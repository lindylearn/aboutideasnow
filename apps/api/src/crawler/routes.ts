import { createCheerioRouter } from "crawlee";
import { getDomain, getMeta } from "../common/meta.js";
import normalizeUrl from "normalize-url";
import { getPageContent } from "../common/content.js";
import { PostType, ScrapeStatus } from "@repo/core/generated/prisma-client";
import { db } from "../common/db.js";
import { isExcludedPage } from "../common/filter.js";
import { indexPost } from "../common/typesense.js";

export const router = createCheerioRouter();

// Scrape a directory of links
router.addHandler("directory", async ({ $, request, enqueueLinks, log }) => {
    const url = request.loadedUrl!;
    const domain = getDomain(url);
    log.info(`crawling directory: ${url}`);

    // Extract links
    const links = $("a[href]")
        .map((_, el) => $(el).attr("href"))
        .get()
        // map to absolute urls
        .map((link) => new URL(link, url))
        // filter out current-domain links
        .filter((url) => url.hostname !== domain)
        // map back to strings
        .map((url) => url.toString());
    const nowLinks = links.filter((link) => link.endsWith("/now"));

    // Exclude already checked links
    const excludedDomains = new Set();
    const scrapeStates = await db.scrapeState.findMany({
        where: { domain: { in: nowLinks.map(getDomain) } }
    });
    scrapeStates
        // .filter((s) => s.status === ScrapeStatus.SCRAPED)
        .forEach((s) => excludedDomains.add(s.domain));

    const newLinks = nowLinks.filter((link) => !excludedDomains.has(getDomain(link)));
    console.log(`Found ${newLinks.length} new links`);

    await enqueueLinks({
        strategy: "all",
        label: "document",
        urls: newLinks
    });
});

// Scrape an individual page
router.addHandler("document", async ({ $, request, log }) => {
    const originalUrl = normalizeUrl(request.url);
    const url = normalizeUrl(request.loadedUrl || request.url);

    if (url !== originalUrl) {
        // Save redirect state for original url
        const originalDomain = getDomain(originalUrl);
        const scrapeState = {
            domain: originalDomain,
            status: ScrapeStatus.REDIRECTED,
            scapedAt: new Date()
        };
        await db.scrapeState.upsert({
            where: { domain: originalDomain },
            create: scrapeState,
            update: scrapeState
        });

        // Skip if new page doesn't end with /now
        if (!/\/now\/?$/.test(url)) {
            log.info(`${originalUrl} redirected to non-now page`);
            return;
        }
    }

    // Extract content
    const title = $("title").text();
    const html = $.html();
    const content = await getPageContent(url, html);
    const wordCount = content?.split(/\s+/).length || 0;

    // Check if content has changed
    const existingPost = await db.post.findFirst({ where: { url } });
    if (existingPost?.content === content) {
        log.info(`skipping ${url} (content unchanged)`);
        return;
    }

    const meta = await getMeta(url, html, content);

    // Log debug stats
    log.info(`scraped ${url}:`);
    log.info(`\twords: ${wordCount}`);
    log.info(`\tdate: ${meta.date?.toISOString().slice(0, 10)}`);

    if (!content || isExcludedPage(meta.domain, title, content)) {
        // save crawl exclude
        log.info("\texcluding page");
        const scrapeState = {
            domain: meta.domain,
            status: ScrapeStatus.NO_CONTENT,
            scapedAt: new Date()
        };
        await db.scrapeState.upsert({
            where: { domain: meta.domain },
            create: scrapeState,
            update: scrapeState
        });

        // Delete post if exists
        try {
            await db.post.delete({ where: { url } });
        } catch {}

        return;
    }

    // Print newline
    log.info(``);

    // Store post
    const post = {
        url,
        domain: meta.domain,
        type: PostType.NOW,
        content,
        updatedAt: meta.date || new Date("1970-01-01")
    };
    await db.post.upsert({
        where: { url },
        create: post,
        update: post
    });

    // Index for search async
    indexPost(post);

    // Save scrape success
    const scrapeState = {
        domain: meta.domain,
        status: ScrapeStatus.SCRAPED,
        scapedAt: new Date()
    };
    await db.scrapeState.upsert({
        where: { domain: meta.domain },
        create: scrapeState,
        update: scrapeState
    });
});

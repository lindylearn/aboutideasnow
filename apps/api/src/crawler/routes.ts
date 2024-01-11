import { createCheerioRouter } from "crawlee";
import { getDomain, getMeta } from "../common/meta.js";
import normalizeUrl from "normalize-url";
import { getPageContent } from "../common/content.js";
import { PostType, ScrapeStatus } from "@repo/core/generated/prisma-client";
import { db } from "../common/db.js";
import { isExcludedPage } from "../common/filter.js";

export const router = createCheerioRouter();

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

    // Exclude already scraped links
    const scrapeStates = await db.scrapeState.findMany({
        where: { domain: { in: nowLinks.map(getDomain) } }
    });
    const existingPosts = await db.post.findMany({
        where: { domain: { in: nowLinks.map(getDomain) } }
    });

    const scrapedDomains = new Set();
    scrapeStates
        .filter((s) => s.status !== ScrapeStatus.SCRAPED)
        .forEach((s) => scrapedDomains.add(s.domain));
    existingPosts.forEach((p) => scrapedDomains.add(p.domain));

    const newLinks = nowLinks.filter((link) => !scrapedDomains.has(getDomain(link)));
    console.log(`Found ${newLinks.length} new links`);

    await enqueueLinks({
        strategy: "all",
        label: "document",
        urls: newLinks
    });
});

router.addHandler("document", async ({ $, request, log }) => {
    const originalUrl = normalizeUrl(request.url);
    const url = normalizeUrl(request.loadedUrl || request.url);
    log.info(`scraping content: ${url}`);

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
            console.log("\tredirected to non-now page");
            return;
        }
    }

    // Extract content

    const title = $("title").text();
    const html = $.html();
    const content = await getPageContent(url, html);
    const meta = await getMeta(url, html, content);

    console.log(content);
    console.log(meta.date);

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
            await db.post.delete({ where: { domain: meta.domain } });
        } catch {}

        return;
    }

    // Store post
    log.info("\tsuccess");
    const post = {
        domain: meta.domain,
        url,
        type: PostType.NOW,
        content,
        updatedAt: meta.date || new Date("1970-01-01")
    };
    await db.post.upsert({
        where: { domain: meta.domain },
        create: post,
        update: post
    });

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

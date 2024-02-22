import { createCheerioRouter } from "crawlee";
import { getDomain, getMeta } from "../common/meta.js";
import normalizeUrl from "normalize-url";
import { getPageContent } from "../common/content.js";
import { PostType, ScrapeStatus } from "@repo/core/generated/prisma-client";
import { db } from "../common/db.js";
import { isExcludedPage } from "../common/filter.js";
import { indexPost, unIndexPost } from "../common/typesense.js";

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
    log.info(`Found ${newLinks.length} new links`);

    await enqueueLinks({
        strategy: "all",
        label: "document",
        urls: newLinks
    });
});

// Scrape an individual page
router.addHandler("document", async ({ $, request, log }) => {
    const url = normalizeUrl(request.loadedUrl || request.url);
    const domain = getDomain(url);
    let pathname = new URL(url).pathname;

    const originalUrl = normalizeUrl(request.url);
    const originalDomain = getDomain(originalUrl);
    const originalPathname = new URL(originalUrl).pathname;

    // Store domain redirects
    if (domain !== originalDomain) {
        log.info(`Redirected from ${originalDomain} to ${domain}`);
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
    }

    // Allow /about redirect to /
    if (originalPathname === "/about" && pathname === "/") {
        log.info("Allowing /about redirect to /");
        pathname = "/about";
    }
    // Skip if not /about, /now, or /ideas page
    if (!["/about", "/now", "/ideas"].includes(pathname)) {
        log.info(`${domain} ${pathname} skipped (not /about, /now, or /ideas)\n`);
        return;
    }
    let postType: PostType;
    if (pathname === "/about") {
        postType = PostType.ABOUT;
    } else if (pathname === "/now") {
        postType = PostType.NOW;
    } else {
        postType = PostType.IDEAS;
    }

    const existingPost = await db.post.findFirst({ where: { url } });

    // Extract content
    const title = $("title").text();
    const html = $.html();
    const content = await getPageContent(url, html);
    const wordCount = content?.split(/\s+/).length || 0;

    // Check if should exclude / delete post
    if (!content || isExcludedPage(domain, title, content)) {
        log.info(`excluding ${url} (title: ${title})\n`);

        // Update scrape time if exists, otherwise save as no content
        await db.scrapeState.upsert({
            where: { domain },
            create: {
                domain,
                status: ScrapeStatus.NO_CONTENT,
                scapedAt: new Date()
            },
            update: {
                scapedAt: new Date()
            }
        });

        // Delete post if existed before
        if (existingPost) {
            try {
                await db.post.delete({ where: { url } });
                await unIndexPost(existingPost!);
            } catch {}
        }

        return;
    }

    // Check if content has changed
    if (existingPost?.content === content) {
        log.info(`skipping ${url} (content unchanged)\n`);

        // Update scrape time
        await db.scrapeState.update({
            where: { domain },
            data: { scapedAt: new Date() }
        });

        return;
    }

    const meta = await getMeta(url, html, content);
    // Log debug stats
    log.info(`scraped ${url}:`);
    log.info(`\ttitle: ${title}`);
    log.info(`\twords: ${wordCount}`);
    log.info(`\tdate: ${meta.date?.toISOString().slice(0, 10)}`);
    log.info(``);

    // Store post
    const post = {
        url,
        domain,
        type: postType,
        content,
        updatedAt: meta.date || new Date("1970-01-01")
    };
    await db.post.upsert({
        where: { url },
        create: post,
        update: post
    });

    // Index for search async
    indexPost(post, log.info.bind(log));

    // Save scrape success
    const scrapeState = {
        domain,
        status: ScrapeStatus.SCRAPED,
        scapedAt: new Date()
    };
    await db.scrapeState.upsert({
        where: { domain },
        create: scrapeState,
        update: scrapeState
    });
});

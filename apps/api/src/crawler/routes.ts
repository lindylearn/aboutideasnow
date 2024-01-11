import { createCheerioRouter } from "crawlee";
import { getDomain, getMeta } from "../common/meta.js";
import normalizeUrl from "normalize-url";
import { getPageContent } from "../common/content.js";
import { PostType, ScrapeStatus } from "@repo/core/generated/prisma-client";
import { db } from "../common/db.js";

export const router = createCheerioRouter();

router.addHandler("directory", async ({ $, request, enqueueLinks, log }) => {
    log.info(`crawling directory: ${request.loadedUrl}`);

    await enqueueLinks({
        strategy: "all",
        regexps: [/\/now\/?$/],
        label: "document"
    });
});

router.addHandler("document", async ({ $, request, log }) => {
    const originalUrl = normalizeUrl(request.url);
    const url = normalizeUrl(request.loadedUrl || request.url);
    log.info(`scraping content: ${url}`);

    if (url !== originalUrl) {
        // TODO save url redirect
        console.log("\tgot redirected");
    }

    // Extract content
    const meta = await getMeta(url, $.html());
    const content = await getPageContent(url, $.html());

    const wordCount = content?.split(/\s+/).length || 0;
    if (!content || wordCount < 200) {
        // save crawl exclude
        log.info("\ttoo_short");
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
        return;
    }

    // Store post
    log.info("\tsuccess");
    const post = {
        domain: meta.domain,
        url,
        type: PostType.NOW,
        content
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

import { createCheerioRouter } from "crawlee";
import { getMeta } from "../common/meta.js";
import normalizeUrl from "normalize-url";
import { getPageContent } from "../common/content.js";
import { getDatabaseClient } from "@repo/core";

const db = getDatabaseClient();

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
        log.info(content!);
        return;
    }

    // store results
    log.info("\tsuccess");

    await db.post.create({
        data: {
            domain: meta.domain,
            url,
            content
        }
    });
});

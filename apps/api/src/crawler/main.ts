// For more information, see https://crawlee.dev/
import "dotenv/config";
import {
    CheerioCrawler,
    RequestOptions,
    ProxyConfiguration,
    purgeDefaultStorages,
    Configuration
} from "crawlee";
import { MemoryStorage } from "@crawlee/memory-storage";
import { router } from "./routes.js";
import normalizeUrl from "normalize-url";
import { db } from "../common/db.js";
import { getDomain } from "../common/meta.js";
import { ScrapeStatus } from "@repo/core/generated/prisma-client";
import { getPostType } from "../common/postType.js";

export async function runCrawler(directoryUrls: string[], documentUrls: string[]) {
    // Seed URLs
    const crawlerQueue: RequestOptions[] = [
        ...directoryUrls.map((url) => ({
            url,
            label: "directory"
        })),
        ...documentUrls.map((url) => ({
            url,
            label: "document"
        }))
    ];

    // Run crawler
    const proxyConfiguration = new ProxyConfiguration({
        // proxyUrls: ["URL"]
        // proxyUrls: Array.from(Array(100).keys()).map(
        //     (i) => `URL:${10000 + i + 1}`
        // )
    });
    await purgeDefaultStorages();
    const crawler = new CheerioCrawler(
        {
            // proxyConfiguration,
            // useSessionPool: true,
            // persistCookiesPerSession: true,
            // additionalHttpErrorStatusCodes: [403, 444, 503],

            minConcurrency: 1,
            maxConcurrency: 10,
            retryOnBlocked: false,
            maxRequestRetries: 1,
            maxRequestsPerMinute: 120,
            sameDomainDelaySecs: 0,

            // Use browser-like headers to avoid being blocked
            additionalMimeTypes: ["text/html"],
            requestHandlerTimeoutSecs: 30,
            navigationTimeoutSecs: 30,
            preNavigationHooks: [
                async ({ request }) => {
                    request.headers = {
                        ...request.headers,
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                        "Accept-Language": "en-US,en;q=0.5",
                    };
                }
            ],

            requestHandler: router,
            failedRequestHandler: async ({ request, log, enqueueLinks }) => {
                const url = normalizeUrl(request.url);
                const domain = getDomain(url);
                const pathname = new URL(url).pathname;
                const postType = getPostType(pathname);

                log.info(`Failed to crawl ${url}`);

                // Mark as unavailable
                if (postType) {
                    await db.scrapeState.upsert({
                        where: { domain_type: { domain, type: postType } },
                        create: {
                            domain,
                            type: postType,
                            status: ScrapeStatus.UNAVAILABLE,
                            scapedAt: new Date()
                        },
                        update: {
                            status: ScrapeStatus.UNAVAILABLE,
                            scapedAt: new Date()
                        }
                    });
                }

                // Try other paths
                if (postType === "ABOUT" && pathname !== "/") {
                    log.info(`Trying / instead of /about for ${domain}`);
                    await enqueueLinks({
                        strategy: "all",
                        label: "document",
                        urls: [`https://${domain}/`]
                    });
                    return;
                }
            }
        },
        new Configuration({
            persistStateIntervalMillis: 10_000,
            storageClient: new MemoryStorage({
                persistStorage: false,
                writeMetadata: false
            })
        })
    );
    console.log(`Crawling ${crawlerQueue.length} urls...`);
    await crawler.run(crawlerQueue);
}

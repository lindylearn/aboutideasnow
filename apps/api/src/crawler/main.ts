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
    // const proxyConfiguration = new ProxyConfiguration({
    //     // proxyUrls: ["http://spzk5975qs:wf4Fy0TDrwncJa74ts@dc.smartproxy.com:10000"],
    //     proxyUrls: Array.from(Array(100).keys()).map(
    //         (i) => `http://spzk5975qs:wf4Fy0TDrwncJa74ts@dc.smartproxy.com:${10000 + i + 1}`
    //     )
    // });
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
            maxRequestsPerMinute: 100,
            sameDomainDelaySecs: 0,

            requestHandler: router,
            failedRequestHandler: async ({ request, log, pushData }) => {
                const url = normalizeUrl(request.url);
                const domain = getDomain(url);
                const pathname = new URL(url).pathname;
                const postType = getPostType(pathname);

                if (pathname === "/about") {
                    log.info(`Trying / instead of /about for ${domain}`);
                    pushData({
                        url: `https://${domain}/`,
                        label: "document"
                    });
                    return;
                }

                log.info(`Failed to crawl ${url} (${postType})`);
                if (!postType) {
                    return;
                }
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

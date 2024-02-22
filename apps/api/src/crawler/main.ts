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
            maxConcurrency: 5,
            retryOnBlocked: false,
            maxRequestRetries: 1,
            maxRequestsPerMinute: 100,
            sameDomainDelaySecs: 5,

            requestHandler: router,
            failedRequestHandler: async ({ request }) => {
                const url = normalizeUrl(request.url);
                const domain = getDomain(url);

                console.log(`Failed to crawl ${url}`);
                // const scrapeState = {
                //     domain,
                //     status: ScrapeStatus.UNAVAILABLE,
                //     scapedAt: new Date()
                // };
                // await db.scrapeState.upsert({
                //     where: { domain },
                //     create: scrapeState,
                //     update: scrapeState
                // });
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

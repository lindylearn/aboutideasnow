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

export async function runCrawler() {
    // Seed URLs
    const crawlerQueue: RequestOptions[] = [];
    crawlerQueue.push({
        url: "https://nownownow.com",
        label: "directory"
    });
    // crawlerQueue.push({
    //     url: "https://jgoin.net/now",
    //     label: "document"
    // });

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
            maxConcurrency: 1,
            retryOnBlocked: false,
            maxRequestRetries: 1,
            maxRequestsPerMinute: 100,
            sameDomainDelaySecs: 5,

            requestHandler: router,
            failedRequestHandler: async ({ request }) => {
                const url = normalizeUrl(request.url);

                console.log(`Failed to crawl ${url}`);
                // TODO save crawl exclude
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

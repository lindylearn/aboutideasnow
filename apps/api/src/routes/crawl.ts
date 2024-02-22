import type { Request, Response } from "express";
import { runCrawler } from "../crawler/main.js";
import { db } from "../common/db.js";

export async function periodicCrawl(req: Request, res: Response) {
    const limit = parseInt(req.query.limit as string) || 10_000;

    // Re-scrape all previously scraped directories and domains
    const scrapeStates = await db.scrapeState.findMany({
        where: { status: { in: ["SCRAPED"] } },
        orderBy: { scapedAt: "asc" },
        take: limit
    });
    const directories = scrapeStates
        .filter((s) => s.domainType === "DIRECTORY")
        .map((s) => `https://${s.domain}`);

    // const documents = scrapeStates
    //     .filter((s) => s.domainType === "INDIVIDUAL_SITE")
    //     .flatMap((s) => [
    //         `https://${s.domain}/about`,
    //         `https://${s.domain}/now`,
    //         `https://${s.domain}/ideas`
    //     ]);

    const docs = await db.post.findMany({
        where: { type: "IDEAS" },
        select: { url: true }
    });
    const documents = docs.map((d) => d.url);

    // Don't await response
    runCrawler(directories, documents);

    return res.json({ message: "Pending" });
}

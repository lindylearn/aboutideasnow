import type { Request, Response } from "express";
import { runCrawler } from "../crawler/main.js";
import { db } from "../common/db.js";

export async function periodicCrawl(req: Request, res: Response) {
    const limit = parseInt(req.query.limit as string) || 100;

    // Re-scrape all previously scraped documents
    const scrapeStates = await db.scrapeState.findMany({
        where: { status: { in: ["SCRAPED"] } },
        orderBy: { scapedAt: "asc" },
        take: limit
    });
    const directories = scrapeStates
        .filter((s) => s.domainType === "DIRECTORY")
        .map((s) => `https://${s.domain}/now`);
    const documents = scrapeStates
        .filter((s) => s.domainType === "INDIVIDUAL_SITE")
        .map((s) => `https://${s.domain}/now`);

    await runCrawler(directories, documents);

    return res.json({ message: "Pending" });
}

import type { Request, Response } from "express";
import { runCrawler } from "../crawler/main.js";
import { db } from "../common/db.js";

export async function periodicCrawl(req: Request, res: Response) {
    const includeDirectories = req.query.directories === "true";
    const limit = parseInt(req.query.limit as string) || 10_000;

    // Check all directories for new links
    const directoryScrapes = await db.scrapeState.findMany({
        where: { domainType: "DIRECTORY" }
    });
    const directories = includeDirectories
        ? directoryScrapes.map((s) => `https://${s.domain}`)
        : [];

    // Re-scrape all indexed pages
    const scrapeStates = await db.scrapeState.findMany({
        where: { status: "SCRAPED", domainType: "INDIVIDUAL_SITE" },
        orderBy: { scapedAt: "asc" },
        take: limit
    });
    const documents = scrapeStates.map((s) => `https://${s.domain}/${s.type.toLowerCase()}`);

    // const docs = await db.post.findMany({
    //     where: { type: "ABOUT" },
    //     orderBy: { updatedAt: "asc" },
    //     select: { url: true },
    //     take: limit
    // });
    // const documents = docs.map((d) => d.url);

    // Don't await response
    runCrawler(directories, documents);

    return res.json({ message: "Pending" });
}

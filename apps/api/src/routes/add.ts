import type { Request, Response } from "express";
import { runCrawler } from "../crawler/main.js";
import { db } from "../common/db.js";
import { getDomain } from "../common/meta.js";
import { SubmittedDomain } from "@repo/core/generated/prisma-client";

export async function addDirectory(req: Request, res: Response) {
    const url = parseUrl(req);
    if (!url) {
        return res.status(400).json({ message: "Missing url" });
    }

    // Don't await
    runCrawler([url], []);

    const domain = getDomain(url);
    await db.scrapeState.upsert({
        where: { domain_type: { domain, type: "ABOUT" } },
        create: {
            domain,
            domainType: "DIRECTORY",
            type: "ABOUT",
            status: "SCRAPED",
            scapedAt: new Date()
        },
        update: { scapedAt: new Date() }
    });

    return res.json({ message: "Pending" });
}

export async function addDomain(req: Request, res: Response) {
    // Parse params
    let url = parseUrl(req);
    if (!url) {
        return res.status(400).json({ message: "Missing url" });
    }
    const domain = getDomain(url);
    let email = (req.query.email as string) || null;

    // Scrape website
    let success = true;
    try {
        await runCrawler(
            [],
            [`https://${domain}/about`, `https://${domain}/now`, `https://${domain}/ideas`]
        );
    } catch (err) {
        success = false;
    }

    // Save status
    const submittedDomain: SubmittedDomain = {
        domain,
        email,
        success,
        submittedAt: new Date()
    };
    await db.submittedDomain.upsert({
        where: { domain },
        update: submittedDomain,
        create: submittedDomain
    });

    // Return results
    if (success) {
        const posts = await db.post.findMany({
            where: { domain },
            orderBy: { updatedAt: "desc" }
        });
        return res.json(posts);
    } else {
        return res.status(500).json({ message: "Failed to scrape website :(" });
    }
}

function parseUrl(req: Request) {
    let url = req.query.url as string | undefined;

    if (!url?.startsWith("http")) {
        url = `https://${url}`;
    }

    // Validate url
    if (!url.includes(".")) {
        return;
    }
    try {
        new URL(url);
    } catch (error) {
        return;
    }

    return url;
}

import type { Request, Response } from "express";
import { runCrawler } from "../crawler/main.js";
import { db } from "../common/db.js";
import { getDomain } from "../common/meta.js";
import { SubmittedDomain } from "@repo/core/generated/prisma-client";
import { unIndexPost } from "../common/typesense.js";

export async function addDirectory(req: Request, res: Response) {
    const url = req.query.url as string | undefined;
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

export async function addBatchDomains(req: Request, res: Response) {
    let domains = req.body.domains as string[];
    domains = domains.filter((domain) => domain.includes("."));

    const links = domains.flatMap((domain) => [
        `https://${domain}/about`,
        `https://${domain}/now`,
        `https://${domain}/ideas`
    ]);

    // Exclude existing domains
    const excludedDomains = new Set();
    const scrapeStates = await db.scrapeState.findMany({
        where: { domain: { in: links.map(getDomain) } }
    });
    scrapeStates.forEach((s) => excludedDomains.add(s.domain));
    const newLinks = links.filter((link) => !excludedDomains.has(getDomain(link)));
    console.log(`Found ${newLinks.length} new links`);

    runCrawler([], links);

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

    // Save submitted info if not exists
    try {
        await db.submittedDomain.create({
            data: {
                domain,
                email,
                success,
                submittedAt: new Date()
            }
        });
    } catch {}

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

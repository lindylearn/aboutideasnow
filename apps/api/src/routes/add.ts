import type { Request, Response } from "express";
import { runCrawler } from "../crawler/main.js";
import { db } from "../common/db.js";
import { getDomain } from "../common/meta.js";

export async function addDirectory(req: Request, res: Response) {
    const url = parseUrl(req);
    if (!url) {
        return res.status(400).json({ message: "Missing url" });
    }

    // Don't await
    runCrawler([url], []);

    return res.json({ message: "Pending" });
}

export async function addDomain(req: Request, res: Response) {
    let url = parseUrl(req);
    if (!url) {
        return res.status(400).json({ message: "Missing url" });
    }

    if (!url.endsWith("/now")) {
        url = `${url}/now`;
    }

    await runCrawler([], [url]);

    // Return scraped content
    const domain = getDomain(url);
    const posts = await db.post.findMany({
        where: { domain }
    });

    return res.json({ message: "Success", posts });
}

function parseUrl(req: Request) {
    let url = req.query.url as string | undefined;

    if (!url?.startsWith("http")) {
        url = `https://${url}`;
    }

    return url;
}

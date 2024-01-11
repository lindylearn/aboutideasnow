import type { Request, Response } from "express";
import { runCrawler } from "../crawler/main.js";

export async function crawl(req: Request, res: Response) {
    const directoryUrl = req.query.directoryUrl as string | undefined;
    const documentUrl = req.query.documentUrl as string | undefined;

    await runCrawler(directoryUrl, documentUrl);

    return res.json({ message: "Pending" });
}

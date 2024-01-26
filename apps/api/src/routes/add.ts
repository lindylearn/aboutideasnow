import type { Request, Response } from "express";
import { runCrawler } from "../crawler/main.js";

export async function addSite(req: Request, res: Response) {
    const directoryUrl = req.query.directoryUrl as string | undefined;
    const documentUrl = req.query.documentUrl as string | undefined;

    await runCrawler(directoryUrl ? [directoryUrl] : [], documentUrl ? [documentUrl] : []);

    return res.json({ message: "Success" });
}

import type { Request, Response } from "express";
import { runCrawler } from "../crawler/main.js";

export async function crawl(req: Request, res: Response) {
    await runCrawler();

    return res.json({ message: "Done" });
}

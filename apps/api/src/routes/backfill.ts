import type { Request, Response } from "express";
import { db } from "../common/db.js";
import { indexPost } from "../common/typesense.js";

export async function runBackfill(req: Request, res: Response) {
    const start = parseInt(req.query.start as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10000;

    const posts = await db.post.findMany({
        orderBy: { updatedAt: "desc" },
        take: limit,
        skip: start
    });

    let index = start;
    for (const post of posts) {
        console.log(`(${index}/${posts.length + start}) Backfilling post ${post.url}`);

        try {
            indexPost(post);
        } catch (e) {
            console.error(e);
        }

        await new Promise((resolve) => setTimeout(resolve, 300));

        index++;
    }

    console.log(`Backfill complete`);
    return res.json({ success: true });
}

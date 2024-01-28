import type { Request, Response } from "express";
import { db } from "../common/db.js";
import { generateEmbedding } from "../common/openai.js";
import { Post } from "@repo/core/generated/prisma-client";

export async function runBackfill(req: Request, res: Response) {
    const posts: Post[] =
        await db.$queryRaw`SELECT "url", "content" FROM "Post" WHERE "embedding" IS NULL`;

    console.log(`Backfilling ${posts.length} posts`);

    let index = 1;
    for (const post of posts) {
        console.log(`Backfilling post ${index}/${posts.length}`);

        const embedding = await generateEmbedding(post.content.slice(0, 1000));
        await db.$executeRaw`UPDATE "Post" SET "embedding" = ${embedding} WHERE "url" = ${post.url}`;

        index++;
    }
}

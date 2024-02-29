import { getDatabaseClient } from "@repo/core/dist";
import { unIndexPost } from "./typesense.js";
import { PostType } from "@repo/core/generated/prisma-client";

export const db = getDatabaseClient();

// Delete all post state if it exists
export async function deletePost(domain: string, postType: PostType) {
    try {
        await db.post.deleteMany({ where: { domain, type: postType } });
    } catch {}
    try {
        await db.scrapeState.deleteMany({ where: { domain, type: postType } });
    } catch {}
    try {
        await unIndexPost(domain, postType);
    } catch {}
}

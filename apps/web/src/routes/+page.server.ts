import { getDatabaseClient } from "@repo/core/dist";
import type { Post } from "@repo/core/generated/prisma-client";

export async function load() {
    const db = getDatabaseClient();

    const posts = await db.post.findMany();

    const post: Post = posts[0];

    return { posts };
}

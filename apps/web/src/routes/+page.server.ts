import { getDatabaseClient } from "@repo/core/dist";

export async function load() {
    const db = getDatabaseClient();

    const posts = await db.post.findMany();

    return { posts };
}

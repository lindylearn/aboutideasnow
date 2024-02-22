import { getDatabaseClient } from "@repo/core/dist";
import type { PostType } from "@repo/core/generated/prisma-client";

export async function load({ url, setHeaders }) {
    const db = getDatabaseClient();

    const postTypeFilter = (url.searchParams.get("filter")?.toUpperCase() as PostType) || "IDEAS";
    const defaultPosts = await db.post.findMany({
        where: {
            type: postTypeFilter
        },
        orderBy: {
            updatedAt: "desc"
        },
        take: 6
    });

    // Cache for 1 hour
    setHeaders({
        "Cache-Control": "max-age=0, s-max-age=3600"
    });

    return { defaultPosts };
}

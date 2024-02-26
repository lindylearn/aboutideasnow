import { getDatabaseClient } from "@repo/core/dist";
import type { PostType, Post } from "@repo/core/generated/prisma-client";
import { handleSubmit } from "../common/formActions.js";

export async function load({ url, setHeaders }): Promise<{
    websiteCount: number;
    defaultPosts: Post[];
}> {
    let websiteCount: number = 0;
    let defaultPosts: Post[] = [];

    try {
        const db = getDatabaseClient();

        const postTypeFilter =
            (url.searchParams.get("filter")?.toUpperCase() as PostType) || "IDEAS";

        defaultPosts = await db.post.findMany({
            where: {
                type: postTypeFilter
            },
            orderBy: [
                {
                    updatedAt: "desc"
                },
                {
                    domain: "desc"
                }
            ],
            take: postTypeFilter ? 15 : 9
        });

        console.log(defaultPosts.length);

        websiteCount = await db.scrapeState.count({
            where: {
                status: "SCRAPED",
                type: "ABOUT"
            }
        });
    } catch (error) {
        console.error(error);
    }

    // Cache for 1 hour
    setHeaders({
        "Cache-Control": "max-age=0, s-max-age=3600"
    });

    return {
        websiteCount,
        defaultPosts
    };
}

export const actions = {
    default: async ({ request }) => {
        return await handleSubmit(request);
    }
};

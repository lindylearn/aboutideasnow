import { getDatabaseClient } from "@repo/core/dist";
import type { Post, PostType } from "@repo/core/generated/prisma-client";
import { handleSubmit } from "../common/formActions.js";

export async function load({ url, setHeaders }): Promise<{
    websiteCount: number;
    defaultPosts: Post[];
}> {
    try {
        const db = getDatabaseClient();

        const postTypeFilter =
            (url.searchParams.get("filter")?.toUpperCase() as PostType) || undefined;
        const defaultPosts = await db.post.findMany({
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
            take: 12
        });

        const websiteCount = await db.scrapeState.count({
            where: {
                status: "SCRAPED",
                type: "ABOUT"
            }
        });

        db.$disconnect();

        // Cache for 1 hour
        setHeaders({
            "Cache-Control": "max-age=0, s-max-age=3600"
        });

        return { websiteCount, defaultPosts };
    } catch (err) {
        console.error(`load() function failed: ${err}`);

        return { websiteCount: 7591, defaultPosts: [] };
    }
}

export const actions = {
    default: async ({ request }) => {
        return await handleSubmit(request);
    }
};

import { getDatabaseClient } from "@repo/core/dist";
import type { PostType } from "@repo/core/generated/prisma-client";
import { handleSubmit } from "../common/formActions.js";

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
        take: postTypeFilter ? 20 : 9
    });

    const websiteCount = await db.scrapeState.count({
        where: {
            status: "SCRAPED"
        }
    });

    // Cache for 1 hour
    setHeaders({
        "Cache-Control": "max-age=0, s-max-age=3600"
    });

    return { websiteCount, defaultPosts };
}

export const actions = {
    default: async ({ request }) => {
        return await handleSubmit(request);
    }
};

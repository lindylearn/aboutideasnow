import { getDatabaseClient } from "@repo/core/dist";
import { type Post, PostType, PrismaClient } from "@repo/core/generated/prisma-client";
import { handleSubmit } from "../common/formActions.js";

export async function load({ url, setHeaders }): Promise<{
    websiteCount: number;
    defaultPosts: Post[];
}> {
    try {
        const db = getDatabaseClient();

        const postTypeFilter =
            (url.searchParams.get("filter")?.toUpperCase() as PostType) || undefined;

        const defaultPosts = await getRepresentativePosts(postTypeFilter, db);
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

async function getRepresentativePosts(
    postTypeFilter: PostType | undefined,
    db: PrismaClient,
    limit = 12
) {
    // Apply filter if present
    if (postTypeFilter) {
        return await getPosts(postTypeFilter, db, limit);
    }

    // Ensure that all three post types exist
    const postsByType = await Promise.all(
        [PostType.ABOUT, PostType.IDEAS, PostType.NOW].map((type) =>
            getPosts(type, db, Math.floor(limit / 3))
        )
    );
    return postsByType.flat().sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

async function getPosts(postTypeFilter: PostType, db: PrismaClient, limit = 12) {
    return await db.post.findMany({
        where: { type: postTypeFilter },
        orderBy: { updatedAt: "desc" },
        take: limit
    });
}

export const actions = {
    default: async ({ request }) => {
        return await handleSubmit(request);
    }
};

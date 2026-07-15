import { getDatabaseClient } from "@repo/core/dist";
import type { Post, PostType } from "@repo/core/generated/prisma-client";
import { handleSubmit } from "../common/formActions.js";

const PER_PAGE = 24;

export async function load({ url, setHeaders }): Promise<{
    websiteCount: number;
    defaultPosts: Post[];
    page: number;
    totalPages: number;
}> {
    try {
        const db = getDatabaseClient();

        const postTypeFilter =
            (url.searchParams.get("filter")?.toUpperCase() as PostType) || undefined;
        const page = Math.max(1, parseInt(url.searchParams.get("page") || "1") || 1);

        const where = postTypeFilter ? { type: postTypeFilter } : {};
        const [defaultPosts, total, websiteCount] = await Promise.all([
            db.post.findMany({
                where,
                orderBy: [{ updatedAt: "desc" }, { url: "asc" }],
                skip: (page - 1) * PER_PAGE,
                take: PER_PAGE
            }),
            db.post.count({ where }),
            db.scrapeState.count({ where: { status: "SCRAPED", type: "ABOUT" } })
        ]);
        const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

        db.$disconnect();

        // Cache for 1 hour
        setHeaders({
            "Cache-Control": "max-age=0, s-max-age=3600"
        });

        return { websiteCount, defaultPosts, page, totalPages };
    } catch (err) {
        console.error(`load() function failed: ${err}`);

        return { websiteCount: 7591, defaultPosts: [], page: 1, totalPages: 1 };
    }
}

export const actions = {
    default: async ({ request }) => {
        return await handleSubmit(request);
    }
};

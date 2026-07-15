import { json } from "@sveltejs/kit";
import { getDatabaseClient } from "@repo/core/dist";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
    const q = (url.searchParams.get("q") || "").trim();
    if (q.length < 2) {
        return json([]);
    }

    const db = getDatabaseClient();
    try {
        const posts = await db.post.findMany({
            where: {
                OR: [
                    { domain: { contains: q, mode: "insensitive" } },
                    { content: { contains: q, mode: "insensitive" } }
                ]
            },
            orderBy: { updatedAt: "desc" },
            take: 100
        });

        const seen = new Set<string>();
        const results = posts
            .filter((post) => {
                const key = `${post.domain}-${post.type}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            })
            .slice(0, 50)
            .map((post) => ({ ...post, content: post.content.slice(0, 500) }));

        return json(results);
    } finally {
        await db.$disconnect();
    }
};

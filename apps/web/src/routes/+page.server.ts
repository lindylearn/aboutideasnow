import { INTERNAL_API_URL } from "$env/static/private";
import { getDatabaseClient } from "@repo/core/dist";
import type { Post } from "@repo/core/generated/prisma-client";

export const actions = {
    default: async ({ request, fetch }) => {
        const data = await request.formData();
        const domain = data.get("domain");

        const response = await fetch(`${INTERNAL_API_URL}/add-domain?url=${domain}`, {
            method: "POST"
        });
        if (!response.ok) {
            return {
                addedDomain: false
            };
        }
        const scrapedPosts: Post[] = await response.json();

        return {
            addedDomain: true,
            scrapedPosts
        };
    }
};

export async function load() {
    const db = getDatabaseClient();

    const posts = await db.post.findMany({
        orderBy: {
            updatedAt: "desc"
        }
    });

    return { posts };
}

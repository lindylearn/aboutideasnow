import { INTERNAL_API_URL } from "$env/static/private";
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

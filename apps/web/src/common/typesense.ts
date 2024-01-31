import { PUBLIC_TYPESENSE_SEARCH_API_KEY, PUBLIC_TYPESENSE_URL } from "$env/static/public";
import type { Post } from "@repo/core/generated/prisma-client";
import Typesense from "typesense";

export const typesense = new Typesense.Client({
    nodes: [
        {
            host: PUBLIC_TYPESENSE_URL,
            port: 443,
            protocol: "https"
        }
    ],
    apiKey: PUBLIC_TYPESENSE_SEARCH_API_KEY,
    connectionTimeoutSeconds: 2
});

export type SearchedPost = Post & {};

export async function searchPosts(query: string): Promise<SearchedPost[]> {
    const searchResults = await typesense.collections<Post>("paragraphs").documents().search({
        q: query,
        query_by: "content,domain"
    });

    return (
        searchResults.hits?.map((hit) => {
            // Highlight search matches
            let htmlContent = hit.document.content;
            hit.highlights?.forEach((highlight) => {
                if (highlight.field !== "content") {
                    return;
                }

                highlight.matched_tokens?.forEach((token) => {
                    if (typeof token !== "string") {
                        return;
                    }

                    htmlContent = htmlContent.replace(
                        token,
                        `<span class="highlight">${token}</span>`
                    );
                });
            });

            return {
                ...hit.document,
                updatedAt: new Date(hit.document.updatedAt),
                content: htmlContent
            };
        }) || []
    );
}

import { PUBLIC_TYPESENSE_SEARCH_API_KEY, PUBLIC_TYPESENSE_URL } from "$env/static/public";
import type { Post, PostType } from "@repo/core/generated/prisma-client";
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

export type SearchedPost = Post & {
    id: number;
};

export async function searchPosts(query: string, postType?: PostType): Promise<SearchedPost[]> {
    const searchResults = await typesense
        .collections<Post & { id: number }>("paragraphs")
        .documents()
        .search({
            q: query,
            // query_by: "embedding",
            query_by: "embedding,content,domain",

            filter_by: postType ? `type:${postType}` : undefined,

            // required for embeddings
            exclude_fields: "embedding",
            prefix: false,

            // group by domain to return only best paragraph
            group_by: "domain,type",
            group_limit: 1,

            limit: 20
        });

    const hits = searchResults.grouped_hits?.map((hit) => hit.hits[0]) || [];
    console.log(hits);
    return (
        hits.map((hit) => {
            // Highlight search matches
            let htmlContent = hit.document.content;
            hit.highlights?.forEach((highlight) => {
                if (highlight.field !== "content") {
                    return;
                }

                highlight.matched_tokens?.forEach((token) => {
                    if (typeof token !== "string" || token.length <= 3) {
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

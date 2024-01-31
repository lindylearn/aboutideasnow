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

export async function searchPosts(query: string) {
    const t0 = Date.now();

    const searchResults = await typesense.collections<Post>("paragraphs").documents().search({
        q: query,
        query_by: "content,domain"
    });

    return searchResults.hits?.map((hit) => hit.document) || [];
}

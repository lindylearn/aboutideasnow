import type { RequestHandler } from "./$types";
import { generateEmbedding } from "../../../common/openai";
import { supabase } from "../../../common/supabase";
import type { Post } from "@repo/core/generated/prisma-client";

export const GET: RequestHandler = async ({ url }) => {
    const query = url.searchParams.get("query");
    if (!query) {
        return new Response(JSON.stringify({ error: "No query provided" }), { status: 400 });
    }

    const t0 = Date.now();
    const [keywordSearchResponse, semanticSearchResponse] = await Promise.all([
        supabase.rpc("kw_match_posts", {
            query_text: query,
            match_count: 10
        }),
        generateEmbedding(query).then((embedding) =>
            supabase.rpc("match_posts", {
                query_embedding: embedding,
                match_count: 10
            })
        )
    ]);
    const t1 = Date.now();
    console.log(`Search completed in ${t1 - t0}ms`);

    // Return errors
    if (semanticSearchResponse.error) {
        return new Response(JSON.stringify({ error: semanticSearchResponse.error }), {
            status: 500
        });
    }
    if (keywordSearchResponse.error) {
        return new Response(JSON.stringify({ error: keywordSearchResponse.error }), {
            status: 500
        });
    }

    // Combine results
    const posts: (Post & { similarity: number })[] = [
        ...semanticSearchResponse.data,
        ...keywordSearchResponse.data
    ];
    posts.sort((a, b) => b.similarity - a.similarity);

    // importing json() helper from @sveltejs/kit causes a build error
    return new Response(JSON.stringify({ posts }));
};

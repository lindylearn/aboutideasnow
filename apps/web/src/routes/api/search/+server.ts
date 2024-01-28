import type { RequestHandler } from "./$types";
import { generateEmbedding } from "../../../common/openai";
import { supabase } from "../../../common/supabase";
import type { Post } from "@repo/core/generated/prisma-client";

export const GET: RequestHandler = async ({ url }) => {
    const query = url.searchParams.get("query");
    if (!query) {
        return new Response(JSON.stringify({ error: "No query provided" }), { status: 400 });
    }

    const embedding = await generateEmbedding(query);

    // Query the database
    const semanticSearchResponse = await supabase.rpc("match_posts", {
        query_embedding: embedding,
        match_count: 10
    });
    const keywordSearchResponse = await supabase.rpc("kw_match_posts", {
        query_text: embedding,
        match_count: 10
    });

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

    // importing json() helper from @sveltejs/kit causes a build error
    return new Response(JSON.stringify({ posts }));
};

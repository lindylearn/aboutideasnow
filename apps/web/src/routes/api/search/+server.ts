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
    const embedding = await generateEmbedding(query);
    const t1 = Date.now();
    console.log(`Embedding generated in ${t1 - t0}ms`);

    // Query the database
    const semanticSearchResponse = await supabase.rpc("match_posts", {
        query_embedding: embedding,
        match_count: 10
    });
    const t2 = Date.now();
    console.log(`Semantic search performed in ${t2 - t1}ms`);
    const keywordSearchResponse = await supabase.rpc("kw_match_posts", {
        query_text: embedding,
        match_count: 10
    });
    const t3 = Date.now();
    console.log(`Keyword search performed in ${t3 - t2}ms`);

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

    console.log(`Search completed in ${Date.now() - t0}ms\n`);

    // importing json() helper from @sveltejs/kit causes a build error
    return new Response(JSON.stringify({ posts }));
};

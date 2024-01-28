import type { RequestHandler } from "./$types";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { SupabaseHybridSearch } from "@langchain/community/retrievers/supabase";
import { OPENAI_API_KEY, SUPABASE_PRIVATE_KEY, SUPABASE_URL } from "$env/static/private";

const client = createClient(SUPABASE_URL, SUPABASE_PRIVATE_KEY);
const embeddings = new OpenAIEmbeddings({
    openAIApiKey: OPENAI_API_KEY,
    modelName: "text-embedding-3-large",
    dimensions: 1024
});

const retriever = new SupabaseHybridSearch(embeddings, {
    client,
    similarityK: 0,
    keywordK: 10,
    tableName: "Post",
    similarityQueryName: "match_posts",
    keywordQueryName: "kw_match_posts"
});

export const GET: RequestHandler = async ({ url }) => {
    const query = url.searchParams.get("query");
    if (!query) {
        return new Response(JSON.stringify({ error: "No query provided" }), { status: 400 });
    }

    const results = await retriever.getRelevantDocuments(query);

    // importing json() helper from @sveltejs/kit causes a build error
    return new Response(JSON.stringify({ results }));
};

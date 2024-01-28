import { OPENAI_API_KEY } from "$env/static/private";
import OpenAI from "openai";

export const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
});

export async function generateEmbedding(text: string) {
    const result = await openai.embeddings.create({
        input: text,
        model: "text-embedding-3-large",
        dimensions: 1024
    });

    const [{ embedding }] = result.data;
    return embedding;
}

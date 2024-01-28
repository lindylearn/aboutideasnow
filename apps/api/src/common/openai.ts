import OpenAI from "openai";
import { env } from "process";

export const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY
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

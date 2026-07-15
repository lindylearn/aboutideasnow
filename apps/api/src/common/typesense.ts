import Typesense from "typesense";
import { getPostParagraphs } from "./split.js";
import type { Post, PostType } from "@repo/core/generated/prisma-client";
import { env } from "process";

export const typesense = new Typesense.Client({
    nodes: [
        {
            host: env.TYPESENSE_URL!,
            port: 443,
            protocol: "https"
        }
    ],
    apiKey: env.TYPESENSE_ADMIN_API_KEY!,
    connectionTimeoutSeconds: 15
});

// typesense.collections().create({
//     name: "paragraphs",
//     fields: [
//         // { name: "id", type: "string" },
//         { name: "domain", type: "string", facet: true },
//         { name: "type", type: "string", facet: true },
//         { name: "url", type: "string" },
//         { name: "content", type: "string" },
//         { name: "updatedAt", type: "int64" }, // epoch milliseconds to enable sorting,
//         {
//             name: "embedding",
//             type: "float[]",
//             embed: {
//                 from: ["content"],
//                 model_config: {
//                     model_name: "openai/text-embedding-3-small",
//                     api_key: env.OPENAI_API_KEY!
//                 }
//             }
//         }
//     ],
//     default_sorting_field: "updatedAt"
// });

const IMPORT_MAX_RETRIES = 3;

export async function indexPost(post: Post, logger = console.log) {
    const paragraphs = await getPostParagraphs(post.content);

    if (paragraphs.length === 0) {
        await unIndexPost(post.domain, post.type);
        return;
    }

    const documents = paragraphs.map((p) => ({
        url: post.url,
        domain: post.domain,
        type: post.type,
        content: p,
        updatedAt: post.updatedAt.getTime()
    }));

    let lastErr: unknown;
    for (let attempt = 1; attempt <= IMPORT_MAX_RETRIES; attempt++) {
        try {
            await unIndexPost(post.domain, post.type);
            await typesense.collections("paragraphs").documents().import(documents);
            return;
        } catch (e) {
            lastErr = e;
            logger(
                `Error indexing post ${post.url} (attempt ${attempt}/${IMPORT_MAX_RETRIES}): ${e}`
            );
            if (attempt < IMPORT_MAX_RETRIES) {
                await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** (attempt - 1)));
            }
        }
    }

    throw new Error(
        `Failed to index post ${post.url} after ${IMPORT_MAX_RETRIES} attempts: ${lastErr}`
    );
}

export async function isPostIndexed(domain: string, postType: PostType): Promise<boolean> {
    const res = await typesense
        .collections("paragraphs")
        .documents()
        .search({
            q: "*",
            query_by: "content",
            filter_by: `domain:=${domain} && type:=${postType}`,
            per_page: 0
        });
    return (res.found ?? 0) > 0;
}

export async function unIndexPost(domain: string, postType: PostType) {
    await typesense
        .collections("paragraphs")
        .documents()
        .delete({ filter_by: `domain:${domain} && type:${postType}` });
}

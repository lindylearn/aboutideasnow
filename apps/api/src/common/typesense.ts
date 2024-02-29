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
    connectionTimeoutSeconds: 2
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

export async function indexPost(post: Post, logger = console.log) {
    try {
        const t0 = Date.now();
        const paragraphs = await getPostParagraphs(post.content);

        // Paragraph splitting debug
        // logger(`# ${post.url}\n`);
        // for (const p of paragraphs) {
        //     logger(`- ${p}\n`);
        // }
        // logger(`\n\n`);
        // return;

        // Delete existing paragraphs for this post (the number might have changed)
        await unIndexPost(post.domain, post.type);

        await typesense
            .collections("paragraphs")
            .documents()
            .import(
                paragraphs.map((p, i) => ({
                    // id: `${post.domain}-${post.type}-${i}`,
                    url: post.url,
                    domain: post.domain,
                    type: post.type,
                    content: p,
                    updatedAt: post.updatedAt.getTime()
                }))
            );

        // logger(`Inserted ${paragraphs.length} paragraphs in ${Date.now() - t0}ms`);
    } catch (e) {
        logger(`Error indexing post ${post.url}: ${e}`);
    }
}

export async function unIndexPost(domain: string, postType: PostType) {
    await typesense
        .collections("paragraphs")
        .documents()
        .delete({ filter_by: `domain:${domain} && type:${postType}` });
}

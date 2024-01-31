import Typesense from "typesense";
import { getPostParagraphs } from "./split.js";
import { Post } from "@repo/core/generated/prisma-client";
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
//         { name: "updatedAt", type: "int64" } // epoch milliseconds to enable sorting
//     ],
//     default_sorting_field: "updatedAt"
// });

export async function indexPost(post: Post) {
    const t0 = Date.now();
    const paragraphs = await getPostParagraphs(post.content);

    // Paragraph splitting debug
    // console.log(`# ${post.url}\n`);
    // for (const p of paragraphs) {
    //     console.log(`- ${p}\n`);
    // }
    // console.log(`\n\n`);
    // return;

    // Delete existing paragraphs for this post (the number might have changed)
    await typesense
        .collections("paragraphs")
        .documents()
        .delete({ filter_by: `domain:${post.domain} && type:${post.type}` });

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

    console.log(`Inserted ${paragraphs.length} paragraphs in ${Date.now() - t0}ms`);
}

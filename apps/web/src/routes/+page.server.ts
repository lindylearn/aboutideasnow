import { getDatabaseClient } from "@repo/core/dist";

export async function load({ setHeaders }) {
    const db = getDatabaseClient();
    const defaultPosts = await db.post.findMany({
        where: {
            type: "IDEAS"
        },
        orderBy: {
            updatedAt: "desc"
        },
        take: 6
    });

    // Cache for 1 hour
    // setHeaders({
    //     "Cache-Control": "max-age=0, s-max-age=3600"
    // });

    return { defaultPosts };
}

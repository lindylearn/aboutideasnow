import { Request, Response } from "express";
import { db } from "../common/db.js";

export async function getIndexedNowPages(req: Request, res: Response) {
    // List valid /now posts
    const posts = await db.post.findMany({
        where: {
            type: "NOW"
        },
        select: {
            domain: true,
            url: true,
            updatedAt: true
        },
        orderBy: {
            updatedAt: "desc"
        }
    });
    // Map format
    const publicPosts = posts.map((post) => {
        let updatedAt: string | undefined = post.updatedAt.toISOString().slice(0, 10);
        if (updatedAt === "1970-01-01") {
            updatedAt = undefined;
        }

        return { ...post, updatedAt };
    });

    const lastScrapeState = await db.scrapeState.findFirst({
        where: {
            type: "NOW"
        },
        select: {
            scapedAt: true
        },
        orderBy: {
            scapedAt: "desc"
        }
    });

    return res.json({
        validWebsitesCount: publicPosts.length,
        lastScrapedAt: lastScrapeState?.scapedAt,
        websites: publicPosts
    });
}

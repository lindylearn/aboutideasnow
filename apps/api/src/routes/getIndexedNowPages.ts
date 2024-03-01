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
            // url: true,
            updatedAt: true
        },
        orderBy: {
            updatedAt: "desc"
        }
    });
    // Map format
    const websitesUpdatedAt = posts.reduce((obj, post) => {
        let updatedAt: string | null = post.updatedAt.toISOString().slice(0, 10);
        if (updatedAt === "1970-01-01") {
            updatedAt = null;
        }

        return {
            ...obj,
            [post.domain]: updatedAt
        };
    }, {});

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
        validWebsitesCount: posts.length,
        lastScrapedAt: lastScrapeState?.scapedAt,
        websitesUpdatedAt
    });
}

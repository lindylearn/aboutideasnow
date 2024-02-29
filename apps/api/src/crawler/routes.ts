import { createCheerioRouter } from "crawlee";
import { getDomain, getMeta } from "../common/meta.js";
import normalizeUrl from "normalize-url";
import { getPageContent } from "../common/content.js";
import { PostType, ScrapeStatus } from "@repo/core/generated/prisma-client";
import { db } from "../common/db.js";
import { isExcludedPage } from "../common/filter.js";
import { indexPost, unIndexPost } from "../common/typesense.js";
import { getPostType } from "../common/postType.js";

export const router = createCheerioRouter();

// Scrape a directory of links
router.addHandler("directory", async ({ $, request, enqueueLinks, log }) => {
    const url = request.loadedUrl!;
    const domain = getDomain(url);
    log.info(`crawling directory: ${url}`);

    // Extract links
    const links = $("a[href]")
        .map((_, el) => $(el).attr("href"))
        .get()
        // map to absolute urls
        .map((link) => {
            try {
                const obj = new URL(link, url);
                // filter out current-domain links
                if (obj.hostname === domain) {
                    return null;
                }
                return obj.toString();
            } catch {
                return null;
            }
        })
        .filter((link) => link !== null) as string[];

    // Exclude already checked links
    const excludedDomains = new Set();
    const scrapeStates = await db.scrapeState.findMany({
        where: { domain: { in: links.map(getDomain) } }
    });
    scrapeStates.forEach((s) => excludedDomains.add(s.domain));
    const newLinks = links.filter((link) => !excludedDomains.has(getDomain(link)));
    log.info(`Found ${newLinks.length} new links`);

    // Randomize order to work around network errors
    newLinks.sort(() => Math.random() - 0.5);

    // Scrape new links
    await enqueueLinks({
        strategy: "all",
        label: "document",
        urls: newLinks.flatMap((url) => {
            const domain = getDomain(url);
            return [`https://${domain}/about`, `https://${domain}/now`, `https://${domain}/ideas`];
        })
    });
});

// Scrape an individual page
router.addHandler("document", async ({ $, request, log, enqueueLinks }) => {
    const url = normalizeUrl(request.loadedUrl || request.url);
    const domain = getDomain(url);
    const pathname = new URL(url).pathname;

    const originalUrl = normalizeUrl(request.url);
    const originalDomain = getDomain(originalUrl);

    // Detect post type
    const postType = getPostType(pathname);
    if (!postType) {
        log.info(`${domain} ${pathname} skipped (not /about, /now, or /ideas)\n`);
        return;
    }

    // Store domain redirects
    if (domain !== originalDomain) {
        log.info(`Redirected from ${originalDomain} to ${domain}`);
        await db.scrapeState.upsert({
            where: { domain_type: { domain, type: postType } },
            create: {
                domain: originalDomain,
                type: postType,
                status: ScrapeStatus.REDIRECTED,
                scapedAt: new Date()
            },
            update: {
                status: ScrapeStatus.REDIRECTED,
                scapedAt: new Date()
            }
        });
    }

    const existingPost = await db.post.findFirst({ where: { domain, type: postType } });

    // Extract content
    const title = $("title").text();
    const html = $.html();
    const content = await getPageContent(url, html);
    const wordCount = content?.split(/\s+/).length || 0;

    // Check if should exclude / delete post
    if (!content || isExcludedPage(url, domain, title, pathname, content)) {
        if (pathname === "/about") {
            log.info(`Trying / instead of /about for ${domain}\n`);
            enqueueLinks({
                strategy: "all",
                label: "document",
                urls: [`https://${domain}/`]
            });
            return;
        }
        log.info(`excluding ${url} (title: ${title})\n`);

        // Update scrape time if exists, otherwise save as no content
        await db.scrapeState.upsert({
            where: { domain_type: { domain, type: postType } },
            create: {
                domain,
                type: postType,
                status: ScrapeStatus.NO_CONTENT,
                scapedAt: new Date()
            },
            update: {
                scapedAt: new Date()
            }
        });

        // Delete post if existed before
        if (existingPost) {
            try {
                await db.post.deleteMany({ where: { domain, type: existingPost.type } });
                await unIndexPost(existingPost!);
            } catch {}
        }

        return;
    }

    // Always scrape the metadata for now to improve the date extraction
    const meta = await getMeta(url, html, content);
    // Log debug stats
    log.info(`scraped ${url}:`);
    log.info(`\ttitle: ${title}`);
    log.info(`\twords: ${wordCount}`);
    log.info(`\tdate: ${meta.date?.toISOString().slice(0, 10)}`);

    // Check if content has changed
    if (
        existingPost &&
        existingPost.content === content &&
        existingPost.updatedAt?.toISOString() === meta.date?.toISOString()
    ) {
        log.info(`skipping ${url} (content unchanged)\n`);

        // Update scrape time
        await db.scrapeState.upsert({
            where: { domain_type: { domain, type: postType } },
            create: {
                domain,
                type: postType,
                status: ScrapeStatus.SCRAPED,
                scapedAt: new Date()
            },
            update: {
                scapedAt: new Date()
            }
        });

        return;
    }

    log.info(``);

    // Update post
    const post = {
        url,
        domain,
        type: postType,
        content,
        updatedAt: meta.date || new Date("1970-01-01")
    };
    await db.post.upsert({
        where: { url },
        create: post,
        update: post
    });

    // Index for search async
    indexPost(post, log.info.bind(log));

    // Save scrape success
    await db.scrapeState.upsert({
        where: { domain_type: { domain, type: postType } },
        create: {
            domain,
            type: postType,
            status: ScrapeStatus.SCRAPED,
            scapedAt: new Date()
        },
        update: {
            status: ScrapeStatus.SCRAPED,
            scapedAt: new Date()
        }
    });
});

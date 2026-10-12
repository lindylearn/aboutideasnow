import type { Post, ScrapeState } from "@repo/core/generated/prisma-client";
import { db } from "./db.js";
import { getDomain } from "./meta.js";
import { indexPost, typesense } from "./typesense.js";

// Domains removed at the owner's request. The table is created on demand (no Prisma
// migration needed) and keeps a snapshot of the deleted rows so a removal can be undone.
let tableReady: Promise<unknown> | undefined;
function ensureTable() {
    tableReady ??= db
        .$executeRawUnsafe(
            `CREATE TABLE IF NOT EXISTS "RemovedDomain" (
                "domain" TEXT PRIMARY KEY,
                "reason" TEXT,
                "snapshot" JSONB NOT NULL,
                "removedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
            )`
        )
        .catch((e) => {
            tableReady = undefined;
            throw e;
        });
    return tableReady;
}

type Snapshot = { posts: Post[]; scrapeStates: ScrapeState[] };
type RemovedDomainRow = { domain: string; reason: string | null; snapshot: Snapshot; removedAt: Date };

export function normalizeDomain(input: string | undefined) {
    const value = input?.trim().toLowerCase();
    if (!value || !value.includes(".")) {
        return;
    }
    try {
        return getDomain(value.startsWith("http") ? value : `https://${value}`);
    } catch {
        return;
    }
}

export async function isDomainRemoved(domain: string) {
    await ensureTable();
    const rows = await db.$queryRaw<{ domain: string }[]>`
        SELECT "domain" FROM "RemovedDomain" WHERE "domain" = ${domain}`;
    return rows.length > 0;
}

export async function listRemovedDomains() {
    await ensureTable();
    const rows = await db.$queryRaw<RemovedDomainRow[]>`
        SELECT * FROM "RemovedDomain" ORDER BY "removedAt" DESC`;
    return rows.map((r) => ({
        domain: r.domain,
        reason: r.reason,
        removedAt: r.removedAt,
        posts: r.snapshot.posts.map((p) => ({ url: p.url, type: p.type }))
    }));
}

export async function removeDomain(domain: string, reason: string | null, dryRun = false) {
    await ensureTable();
    const posts = await db.post.findMany({ where: { domain } });
    const scrapeStates = await db.scrapeState.findMany({ where: { domain } });
    const indexed = await countIndexedDocuments(domain);

    const summary = {
        domain,
        posts: posts.map((p) => ({ url: p.url, type: p.type })),
        scrapeStates: scrapeStates.length,
        indexedDocuments: indexed
    };
    if (dryRun) {
        return { dryRun: true, ...summary };
    }

    // Save the snapshot first so nothing is lost if a later step fails. Removing an
    // already-removed domain appends to the existing snapshot instead of replacing it.
    const snapshot = JSON.stringify({ posts, scrapeStates } satisfies Snapshot);
    await db.$executeRaw`
        INSERT INTO "RemovedDomain" ("domain", "reason", "snapshot")
        VALUES (${domain}, ${reason}, ${snapshot}::jsonb)
        ON CONFLICT ("domain") DO UPDATE SET
            "reason" = COALESCE(EXCLUDED."reason", "RemovedDomain"."reason"),
            "snapshot" = jsonb_build_object(
                'posts', ("RemovedDomain"."snapshot"->'posts') || (EXCLUDED."snapshot"->'posts'),
                'scrapeStates', ("RemovedDomain"."snapshot"->'scrapeStates') || (EXCLUDED."snapshot"->'scrapeStates')
            )`;

    await db.$transaction([
        db.post.deleteMany({ where: { domain } }),
        db.scrapeState.deleteMany({ where: { domain } })
    ]);
    await typesense
        .collections("paragraphs")
        .documents()
        .delete({ filter_by: `domain:=${domain}` });

    return { ...summary, remainingIndexedDocuments: await countIndexedDocuments(domain) };
}

export async function restoreDomain(domain: string) {
    await ensureTable();
    const [row] = await db.$queryRaw<RemovedDomainRow[]>`
        SELECT * FROM "RemovedDomain" WHERE "domain" = ${domain}`;
    if (!row) {
        return;
    }

    // Dates come back from JSON as strings
    const posts = row.snapshot.posts.map((p) => ({
        url: p.url,
        domain: p.domain,
        type: p.type,
        content: p.content,
        updatedAt: new Date(p.updatedAt)
    }));
    const scrapeStates = row.snapshot.scrapeStates.map((s) => ({
        ...s,
        scapedAt: s.scapedAt ? new Date(s.scapedAt) : null
    }));

    await db.$transaction([
        db.post.createMany({ data: posts, skipDuplicates: true }),
        db.scrapeState.createMany({ data: scrapeStates, skipDuplicates: true }),
        db.$executeRaw`DELETE FROM "RemovedDomain" WHERE "domain" = ${domain}`
    ]);

    const indexErrors: string[] = [];
    for (const post of posts) {
        try {
            await indexPost(post);
        } catch (e) {
            indexErrors.push(`${post.url}: ${e}`);
        }
    }

    return {
        domain,
        posts: posts.map((p) => ({ url: p.url, type: p.type })),
        scrapeStates: scrapeStates.length,
        indexedDocuments: await countIndexedDocuments(domain),
        indexErrors
    };
}

async function countIndexedDocuments(domain: string) {
    const res = await typesense
        .collections("paragraphs")
        .documents()
        .search({ q: "*", query_by: "content", filter_by: `domain:=${domain}`, per_page: 0 });
    return res.found ?? 0;
}

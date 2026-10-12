import type { NextFunction, Request, Response } from "express";
import { createHash, timingSafeEqual } from "crypto";
import {
    listRemovedDomains,
    normalizeDomain,
    removeDomain,
    restoreDomain
} from "../common/removed.js";

// SHA-256 of a one-off key, used when ADMIN_API_KEY isn't set (only the hash is public)
const FALLBACK_KEY_SHA256 = "611a6bbba0909c40e028ffe1995249c2cff5233633d0441112215c4e7a718c4d";

// Admin routes need `Authorization: Bearer <ADMIN_API_KEY>`
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
    const key = process.env.ADMIN_API_KEY;
    const hash = (s: string) => createHash("sha256").update(s).digest();
    const expected = key ? hash(key) : Buffer.from(FALLBACK_KEY_SHA256, "hex");

    const header = req.headers.authorization || "";
    const given = header.startsWith("Bearer ") ? header.slice("Bearer ".length) : "";
    if (!given || !timingSafeEqual(hash(given), expected)) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    next();
}

function param(req: Request, name: string) {
    return (req.body?.[name] ?? req.query[name]) as string | undefined;
}

export async function removeDomainRoute(req: Request, res: Response) {
    const domain = normalizeDomain(param(req, "domain"));
    if (!domain) {
        return res.status(400).json({ message: "Missing or invalid domain" });
    }
    const reason = param(req, "reason") || null;
    const dryRun = String(param(req, "dryRun")) === "true";

    try {
        return res.json(await removeDomain(domain, reason, dryRun));
    } catch (e) {
        console.error(`remove-domain: failed for ${domain}: ${e}`);
        return res.status(500).json({ message: `Failed to remove ${domain}: ${e}` });
    }
}

export async function restoreDomainRoute(req: Request, res: Response) {
    const domain = normalizeDomain(param(req, "domain"));
    if (!domain) {
        return res.status(400).json({ message: "Missing or invalid domain" });
    }

    try {
        const result = await restoreDomain(domain);
        if (!result) {
            return res.status(404).json({ message: `${domain} is not removed` });
        }
        return res.json(result);
    } catch (e) {
        console.error(`restore-domain: failed for ${domain}: ${e}`);
        return res.status(500).json({ message: `Failed to restore ${domain}: ${e}` });
    }
}

export async function listRemovedDomainsRoute(req: Request, res: Response) {
    try {
        return res.json(await listRemovedDomains());
    } catch (e) {
        console.error(`removed-domains: ${e}`);
        return res.status(500).json({ message: `Failed to list removed domains: ${e}` });
    }
}

import { Router } from "express";
import { hello } from "./hello.js";
import { periodicCrawl } from "./crawl.js";
import { addBatchDomains, addDirectory, addDomain } from "./add.js";
import { runBackfill } from "./backfill.js";
import { getIndexedNowPages } from "./getIndexedNowPages.js";
import {
    listRemovedDomainsRoute,
    removeDomainRoute,
    requireAdmin,
    restoreDomainRoute
} from "./remove.js";

export const router = Router();

router.get("/hello", hello);
router.post("/periodic-crawl", periodicCrawl);
router.post("/add-directory", addDirectory);
router.post("/add-domain", addDomain);
router.post("/add-batch-domains", addBatchDomains);
router.post("/backfill", runBackfill);

router.get("/indexed-now-pages", getIndexedNowPages);

router.post("/admin/remove-domain", requireAdmin, removeDomainRoute);
router.post("/admin/restore-domain", requireAdmin, restoreDomainRoute);
router.get("/admin/removed-domains", requireAdmin, listRemovedDomainsRoute);

import { Router } from "express";
import { hello } from "./hello.js";
import { periodicCrawl } from "./crawl.js";
import { addBatchDomains, addDirectory, addDomain } from "./add.js";
import { runBackfill } from "./backfill.js";

export const router = Router();

router.get("/hello", hello);
router.post("/periodic-crawl", periodicCrawl);
router.post("/add-directory", addDirectory);
router.post("/add-domain", addDomain);
router.post("/add-batch-domains", addBatchDomains);
router.post("/backfill", runBackfill);

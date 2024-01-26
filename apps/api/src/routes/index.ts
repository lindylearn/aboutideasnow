import { Router } from "express";
import { hello } from "./hello.js";
import { periodicCrawl } from "./crawl.js";
import { addSite } from "./add.js";

export const router = Router();

router.get("/hello", hello);
router.get("/periodic-crawl", periodicCrawl);
router.get("/add-site", addSite);

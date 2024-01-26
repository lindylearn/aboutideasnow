import { Router } from "express";
import { hello } from "./hello.js";
import { periodicCrawl } from "./crawl.js";
import { addDirectory, addDomain } from "./add.js";

export const router = Router();

router.get("/hello", hello);
router.post("/periodic-crawl", periodicCrawl);
router.post("/add-directory", addDirectory);
router.post("/add-domain", addDomain);

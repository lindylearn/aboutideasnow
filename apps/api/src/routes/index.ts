import { Router } from "express";
import { hello } from "./hello.js";
import { crawl } from "./crawl.js";

export const router = Router();

router.get("/hello", hello);
router.get("/crawl", crawl);

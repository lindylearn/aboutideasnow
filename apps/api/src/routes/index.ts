import { Router } from "express";
import { hello } from "./hello.js";

export const router = Router();

router.get("/hello", hello);

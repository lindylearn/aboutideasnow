import type { Request, Response } from "express";

export async function hello(req: Request, res: Response) {
    return res.json({ message: "Hello World!!!" });
}

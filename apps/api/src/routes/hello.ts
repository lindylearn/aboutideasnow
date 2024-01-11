import type { Request, Response } from "express";

// import { getDatabaseClient } from "@repo/core";
// const db = getDatabaseClient();

export async function hello(req: Request, res: Response) {
    // const users = await db.user.findMany();
    // console.log(users);

    return res.json({ message: "Hello World!" });
}

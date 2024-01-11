import { PrismaClient } from "../generated/prisma-client";

export function getDatabaseClient(): PrismaClient {
    console.log("Initializing database client");

    return new PrismaClient();
}

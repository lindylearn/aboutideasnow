import { PostType } from "@repo/core/generated/prisma-client";

export function getPostType(pathname: string, originalPathname?: string) {
    // Allow /about redirect to /
    if (originalPathname === "/about" && pathname === "/") {
        pathname = "/about";
    }

    if (pathname === "/about") {
        return PostType.ABOUT;
    } else if (pathname === "/now") {
        return PostType.NOW;
    } else if (pathname === "/ideas") {
        return PostType.IDEAS;
    }

    return undefined;
}

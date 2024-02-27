import { PostType } from "@repo/core/generated/prisma-client";

export function getPostType(pathname: string) {
    // Ignore trailing slash
    if (pathname.endsWith("/")) {
        pathname = pathname.slice(0, -1);
    }

    // Treat / as /about
    if (pathname === "/") {
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

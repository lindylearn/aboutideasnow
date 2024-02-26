export function isExcludedPage(
    url: string,
    domain: string,
    title: string,
    pathname: string,
    content?: string
) {
    // Missing content
    const wordCount = content?.split(/\s+/).length || 0;
    if (!content || wordCount < 10) {
        return true;
    }

    // Check words in title & content
    const wordBlocklist = [
        "404",
        "oops",
        "missing",
        "not found",
        "cannot find",
        "couldn't find",
        "no page",
        "private site",
        "you're lost",
        "this website uses cookies",
        "error",
        "does not exist"
    ];
    if (
        wordBlocklist.some(
            (w) => title.toLowerCase().includes(w) || content.toLowerCase().includes(w)
        )
    ) {
        return true;
    }

    // Broken platform links such as https://hiradnotes.substack.com/now
    if (domain.includes("substack") || ["soundcloud.com"].includes(domain)) {
        return true;
    }

    // Ensure /ideas pages actually talk about ideas (and are not fallback pages)
    if (
        pathname === "/ideas" &&
        !(title.toLowerCase().includes("idea") || content.toLowerCase().includes("idea"))
    ) {
        return true;
    }

    // Exclude some pages manually for nice initial results
    if (
        [
            "https://jonathanhaslett.com/ideas",
            "https://levinofearth.com/ideas",
            "https://andreiluca.com/ideas"
        ].includes(url)
    ) {
        return true;
    }

    return false;
}

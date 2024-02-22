export function isExcludedPage(domain: string, title: string, content?: string) {
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
        "you're lost"
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

    return false;
}

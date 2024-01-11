export function isExcludedPage(domain: string, title: string, content?: string) {
    // Missing content
    const wordCount = content?.split(/\s+/).length || 0;
    if (!content || wordCount < 10) {
        return true;
    }

    // Check words in title
    const wordBlocklist = [
        "404",
        "page not found",
        "couldn't find the page",
        "no page found",
        "private site"
    ];
    if (
        wordBlocklist.some(
            (w) => title.toLowerCase().includes(w) || content.toLowerCase().includes(w)
        )
    ) {
        return true;
    }

    // Broken platform links such as https://hiradnotes.substack.com/now
    if (domain.includes("substack")) {
        return true;
    }

    return false;
}

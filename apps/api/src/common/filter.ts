export function isExcludedPage(title: string, content?: string) {
    // Missing content
    const wordCount = content?.split(/\s+/).length || 0;
    if (!content || wordCount < 10) {
        return true;
    }

    // Check words in title
    const wordBlocklist = ["404", "page not found", "couldn't find the page"];
    if (
        wordBlocklist.some(
            (w) => title.toLowerCase().includes(w) || content.toLowerCase().includes(w)
        )
    ) {
        return true;
    }
}

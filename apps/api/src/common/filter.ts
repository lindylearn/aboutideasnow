export function isExcludedPage(title: string, content?: string) {
    // Missing content
    const wordCount = content?.split(/\s+/).length || 0;
    if (!content || wordCount < 10) {
        return true;
    }

    // Check words in title
    const wordBlocklist = ["404", "not found"];
    if (wordBlocklist.some((w) => title.includes(w))) {
        return true;
    }
}

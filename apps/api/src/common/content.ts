import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import TurndownService from "turndown";

export async function getPageContent(url: string, html: string) {
    const dom = new JSDOM(html, { url });
    const document = dom.window.document;

    // Get simplified HTML content
    const article = new Readability(document).parse();
    if (!article?.content) {
        return;
    }

    // Convert to Markdown
    return new TurndownService().turndown(article.content);
}

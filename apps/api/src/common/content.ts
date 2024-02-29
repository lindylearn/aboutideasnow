import { Readability } from "@mozilla/readability";
// @ts-ignore types missing
import Parser from "@postlight/parser";
import { JSDOM } from "jsdom";
import TurndownService from "turndown";

export async function getPageContent(url: string, html: string) {
    const dom = new JSDOM(html, { url });
    const document = dom.window.document;

    const rawContent = document.body.textContent?.replace(/\s+/g, " ") || "";

    const articleContent = await getReaderModeHtml(url, html, document);

    return { rawContent, articleContent };
}

async function getReaderModeHtml(url: string, html: string, document: Document) {
    // Try Readability
    const article1 = new Readability(document).parse();
    const content1 = htmlToMarkdown(article1?.content);
    if (content1) {
        return content1;
    }

    // Try Postlight
    const article2 = await Parser.parse(url, { html });
    const content2 = htmlToMarkdown(article2?.content);
    if (content2) {
        return content2;
    }

    return undefined;
}

function htmlToMarkdown(html?: string) {
    if (!html) {
        return undefined;
    }

    return new TurndownService()
        .addRule("remove-tags", {
            filter: ["figure", "img"],
            replacement: function () {
                return "";
            }
        })
        .addRule("unwrap-links", {
            filter: ["a"],
            replacement: function (content) {
                return content;
            }
        })
        .turndown(html);
}

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

    // console.log(html);
    // console.log(document.body.innerText);

    // Convert to Markdown
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
        .turndown(article.content);
}

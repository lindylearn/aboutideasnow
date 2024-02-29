import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import TurndownService from "turndown";

export async function getPageContent(url: string, html: string) {
    const dom = new JSDOM(html, { url });
    const document = dom.window.document;

    const rawContent = document.body.textContent?.replace(/\s+/g, " ") || "";

    // Parse reader mode
    const article = new Readability(document).parse();
    // Convert to markdown
    const articleContent = article?.content
        ? new TurndownService()
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
              .turndown(article.content)
        : undefined;

    return { rawContent, articleContent };
}

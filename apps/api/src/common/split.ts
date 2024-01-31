import { MarkdownTextSplitter } from "langchain/text_splitter";

const splitter = new MarkdownTextSplitter({
    chunkSize: 500,
    chunkOverlap: 0
});

export async function getPostParagraphs(text: string) {
    // Exclude heading lines
    const lines = text.trim().split("\n");
    // console.log(lines.slice(0, 10));
    while (lines[0] && lines[0].length < 100) {
        lines.shift();
    }
    text = lines.join("\n");

    // console.log(lines.slice(0, 10));

    const paragraphs = await splitter.splitText(text);
    return paragraphs.filter((paragraph) => paragraph.length > 100).slice(0, 10);
}

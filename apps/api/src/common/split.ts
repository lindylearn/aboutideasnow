import { MarkdownTextSplitter } from "langchain/text_splitter";

const splitter = new MarkdownTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50
});

export async function getPostParagraphs(text: string) {
    // const paragraphs = text
    //     .split("\n\n")
    //     .map((p) => p.trim())
    //     .filter((p) => p.length > 10)
    //     .slice(0, 50);

    return await splitter.splitText(text);
}

// @ts-ignore
import Parser from "@postlight/parser";
import _metascraper from "metascraper";
import _metascraperDate from "metascraper-date";
import { openai } from "./openai.js";

// @ts-ignore
const metascraper = _metascraper([_metascraperDate()]);

export async function getMeta(url: string, html: string, content?: string) {
    const meta = await metascraper({ url, html });
    const domain = getDomain(url);

    // Try using metadata data
    let date = meta.date ? new Date(meta.date) : undefined;
    // Don't trust current or future dates, e.g. on https://francescasciandra.art/now
    if (date && date.toISOString().slice(0, 10) >= new Date().toISOString().slice(0, 10)) {
        date = undefined;
    }

    // Try GPT as last resort
    if (!date && content) {
        console.log("Trying GPT date parse");

        date = await findDateUsingGPT(content.slice(0, 2000));
    }

    return {
        domain,
        date
    };
}

async function findDateUsingGPT(text: string): Promise<Date | undefined> {
    if (!text) {
        return undefined;
    }

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106", // 3.5 seems enough for this
        max_tokens: 50,
        temperature: 0,
        messages: [
            {
                role: "system",
                content: `You are an API that extracts the lastUpdated full ISO date from a text. Return null if there's no date mentioned. Return only the data as JSON.`
            },
            {
                role: "user",
                content: text
            }
        ],
        response_format: { type: "json_object" }
    });
    const completion = response.choices[0].message.content;
    // Parse again with Chrono for error handling

    try {
        const isoString = JSON.parse(completion!).lastUpdated;
        return new Date(isoString);
    } catch (err) {
        console.error(`Could not parse date from string with GPT: ${completion}`);
        return undefined;
    }
}

export function getDomain(url: string) {
    return new URL(url).hostname.replace("www.", "");
}

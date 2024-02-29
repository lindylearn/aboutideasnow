// @ts-ignore
import Parser from "@postlight/parser";
import _metascraper from "metascraper";
import _metascraperDate from "metascraper-date";
import { openai } from "./openai.js";

// @ts-ignore
const metascraper = _metascraper([_metascraperDate()]);

export async function getMeta(url: string, html: string, content?: string, log = console.log) {
    const meta = await metascraper({ url, html });
    const domain = getDomain(url);

    let date: Date | undefined = undefined;

    // Use GPT date parse by default as it's the most reliable
    if (content) {
        date = await findDateUsingGPT(content.slice(0, 2000));
        if (!date && content.length > 2000) {
            // Try end of large pages
            date = await findDateUsingGPT(content.slice(-1000));
        }

        console.log(`GPT date: ${date?.toISOString().slice(0, 10)}`);
        console.log(`meta date: ${meta.date}`);
    }

    if (!date) {
        // Use metadata date instead
        date = meta.date ? new Date(meta.date) : undefined;

        // Don't trust future dates, e.g. on https://francescasciandra.art/now
        // Include the current date in case people create their now page before submitting it
        if (date && date.toISOString().slice(0, 10) > new Date().toISOString().slice(0, 10)) {
            date = undefined;
        }
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
        const date = new Date(isoString);

        // GTP returns 1970-01-01 for empty dates
        if (date && date.getFullYear() <= 1970) {
            return undefined;
        }
        // Don't trust future dates, e.g. on https://kunalmarwaha.com/now
        if (date && date.toISOString().slice(0, 10) > new Date().toISOString().slice(0, 10)) {
            return undefined;
        }

        return date;
    } catch (err) {
        console.error(`Could not parse date from string with GPT: ${completion}`);
        return undefined;
    }
}

export function getDomain(url: string) {
    return new URL(url).hostname.replace("www.", "");
}

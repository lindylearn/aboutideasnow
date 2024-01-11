// @ts-ignore
import Parser from "@postlight/parser";
import _metascraper from "metascraper";
import _metascraperDate from "metascraper-date";
import { findDates } from "find-dates";
import * as chrono from "chrono-node";

// @ts-ignore
const metascraper = _metascraper([_metascraperDate()]);

export async function getMeta(url: string, html: string) {
    const meta = await metascraper({ url, html });
    const domain = getDomain(url);

    // Try using metadata data
    let date = meta.date ? new Date(meta.date) : undefined;

    // Try another extractor library
    if (!date) {
        const results = findDates(html) as { match: string }[];
        if (results.length) {
            date = chrono.parseDate(results[0].match);
        }
    }

    // Don't trust current or future dates, e.g. on https://francescasciandra.art/now
    if (date && date.toISOString().slice(0, 10) >= new Date().toISOString().slice(0, 10)) {
        date = undefined;
    }

    return {
        domain,
        date
    };
}

export function getDomain(url: string) {
    return new URL(url).hostname.replace("www.", "");
}

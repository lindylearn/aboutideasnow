// @ts-ignore
import Parser from "@postlight/parser";
import _metascraper from "metascraper";
import _metascraperDate from "metascraper-date";

// @ts-ignore
const metascraper = _metascraper([_metascraperDate()]);

export async function getMeta(url: string, html: string) {
    const meta = await metascraper({ url, html });
    const domain = getDomain(url);

    const date = meta.date ? new Date(meta.date) : undefined;
    console.log(date);

    return {
        domain,
        date
    };
}

export function getDomain(url: string) {
    return new URL(url).hostname.replace("www.", "");
}

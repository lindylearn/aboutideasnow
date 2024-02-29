export function isExcludedPage(
    url: string,
    domain: string,
    title: string,
    pathname: string,
    rawContent: string,
    articleContent?: string
) {
    // Missing article content
    const wordCount = articleContent?.split(/\s+/).length || 0;
    if (!articleContent || wordCount < 10) {
        return true;
    }

    // Check words in title & content
    const wordBlocklist = [
        "404",
        "oops",
        "missing",
        "not found",
        "does not exist",
        "cannot find",
        "cannot be found",
        "couldn't find",
        "nothing found",
        "no page",
        "private site",
        "you're lost",
        "this website uses cookies",
        "does not exist",
        "you need to enable javascript",
        "server error",
        "| substack",
        "existiert noch nicht"
    ];
    if (
        wordBlocklist.some(
            (w) => title.toLowerCase().includes(w) || rawContent.toLowerCase().includes(w)
        )
    ) {
        return true;
    }

    // Broken platform links such as https://hiradnotes.substack.com/now
    if (domain.includes("substack") || ["soundcloud.com"].includes(domain)) {
        return true;
    }

    // Ensure /ideas pages actually talk about ideas (and are not fallback pages)
    if (
        pathname === "/ideas" &&
        !(title.toLowerCase().includes("idea") || rawContent.toLowerCase().includes("idea"))
    ) {
        return true;
    }

    // Exclude some domains & pages manually
    if (
        [
            "founderslist.com",
            "notesnook.com",
            "aisnakeoil.com",
            "dev.to",
            "github.com",
            "blog.tjcx.me",
            "ethical.net",
            "newstalk.com",
            "thoughtdistillery.com",
            "archive.blogs.harvard.edu",
            "indieweb.org",
            "wrightplacetv.com",
            "zotero.org",
            "theatlantic.com",
            "roarmag.org",
            "profiles.wordpress.org",
            "privacytools.io",
            "openthemagazine.com",
            "newstatesman.com",
            "learninpublic.org"
        ].includes(domain)
    ) {
        return true;
    }
    if (
        [
            "https://jonathanhaslett.com/ideas",
            "https://levinofearth.com/ideas",
            "https://andreiluca.com/ideas",
            "https://bunniestudios.com/ideas",
            "https://drorpoleg.com/ideas",
            "https://verraes.net/ideas",
            "https://blog.nateliason.com/ideas",
            "https://ajain.tech/ideas",
            "https://tracingwoodgrains.com/ideas",
            "https://secretorum.life/ideas",
            "https://blazsemprimoznik.com/ideas",
            "https://xan.lol/ideas",
            "https://hardtowrite.com/ideas",
            "https://flaviocopes.com/ideas",
            "https://kvark.github.io/ideas",
            "https://cwinters.com/ideas",
            "https://simply.joejenett.com/ideas",
            "https://joshj.blog/ideas",
            "https://ianbrodie.com/ideas",
            "https://marcjenkins.co.uk/ideas",
            "https://hans.gerwitz.com/ideas",
            "https://reesskennedy.com/ideas",
            "https://blog.bitsapien.dev/ideas",
            "https://jfpenn.com/ideas",
            "https://jonathontoon.com/ideas",
            "https://whatlisacooks.com/ideas",
            "https://thistooshallgrow.com/ideas",
            "https://teodorapetkova.com/ideas",
            "https://sohl-dickstein.github.io/ideas",
            "https://scottaaronson.blog/ideas",
            "https://ryanholiday.net/ideas",
            "https://rocketcrab.com/ideas",
            "https://neilkakkar.com/ideas",
            "https://nadia.xyz/ideas",
            "https://mywiki.wooledge.org/ideas",
            "https://michaelnielsen.org/ideas",
            "https://matthiasportzel.com/ideas",
            "https://markuskaarlonen.com/ideas",
            "https://liw.fi/ideas",
            "https://literacyenquirer.blogspot.com/ideas"
        ].includes(url)
    ) {
        return true;
    }

    return false;
}

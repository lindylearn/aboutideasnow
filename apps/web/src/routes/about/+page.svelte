<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types";
    import { colorPalette } from "../../common/constants";

    export let form: ActionData;

    let isAddingDomain = false;
</script>

<main class="flex flex-col w-full max-w-xl gap-5 text-lg md:gap-10 items-left">
    <section>
        <p>
            1000s of personal websites exist on the internet, created by creators, thinkers, and
            doers of all sorts.
        </p>
        <p>
            <span class="font-bold">aboutideasnow.com</span> exists to bring these sites together in
            one place &#8212; to help you find your people, and help them find you.
        </p>

        <p>
            We index the /about, /ideas, and /now pages of these sites, and give you a handy way to
            search through them.
        </p>
    </section>

    <section>
        <h2>The manifesto</h2>
        <p>
            <span class="font-bold">/about</span> pages are about the past: how you see yourself and
            what brought you here.
        </p>
        <p>
            <span class="font-bold">/now</span> is a more personal look at what you're doing now and
            what you care about.
        </p>
        <p>
            But there's something missing in both &#8212; the future. By writing your ideas of what
            you want to do next, people with similar ideas can find you and reach out.
        </p>
        <p>
            So <span class="font-bold">/ideas</span> is a space to write about the crazy things you always
            wanted to make, concepts you're mulling over, or projects you're looking to find collaborators
            for.
        </p>
    </section>

    <section>
        <h2>Help other people find you</h2>
        <p>
            You can add your website to the <span class="font-bold"> aboutideasnow.com </span> search
            index if it's not included already. For this you need to create an /about, /ideas, or /now
            page - or all three.
        </p>
        <p>The more you write, the more likely people can find you.</p>
        <div class="flex flex-col items-center mt-4 text-center">
            {#if form?.addedDomain === false}
                Error indexing your domain :(<br />We will take a look and add your site as soon as
                possible!
            {:else if form?.scrapedPosts}
                {#if form?.scrapedPosts.length === 0}
                    We didn't find a /now, /about, or /ideas page on your website. Add one and try
                    again!
                {:else}
                    Indexed your website successfully! Found posts:
                    <ul class="list-disc">
                        {#each form.scrapedPosts as post}
                            <li>
                                {post.url}
                                last updated at {new Intl.DateTimeFormat("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric"
                                }).format(new Date(post.updatedAt))}
                            </li>
                        {/each}
                    </ul>
                {/if}
            {:else if isAddingDomain}
                Indexing your domain...
            {:else}
                <form
                    class="flex flex-col items-center gap-2 w-96 md:w-full md:gap-4 md:flex-row"
                    method="POST"
                    use:enhance={() => {
                        // Show loading state until page data is reloaded
                        isAddingDomain = true;
                    }}
                >
                    <input
                        class="px-3 py-2 text-lg border rounded-lg shadow-lg outline-none grow bg-light placeholder:text-text/30 border-border"
                        placeholder="mywebsite.com"
                        name="domain"
                        required
                    />
                    <button
                        class="px-3 py-2 font-bold text-white border rounded-lg shadow-lg border-border"
                        style:background-color={colorPalette[0]}
                    >
                        Add my site
                    </button>
                </form>
            {/if}
        </div>
    </section>

    <section>
        <h2>Who built this?</h2>
        <p>
            <span class="font-bold"> aboutideasnow.com </span> is a decentralized solution on the increasingly
            centralized web. We exist to direct you to people's personal websites &#8212; you take it
            from there.
        </p>
        <p>
            <a class="font-bold" href="https://lindylearn.io" target="_blank">Peter Hagen</a>
            and
            <a class="font-bold" href="https://louis.work" target="_blank">Louis Barclay</a> built this
            website in January 2024.
        </p>
        <p>
            <a class="font-bold" href="https://agentcooper.io/about" target="_blank">Artem Tyurin</a
            > came up with the notion of /ideas pages.
        </p>
        <p>
            <a href="https://sive.rs" target="_blank"> Derek Sivers </a>started the /now page
            movement without which this all wouldn't be possible.
        </p>
        <p>
            Contribute
            <a href="https://github.com/lindylearn/ideasideasideas" target="_blank"> on GitHub</a> to
            add your name here!
        </p>
    </section>
</main>

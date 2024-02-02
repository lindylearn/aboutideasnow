<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types";
    import { colorPalette } from "../../common/constants";

    export let form: ActionData;

    let isAddingDomain = false;
</script>

<main class="flex flex-col max-w-xl gap-5 text-lg text-justify md:gap-10 items-left">
    <section>
        <!-- <h2>Okay, so what is this?</h2> -->
        <p>
            1000s of personal websites exist on the internet, created by creators, thinkers, and
            doers of all sorts.
            <span class="font-bold">aboutideasnow.com</span> exist to help you find your people, and
            help them find you.
        </p>
    </section>

    <section>
        <h2>Finding interesting people</h2>
        <p>
            Search for any topic, project, or feeling that you're thinking about on <span
                class="font-bold">aboutideasnow.com</span
            >. Then visit people's websites to learn more about them.
        </p>
        <p>
            Maybe you can exchange ideas or work together! All the best things in life happen
            through collaboration.
        </p>
    </section>

    <section>
        <h2>Help other people find me</h2>
        <p>
            <span class="font-bold">aboutideasnow.com</span> indexes the /about, /ideas, and /now pages
            of personal websites. If you want other people to find you, you need to create at least one
            of these pages and submit your site here.
        </p>
        <p>
            <span class="font-bold">/about</span> to describe yourself with whatever you want to share.
        </p>
        <p>
            <span class="font-bold">/ideas</span> with what you want to work on in the future, what you're
            frequently thinking about, or projects you're looking collaborators for.
        </p>
        <p>
            <span class="font-bold">/now</span> with what you're up to right now.
        </p>

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
                        class="px-3 py-2 font-bold border rounded-lg shadow-lg border-border"
                        style:background-color={colorPalette[0]}
                    >
                        Add my site
                    </button>
                </form>
            {/if}
        </div>
    </section>

    <section>
        <h2>About this website</h2>
        <p>
            <span class="font-bold"> aboutideasnow.com </span> is a decentralized solution on the increasingly
            centralized web. It exists only to direct you to people's personal websites and take it from
            there.
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

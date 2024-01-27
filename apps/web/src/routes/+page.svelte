<script lang="ts">
    import { enhance } from "$app/forms";
    import IdeaCard from "../components/IdeaCard.svelte";
    import type { PageData, ActionData } from "./$types";

    export let data: PageData;
    export let form: ActionData;

    let isAddingDomain = false;
    let colorPalette = ["#ffb3ba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff"];
</script>

<main class="flex flex-col items-center gap-3 md:gap-7">
    <header class="flex flex-col items-center justify-center h-auto">
        <h1 class="text-4xl font-bold leading-relaxed text-center md:text-5xl font-title">
            <span style="background-color: {colorPalette[2]}" class="px-2 rounded-md">about</span>
            <span style="background-color: {colorPalette[3]}" class="px-2 rounded-md">now</span>
            <span style="background-color: {colorPalette[4]}" class="px-2 rounded-md">ideas</span>
        </h1>
        <!-- <h2 class="font-bold text-center md:text-lg">index of personal websites</h2> -->
    </header>

    <main class="flex flex-col max-w-xl text-center text-lg items-center gap-3">
        <!-- <p>
            Social media is not good at creating authentic human connections.
            <br />
            But how can you find people on the internet without it?
        </p> -->
        <!-- <p>Browsing personal websites is the best way to get to know people on the internet.</p> -->
        <p>
            Find people to talk to or collaborate with by searching across the
            <span class="px-2 py-1 text-sm rounded-md bg-slate-300">/about</span>
            <span class="px-2 py-1 text-sm rounded-md bg-slate-300">/now</span> and
            <span class="px-2 py-1 text-sm rounded-md bg-slate-300">/ideas</span>
            pages of 1000s of personal websites.
        </p>
    </main>

    <a class="w-max px-3 py-2 text-white rounded-md bg-text" href="/manifesto">
        Read the /ideas manifesto
    </a>

    <!-- <div class="text-center">
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
                class="flex flex-col justify-center w-full gap-2 mb-4 md:gap-4 md:flex-row"
                method="POST"
                use:enhance={() => {
                    // Show loading state until page data is reloaded
                    isAddingDomain = true;
                }}
            >
                <input
                    class="w-full px-3 py-2 text-lg text-center rounded-md shadow-sm md:w-auto md:text-left"
                    placeholder="mywebsite.com"
                    name="domain"
                    required
                />
                <button class="w-full h-auto px-3 py-2 text-white rounded-md md:w-auto bg-text">
                    Add my website
                </button>
            </form>
        {/if}
    </div> -->

    <div class="w-full flex gap-2 mt-5">
        <button class="px-2 py-1 bg-slate-300 rounded-md text-lg">{data.posts.length} posts</button>
        <input
            class="grow px-3 py-2 text-lg text-center rounded-md shadow-sm md:w-auto md:text-left"
            placeholder="Search for anything that people are doing"
        />

        <button class="px-2 py-1 bg-slate-300 rounded-md text-lg">All posts</button>
        <button class="px-2 py-1 bg-slate-300 rounded-md text-lg">All languages</button>
        <button class="px-2 py-1 bg-slate-300 rounded-md text-lg">All time</button>
    </div>

    <div
        class="flex flex-col items-center justify-around w-full gap-8 md:grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
    >
        {#each data.posts as post, index}
            <IdeaCard {post} color={colorPalette[index % colorPalette.length]}></IdeaCard>
        {/each}
    </div>
    <footer>
        <p>
            Made with 💡 by
            <a class="font-bold" href="https://lindylearn.io" target="_blank">Peter Hagen</a>
            and
            <a class="font-bold" href="https://louis.work" target="_blank">Louis Barclay</a>.
            Contribute on
            <a
                class="font-bold"
                href="https://github.com/lindylearn/ideasideasideas"
                target="_blank"
            >
                GitHub
            </a>
            to add your name here!
        </p>
    </footer>
</main>

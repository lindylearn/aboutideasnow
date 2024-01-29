<script lang="ts">
    import IdeaCard from "../components/IdeaCard.svelte";
    import type { PageData } from "./$types";
    import type { Post } from "@repo/core/generated/prisma-client";
    import debounce from "lodash/debounce";

    export let data: PageData;

    let searchQuery = "";
    let isLoading = false;
    let posts: Post[] = data.posts;
    $: if (!searchQuery) {
        posts = data.posts;
        isLoading = false;
    }
    const search = debounce(async () => {
        isLoading = true;
        const res = await fetch(`/api/search?query=${searchQuery}`);
        const json = await res.json();

        posts = json.posts;
        isLoading = false;
    }, 500);

    let colorPalette = ["#ffb3ba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff"];
</script>

<main class="flex flex-col items-center gap-3 md:gap-7">
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
            <span class="px-2 py-1 text-sm rounded-md bg-slate-300">/ideas</span> and
            <span class="px-2 py-1 text-sm rounded-md bg-slate-300">/now</span>
            pages of 1000s of personal websites.
        </p>
    </main>

    <a class="w-max px-3 py-2 text-white rounded-md bg-text" href="/manifesto">
        Read the /ideas manifesto
    </a>

    <div class="flex flex-wrap gap-2">
        <button
            class="px-2 py-1 bg-slate-300 rounded-md text-lg"
            on:click={() => {
                searchQuery = "Writing a book";
                search();
            }}
        >
            Writing a book
        </button>
        <button
            class="px-2 py-1 bg-slate-300 rounded-md text-lg"
            on:click={() => {
                searchQuery = "Spending time with my kids";
                search();
            }}
        >
            Spending time with my kids
        </button>
        <button
            class="px-2 py-1 bg-slate-300 rounded-md text-lg"
            on:click={() => {
                searchQuery = "Searching for a job";
                search();
            }}
        >
            Searching for a job
        </button>
    </div>

    <div class="w-full flex gap-2 mt-5">
        <!-- <button class="px-2 py-1 bg-slate-300 rounded-md text-lg">{posts.length} posts</button> -->
        <input
            class="grow px-3 py-2 text-lg text-center rounded-md shadow-sm md:w-auto md:text-left"
            placeholder="Search for anything that people are doing"
            bind:value={searchQuery}
            on:input={search}
        />

        <!-- <button class="px-2 py-1 bg-slate-300 rounded-md text-lg">All posts</button>
        <button class="px-2 py-1 bg-slate-300 rounded-md text-lg">All languages</button>
        <button class="px-2 py-1 bg-slate-300 rounded-md text-lg">All time</button> -->
    </div>

    {#if isLoading}
        <div class="text-center">Loading...</div>
    {:else}
        <div
            class="flex flex-col items-center justify-around w-full gap-8 md:grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        >
            {#each posts as post, index}
                <IdeaCard {post} color={colorPalette[index % colorPalette.length]}></IdeaCard>
            {/each}
        </div>
    {/if}
</main>

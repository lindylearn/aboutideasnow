<script lang="ts">
    import IdeaCard from "../components/IdeaCard.svelte";
    import type { PageData } from "./$types";
    import type { Post } from "@repo/core/generated/prisma-client";
    import debounce from "lodash/debounce";

    let exampleSearchQueries = [
        {
            term: "writing",
            emoji: "🖊️"
        },
        {
            term: "design",
            emoji: "📈✍️"
        },
        {
            term: "art",
            emoji: "🎨"
        },
        {
            term: "apps",
            emoji: "📱"
        },
        {
            term: "coding",
            emoji: "👩‍💻"
        },
        {
            term: "sport",
            emoji: "🏓"
        },
        {
            term: "meeting people",
            emoji: "🤼"
        },
        {
            term: "productivity",
            emoji: "📈"
        }
    ];

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
    <main class="flex flex-col items-center max-w-xl gap-3 mb-8 text-lg text-center">
        <!-- <p>
            Social media is not good at creating authentic human connections.
            <br />
            But how can you find people on the internet without it?
        </p> -->
        <!-- <p>Browsing personal websites is the best way to get to know people on the internet.</p> -->
        <p>
            Find people to talk to or collaborate with by searching across the
            <span class="px-2 py-1 font-bold bg-green-200 rounded-md">/about</span>,
            <span class="px-2 py-1 font-bold bg-yellow-200 rounded-md">/ideas</span> and
            <span class="px-2 py-1 font-bold bg-red-200 rounded-md">/now</span>
            pages of 1000s of personal websites.
        </p>
    </main>

    <a
        class="px-6 py-4 mb-8 text-lg text-white bg-blue-600 rounded-md shadow-lg w-max"
        href="/manifesto"
    >
        Read the manifesto
    </a>

    <div class="flex justify-center w-full gap-2">
        <!-- <button class="px-2 py-1 text-lg rounded-md bg-slate-300">{posts.length} posts</button> -->
        <input
            class="w-8 max-w-2xl px-3 py-2 text-lg text-center rounded-md shadow-sm grow md:w-auto"
            placeholder="🔍 Search"
            bind:value={searchQuery}
            on:input={search}
        />

        <!-- <button class="px-2 py-1 text-lg rounded-md bg-slate-300">All posts</button>
        <button class="px-2 py-1 text-lg rounded-md bg-slate-300">All languages</button>
        <button class="px-2 py-1 text-lg rounded-md bg-slate-300">All time</button> -->
    </div>
    <div class="flex flex-wrap justify-center max-w-2xl gap-2 mb-8">
        {#each exampleSearchQueries as exampleSearchQuery}
            <button
                class="px-2 py-1 text-lg bg-white rounded-md shadow-sm"
                on:click={() => {
                    searchQuery = exampleSearchQuery.term;
                    search();
                }}
            >
                {exampleSearchQuery.emoji + " " + exampleSearchQuery.term}
            </button>
        {/each}
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

<script lang="ts">
    import { exampleSearchQueries } from "../common/constants";
    import { searchPosts, type SearchedPost } from "../common/typesense";
    import IdeaCard from "../components/IdeaCard.svelte";
    import type { PageData } from "./$types";
    import debounce from "lodash/debounce";

    // export let data: PageData;

    let searchQuery = "";
    let posts: SearchedPost[] = [];
    let isSearching = false;
    $: if (!searchQuery) {
        posts = [];
        isSearching = false;
    }

    async function runSearch() {
        if (!searchQuery) {
            return;
        }

        isSearching = true;
        posts = await searchPosts(searchQuery); // Call TypeSense directly from the browser
        isSearching = false;
    }
    const runSearchDebounced = debounce(runSearch, 200);

    let colorPalette = ["#ffb3ba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff"];
</script>

<main class="flex flex-col items-center gap-3 md:gap-7">
    <main class="flex flex-col items-center max-w-2xl gap-2 text-lg text-center">
        <p>
            Find people to talk to or collaborate with by searching across the
            <span class="px-2 py-1 font-bold bg-green-200 rounded-md">/about</span>,
            <span class="px-2 py-1 font-bold bg-yellow-200 rounded-md">/ideas</span> and
            <span class="px-2 py-1 font-bold bg-red-200 rounded-md">/now</span>
            pages of 1000s of personal websites.
        </p>

        <a class="text-lg font-bold" href="/manifesto">Read the /ideas manifesto</a>
    </main>

    <div class="flex items-center justify-center w-full gap-2 max-w-3xl mt-5">
        <!-- svelte-ignore a11y-autofocus -->
        <input
            id="search-bar"
            class="w-8 px-3 py-2 text-lg text-center rounded-md shadow grow md:w-auto outline-none"
            placeholder="Search for anything that people are doing"
            autocapitalize="off"
            spellcheck="false"
            autofocus
            bind:value={searchQuery}
            on:input={runSearchDebounced}
        />
        <div class="relative w-0">
            {#if isSearching}
                <div class="loader -ml-10" />
            {/if}
        </div>
    </div>

    <div class="flex flex-wrap justify-center max-w-4xl gap-2 mb-8 -mt-2">
        {#each exampleSearchQueries as exampleSearchQuery}
            <button
                class="px-2 py-1 text-lg bg-white rounded-md shadow-sm"
                on:click={() => {
                    searchQuery = exampleSearchQuery.term;
                    // trigger search without debounce
                    runSearch();

                    document.getElementById("search-bar")?.focus();
                }}
            >
                {exampleSearchQuery.emoji + " " + exampleSearchQuery.term}
            </button>
        {/each}
    </div>

    <div
        class="flex flex-col items-start justify-around w-full gap-8 md:grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
    >
        {#each posts as post, index (post.id)}
            <IdeaCard {post} color={colorPalette[index % colorPalette.length]}></IdeaCard>
        {/each}
        {#if posts.length}
            <IdeaCard
                post={{
                    domain: "ideasideasideas.io",
                    // @ts-ignore
                    type: "ABOUT",
                    content:
                        "Something missing?\n\nSubmit your website to ideasideasideas so that others can find you and reach out!",
                    url: "https://ideasideasideas.io/manifesto",
                    // @ts-ignore
                    updatedAt: undefined
                }}
                color="#ffb3ba"
            />
        {/if}
    </div>
</main>

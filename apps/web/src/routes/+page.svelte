<script lang="ts">
    import { colorPalette, exampleSearchQueries } from "../common/constants";
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
</script>

<main class="flex flex-col items-center gap-3 md:gap-7">
    <main class="flex flex-col items-center max-w-2xl gap-2 text-lg text-center">
        <p>
            Find people to talk to or collaborate with by searching across the /about, /ideas and
            /now pages of 1000s of personal websites.
        </p>

        <a class="text-lg font-semibold" href="/manifesto">Read the /ideas manifesto</a>
    </main>

    <div class="flex items-center justify-center w-full gap-2 max-w-4xl mt-0">
        <!-- svelte-ignore a11y-autofocus -->
        <input
            id="search-bar"
            class="w-8 px-3 py-2 text-lg text-center shadow-lg rounded-xl grow md:w-auto outline-none bg-light placeholder:text-text/25 border border-border"
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

    {#if posts.length}
        <div
            class="flex flex-col items-start justify-around w-full gap-8 md:grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        >
            {#each posts as post, index (post.id)}
                <IdeaCard {post} color={colorPalette[index % colorPalette.length]}></IdeaCard>
            {/each}

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
        </div>
    {:else}
        <div class="flex flex-wrap justify-center max-w-4xl gap-2 mb-8 -mt-2">
            {#each exampleSearchQueries as exampleSearchQuery}
                <button
                    class="px-2 py-1 font-mono"
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
    {/if}
</main>

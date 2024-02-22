<script lang="ts">
    import { colorPalette, exampleSearchQueries } from "../common/constants";
    import { searchPosts } from "../common/typesense";
    import IdeaCard from "../components/IdeaCard.svelte";
    import type { PageData } from "./$types";
    import debounce from "lodash/debounce";
    import XIcon from "../components/icons/x.svelte";
    import type { Post, PostType } from "@repo/core/generated/prisma-client";

    export let data: PageData;

    let searchQuery = "";
    let postTypeFilter: PostType | undefined = "IDEAS";

    let searchedPosts: Post[] = [];
    let isSearching = false;
    $: if (!searchQuery) {
        searchedPosts = [];
        isSearching = false;
    }

    async function runSearch() {
        if (!searchQuery) {
            return;
        }

        isSearching = true;
        searchedPosts = await searchPosts(searchQuery, postTypeFilter); // Call TypeSense directly from the browser
        isSearching = false;
    }
    const runSearchDebounced = debounce(runSearch, 200);
</script>

<main class="flex flex-col items-center max-w-2xl gap-0 text-lg text-center">
    <p>
        Find people to talk to or collaborate with by searching across the /about, /ideas and /now
        pages of 1000s of personal websites.
    </p>
    <a class="text-lg underline" href="/about">Read the manifesto</a>
</main>

<div class="flex">
    {#each ["ABOUT", "IDEAS", "NOW"] as word, i}
        <button
            class="h-full px-2 py-2 font-mono"
            style:background-color={postTypeFilter === word ? colorPalette[i] : undefined}
            on:click={() => {
                // @ts-ignore
                postTypeFilter = word;
                runSearch();
            }}
        >
            /{word.toLowerCase()}
        </button>
    {/each}
</div>

<div
    id="search-container"
    class="flex items-stretch w-full max-w-4xl overflow-hidden text-lg bg-white border shadow-md rounded-xl border-border"
>
    <!-- svelte-ignore a11y-autofocus -->
    <input
        id="search-bar"
        class="px-3 py-2 text-center outline-none grow placeholder:text-text/30"
        placeholder="Search for anything that people are doing"
        autocapitalize="off"
        spellcheck="false"
        autofocus
        bind:value={searchQuery}
        on:input={runSearchDebounced}
    />
    <div class="relative flex items-center w-0">
        {#if isSearching}
            <div class="loader -ml-9 animate-fadein" />
        {:else if searchQuery}
            <button
                class="p-1 -ml-10 font-normal rounded-full animate-fadein"
                on:click={() => {
                    searchQuery = "";
                    document.getElementById("search-bar")?.focus();
                }}
            >
                <XIcon />
            </button>
        {/if}
    </div>
</div>

<div id="example-searches" class="flex flex-wrap justify-center max-w-4xl gap-2 animate-fadein">
    {#each exampleSearchQueries as exampleSearchQuery}
        <button
            class="px-2 py-1 font-mono transition-colors hover:text-text/50"
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
    id="search-results"
    class="flex flex-col items-start justify-around w-full gap-8 md:grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
>
    {#each searchedPosts.length ? searchedPosts : data.defaultPosts as post, index (post.url)}
        <IdeaCard {post} listIndex={index}></IdeaCard>
    {/each}
</div>

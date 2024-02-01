<script lang="ts">
    import { colorPalette, exampleSearchQueries } from "../common/constants";
    import { searchPosts, type SearchedPost } from "../common/typesense";
    import IdeaCard from "../components/IdeaCard.svelte";
    import type { PageData } from "./$types";
    import debounce from "lodash/debounce";
    import XIcon from "../components/icons/x.svelte";

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

<main class="flex flex-col items-center max-w-2xl gap-0 text-lg text-center">
    <p>
        Find people to talk to or collaborate with by searching across the /about, /ideas and /now
        pages of 1000s of personal websites.
    </p>
    <a class="text-lg font-semibold transition-all hover:text-text/50" href="/about"
        >Read the /ideas manifesto</a
    >
</main>

<div class="flex items-center justify-center w-full max-w-4xl gap-2">
    <!-- svelte-ignore a11y-autofocus -->
    <input
        id="search-bar"
        class="w-8 px-3 py-2 text-lg text-center border shadow-md outline-none rounded-xl grow md:w-auto bg-light placeholder:text-text/30 border-border"
        placeholder="Search for anything that people are doing"
        autocapitalize="off"
        spellcheck="false"
        autofocus
        bind:value={searchQuery}
        on:input={runSearchDebounced}
    />
    <div class="relative flex items-center w-0">
        {#if isSearching}
            <div class="loader -ml-11 animate-fadein" />
        {:else if searchQuery}
            <button
                class="p-1 -ml-12 transition-colors rounded-full hover:text-text/50 animate-fadein"
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

{#if posts.length}
    <div
        id="search-results"
        class="flex flex-col items-start justify-around w-full gap-8 md:grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
    >
        {#each posts as post, index (post.id)}
            <IdeaCard {post} listIndex={index}></IdeaCard>
        {/each}

        <IdeaCard
            post={{
                domain: "ideasideasideas.io",
                // @ts-ignore
                type: "ABOUT",
                content:
                    "Something missing?\n\nSubmit your website to ideasideasideas so that others can find you and reach out!",
                url: "https://ideasideasideas.io/about",
                // @ts-ignore
                updatedAt: undefined
            }}
        />
    </div>
{:else}
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
{/if}

<script lang="ts">
    import { page, navigating } from "$app/stores";
    import { goto } from "$app/navigation";
    import { colorPalette, exampleSearchQueries } from "../common/constants";
    import { searchPosts } from "../common/typesense";
    import IdeaCard from "../components/IdeaCard.svelte";
    import type { PageData } from "./$types";
    import debounce from "lodash/debounce";
    import XIcon from "../components/icons/x.svelte";
    import type { Post, PostType } from "@repo/core/generated/prisma-client";
    import clsx from "clsx";

    export let data: PageData;

    let searchQuery = $page.url.searchParams.get("q") || "";
    let postTypeFilter: PostType | undefined = "IDEAS";

    let searchedPosts: Post[] = [];
    let isSearching = false;
    $: if (!searchQuery) {
        searchedPosts = [];
        isSearching = false;
    }

    async function runSearch() {
        // Update URL params
        const searchParams = new URLSearchParams($page.url.searchParams.toString());
        searchParams.set("filter", postTypeFilter?.toLowerCase() || "ideas");
        if (searchQuery) {
            searchParams.set("q", searchQuery);
        } else {
            searchParams.delete("q");
        }

        if (!searchQuery) {
            // Show most recent posts per type by reloading the page
            goto(`?${searchParams.toString()}`);
            return;
        } else {
            // Update URL without reload
            window.history.replaceState(history.state, "", `?${searchParams.toString()}`);
        }

        isSearching = true;
        searchedPosts = await searchPosts(searchQuery, postTypeFilter); // Call TypeSense directly from the browser
        isSearching = false;
    }
    const runSearchDebounced = debounce(runSearch, 200);

    // Run search on page load
    if (searchQuery && typeof window !== "undefined") {
        runSearch();
    }
</script>

<main class="flex flex-col items-center max-w-2xl gap-0 text-lg text-center">
    <p>
        Find people to talk to or collaborate with by searching across the /about, /ideas and /now
        pages of 1000s of personal websites.
    </p>
    <a class="text-lg underline" href="/about">Read the manifesto</a>
</main>

<div class="flex items-center w-full max-w-4xl gap-4">
    <div class="flex overflow-hidden shadow-md rounded-xl border-border">
        {#each ["ABOUT", "IDEAS", "NOW"] as word, i}
            <button
                class={clsx(
                    "h-full px-2 py-2 text-lg bg-white",
                    postTypeFilter !== word && "text-text/30"
                )}
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
        class="flex items-stretch overflow-hidden text-lg bg-white border shadow-md grow rounded-xl border-border"
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
            {#if isSearching || $navigating}
                <div class="loader -ml-9 animate-fadein" />
            {:else if searchQuery}
                <button
                    class="p-1 -ml-10 font-normal rounded-full animate-fadein"
                    on:click={() => {
                        searchQuery = "";
                        runSearch();
                        document.getElementById("search-bar")?.focus();
                    }}
                >
                    <XIcon />
                </button>
            {/if}
        </div>
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
    {#each searchQuery ? searchedPosts : data.defaultPosts as post, index (post.url)}
        <IdeaCard {post} listIndex={index}></IdeaCard>
    {/each}
</div>

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
    import Form from "../components/Form.svelte";
    import type { ActionData } from "./about/$types";
    import posthog from "posthog-js";
    import Header from "../components/Header.svelte";

    export let data: PageData;
    export let form: ActionData;

    let showFilter = false;
    let isAddingDomain = false;

    let searchQuery = $page.url.searchParams.get("q") || "";
    let postTypeFilter: PostType | undefined = $page.url.searchParams
        .get("filter")
        ?.toUpperCase() as PostType;

    function toggleFilter() {
        if (postTypeFilter === undefined) {
            postTypeFilter = "ABOUT";
        } else if (postTypeFilter === "ABOUT") {
            postTypeFilter = "IDEAS";
        } else if (postTypeFilter === "IDEAS") {
            postTypeFilter = "NOW";
        } else {
            postTypeFilter = undefined;
        }

        runSearch();
    }

    let searchedPosts: Post[] = [];
    let isSearching = false;
    $: if (!searchQuery) {
        searchedPosts = [];
        isSearching = false;
    }

    async function runSearch() {
        if (searchQuery) {
            postTypeFilter = undefined;
        } else {
            // postTypeFilter = "IDEAS";
        }

        // Update URL params
        const searchParams = new URLSearchParams($page.url.searchParams.toString());
        if (postTypeFilter) {
            searchParams.set("filter", postTypeFilter?.toLowerCase() || "ideas");
        } else {
            searchParams.delete("filter");
        }
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
        showFilter = false;
        searchedPosts = await searchPosts(searchQuery, postTypeFilter); // Call TypeSense directly from the browser
        isSearching = false;

        posthog.capture("search");
    }
    const runSearchDebounced = debounce(runSearch, 200);

    // Run search on page load
    if (searchQuery && typeof window !== "undefined") {
        runSearch();
    }
</script>

<Header activeTag={postTypeFilter} onClick={toggleFilter} />

<main class="flex flex-col items-center max-w-xl gap-0 text-center md:text-lg">
    <p>
        Find people to talk to or collaborate with by searching across the /about, /ideas and /now
        pages of {data.websiteCount}
        personal websites.
    </p>
    <a class="underline transition-opacity md:text-lg hover:opacity-50" href="/about"
        >Read the manifesto</a
    >
</main>

<div class="flex items-center w-full max-w-4xl gap-4">
    <div
        id="search-container"
        class="flex items-stretch self-stretch overflow-hidden bg-white border shadow-md md:text-lg grow rounded-xl border-border"
    >
        <!-- svelte-ignore a11y-autofocus -->
        <input
            id="search-bar"
            class="px-3 py-2 text-center outline-none grow placeholder:text-text/30"
            placeholder="Search for anything that interests you"
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
                        // document.getElementById("search-bar")?.focus();
                    }}
                >
                    <XIcon />
                </button>
            {/if}
        </div>
    </div>

    <!-- <button
        class={clsx(
            "hidden md:block transition-opacity text-text hover:opacity-100",
            showFilter ? "opacity-100" : "opacity-30"
        )}
        on:click={() => {
            showFilter = !showFilter;
        }}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
            />
        </svg>
    </button> -->
</div>

<!-- {#if showFilter}
    <div class="flex gap-2 overflow-hidden font-title border-border md:-mt-5">
        {#each ["ABOUT", "IDEAS", "NOW"] as word, i}
            <button
                class={clsx(
                    "rounded-lg px-2 text-text font-mono",
                    postTypeFilter !== word &&
                        "transition-opacity opacity-30 h-full px-2 py-1 hover:opacity-100"
                )}
                style:background-color={postTypeFilter === word ? colorPalette[i] : undefined}
                on:click={() => {
                    // @ts-ignore
                    postTypeFilter = word;
                    searchQuery = "";
                    runSearch();
                }}
            >
                /{word.toLowerCase()}
            </button>
        {/each}
    </div>
{/if} -->

<div
    id="example-searches"
    class="flex flex-wrap justify-center max-w-4xl gap-1 -mx-5 -mt-2 text-sm md:text-base md:mx-0 md:justify-center md:-mt-5"
>
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
    class="flex flex-col items-start justify-around w-full gap-8 mt-2 mb-5 md:mt-5 md:grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
>
    {#each searchedPosts.length ? searchedPosts : data.defaultPosts as post, index (post.url)}
        <IdeaCard {post}></IdeaCard>
    {/each}
</div>

<section class="flex flex-col items-center max-w-xl gap-0 text-center md:text-lg">
    <p>
        Find more posts by searching for things you're interested in!<br />Or click the
        AboutIdeasNow logo to filter by a specific post type.
    </p>
</section>

<div
    class="flex flex-col items-center max-w-lg p-4 bg-white border shadow-md rounded-xl border-border"
    style:background-color={colorPalette[1]}
>
    <h1 class="mb-2 text-2xl font-bold font-title">Add your site here!</h1>
    <p class="text-center">
        Help other people find you by adding your website to aboutideasnow.com.
        <a class="font-bold" href="/about#submit">Learn more</a>
    </p>
    <Form {form} isClearBg={false} {isAddingDomain} />
</div>

<script lang="ts">
    import { colorPalette, exampleSearchQueries } from "../common/constants";
    import { searchPosts } from "../common/typesense";
    import IdeaCard from "../components/IdeaCard.svelte";
    import type { PageData } from "./$types";
    import debounce from "lodash/debounce";
    import XIcon from "../components/icons/x.svelte";
    import type { Post, PostType } from "@repo/core/generated/prisma-client";
    import type { ActionData } from "./$types";

    // import { actions } from "../common/form";

    // export let form = actions;
    // let isAddingDomain = false;

    const randomIndex = Math.floor(Math.random() * colorPalette.length);
    // Choose random color from array
    const color = colorPalette[randomIndex];

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

<div class="flex items-center justify-center w-full max-w-4xl gap-2">
    <!-- svelte-ignore a11y-autofocus -->
    <input
        id="search-bar"
        class="px-3 py-2 text-lg text-center border shadow-md outline-none rounded-xl grow md:w-auto bg-light placeholder:text-text/30 border-border"
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
                class="p-1 -ml-12 font-normal rounded-full animate-fadein"
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
<!-- 
<div style:background-color={color}>
    Submit your page

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
                    class="px-3 py-2 font-bold text-white border rounded-lg shadow-lg border-border"
                    style:background-color={colorPalette[0]}
                >
                    Add my site
                </button>
            </form>
        {/if}
    </div> -->
<!-- </div> -->

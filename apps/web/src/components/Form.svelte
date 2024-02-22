<script lang="ts">
    import { enhance } from "$app/forms";
    import { colorPalette } from "../common/constants"; // Adjust the import path as necessary
    import type { ActionData } from "../routes/about/$types";
    export let form: ActionData;
    export let isAddingDomain: boolean;
</script>

<div class="flex flex-col items-center mt-4 text-center">
    {#if form?.addedDomain === false}
        Error indexing your domain :(<br />We will take a look and add your site as soon as
        possible!
    {:else if form?.scrapedPosts}
        {#if form?.scrapedPosts.length === 0}
            We didn't find a /now, /about, or /ideas page on your website. Add one and try again!
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
</div>

<script lang="ts">
    import { enhance } from "$app/forms";
    import { colorPalette } from "../common/constants"; // Adjust the import path as necessary
    import type { ActionData } from "../routes/about/$types";
    import posthog from "posthog-js";

    export let form: ActionData;
    export let isAddingDomain: boolean;
    export let isClearBg: boolean;
</script>

<div class="flex flex-col mt-4 text-left">
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
                        <span class="font-bold">
                            {new URL(post.url).hostname}{new URL(post.url).pathname}
                        </span>
                        {#if post.updatedAt && new Date(post.updatedAt).getFullYear() > 1970}
                            last updated at {new Intl.DateTimeFormat("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric"
                            }).format(new Date(post.updatedAt))}
                        {:else}
                            without update time
                        {/if}
                    </li>
                {/each}
            </ul>
        {/if}
    {:else if isAddingDomain}
        Indexing your domain...
    {:else}
        <form
            class="flex flex-col items-center w-full gap-4 md:w-full"
            method="POST"
            use:enhance={() => {
                // Show loading state until page data is reloaded
                isAddingDomain = true;

                posthog.capture("siteAdded");
            }}
        >
            <div class="flex flex-col w-full gap-4 md:flex-row">
                <input
                    class="w-full px-3 py-2 text-lg bg-white border rounded-lg shadow-lg outline-none placeholder:text-text/30 border-border"
                    placeholder="yourwebsite.com"
                    name="domain"
                    required
                />
                <input
                    class="w-full px-3 py-2 text-lg bg-white border rounded-lg shadow-lg outline-none placeholder:text-text/30 border-border"
                    placeholder="your@email.com"
                    name="email"
                />
            </div>
            <button
                class="w-full px-3 py-2 font-bold text-white border rounded-lg shadow-lg border-border"
                style:background-color={isClearBg ? colorPalette[0] : colorPalette[0]}
            >
                Add my site
            </button>
        </form>
    {/if}
</div>

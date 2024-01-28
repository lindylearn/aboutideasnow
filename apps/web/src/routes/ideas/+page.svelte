<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types";

    export let form: ActionData;

    let isAddingDomain = false;
    let colorPalette = ["#ffb3ba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff"];
</script>

<main class="flex flex-col items-center gap-3 md:gap-7">
    <header class="flex flex-col items-center justify-center h-auto">
        <h1 class="text-4xl font-bold leading-relaxed text-center md:text-5xl font-title">
            <span style="background-color: {colorPalette[2]}" class="px-2 rounded-md">about</span>
            <span style="background-color: {colorPalette[3]}" class="px-2 rounded-md">ideas</span>
            <span style="background-color: {colorPalette[4]}" class="px-2 rounded-md">now</span>
        </h1>
    </header>

    <main class="flex flex-col max-w-xl text-center text-lg items-center gap-3">
        <p>...</p>
    </main>

    <div class="text-center">
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
                class="flex flex-col justify-center w-full gap-2 mb-4 md:gap-4 md:flex-row"
                method="POST"
                use:enhance={() => {
                    // Show loading state until page data is reloaded
                    isAddingDomain = true;
                }}
            >
                <input
                    class="w-full px-3 py-2 text-lg text-center rounded-md shadow-sm md:w-auto md:text-left"
                    placeholder="mywebsite.com"
                    name="domain"
                    required
                />
                <button class="w-full h-auto px-3 py-2 text-white rounded-md md:w-auto bg-text">
                    Add my website
                </button>
            </form>
        {/if}
    </div>

    <footer>
        <p>
            Made with 💡 by
            <a class="font-bold" href="https://lindylearn.io" target="_blank">Peter Hagen</a>
            and
            <a class="font-bold" href="https://louis.work" target="_blank">Louis Barclay</a>.
            Contribute on
            <a
                class="font-bold"
                href="https://github.com/lindylearn/ideasideasideas"
                target="_blank"
            >
                GitHub
            </a>
            to add your name here!
        </p>
    </footer>
</main>

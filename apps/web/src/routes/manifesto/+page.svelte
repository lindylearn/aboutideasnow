<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types";

    export let form: ActionData;

    let isAddingDomain = false;
</script>

<main class="flex flex-col items-center gap-3 md:gap-7">
    <p class="mb-4 text-lg">Thousands of personal sites. One directory.</p>
    <main class="flex flex-col max-w-xl gap-3 text-lg text-left items-left">
        <h1 class="mt-8">
            What is <span class="px-2 py-1 bg-green-200 rounded-md">about</span>
            <span class="px-2 py-1 bg-yellow-200 rounded-md">ideas</span>
            <span class="px-2 py-1 bg-red-200 rounded-md">now</span>?
        </h1>
        Thousands of personal sites exist on the internet, created by creators, thinkers, and doers of
        all sorts. These sites are used by people to tell the world:

        <ul>
            <li>
                <span class="px-2 py-1 font-bold bg-green-200 rounded-md">about</span> themselves
            </li>
            <li>
                Their <span class="px-2 py-1 font-bold bg-yellow-200 rounded-md">ideas</span>
            </li>
            <li>
                What they're up to <span class="px-2 py-1 font-bold bg-red-200 rounded-md">now</span
                >
            </li>
        </ul>

        <p>
            But because these sites are scattered all over the web, it’s hard to know where to find
            them.
        </p>
        <p>
            We created <a
                href="https://www.aboutideasnow.com"
                target="_blank"
                class="font-bold hover:underline"
                ><span class="px-1 py-1 bg-green-200 rounded-md">about</span><span
                    class="px-1 py-1 bg-yellow-200 rounded-md">ideas</span
                ><span class="px-1 py-1 bg-red-200 rounded-md">now</span>.com</a
            >
            as a directory bringing these personal sites into a searchable, up-to-date space, so that
            you can:
        </p>
        <ul>
            <li>Find people working on interesting things</li>
            <li>Help other people find you</li>
        </ul>
        <h1 class="mt-8">How do I use it?</h1>
        <p>To find people working on interesting things:</p>
        <ol>
            <li>
                Search for a topic on <a
                    href="https://www.aboutideasnow.com"
                    target="_blank"
                    class="font-bold hover:underline"
                    ><span class="px-1 py-1 bg-green-200 rounded-md">about</span><span
                        class="px-1 py-1 bg-yellow-200 rounded-md">ideas</span
                    ><span class="px-1 py-1 bg-red-200 rounded-md">now</span>.com</a
                >
            </li>
            <li>Go to a person's site to read more</li>
            <li>Email them and chat!</li>
        </ol>
        <p>To help other people find you:</p>
        <ol>
            <li>Add at least one of these pages to your website:</li>
            <ul>
                <li>
                    <span class="px-2 py-1 bg-green-200 rounded-md">/about</span> to describe yourself
                </li>
                <li>
                    <span class="px-2 py-1 bg-yellow-200 rounded-md">/ideas</span> with what you want
                    to do
                </li>
                <li>
                    <span class="px-2 py-1 bg-red-200 rounded-md">/now</span> with what you're up to
                    right now
                </li>
            </ul>
            <li>Submit your site here:</li>
            <div class="text-center">
                {#if form?.addedDomain === false}
                    Error indexing your domain :(<br />We will take a look and add your site as soon
                    as possible!
                {:else if form?.scrapedPosts}
                    {#if form?.scrapedPosts.length === 0}
                        We didn't find a /now, /about, or /ideas page on your website. Add one and
                        try again!
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
                        class="flex flex-col justify-center w-full gap-2 mt-8 md:gap-4 md:flex-row"
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
                        <button
                            class="w-full h-auto px-3 py-2 text-white rounded-md md:w-auto bg-text"
                        >
                            Add my website
                        </button>
                    </form>
                {/if}
            </div>
        </ol>
        <h1 class="mt-8">About us</h1>
        <p>
            <a
                href="https://www.aboutideasnow.com"
                target="_blank"
                class="font-bold hover:underline"
                ><span class="px-1 py-1 bg-green-200 rounded-md">about</span><span
                    class="px-1 py-1 bg-yellow-200 rounded-md">ideas</span
                ><span class="px-1 py-1 bg-red-200 rounded-md">now</span>.com</a
            > is a decentralized solution on the increasingly centralized web. We’re just here to display
            the content that you host on your personal site.
        </p>
        <p>This is an unofficial continuation of Derek Sivers’ Now page project, which we love.</p>
        <p>
            This project is completely open source under an MIT licence —
            <a href="https://github.com/lindylearn/ideasideasideas" target="_blank"
                >come help us out on GitHub</a
            >!
        </p>
    </main>
</main>

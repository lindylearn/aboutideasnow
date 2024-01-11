<script lang="ts">
    import IdeaCard from "../components/IdeaCard.svelte";
    import type { PageData } from "./$types";
    export let data: PageData;
</script>

<main class="flex flex-col items-center gap-3 md:gap-5">
    <div class="flex flex-col justify-center h-auto mb-4 align-center md:flex-row">
        <h1 class="mr-2 text-4xl font-title">
            <span class="text-blue-600">ideas</span><span class="text-pink-500">ideas</span><span
                class="text-emerald-500">ideas</span
            >
        </h1>
    </div>
    <div class="text-center">
        <p class="mb-4 text-lg font-bold">1000s of ideas. 1000s of people to team up with.</p>
        <p class="mb-4">
            Here are the /ideas and /now pages of 1000s of personal sites. Want to join in? Add your
            site below, and update your <span class="rounded-md border-1 border-slate-200"
                >/ideas</span
            >
            and <span>now</span> pages. We'll handle the rest!
        </p>
        <div>
            <input class="px-2 py-3 mr-2 text-lg rounded-md" placeholder="my.personal.site" />
            <button
                class="h-auto px-3 py-2 text-base text-white bg-blue-400 rounded-md hover:bg-blue-600"
                >+ add your site</button
            >
        </div>
    </div>
    <div
        class="flex flex-col items-center justify-around w-full max-w-5xl gap-4 md:grid md:grid-cols-2"
    >
        {#each data.posts as post}
            <IdeaCard {post}></IdeaCard>
        {/each}
    </div>
</main>

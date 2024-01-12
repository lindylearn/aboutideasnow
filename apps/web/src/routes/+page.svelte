<script lang="ts">
    import IdeaCard from "../components/IdeaCard.svelte";
    import type { PageData } from "./$types";
    export let data: PageData;
</script>

<main class="flex flex-col items-center gap-3 md:gap-10">
    <header class="flex flex-col justify-center items-center h-auto align-center">
        <h1 class="mr-2 text-5xl font-title">
            <span class="text-blue-600">ideas</span> <span class="text-pink-500">ideas</span>
            <span class="text-emerald-500">ideas</span>
        </h1>
        <h2 class="text-lg font-bold">1000s of ideas, 1000s of people to talk to</h2>
    </header>
    <main class="text-center max-w-2xl flex flex-col gap-4">
        <p>
            The internet can feel lonely if you're doing your own thing and are not really posting
            on social media. But 1000s of people are thinking and writing about the same things as
            you.
        </p>
        <p>
            The solution: Add a /now page to your website describing what you're doing now, and
            /ideas with what you want to do. Then check this website to find people like you.
        </p>
    </main>
    <div class="flex gap-2 justify-center">
        <input class="px-3 py-2 text-lg rounded-md" placeholder="mywebsite.com" />
        <button
            class="h-auto px-3 py-2 text-lg text-white bg-blue-400 rounded-md hover:bg-blue-600"
        >
            find people like me
        </button>
    </div>
    <div
        class="flex flex-col items-center justify-around w-full gap-4 md:grid md:grid-cols-2 lg:grid-cols-3"
    >
        {#each data.posts.slice(0, 100) as post}
            <IdeaCard {post}></IdeaCard>
        {/each}
    </div>
    <footer>
        <p>
            Made by <a class="font-bold" href="https://louis.work" target="_blank">Louis Barclay</a>
            and
            <a class="font-bold" href="https://lindylearn.io" target="_blank">Peter Hagen</a>.
            Contribute
            <a
                class="font-bold"
                href="https://github.com/lindylearn/ideasideasideas"
                target="_blank">on GitHub</a
            > to add your name here!
        </p>
    </footer>
</main>

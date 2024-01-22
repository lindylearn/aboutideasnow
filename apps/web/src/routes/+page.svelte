<script lang="ts">
    import IdeaCard from "../components/IdeaCard.svelte";
    import type { PageData } from "./$types";
    export let data: PageData;
    let colorPalette = ["#ffb3ba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff"];
</script>

<main class="flex flex-col items-center gap-3 md:gap-7">
    <header class="flex flex-col items-center justify-center h-auto">
        <h1 class="mb-4 mr-2 text-4xl font-bold leading-relaxed text-center md:text-5xl font-title">
            <span style="background-color: {colorPalette[2]}" class="px-2 rounded-md">ideas</span>
            <span style="background-color: {colorPalette[3]}" class="px-2 rounded-md">ideas</span>
            <span style="background-color: {colorPalette[4]}" class="px-2 rounded-md">ideas</span>
        </h1>
        <h2 class="font-bold text-center md:text-lg">1000s of ideas, 1000s of people to talk to</h2>
    </header>
    <main class="flex flex-col max-w-xl mt-8 text-center">
        <!-- <div class="h-32 mx-auto">
            <img class="h-full" src="/telephone.png" />
        </div> -->

        <!-- <p>
            The internet can feel lonely if you're doing your own thing and are not really posting
            on social media. But 1000s of people are thinking and writing about the same things as
            you.
        </p> -->
        <p>
            Add a <span class="px-2 py-1 text-sm rounded-md bg-slate-300">/now</span> page to your
            website with what you're doing now, and
            <span class="px-2 py-1 text-sm bg-blue-300 rounded-md">/ideas</span> with what you want to
            do. Then use this website to find people like you.
        </p>
    </main>
    <div class="flex flex-col justify-center w-full gap-2 mb-4 md:gap-4 md:flex-row">
        <input
            class="w-full px-3 py-2 text-lg text-center rounded-md shadow-sm md:w-auto md:text-left"
            placeholder="mywebsite.com"
        />
        <button class="w-full h-auto px-3 py-2 text-white rounded-md md:w-auto bg-text">
            Find people like me
        </button>
    </div>
    <div
        class="flex flex-col items-center justify-around w-full gap-8 md:grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
    >
        {#each data.posts.slice(0, 100) as post, index}
            <IdeaCard {post} color={colorPalette[index % colorPalette.length]}></IdeaCard>
        {/each}
    </div>
    <footer>
        <p>
            Made with 💡 by <a class="font-bold" href="https://lindylearn.io" target="_blank"
                >Peter Hagen</a
            >
            and
            <a class="font-bold" href="https://louis.work" target="_blank">Louis Barclay</a>.
            Contribute on
            <a
                class="font-bold"
                href="https://github.com/lindylearn/ideasideasideas"
                target="_blank">GitHub</a
            > to add your name here!
        </p>
    </footer>
</main>

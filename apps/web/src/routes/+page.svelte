<script lang="ts">
    import IdeaCard from "../components/IdeaCard.svelte";
    // import type { PageData } from "./$types";
    // export let data: PageData
</script>

<main class="flex flex-col items-center gap-3 md:gap-5">
    <div class="flex flex-col justify-center h-auto mb-4 align-center md:flex-row">
        <h1 class="mb-4 mr-2 text-4xl bg-red-300 font-title">
            <span class="text-blue-600 ">ideas</span><span class="text-pink-500">ideas</span><span class="text-emerald-500">ideas</span>
        </h1>
        <button class="h-auto px-3 py-2 text-base text-white bg-blue-600 rounded-md">+ add your own</button>
    </div>
    <!-- {JSON.stringify(data.posts)} -->
    
    <div class="flex flex-col items-center justify-around w-full max-w-5xl gap-4 md:grid md:grid-cols-2">
        <IdeaCard color="blue"></IdeaCard>
        <IdeaCard color="blue"></IdeaCard>
        <IdeaCard color="blue"></IdeaCard>
        <IdeaCard color="blue"></IdeaCard>
        <IdeaCard color="blue"></IdeaCard>
        <IdeaCard color="blue"></IdeaCard>
        <IdeaCard color="blue"></IdeaCard>
    </div>
</main>

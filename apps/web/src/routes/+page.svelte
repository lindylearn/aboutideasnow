<script lang="ts">
    import IdeaCard from "../components/IdeaCard.svelte";
</script>

<main class="flex flex-col items-center gap-3 bg-red-300 md:gap-5">
    <div class="flex flex-col mb-4 align-baseline md:flex-row">
        <h1 class="mb-4 mr-2 text-4xl font-title">
            <span class="text-blue-600 ">ideas</span><span class="text-pink-500">ideas</span><span class="text-emerald-500">ideas</span>
        </h1>
        <button class="px-2 py-3 text-base text-white bg-blue-500 rounded-md">+ add your own</button>
    </div>
    
    <div class="flex flex-col items-center justify-around w-full max-w-5xl gap-2 bg-blue-300 md:space-y-0 md:flex-row md:flex-wrap">
        <IdeaCard color="blue"></IdeaCard>
        <IdeaCard color="blue"></IdeaCard>
        <IdeaCard color="blue"></IdeaCard>
        <IdeaCard color="blue"></IdeaCard>
        <IdeaCard color="blue"></IdeaCard>
        <IdeaCard color="blue"></IdeaCard>
        <IdeaCard color="blue"></IdeaCard>
    </div>
</main>

<script lang="ts">
    import clsx from "clsx";
    import { colorPalette } from "../common/constants";
    import type { PostType } from "@repo/core/generated/prisma-client";

    export let onClick: () => void = () => {};
    export let activeTag: PostType | undefined = undefined;
</script>

<button
    class="flex text-3xl font-bold leading-relaxed text-center transition-all shadow md:text-6xl font-title rounded-2xl hover:shadow-md"
    on:click={onClick}
>
    {#each ["ABOUT", "IDEAS", "NOW"] as word, i}
        <div
            class={clsx(
                "bg-light h-full py-1 md:py-3 px-3 md:px-4 border border-border",
                i === 0 && "rounded-l-2xl",
                i === 2 && "rounded-r-2xl",
                activeTag && word !== activeTag && "opacity-25"
            )}
            style:background-color={colorPalette[i]}
        >
            {word.toLowerCase()}
        </div>
    {/each}
</button>

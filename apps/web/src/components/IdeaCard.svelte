<script lang="ts">
    import type { Post } from "@repo/core/generated/prisma-client";
    import posthog from "posthog-js";
    import { colorPalette } from "../common/constants";
    import { getUTCDate } from "../common/util";

    export let post: Post;

    const typeColors = {
        IDEAS: colorPalette[1],
        ABOUT: colorPalette[0],
        NOW: colorPalette[2]
    };

    const color = typeColors[post.type];
    // const color = colorPalette[listIndex % colorPalette.length];
    const date = post.updatedAt ? new Date(post.updatedAt) : undefined;
</script>

<a
    href={post.url}
    class="relative flex flex-col w-full overflow-hidden transition-all border shadow-sm post h-max rounded-xl border-border bg-light animate-cardFadein will-change-transform hover:shadow md:hover:rotate-1 md:hover:opacity-75"
    target="_blank"
    style:animation-delay={`${Math.random() * 200}ms`}
    on:click={() => {
        posthog.capture("postClicked");
    }}
>
    <div class="flex gap-2 p-2" style:background-color={color}>
        <div class="flex flex-1 gap-2 px-2 rounded-lg bg-light">
            <img
                alt={post.domain}
                class="w-5 h-5 my-2"
                src="https://www.google.com/s2/favicons?sz=256&domain_url={post.domain}"
            />
            <div class="flex flex-row items-center gap-2 overflow-hidden grow shrink">
                <h3 class="overflow-hidden text-xl font-bold font-title shrink text-ellipsis">
                    {post.domain}
                </h3>
                <div
                    class="w-auto px-2 py-1 font-mono text-sm rounded-lg"
                    style:background-color={color}
                >
                    /{post.type.toLowerCase()}
                </div>
            </div>
        </div>
    </div>
    <div class="p-4">
        <div
            class="text-sm whitespace-pre-wrap overflow-hidden line-clamp-[10] font-mono font-normal"
        >
            {#if date && date.getFullYear() > 1970}
                Updated {getUTCDate(date)}
                <!-- Use HTML to easily style search highlights -->
                <br /><br />{/if}{@html post.content}
            <!-- <div
                id="bottom-fade"
                class="absolute left-0 -bottom-2 w-full h-8 pointer-events-none bg-gradient-to-t from-red-200 via-white via-50%"
            /> -->
        </div>
    </div>
</a>

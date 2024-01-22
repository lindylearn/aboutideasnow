<script lang="ts">
    import type { Post } from "@repo/core/generated/prisma-client";
    export let post: Post;
    export let color: string;
</script>

<a
    href={post.url}
    class="flex flex-col w-full h-full font-mono transition-all rounded-md shadow-sm"
    style="background-color: {color}"
    target="_blank"
>
    <div class="flex p-2">
        <div class="flex flex-1 rounded-md bg-light">
            <img
                alt={post.domain}
                class="w-5 h-5 m-2"
                src="https://www.google.com/s2/favicons?sz=256&domain_url={post.domain}"
            />
            <div class="flex flex-row items-center justify-center gap-2">
                <h2 class="mr-0 font-sans font-bold text-slate-700">
                    {post.domain}
                </h2>
                <div class="flex">
                    {#if post.type === "NOW"}
                        <div class="w-auto px-2 py-1 text-sm rounded-md bg-slate-300">/now</div>
                    {/if}
                </div>
            </div>
        </div>
        <div class="flex items-center ml-2">
            <div class="w-3 h-3 ml-1 mr-2 bg-red-400 rounded-full"></div>
            <div class="w-3 h-3 mr-2 bg-yellow-400 rounded-full"></div>
            <div class="w-3 h-3 bg-green-400 rounded-full"></div>
        </div>
    </div>
    <div class="bg-light text-sm px-4 pt-4 whitespace-pre-wrap line-clamp-[10]">
        <div class="relative">
            {post.content}
            <div
                class="absolute bottom-0 w-full h-16 pointer-events-none bg-gradient-to-t from-white via-white via-30%"
            ></div>
        </div>
    </div>

    {#if post.updatedAt && post.updatedAt.getFullYear() !== 1970}
        <div class="p-2">
            <div class="text-xs font-bold uppercase text-slate-500">Last updated:</div>
            <div class="font-sans font-bold text-slate-700">
                {new Intl.DateTimeFormat("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                }).format(post.updatedAt)}
            </div>
        </div>
    {/if}
</a>

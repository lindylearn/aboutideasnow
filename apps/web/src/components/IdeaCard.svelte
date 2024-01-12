<script lang="ts">
    import type { Post } from "@repo/core/generated/prisma-client";
    export let post: Post;
</script>

<a
    href={post.url}
    class="flex flex-col w-full h-full p-4 bg-light transition-all font-mono"
    target="_blank"
>
    <div class="flex mb-4 align-center">
        <img
            alt={post.domain}
            class="w-10 h-10 mr-2"
            src="https://www.google.com/s2/favicons?sz=256&domain_url={post.domain}"
        />
        <div class="flex flex-row justify-center items-center gap-2">
            <h2 class="font-title font-bold">
                {post.domain}
            </h2>
            <div class="flex">
                {#if post.type === "NOW"}
                    <div class="w-auto px-2 py-1 text-sm text-white bg-gray-300 rounded-md">
                        /now
                    </div>
                {/if}
            </div>
        </div>
    </div>
    <div class="mb-2 whitespace-pre-wrap line-clamp-[10]">{post.content}</div>
    {#if post.updatedAt && post.updatedAt.getFullYear() !== 1970}
        <div class="font-bold">
            {new Intl.DateTimeFormat("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric"
            }).format(post.updatedAt)}
        </div>
    {/if}
</a>

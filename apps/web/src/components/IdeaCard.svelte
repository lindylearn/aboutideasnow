<script lang="ts">
    import type { Post } from "@repo/core/generated/prisma-client";
    export let post: Post;
</script>

<a href={post.url} class="flex flex-col w-full h-full p-4 bg-white rounded-md" target="_blank">
    <div class="flex mb-4 align-center">
        <img
            alt={post.domain}
            class="w-10 h-10 mr-2"
            src="https://www.google.com/s2/favicons?sz=256&domain_url={post.domain}"
        />
        <div class="flex flex-col justify-center">
            <h2 class="font-bold">{post.domain}</h2>
        </div>
    </div>
    <div class="mb-2">{post.content.substring(0, 300)}</div>
    <div class="flex">
        {#if post.type === "NOW"}
            <div class="w-auto px-2 py-1 text-sm text-white bg-gray-300 rounded-md">/now</div>
        {/if}
    </div>
</a>

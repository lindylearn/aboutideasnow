<script>
    import clsx from "clsx";
    import { colorPalette } from "../common/constants";
    import "../app.css";
    import { page } from "$app/stores";
    let href = "/";
    // Update href based on current page
    $: {
        const currentPath = $page.url.pathname;
        href = currentPath === "/" ? "/about" : "/";
    }
</script>

<div
    class="flex flex-col items-center min-h-screen gap-5 p-5 mb-5 md:gap-10 bg-background font-text text-text animate-fadein"
>
    <h1>
        <a
            class="flex text-2xl font-bold leading-relaxed text-center transition-all shadow md:text-5xl font-title rounded-2xl hover:shadow-lg"
            {href}
        >
            {#each ["about", "ideas", "now"] as word, i}
                <div
                    class={clsx(
                        "bg-light h-full py-1 md:py-3  px-2 md:px-4 border border-border",
                        i === 0 && "rounded-l-2xl",
                        i === 2 && "rounded-r-2xl"
                    )}
                    style:background-color={colorPalette[i]}
                >
                    {word}
                </div>
            {/each}
        </a>
    </h1>

    <slot />

    <!-- Putting this on the manifest page may be enough? -->
    <!-- <footer class="flex flex-col items-center mt-10">
        <p>
            Made by
            <a class="font-bold" href="https://lindylearn.io" target="_blank">Peter Hagen</a>
            and
            <a class="font-bold" href="https://louis.work" target="_blank">Louis Barclay</a>. Add
            your site <a class="font-bold" href="/about">here</a>.
        </p>
        <p>
            Contribute on
            <a
                class="font-bold"
                href="https://github.com/lindylearn/ideasideasideas"
                target="_blank"
            >
                GitHub
            </a>
            to add your name here!
        </p>
    </footer> -->
</div>

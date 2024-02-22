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

<!-- Very ugly piece of code here for GitHub corner, but it's quick and dirty -->
<a
    href="https://github.com/lindylearn/ideasideasideas"
    class="github-corner"
    aria-label="View source on GitHub"
    ><svg
        width="80"
        height="80"
        viewBox="0 0 250 250"
        style="fill:{colorPalette[1]}; color:#fff; position: absolute; top: 0; border: 0; right: 0;"
        aria-hidden="true"
        ><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path
            d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
            fill="currentColor"
            style="transform-origin: 130px 106px;"
            class="octo-arm"
        ></path><path
            d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
            fill="currentColor"
            class="octo-body"
        ></path></svg
    ></a
>

<div
    class="flex flex-col items-center min-h-screen gap-5 p-5 md:gap-10 bg-background font-text text-text animate-fadein"
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

    {#if href !== "/"}
        <footer class="flex flex-col items-center text-center">
            <p class="mb-0">
                Made with 💡 by <a class="font-bold" href="https://lindylearn.io" target="_blank"
                    >Peter Hagen</a
                >
                and
                <a class="font-bold" href="https://louis.work" target="_blank">Louis Barclay</a>.
            </p>
            <p class="mb-0">
                We're open source &#8212;
                <a
                    class="font-bold"
                    href="https://github.com/lindylearn/ideasideasideas"
                    target="_blank"
                >
                    contribute on GitHub
                </a>
                to add your name here!
            </p>
        </footer>
    {/if}
</div>

<style>
    .github-corner:hover .octo-arm {
        animation: octocat-wave 560ms ease-in-out;
    }
    @keyframes octocat-wave {
        0%,
        100% {
            transform: rotate(0);
        }
        20%,
        60% {
            transform: rotate(-25deg);
        }
        40%,
        80% {
            transform: rotate(10deg);
        }
    }
    @media (max-width: 500px) {
        .github-corner:hover .octo-arm {
            animation: none;
        }
        .github-corner .octo-arm {
            animation: octocat-wave 560ms ease-in-out;
        }
    }
</style>

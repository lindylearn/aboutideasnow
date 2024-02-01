<script>
    import clsx from "clsx";
    import { colorPalette } from "../common/constants";

    import "../app.css";
</script>

<div
    class="flex flex-col gap-5 md:gap-10 items-center min-h-screen p-5 bg-background font-text text-text"
>
    <h1>
        <a
            class="text-4xl font-bold leading-relaxed text-center md:text-5xl font-title flex shadow rounded-2xl"
            href="/"
        >
            {#each ["about", "ideas", "now"] as word, i}
                <div
                    class={clsx(
                        "bg-light h-full py-3 px-4 border border-border",
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
            your site <a class="font-bold" href="/manifesto">here</a>.
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

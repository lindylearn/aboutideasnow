<script>
    import "../app.css";

    let colorPalette = ["#ffb3ba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff"];
</script>

<div
    class="p-5 overflow-hidden sm:pt-10 bg-slate-100 font-text text-text min-h-screen flex flex-col items-center"
>
    <header class="flex flex-col items-center justify-center h-auto mb-5">
        <h1 class="text-4xl font-bold leading-relaxed text-center md:text-5xl font-title">
            <span style="background-color: {colorPalette[2]}" class="px-2 rounded-md">about</span>
            <span style="background-color: {colorPalette[3]}" class="px-2 rounded-md">ideas</span>
            <span style="background-color: {colorPalette[4]}" class="px-2 rounded-md">now</span>
        </h1>
    </header>

    <div class="grow">
        <slot />
    </div>

    <footer>
        <p>
            Made with 💡 by
            <a class="font-bold" href="https://lindylearn.io" target="_blank">Peter Hagen</a>
            and
            <a class="font-bold" href="https://louis.work" target="_blank">Louis Barclay</a>.
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
    </footer>
</div>

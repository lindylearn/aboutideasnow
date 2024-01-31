<script>
    import "../app.css";

    let colorPalette = ["#ffb3ba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff"];
</script>

<div class="flex flex-col items-center min-h-screen p-5 sm:pt-10 bg-slate-100 font-text text-text">
    <a class="flex flex-col items-center justify-center h-auto mb-5" href="/">
        <h1 class="text-4xl font-bold leading-relaxed text-center md:text-5xl font-title">
            <span class="px-2 text-white bg-green-500 rounded-md shadow-sm">about</span>
            <span class="px-2 text-white bg-yellow-500 rounded-md shadow-sm">ideas</span>
            <span class="px-2 text-white bg-red-500 rounded-md">now</span>
        </h1>
    </a>

    <div class="w-full grow">
        <slot />
    </div>

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

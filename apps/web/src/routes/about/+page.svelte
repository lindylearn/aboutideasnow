<script lang="ts">
    import type { ActionData } from "./$types";
    import Form from "../../components/Form.svelte";
    let isAddingDomain = false;
    export let form: ActionData;
</script>

<main class="flex flex-col w-full max-w-xl gap-5 text-lg md:gap-10 items-left">
    <section id="intro">
        <p>
            1000s of personal websites exist on the internet, created by creators, thinkers, and
            doers of all sorts.
        </p>
        <p>
            <span class="font-bold">aboutideasnow.com</span> exists to bring these sites together in
            one place &#8212; to help you find your people, and help them find you.
        </p>

        <p>
            We index the /about, /ideas, and /now pages of these sites, and give you a handy way to
            search through them.
        </p>
    </section>

    <section id="manifesto">
        <h2>The manifesto</h2>
        <p>
            <span class="font-bold">/about</span> pages are about the past: how you see yourself and
            what brought you here.
        </p>
        <p>
            <span class="font-bold">/now</span> is a more personal look at what you're doing now and
            what you care about.
        </p>
        <p>
            But there's something missing in both &#8212; the future. By writing your ideas of what
            you want to do next, people with similar ideas can find you and reach out.
        </p>
        <p>
            So <span class="font-bold">/ideas</span> is a space to write about the crazy things you always
            wanted to make, concepts you're mulling over, or projects you're looking to find collaborators
            for.
        </p>
    </section>

    <section id="submit">
        <h2>Help other people find you</h2>
        <p>
            You can add your website to the <span class="font-bold"> aboutideasnow.com </span> search
            index if it's not included already. For this you need to create an /about, /ideas, or /now
            page - or all three.
        </p>
        <p>The more you write, the more likely people can find you. Then, submit your site here:</p>
        <Form {form} isClearBg={true} {isAddingDomain} />
    </section>

    <section id="authors" class="mt-4">
        <h2>Who built this?</h2>
        <p>
            <span class="font-bold"> aboutideasnow.com </span> is a decentralized solution on the increasingly
            centralized web. We exist to direct you to people's personal websites &#8212; you take it
            from there.
        </p>
        <p>
            <a class="font-bold" href="https://lindylearn.io" target="_blank">Peter Hagen</a>
            and
            <a class="font-bold" href="https://louis.work" target="_blank">Louis Barclay</a> built this
            website in February 2024.
        </p>
        <p>
            <a class="font-bold" href="https://agentcooper.io/about" target="_blank">Artem Tyurin</a
            > came up with the notion of /ideas pages.
        </p>
        <p>
            <a href="https://sive.rs" target="_blank"> Derek Sivers </a>started the /now page
            movement without which this all wouldn't be possible.
        </p>
        <p>
            Contribute
            <a href="https://github.com/lindylearn/aboutideasnow" target="_blank"> on GitHub</a> to add
            your name here!
        </p>
    </section>
</main>

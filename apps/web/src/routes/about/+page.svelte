<script lang="ts">
    import type { ActionData } from "./$types";
    import Form from "../../components/Form.svelte";
    import Header from "../../components/Header.svelte";

    export let form: ActionData;

    let isAddingDomain = false;
</script>

<Header
    onClick={() => {
        window.location.href = "/";
    }}
/>

<main class="flex flex-col w-full max-w-xl gap-5 mb-10 text-lg md:gap-10 items-left">
    <section id="intro">
        <p>
            <span class="font-bold">aboutideasnow.com</span> exists to help you find your people.
        </p>
        <p>
            1000s of personal websites exist on the internet, outside of social media &#8212;
            created by creators, thinkers, and doers of all sorts.
        </p>
        <p>
            We index the /about, /ideas, and /now pages of these independent sites to give you a
            handy way of searching through them.
        </p>
    </section>

    <section id="manifesto">
        <h2>What's /ideas?</h2>
        <p>
            The way we see it, the /about, /ideas, and /now pages on websites each have a different
            purpose. And all three should be there.
        </p>
        <ul class="w-full">
            <li>
                <span class="font-bold">/about</span> pages are about the past: how people see themselves
                and what brought them there. That's useful as a general overview.
            </li>
            <li>
                <span class="font-bold">/now</span> is a more personal look at what people are doing
                right now, what they care about, and what they could use help with.
            </li>
            <li>
                <span class="font-bold">/ideas</span> should be about the future: the crazy things people
                always wanted to make, concepts they're mulling over, or planned projects.
            </li>
        </ul>
        <p>
            If you create an <span class="font-bold">/ideas</span> page on your website, people who are
            looking for collaborators are much more likely to find you.
        </p>
    </section>

    <section id="submit">
        <h2>Add your website</h2>
        <p>
            Create any of the above pages on your website. Mention when you last updated each page
            so people know it's fresh.
        </p>
        <p>
            Then submit your website here to add it to
            <span class="font-bold">aboutideasnow.com</span>.
        </p>
        <p>
            If you enter your email address, we'll let you know if someone mentions similar ideas to
            you on their website.
        </p>
        <Form {form} isClearBg={true} {isAddingDomain} />
    </section>

    <section id="authors" class="mt-4">
        <h2>Who built this?</h2>
        <p>
            aboutideasnow.com is a decentralized solution on the increasingly centralized web. We
            exist only to direct you to people's personal websites. You take it from there.
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

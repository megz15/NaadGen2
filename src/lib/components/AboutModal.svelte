<script lang="ts">
    import type { CompositionState } from "$lib/state/compositionState.svelte";

    let { state }: { state: CompositionState } = $props();
</script>

<div
    class={`leading-[1.8] h-fit max-h-3/4 fixed top-0 left-0 z-50 p-5 m-2 rounded-lg bg-[#1d2230b9] backdrop-blur shadow shadow-black border-2 border-gray-400 text-white sm:w-1/2 lg:w-1/3 overflow-auto [&>p:not(:last-child)]:mb-8 transition-opacity duration-1000 ease-in-out ${
        state.aboutModal ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
>
    <div class="flex justify-between items-center mb-4">
        <div class="text-2xl font-bold">🚧 NaadGen v2 🚧</div>
        <button class="text-2xl" onclick={() => (state.aboutModal = false)}
            >❌</button
        >
    </div>

    <p>
        Welcome to NaadGen! This tool is designed to help users create and
        explore music compositions, better tailored for Indian classical ones.
        I'm excited to share this as it is (finally) good enough to warrant
        being labelled completed! As a solo dev in my <del>2nd</del>
        <del>3rd</del>
        4th year
        <del
            >who also recently got reality-checked by the release of midsemester
            gradings</del
        > (third year wasn't bad after all, strictly speaking academically!), I'm
        working to deliver a polished experience, so please bear with me 🐻
    </p>
    <p>
        I hope you enjoy using NaadGen as much as I did making it! If you find
        bugs or have suggestions, please open a GitHub issue by <a
            href="https://github.com/megz15/NaadGen2/issues"
            class="text-blue-900 font-semibold bg-blue-100 py-0.5 px-2 rounded"
            target="_blank"><nobr>clicking here</nobr></a
        >
    </p>
    <p>
        You may also be interested in some of my other projects in this domain: <a
            href="https://play.google.com/store/apps/details?id=megh.dailyraga"
            class="text-blue-900 font-semibold bg-blue-100 py-0.5 px-2 rounded"
            target="_blank">DailyRaga</a
        >
        and
        <a
            href="https://swaranjali.vercel.app/"
            class="text-blue-900 font-semibold bg-blue-100 py-0.5 px-2 rounded"
            target="_blank"><nobr>Swaranjali Web</nobr></a
        >.
        <a
            href="https://megz15.github.io/classical-music-workshop/"
            class="text-blue-900 font-semibold bg-blue-100 py-0.5 px-2 rounded"
            target="_blank"><nobr>Click here</nobr></a
        > to access slides from an introductory workshop I had conducted on Indian
        classical music.
    </p>
    <p>~ Meghraj</p>
</div>

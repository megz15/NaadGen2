<script lang="ts">
    import type { CompositionState } from "$lib/state/compositionState.svelte";

    let { state }: { state: CompositionState } = $props();
</script>

<div
    class={`leading-[1.8] h-fit max-h-3/4 fixed top-1/2 -translate-y-1/2 z-50 p-5 m-2 rounded-lg bg-[#1d2230b9] backdrop-blur shadow shadow-black border-2 border-gray-400 text-white w-1/2 max-md:w-[90%] overflow-auto [&>p:not(:last-child)]:mb-8 transition-opacity duration-1000 ease-in-out ${
        state.aboutModal ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
>
    <div class="flex justify-between items-center mb-4">
        <div class="text-2xl font-bold">✨ <u>NaadGen v2</u> ✨</div>
        <button
            class="text-2xl cursor-pointer"
            onclick={() => (state.aboutModal = false)}>❌</button
        >
    </div>

    <p>
        Welcome to NaadGen! This tool is designed to help users create and
        explore music compositions, with a focus on Indian classical music. I'm
        excited to state that this is now polished enough to be called complete!
        As a solo dev in my <del>2nd</del> <del>3rd</del> <del>4th</del> final year
        of college, I've put a lot of care into this project, so please bear with
        me 🐻.
    </p>
    <p>
        I hope you enjoy using NaadGen as much as I enjoyed making it! If you
        find bugs or have suggestions, please open a GitHub issue by <a
            href="https://github.com/megz15/NaadGen2/issues"
            class="text-blue-900 font-semibold bg-blue-100 py-0.5 px-2 rounded"
            target="_blank"><nobr>clicking here</nobr></a
        >.
    </p>
    <p>
        You might also be interested in a few of my other projects in this
        space, like <a
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
        > to access slides from an introductory workshop I conducted on Indian classical
        music.
    </p>
    <p>~ Meghraj</p>
</div>

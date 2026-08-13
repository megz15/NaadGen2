<script lang="ts">
    import type { CompositionState } from "$lib/state/compositionState.svelte";

    let { state }: { state: CompositionState } = $props();
</script>

<div
    id="sectionControls"
    class={`relative grid grid-cols-4 max-sm:grid-cols-2 gap-1.5 p-4 pt-5 bg-[#1d2230b9] rounded-lg backdrop-blur shadow shadow-black border-2 border-gray-400 opacity-${
        state.isPlaybackStopped ? "100" : "10"
    } pointer-events-${state.isPlaybackStopped ? "auto" : "none"}`}
>
    <div
        class="absolute -top-2 left-4 text-sm font-semibold bg-[#1d2230] text-white px-2 rounded-lg border border-gray-400"
    >
        📒 Sections:
    </div>

    <select
        class="w-30 max-sm:w-auto bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 placeholder-gray-400 hover:border-white hover:shadow-gray-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:border-white active:shadow-gray-500/50 active:text-white active:shadow-[0_0_20px_5px]"
        bind:value={state.currentSection}
    >
        <option selected disabled>Section</option>
        {#each state.bandishSections
            .map((section) => section.sectionName)
            .sort( (a, b) => a.localeCompare( b, undefined, { sensitivity: "base" }, ), ) as section}
            <option value={section}>{section}</option>
        {/each}
    </select>

    <button
        class="text-black bg-lime-500 font-medium rounded-lg text-sm px-5 py-2.5 hover:scale-105 active:scale-90 border-2 hover:border-2 hover:border-white hover:shadow-lime-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:border-2 active:border-white active:shadow-lime-500/50 active:text-white active:shadow-[0_0_20px_5px]"
        onclick={() => {
            const sectionName = prompt("Enter new section name", "New Section");
            if (sectionName) state.addSection(sectionName.trim());
        }}
    >
        Add New
    </button>

    <button
        class="text-black bg-orange-500 font-medium rounded-lg text-sm px-5 py-2.5 hover:scale-105 active:scale-90 border-2 hover:border-2 hover:border-white hover:shadow-orange-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:border-2 active:border-white active:shadow-orange-500/50 active:text-white active:shadow-[0_0_20px_5px]"
        onclick={() => state.renameSection(state.currentSection)}
    >
        Rename
    </button>

    <button
        class="text-black bg-red-500 font-medium rounded-lg text-sm px-5 py-2.5 hover:scale-105 active:scale-90 border-2 hover:border-2 hover:border-white hover:shadow-red-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:border-2 active:border-white active:shadow-red-500/50 active:text-white active:shadow-[0_0_20px_5px]"
        onclick={() => state.deleteSection(state.currentSection)}
    >
        Delete
    </button>
</div>

<script lang="ts">
    import type { CompositionState } from "$lib/state/compositionState.svelte";

    let { state }: { state: CompositionState } = $props();

    const btnActionClasses =
        "text-black font-medium rounded-lg text-sm px-5 py-1.5 hover:scale-105 active:scale-90 border-2 hover:border-2 hover:border-white hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:border-2 active:border-white active:text-white active:shadow-[0_0_20px_5px]";
</script>

<div
    id="sectionControls"
    class="relative grid grid-cols-4 max-sm:grid-cols-2 gap-3 p-4 pt-5 shadow-black shadow rounded-lg flex-col justify-between max-sm:w-full"
>
    <div
        class="absolute -top-3 left-4 text-sm shadow-black shadow font-semibold text-white px-2 rounded-lg"
    >
        📒 Sections:
    </div>

    <select
        class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1.5 placeholder-gray-400 hover:border-white hover:shadow-gray-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:border-white active:shadow-gray-500/50 active:text-white active:shadow-[0_0_20px_5px]"
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
        class="{btnActionClasses} bg-lime-500 hover:shadow-lime-500/50 active:shadow-lime-500/50"
        onclick={() => {
            const sectionName = prompt("Enter new section name", "New Section");
            if (sectionName) state.addSection(sectionName.trim());
        }}
    >
        Add New
    </button>

    <button
        class="{btnActionClasses} bg-orange-500 hover:shadow-orange-500/50 active:shadow-orange-500/50"
        onclick={() => state.renameSection(state.currentSection)}
    >
        Rename
    </button>

    <button
        class="{btnActionClasses} bg-red-500 hover:shadow-red-500/50 active:shadow-red-500/50"
        onclick={() => state.deleteSection(state.currentSection)}
    >
        Delete
    </button>
</div>

<script lang="ts">
    import {
        ragas,
        taals,
        type CompositionState,
    } from "$lib/state/compositionState.svelte";
    import RagaDetails from "$lib/components/RagaDetails.svelte";
    let { state }: { state: CompositionState } = $props();

    const selectClasses =
        "bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1.5 placeholder-gray-400 hover:border-white hover:shadow-gray-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 w-full active:border-white active:shadow-gray-500/50 active:text-white active:shadow-[0_0_20px_5px]";
    const btnBlueClasses =
        "text-black flex-1 bg-blue-400 font-medium rounded-lg text-sm px-5 py-1.5 hover:scale-105 active:scale-90 border-2 hover:border-2 hover:border-white hover:shadow-blue-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:border-2 active:border-white active:shadow-blue-500/50 active:text-white active:shadow-[0_0_20px_5px]";
</script>

<div
    class="relative flex grow gap-1 p-4 pt-5 shadow-black shadow rounded-lg flex-col justify-between max-lg:w-full"
>
    <div
        class="absolute -top-3 left-4 text-sm shadow-black shadow font-semibold text-white px-2 rounded-lg"
    >
        🎵 Composition:
    </div>

    <div class="mb-2 flex flex-col max-lg:flex-row gap-2">
        <select
            id="ragaSelector"
            class={selectClasses}
            bind:value={state.selectedRaga}
            onchange={() => state.resetSvaras()}
        >
            <option selected disabled>Raga</option>
            {#each state.genSelectData(ragas) as raga}
                <option value={raga.value}>{raga.name}</option>
            {/each}
        </select>
        <select
            id="taalSelector"
            class={selectClasses}
            bind:value={state.selectedTaal}
        >
            <option selected disabled>Taal</option>
            {#each state.genSelectData(taals) as taal}
                <option value={taal.value}>{taal.name}</option>
            {/each}
        </select>
    </div>

    <RagaDetails {state} />

    <div
        id="savefileBtns"
        class="my-2 flex flex-col max-lg:flex-row gap-2 max-lg:my-2"
    >
        <button class={btnBlueClasses} onclick={() => state.exportData()}>
            Export
        </button>

        <input
            type="file"
            accept=".ng,.txt"
            bind:this={state.importFileInput}
            onchange={(e) => state.handleFileInput(e)}
            class="hidden"
        />
        <button
            class={btnBlueClasses}
            onclick={() => state.handleImportClick()}
        >
            Import
        </button>
    </div>

    <div class="flex gap-2">
        <div class="text-white">Loop Playback</div>
        <input
            type="checkbox"
            bind:checked={state.isPlaybackLooped}
            class="text-white"
        />
    </div>
</div>

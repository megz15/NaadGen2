<script lang="ts">
    import {
        taals,
        type CompositionState,
    } from "$lib/state/compositionState.svelte";

    let { state }: { state: CompositionState } = $props();
</script>

<div class="flex flex-wrap gap-1" bind:this={state.compDiv}>
    {#each state.currentBandishSectionSvaras as svaras, i}
        {@const svaraLabel = svaras.map((svara) => svara[0])}
        <button
            id={`comp-${i}`}
            class={`relative text-lg h-8 w-12 font-medium rounded-lg hover:scale-112 active:scale-90 hover:shadow-blue-400/50 hover:bg-blue-300 hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:shadow-blue-400/50 active:bg-blue-300 active:shadow-[0_0_20px_5px] ${
                taals[state.selectedTaal]["tali"].includes(
                    i % taals[state.selectedTaal]["matra"],
                )
                    ? "bg-gray-600 text-white"
                    : taals[state.selectedTaal]["khali"].includes(
                            i % taals[state.selectedTaal]["matra"],
                        )
                      ? "bg-orange-500 text-black"
                      : "bg-gray-200 text-black"
            }`}
            onclick={() => state.openNoteModal(i)}
        >
            {#if svaraLabel.join("").length > 4}
                {svaraLabel[0] + ">"}
            {:else if svaraLabel.join("").length == 3 || svaraLabel.join("").length == 4}
                <div
                    class="absolute inset-0 grid grid-cols-2 grid-rows-2 items-center justify-center"
                >
                    {#each svaraLabel as svara}
                        <div>{svara}</div>
                    {/each}
                </div>
            {:else}
                {svaraLabel.join("")}
            {/if}
        </button>
    {/each}
</div>

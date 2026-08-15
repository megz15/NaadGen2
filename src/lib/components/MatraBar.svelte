<script lang="ts">
    import {
        taals,
        type CompositionState,
    } from "$lib/state/compositionState.svelte";

    let { state }: { state: CompositionState } = $props();
</script>

<div class="flex gap-1 py-4 w-fit" bind:this={state.matrasDiv}>
    {#each { length: taals[state.selectedTaal]["matra"] } as _, i}
        {#if state.insertIndex % taals[state.selectedTaal]["matra"] === i}
            <div
                class="w-1 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_8px_2px] shadow-yellow-500"
            ></div>
        {/if}
        <div
            class={`text-lg w-12 font-medium rounded-lg py-1 text-center ${
                taals[state.selectedTaal]["tali"].includes(i)
                    ? "bg-gray-700 text-white"
                    : taals[state.selectedTaal]["khali"].includes(i)
                      ? "bg-orange-600 text-black"
                      : "bg-gray-400 text-black"
            }`}
        >
            {i + 1}
        </div>
    {/each}
    <div class="w-1"></div>
</div>

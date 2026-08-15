<script lang="ts">
    import {
        ragas,
        shrutiNames,
        type CompositionState,
    } from "$lib/state/compositionState.svelte";
    let { state }: { state: CompositionState } = $props();

    const detailClasses = "text-yellow-400";
</script>

<div
    class="flex flex-col text-white gap-2 max-lg:flex-row max-lg:justify-between"
>
    <div>
        Vadi:
        <span class={detailClasses}>
            {shrutiNames[ragas[state.selectedRaga].vadi.toLowerCase()]}
        </span>
    </div>
    <div>
        Samvadi:
        <span class={detailClasses}>
            {shrutiNames[ragas[state.selectedRaga].samvadi.toLowerCase()]}
        </span>
    </div>
    <div>
        Vikrit:
        <span class={detailClasses}>
            {ragas[state.selectedRaga].vikrit.join(", ") || "None"}
        </span>
    </div>
</div>

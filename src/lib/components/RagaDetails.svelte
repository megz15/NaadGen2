<script lang="ts">
    import {
        ragas,
        shrutiNames,
        type CompositionState,
    } from "$lib/state/compositionState.svelte";

    let { state }: { state: CompositionState } = $props();
</script>

<div class="text-white text-lg mb-2">
    <span>
        <b>Vadi:</b>
        <span class="bg-blue-100 py-0.5 px-2 rounded text-blue-900">
            {shrutiNames[ragas[state.selectedRaga].vadi.toLowerCase()]}
        </span>,
    </span>
    <span>
        <b>Samvadi:</b>
        <span class="bg-blue-100 py-0.5 px-2 rounded text-blue-900">
            {shrutiNames[ragas[state.selectedRaga].samvadi.toLowerCase()]}
        </span>
    </span>
</div>

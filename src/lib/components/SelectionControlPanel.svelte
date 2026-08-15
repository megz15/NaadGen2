<script lang="ts">
    import type { CompositionState } from "$lib/state/compositionState.svelte";

    let { state }: { state: CompositionState } = $props();

    const btnActionClasses =
        "text-black font-medium rounded-lg text-sm px-5 py-1.5 hover:scale-105 active:scale-90 border-2 hover:border-2 hover:border-white hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:border-2 active:border-white active:text-white active:shadow-[0_0_20px_5px]";
</script>

<div
    id="selectionControls"
    class="relative grid grid-cols-4 max-sm:grid-cols-2 gap-3 p-4 pt-5 shadow-black shadow rounded-lg flex-col justify-between max-sm:w-full"
>
    <div
        class="absolute -top-3 left-4 text-sm shadow-black shadow font-semibold text-white px-2 rounded-lg"
    >
        ✂️ Selection:
    </div>

    <button
        class="{btnActionClasses} bg-blue-400 hover:shadow-blue-400/50 active:shadow-blue-400/50"
        onclick={() => state.clearSelection()}
    >
        Reset
    </button>

    <button
        class="{btnActionClasses} bg-lime-500 hover:shadow-lime-500/50 active:shadow-lime-500/50"
        onclick={() => state.duplicateSelection()}
    >
        Duplicate
    </button>

    <button
        class="{btnActionClasses} bg-orange-500 hover:shadow-orange-500/50 active:shadow-orange-500/50"
        onclick={() => state.moveSelectionToSection()}
    >
        Move
    </button>

    <button
        class="{btnActionClasses} bg-red-500 hover:shadow-red-500/50 active:shadow-red-500/50"
        onclick={() => state.deleteSelection()}
    >
        Delete
    </button>
</div>

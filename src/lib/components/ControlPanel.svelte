<script lang="ts">
    import CompositionControlPanel from "$lib/components/CompositionControlPanel.svelte";
    import PlaybackControlPanel from "$lib/components/PlaybackControlPanel.svelte";
    import SectionControlPanel from "$lib/components/SectionControlPanel.svelte";
    import SelectionControlPanel from "$lib/components/SelectionControlPanel.svelte";
    import type { CompositionState } from "$lib/state/compositionState.svelte";

    let { state }: { state: CompositionState } = $props();
</script>

<div
    class={`m-5 max-h-[calc(100vh-8rem)] overflow-y-scroll flex flex-col gap-6 p-5 fixed md:bottom-1/2 md:translate-y-1/2 z-30 shadow shadow-black rounded-lg bg-[#1d2230b9] backdrop-blur transition-opacity duration-500 ease-in-out ${
        state.isControlPanelShown
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
    }`}
>
    <div class="flex justify-between items-center mb-4">
        <div class="text-2xl font-bold text-white">⚙ Control Panel</div>
        <button
            class="text-2xl cursor-pointer"
            onclick={() => (state.isControlPanelShown = false)}>❌</button
        >
    </div>

    <div class="flex flex-wrap gap-6">
        <CompositionControlPanel {state} />
        <PlaybackControlPanel {state} />
    </div>

    <SectionControlPanel {state} />
    <SelectionControlPanel {state} />
</div>

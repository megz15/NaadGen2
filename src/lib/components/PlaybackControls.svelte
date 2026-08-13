<script lang="ts">
    import type { CompositionState } from "$lib/state/compositionState.svelte";

    let { state }: { state: CompositionState } = $props();
</script>

<div
    id="playbackControls"
    class={`relative flex grow gap-1 p-4 pt-5 bg-[#1d2230b9] rounded-lg backdrop-blur shadow shadow-black flex-col max-sm:w-full opacity-${
        state.isPlaybackStopped ? "100" : "10"
    } pointer-events-${state.isPlaybackStopped ? "auto" : "none"}`}
>
    <div
        class="absolute -top-3 left-4 text-sm font-semibold bg-[#1d2230b9] text-white px-2 rounded-lg shadow-sm shadow-black"
    >
        🎚️ Playback:
    </div>
    <div>
        <div class="flex items-center justify-between gap-2">
            <div class="text-white">Frequency (Hz)</div>
            <input
                type="number"
                bind:value={state.currBaseFreq}
                class="w-20 bg-gray-50 border-2 text-black text-sm rounded-lg px-2 py-1"
            />
        </div>
        <input
            type="range"
            min="20"
            max="1000"
            step="10"
            bind:value={state.currBaseFreq}
            class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700"
        />
    </div>

    <div>
        <div class="flex items-center justify-between gap-2">
            <div class="text-white">Tempo (BPM)</div>
            <input
                type="number"
                bind:value={state.tempoBPM}
                class="w-20 bg-gray-50 border-2 text-black text-sm rounded-lg px-2 py-1"
            />
        </div>
        <input
            type="range"
            min="20"
            max="1000"
            step="10"
            bind:value={state.tempoBPM}
            class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700"
        />
    </div>

    <div>
        <div class="flex items-center justify-between gap-2">
            <div class="text-white">Note Duration</div>
            <input
                type="number"
                bind:value={state.noteTime}
                step="0.01"
                class="w-20 bg-gray-50 border-2 text-black text-sm rounded-lg px-2 py-1"
            />
        </div>
        <input
            type="range"
            min="0.05"
            max="1"
            step="0.05"
            bind:value={state.noteTime}
            class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700"
        />
    </div>

    <div>
        <div class="flex items-center justify-between gap-2">
            <div class="text-white">Volume %</div>
            <input
                type="number"
                bind:value={state.noteVolume}
                class="w-20 bg-gray-50 border-2 text-black text-sm rounded-lg px-2 py-1"
            />
        </div>
        <input
            type="range"
            min="0"
            max="200"
            step="5"
            bind:value={state.noteVolume}
            class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700"
        />
    </div>
</div>

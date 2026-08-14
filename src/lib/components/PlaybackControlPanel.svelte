<script lang="ts">
    import type { CompositionState } from "$lib/state/compositionState.svelte";

    let { state }: { state: CompositionState } = $props();

    const freqNotes = [
        { label: "B", freq: 246.94 },
        { label: "C", freq: 261.63 },
        { label: "C#", freq: 277.18 },
        { label: "D", freq: 293.66 },
        { label: "D#", freq: 311.13 },
        { label: "E", freq: 329.63 },
        { label: "F", freq: 349.23 },
        { label: "F#", freq: 369.99 },
        { label: "G", freq: 392 },
        { label: "G#", freq: 415.3 },
        { label: "A", freq: 440 },
        { label: "A#", freq: 466.16 },
    ];

    const tempos = [
        { label: "Vilambit", bpm: 70 },
        { label: "Madhya", bpm: 140 },
        { label: "Drut", bpm: 210 },
        { label: "Ati-Drut", bpm: 280 },
        { label: "AA-Drut", bpm: 350 },
    ];

    const durations = [
        { label: "0.1s", val: 0.1 },
        { label: "0.25s", val: 0.25 },
        { label: "0.5s", val: 0.5 },
        { label: "0.75s", val: 0.75 },
        { label: "1.0s", val: 1.0 },
    ];

    const volumes = [
        { label: "pp", val: 25 },
        { label: "p", val: 50 },
        { label: "mf", val: 75 },
        { label: "f", val: 100 },
        { label: "ff", val: 150 },
    ];

    const btnBase =
        "px-2 py-1 rounded-lg text-sm transition-all duration-150 cursor-pointer border";
    const btnActive =
        "bg-yellow-400 text-black border-yellow-300 shadow-[0_0_10px_2px] shadow-yellow-500";
    const btnInactive =
        "bg-[#2a3146] text-gray-300 border-transparent hover:border-gray-500 hover:text-white";
</script>

<div
    id="playbackControls"
    class="relative flex grow gap-4 p-4 pt-5 shadow-black shadow rounded-lg flex-col justify-between max-sm:w-full"
>
    <div
        class="absolute -top-3 left-4 text-sm shadow-black shadow font-semibold text-white px-2 rounded-lg"
    >
        🎚️ Playback:
    </div>

    <!-- Frequency -->
    <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between">
            <div class="text-white text-sm">Base Frequency (Shadaj)</div>
            <div class="text-yellow-400 text-xs">
                {state.baseFreq} Hz
            </div>
        </div>
        <div class="flex flex-wrap gap-1">
            {#each freqNotes as note}
                <button
                    class="{btnBase} {Math.abs(state.baseFreq - note.freq) < 0.1
                        ? btnActive
                        : btnInactive} min-w-10"
                    onclick={() => (state.baseFreq = note.freq)}
                >
                    <span class="text-sm">{note.label}</span>
                </button>
            {/each}
        </div>
    </div>

    <!-- Tempo -->
    <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between">
            <div class="text-white text-sm">Tempo</div>
            <div class="text-yellow-400 text-xs">
                {state.tempoBPM} BPM
            </div>
        </div>
        <div class="flex gap-1.5">
            {#each tempos as t}
                <button
                    class="{btnBase} {state.tempoBPM === t.bpm
                        ? btnActive
                        : btnInactive} flex-1"
                    onclick={() => (state.tempoBPM = t.bpm)}
                >
                    <span class="text-sm">{t.label}</span>
                </button>
            {/each}
        </div>
    </div>

    <!-- Note Duration -->
    <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between">
            <div class="text-white text-sm">Note Duration</div>
            <div class="text-yellow-400 text-xs">
                {state.noteTime}s
            </div>
        </div>
        <div class="flex gap-1.5">
            {#each durations as d}
                <button
                    class="{btnBase} {state.noteTime === d.val
                        ? btnActive
                        : btnInactive} flex-1"
                    onclick={() => (state.noteTime = d.val)}
                >
                    <span class="text-xs">{d.label}</span>
                </button>
            {/each}
        </div>
    </div>

    <!-- Volume -->
    <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between">
            <div class="text-white text-sm">Volume</div>
            <div class="text-yellow-400 text-xs">
                {state.noteVolume}%
            </div>
        </div>
        <div class="flex gap-1.5">
            {#each volumes as v}
                <button
                    class="{btnBase} {state.noteVolume === v.val
                        ? btnActive
                        : btnInactive} flex-1"
                    onclick={() => (state.noteVolume = v.val)}
                >
                    <span class="text-xs">{v.label}</span>
                </button>
            {/each}
        </div>
    </div>
</div>

<!--
todo: "advanced options" panel

<div>
    <div class="flex items-center justify-between gap-2">
        <div class="text-white">Frequency (Hz)</div>
        <input type="number" bind:value={state.baseFreq}
            class="w-20 bg-gray-50 border-2 text-black text-sm rounded-lg px-2 py-1" />
    </div>
    <input type="range" min="20" max="1000" step="10" bind:value={state.baseFreq}
        class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700" />
</div>

<div>
    <div class="flex items-center justify-between gap-2">
        <div class="text-white">Tempo (BPM)</div>
        <input type="number" bind:value={state.tempoBPM}
            class="w-20 bg-gray-50 border-2 text-black text-sm rounded-lg px-2 py-1" />
    </div>
    <input type="range" min="20" max="1000" step="10" bind:value={state.tempoBPM}
        class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700" />
</div>

<div>
    <div class="flex items-center justify-between gap-2">
        <div class="text-white">Note Duration</div>
        <input type="number" bind:value={state.noteTime} step="0.01"
            class="w-20 bg-gray-50 border-2 text-black text-sm rounded-lg px-2 py-1" />
    </div>
    <input type="range" min="0.05" max="1" step="0.05" bind:value={state.noteTime}
        class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700" />
</div>

<div>
    <div class="flex items-center justify-between gap-2">
        <div class="text-white">Volume %</div>
        <input type="number" bind:value={state.noteVolume}
            class="w-20 bg-gray-50 border-2 text-black text-sm rounded-lg px-2 py-1" />
    </div>
    <input type="range" min="0" max="200" step="5" bind:value={state.noteVolume}
        class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700" />
</div>
-->

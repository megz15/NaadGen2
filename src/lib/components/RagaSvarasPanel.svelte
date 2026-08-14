<script lang="ts">
    import type { CompositionState } from "$lib/state/compositionState.svelte";

    let { state }: { state: CompositionState } = $props();
</script>

<div
    class={`flex flex-col gap-4 w-fit opacity-${state.isPlaybackStopped ? "100" : "10"} pointer-events-${
        state.isPlaybackStopped ? "auto" : "none"
    }`}
>
    <div
        id="ragaSvaras"
        class="flex gap-1 relative p-4 pt-5 bg-[#1d2230b9] rounded-lg backdrop-blur shadow shadow-black"
    >
        <div
            class="absolute -top-3 text-sm font-semibold bg-[#1d2230b9] text-white px-2 shadow-sm shadow-black rounded-lg capitalize"
        >
            Raga {state.selectedRaga} Svaras:
        </div>

        {#each state.current_svaras as svara}
            <button
                class="text-lg w-12 text-black bg-gray-200 font-medium rounded-lg px-5 hover:scale-112 active:scale-90 hover:shadow-yellow-400/50 hover:bg-yellow-200 hover:shadow-[0_0_10px_5px] transition-all duration-200 active:duration-50 active:shadow-yellow-400/50 active:bg-yellow-200 active:shadow-[0_0_10px_5px]"
                onclick={() => state.svaraClick(svara, state.octave)}
            >
                {svara}
            </button>
        {/each}

        <div class="flex-1"></div>

        <button
            class="text-lg text-black bg-blue-400 font-medium rounded-lg px-5 py-1 hover:scale-105 active:scale-90 border-2 hover:border-2 hover:border-white hover:shadow-blue-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:border-2 active:border-white active:shadow-blue-500/50 active:text-white active:shadow-[0_0_20px_5px]"
            onclick={() => {
                state.currentBandishSectionSvaras.push([[".", 0]]);
            }}
        >
            Rest
        </button>
    </div>

    <div class="flex gap-3 justify-between">
        <div
            id="noteOctave"
            class="flex gap-0.5 items-center relative p-4 pt-5 bg-[#1d2230b9] rounded-lg backdrop-blur shadow shadow-black"
        >
            <div
                class="absolute -top-3 text-sm font-semibold bg-[#1d2230b9] text-white px-2 rounded-lg shadow-sm shadow-black"
            >
                Octave:
            </div>

            <button
                class="w-8 text-black bg-red-500 font-medium rounded-l-lg hover:scale-108 active:scale-90 hover:shadow-orange-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:shadow-orange-500/50 active:text-white active:shadow-[0_0_20px_5px]"
                onclick={() => {
                    state.octave--;
                }}
            >
                -
            </button>

            <input
                bind:value={state.octave}
                class="h-8 w-12 bg-gray-50 border text-black text-sm p-2.5 rounded-lg"
                readonly
            />

            <button
                class="w-8 text-black bg-lime-500 font-medium rounded-r-lg hover:scale-108 active:scale-90 hover:shadow-lime-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:shadow-lime-500/50 active:text-white active:shadow-[0_0_20px_5px]"
                onclick={() => {
                    state.octave++;
                }}
            >
                +
            </button>
        </div>

        <div
            class="flex gap-0.5 p-4 pt-5 bg-[#1d2230b9] rounded-lg backdrop-blur shadow shadow-black"
        >
            <button
                class="text-black bg-red-500 font-medium rounded-l-lg px-5 py-1 hover:scale-105 active:scale-90 hover:shadow-red-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:shadow-red-500/50 active:text-white active:shadow-[0_0_20px_5px]"
                onclick={() => state.deleteLastSvara()}
            >
                Delete
            </button>

            <button
                class="text-black bg-lime-500 font-medium rounded-r-lg px-5 py-1 hover:scale-105 active:scale-90 hover:shadow-lime-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:shadow-lime-500/50 active:text-white active:shadow-[0_0_20px_5px]"
                onclick={() => state.undoLastSvara()}
            >
                Undo
            </button>

            <button
                class="text-black bg-red-500 font-medium rounded-lg px-5 py-1 ml-1 hover:scale-105 active:scale-90 hover:shadow-red-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:shadow-red-500/50 active:text-white active:shadow-[0_0_20px_5px]"
                onclick={() => state.clearCurrentSection()}
            >
                Clear
            </button>
        </div>
    </div>
</div>

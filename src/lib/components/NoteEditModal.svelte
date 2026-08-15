<script lang="ts">
    import type { CompositionState } from "$lib/state/compositionState.svelte";

    let { state }: { state: CompositionState } = $props();
</script>

<div
    id="noteEditModal"
    class={`fixed bottom-4 left-4 z-50 p-5 rounded-lg bg-[#1d2230b9] backdrop-blur shadow shadow-black border-2 border-gray-400 text-white transition-opacity duration-500 ease-in-out ${
        state.noteEditModal ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
>
    <div class="flex justify-between items-center mb-4">
        <div class="text-xl font-bold">🔧 Svara/Matra Edit</div>
        <button
            class="text-2xl cursor-pointer"
            onclick={() => (state.noteEditModal = false)}>❌</button
        >
    </div>

    <div
        class={`flex flex-col justify-between gap-1 opacity-${
            state.isPlaybackStopped ? "100" : "10"
        } pointer-events-${state.isPlaybackStopped ? "auto" : "none"}`}
    >
        <div class="flex flex-col gap-1">
            {#each state.currentBandishSectionSvaras[state.noteModalNoteIndex] as svaras, i}
                <div class="flex justify-between gap-1">
                    <button
                        class="text-black hover:text-white w-10 bg-orange-500 font-medium rounded-lg py-1.5 hover:scale-105 active:scale-90 hover:shadow-orange-500/50 hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:shadow-orange-500/50 active:shadow-[0_0_20px_5px]"
                        onclick={() => {
                            if (!["S", "P"].includes(svaras[0])) {
                                svaras[0] =
                                    svaras[0].toLowerCase() === svaras[0]
                                        ? svaras[0].toUpperCase()
                                        : svaras[0].toLowerCase();
                            }
                        }}
                    >
                        ⟳
                    </button>

                    <input
                        bind:value={svaras[0]}
                        maxlength="1"
                        onclick={(e) =>
                            (e.currentTarget as HTMLInputElement).select()}
                        class="w-12 bg-gray-50 border-2 text-black text-sm rounded-lg px-2.5"
                    />

                    <div class="flex items-center gap-0.5">
                        <button
                            class="text-lg h-10 w-12 text-black bg-orange-500 font-medium rounded-l-lg hover:scale-108 active:scale-90 hover:shadow-orange-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:shadow-orange-500/50 active:text-white active:shadow-[0_0_20px_5px]"
                            onclick={() => {
                                svaras[1]--;
                            }}
                        >
                            -
                        </button>

                        <input
                            bind:value={svaras[1]}
                            class="h-12 w-12 rounded-lg bg-gray-50 border text-black text-sm px-2.5"
                            readonly
                        />

                        <button
                            class="text-lg h-10 w-12 text-black bg-lime-500 font-medium rounded-r-lg hover:scale-108 active:scale-90 hover:shadow-lime-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:shadow-lime-500/50 active:text-white active:shadow-[0_0_20px_5px]"
                            onclick={() => {
                                svaras[1]++;
                            }}
                        >
                            +
                        </button>
                    </div>

                    <button
                        class="text-black hover:text-white w-10 bg-red-500 font-medium rounded-lg py-1.5 hover:scale-105 active:scale-90 hover:shadow-red-500/50 hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:shadow-red-500/50 active:shadow-[0_0_20px_5px]"
                        onclick={() => {
                            if (
                                state.currentBandishSectionSvaras[
                                    state.noteModalNoteIndex
                                ].length > 1
                            ) {
                                state.currentBandishSectionSvaras[
                                    state.noteModalNoteIndex
                                ].splice(i, 1);
                            } else alert("Can't delete base note!");
                        }}
                    >
                        🗑
                    </button>
                </div>
            {/each}
        </div>

        <div class="grid grid-cols-2 gap-1">
            <button
                class="text-black bg-blue-400 font-medium rounded-lg text-sm px-5 py-1.5 hover:scale-105 active:scale-90 border-2 hover:border-2 hover:border-white hover:shadow-blue-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:border-2 active:border-white active:shadow-blue-500/50 active:text-white active:shadow-[0_0_20px_5px]"
                onclick={() => {
                    state.currentBandishSectionSvaras[
                        state.noteModalNoteIndex
                    ].push([
                        ...state.currentBandishSectionSvaras[
                            state.noteModalNoteIndex
                        ][
                            state.currentBandishSectionSvaras[
                                state.noteModalNoteIndex
                            ].length - 1
                        ],
                    ]);
                }}
            >
                Split
            </button>

            <button
                class="text-black bg-blue-400 font-medium rounded-lg text-sm px-5 py-1.5 hover:scale-105 active:scale-90 border-2 hover:border-2 hover:border-white hover:shadow-blue-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:border-2 active:border-white active:shadow-blue-500/50 active:text-white active:shadow-[0_0_20px_5px]"
                onclick={() => {
                    state.currentBandishSectionSvaras[
                        state.noteModalNoteIndex
                    ] = [
                        state.currentBandishSectionSvaras[
                            state.noteModalNoteIndex
                        ][0],
                    ];
                }}
            >
                Clear
            </button>

            <button
                class="text-black bg-blue-400 font-medium rounded-lg text-sm px-5 py-1.5 hover:scale-105 active:scale-90 border-2 hover:border-2 hover:border-white hover:shadow-blue-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:border-2 active:border-white active:shadow-blue-500/50 active:text-white active:shadow-[0_0_20px_5px]"
                onclick={() => {
                    state.startIndex = state.noteModalNoteIndex;
                    state.focusOnSelectedNoteRange(
                        state.startIndex,
                        state.endIndex,
                    );
                }}
            >
                Mark Start
            </button>

            <button
                class="text-black bg-blue-400 font-medium rounded-lg text-sm px-5 py-1.5 hover:scale-105 active:scale-90 border-2 hover:border-2 hover:border-white hover:shadow-blue-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:border-2 active:border-white active:shadow-blue-500/50 active:text-white active:shadow-[0_0_20px_5px]"
                onclick={() => {
                    state.endIndex = state.noteModalNoteIndex;
                    state.focusOnSelectedNoteRange(
                        state.startIndex,
                        state.endIndex,
                    );
                }}
            >
                Mark End
            </button>

            <button
                class="text-black bg-red-500 font-medium rounded-lg text-sm px-5 py-1.5 hover:scale-105 active:scale-90 border-2 hover:border-2 hover:border-white hover:shadow-red-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:border-2 active:border-white active:shadow-red-500/50 active:text-white active:shadow-[0_0_20px_5px]"
                onclick={() => {
                    state.deleteNoteAtIndex(state.noteModalNoteIndex);
                    if (
                        !state.currentBandishSectionSvaras[
                            state.noteModalNoteIndex
                        ]
                    )
                        state.noteEditModal = false;
                }}
            >
                🗑 Delete Note
            </button>

            <button
                class="text-black bg-yellow-400 font-medium rounded-lg text-sm px-5 py-1.5 hover:scale-105 active:scale-90 border-2 hover:border-2 hover:border-white hover:shadow-yellow-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:border-2 active:border-white active:shadow-yellow-500/50 active:text-white active:shadow-[0_0_20px_5px]"
                onclick={() => {
                    state.setInsertCursor(state.noteModalNoteIndex);
                    state.noteEditModal = false;
                }}
            >
                Insert Before
            </button>
        </div>
    </div>
</div>

<script lang="ts">
    import type { CompositionState } from "$lib/state/compositionState.svelte";

    let { state }: { state: CompositionState } = $props();

    const btnActionClasses =
        "text-black font-medium rounded-lg text-sm px-3 py-1.5 hover:scale-105 active:scale-90 border-2 hover:border-2 hover:border-white hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:border-2 active:border-white active:text-white active:shadow-[0_0_20px_5px]";
    const btnStepper =
        "text-lg h-10 w-12 text-black font-medium hover:scale-108 active:scale-90 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:text-white active:shadow-[0_0_20px_5px]";
</script>

<div
    id="noteEditModal"
    class={`fixed bottom-4 mx-4 z-50 p-5 rounded-lg bg-[#1d2230b9] backdrop-blur shadow shadow-black border-2 border-gray-400 text-white transition-opacity duration-500 ease-in-out ${
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
                        class="{btnActionClasses} bg-yellow-500 hover:shadow-yellow-500/50 active:shadow-yellow-500/50"
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
                            class="{btnStepper} bg-red-500 rounded-l-lg hover:shadow-red-500/50 active:shadow-red-500/50"
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
                            class="{btnStepper} bg-lime-500 rounded-r-lg hover:shadow-lime-500/50 active:shadow-lime-500/50"
                            onclick={() => {
                                svaras[1]++;
                            }}
                        >
                            +
                        </button>
                    </div>

                    <button
                        class="{btnActionClasses} bg-red-500 hover:shadow-red-500/50 active:shadow-red-500/50"
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
                class="{btnActionClasses} bg-blue-400 hover:shadow-blue-500/50 active:shadow-blue-500/50"
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
                class="{btnActionClasses} bg-blue-400 hover:shadow-blue-500/50 active:shadow-blue-500/50"
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
                class="{btnActionClasses} bg-blue-400 hover:shadow-blue-500/50 active:shadow-blue-500/50"
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
                class="{btnActionClasses} bg-blue-400 hover:shadow-blue-500/50 active:shadow-blue-500/50"
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
                class="{btnActionClasses} bg-red-500 hover:shadow-red-500/50 active:shadow-red-500/50"
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
                🗑 Delete
            </button>

            <button
                class="{btnActionClasses} bg-yellow-400 hover:shadow-yellow-500/50 active:shadow-yellow-500/50"
                onclick={() => {
                    state.setInsertCursor(state.noteModalNoteIndex);
                    state.noteEditModal = false;
                }}
            >
                Insert
            </button>
        </div>
    </div>
</div>

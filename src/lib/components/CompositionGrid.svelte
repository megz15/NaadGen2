<script lang="ts">
    import {
        taals,
        type CompositionState,
    } from "$lib/state/compositionState.svelte";
    let { state }: { state: CompositionState } = $props();

    const cursorClasses =
        "w-1 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_2px] shadow-yellow-400";
</script>

{#if state.hasSubsections}
    <!-- Subsection mode: render each subsection stacked vertically -->
    <div class="flex flex-col gap-4">
        {#each state.currentBandishSection.subsections ?? [] as sub, subIdx}
            {@const isActive = state.currentSubsection === sub.subsectionName}
            <div
                class={`p-3 rounded-lg border-2 transition-colors duration-200 ${
                    isActive
                        ? "border-yellow-400 bg-yellow-400/5"
                        : "border-gray-600 bg-transparent"
                }`}
            >
                <button
                    class={`text-sm font-semibold mb-2 px-2 py-0.5 rounded transition-colors duration-200 ${
                        isActive
                            ? "text-yellow-400"
                            : "text-gray-400 hover:text-white"
                    }`}
                    onclick={() => state.switchToSubsection(sub.subsectionName)}
                >
                    {sub.subsectionName}
                </button>

                {#if isActive && state.insertIndex >= 0 && state.insertIndex < sub.svaras.length}
                    <div class="flex items-center gap-5 mb-2">
                        <div
                            class="text-yellow-400 text-sm font-semibold animate-pulse"
                        >
                            Cursor at Avartan {Math.floor(
                                state.insertIndex /
                                    taals[state.selectedTaal]["matra"],
                            ) + 1}, Svara index {state.insertIndex %
                                taals[state.selectedTaal]["matra"]}
                        </div>
                        <button
                            class="text-xs text-black bg-gray-300 hover:text-red-500 hover:bg-white py-0.5 px-2 rounded transition duration-200"
                            onclick={() => state.clearInsertCursor()}
                        >
                            <nobr>✕ Clear</nobr>
                        </button>
                    </div>
                {/if}

                <div class="flex flex-wrap gap-1">
                    {#each sub.svaras as svaras, i}
                        {#if isActive && state.insertIndex % taals[state.selectedTaal]["matra"] === i % taals[state.selectedTaal]["matra"] && state.insertIndex !== i && state.insertIndex % taals[state.selectedTaal]["matra"] !== 0}
                            <div class="w-1"></div>
                        {/if}
                        {#if isActive && state.insertIndex === i}
                            <div class={cursorClasses}></div>
                        {/if}
                        {@const svaraLabel = svaras.map((svara) => svara[0])}
                        <button
                            id={`sub-${subIdx}-${i}`}
                            class={`relative text-lg h-8 w-12 font-medium rounded-lg hover:scale-112 active:scale-90 hover:shadow-blue-400/50 hover:bg-blue-300 hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:shadow-blue-400/50 active:bg-blue-300 active:shadow-[0_0_20px_5px] ${
                                isActive && state.isNoteDimmed(i)
                                    ? "opacity-10"
                                    : ""
                            } ${
                                taals[state.selectedTaal]["tali"].includes(
                                    i % taals[state.selectedTaal]["matra"],
                                )
                                    ? "bg-gray-600 text-white"
                                    : taals[state.selectedTaal][
                                            "khali"
                                        ].includes(
                                            i %
                                                taals[state.selectedTaal][
                                                    "matra"
                                                ],
                                        )
                                      ? "bg-orange-500 text-black"
                                      : "bg-gray-200 text-black"
                            }`}
                            onclick={() => {
                                state.switchToSubsection(sub.subsectionName);
                                state.openNoteModal(i);
                            }}
                        >
                            {#if svaraLabel.join("").length > 4}
                                {svaraLabel[0] + ">"}
                            {:else if svaraLabel.join("").length == 3 || svaraLabel.join("").length == 4}
                                <div
                                    class="absolute inset-0 grid grid-cols-2 grid-rows-2 items-center justify-center"
                                >
                                    {#each svaraLabel as svara}
                                        <div>{svara}</div>
                                    {/each}
                                </div>
                            {:else}
                                {svaraLabel.join("")}
                            {/if}
                        </button>
                    {/each}
                    {#if isActive && (state.insertIndex == -1 || (state.insertIndex >= 0 && state.insertIndex >= sub.svaras.length))}
                        <div class={cursorClasses}></div>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
{:else}
    <!-- Legacy mode: single grid, same as before -->
    {#if state.insertIndex >= 0 && state.insertIndex < state.currentBandishSectionSvaras.length}
        <div class="flex items-center gap-5 mb-2">
            <div class="text-yellow-400 text-sm font-semibold animate-pulse">
                Cursor at Avartan {Math.floor(
                    state.insertIndex / taals[state.selectedTaal]["matra"],
                ) + 1}, Svara index {state.insertIndex %
                    taals[state.selectedTaal]["matra"]}
            </div>
            <button
                class="text-xs text-black bg-gray-300 hover:text-red-500 hover:bg-white py-0.5 px-2 rounded transition duration-200"
                onclick={() => state.clearInsertCursor()}
            >
                <nobr>✕ Clear</nobr>
            </button>
        </div>
    {/if}

    <div class="flex flex-wrap gap-1" bind:this={state.compDiv}>
        {#each state.currentBandishSectionSvaras as svaras, i}
            {#if state.insertIndex % taals[state.selectedTaal]["matra"] === i % taals[state.selectedTaal]["matra"] && state.insertIndex !== i && state.insertIndex % taals[state.selectedTaal]["matra"] !== 0}
                <div class="w-1"></div>
            {/if}
            {#if state.insertIndex === i}
                <div class={cursorClasses}></div>
            {/if}
            {@const svaraLabel = svaras.map((svara) => svara[0])}
            <button
                id={`comp-${i}`}
                class={`relative text-lg h-8 w-12 font-medium rounded-lg hover:scale-112 active:scale-90 hover:shadow-blue-400/50 hover:bg-blue-300 hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:shadow-blue-400/50 active:bg-blue-300 active:shadow-[0_0_20px_5px] ${
                    state.isNoteDimmed(i) ? "opacity-10" : ""
                } ${
                    taals[state.selectedTaal]["tali"].includes(
                        i % taals[state.selectedTaal]["matra"],
                    )
                        ? "bg-gray-600 text-white"
                        : taals[state.selectedTaal]["khali"].includes(
                                i % taals[state.selectedTaal]["matra"],
                            )
                          ? "bg-orange-500 text-black"
                          : "bg-gray-200 text-black"
                }`}
                onclick={() => state.openNoteModal(i)}
            >
                {#if svaraLabel.join("").length > 4}
                    {svaraLabel[0] + ">"}
                {:else if svaraLabel.join("").length == 3 || svaraLabel.join("").length == 4}
                    <div
                        class="absolute inset-0 grid grid-cols-2 grid-rows-2 items-center justify-center"
                    >
                        {#each svaraLabel as svara}
                            <div>{svara}</div>
                        {/each}
                    </div>
                {:else}
                    {svaraLabel.join("")}
                {/if}
            </button>
        {/each}
        {#if state.insertIndex == -1 || (state.insertIndex >= 0 && state.insertIndex >= state.currentBandishSectionSvaras.length)}
            <div class={cursorClasses}></div>
        {/if}
    </div>
{/if}

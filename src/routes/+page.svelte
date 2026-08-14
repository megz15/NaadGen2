<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/state";
    import { CompositionState } from "$lib/state/compositionState.svelte";

    import Header from "$lib/components/Header.svelte";
    import AboutModal from "$lib/components/AboutModal.svelte";
    // import RagaDetails from "$lib/components/RagaDetails.svelte";
    import ControlPanel from "$lib/components/ControlPanel.svelte";
    import RagaSvarasPanel from "$lib/components/RagaSvarasPanel.svelte";
    import MatraBar from "$lib/components/MatraBar.svelte";
    import CompositionGrid from "$lib/components/CompositionGrid.svelte";
    import NoteEditModal from "$lib/components/NoteEditModal.svelte";

    const state = new CompositionState();

    $effect(() => {
        // Automatically sync composition grid width whenever selectedTaal or currentSection changes
        const _taal = state.selectedTaal;
        const _sec = state.currentSection;
        state.matchDivWidth();
    });

    onMount(() => {
        const handleResize = () => state.matchDivWidth();
        window.addEventListener("resize", handleResize);

        const url = page.url.searchParams.get("load");
        if (url && url.trim().length > 0) {
            const decodedURL = decodeURIComponent(url);
            state.loadFromUrl(decodedURL);
        }

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    });
</script>

<svelte:head>
    <title>NaadGen</title>
</svelte:head>

<main class="flex flex-col items-center">
    <AboutModal {state} />

    <Header {state} />

    <div class="overflow-x-scroll p-5 max-w-full">
        <div class="flex flex-wrap gap-2 sm:justify-center">
            <RagaSvarasPanel {state} />
        </div>

        <MatraBar {state} />
        <CompositionGrid {state} />
    </div>
    <!-- <RagaDetails {state} /> -->

    <button
        id="controlPanelBtn"
        class={`z-100 text-black bg-yellow-500 fixed left-4 ${
            state.isFooterVisible ? "bottom-13 max-sm:bottom-20" : "bottom-4"
        } font-medium rounded-lg text-lg px-5 py-2 hover:scale-105 active:scale-90 border-2 hover:border-2 hover:border-white hover:shadow-yellow-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:border-2 active:border-white active:shadow-yellow-500/50 active:text-white active:shadow-[0_0_20px_5px] opacity-${
            state.isPlaybackStopped ? "100" : "10"
        } pointer-events-${state.isPlaybackStopped ? "auto" : "none"}`}
        onclick={() => {
            state.isControlPanelShown = !state.isControlPanelShown;
        }}>⚙ Control Panel</button
    >

    <button
        id="playBtn"
        class={`opacity-${
            state.currentBandishSectionSvaras.length != 0 ? "100" : "10"
        } z-100 text-black bg-${
            state.isPlaybackStopped ? "lime" : "red"
        }-500 fixed right-4 ${
            state.isFooterVisible ? "bottom-13 max-sm:bottom-20" : "bottom-4"
        } font-medium rounded-lg text-lg px-5 py-2 hover:scale-105 active:scale-90 border-2 hover:border-2 hover:border-white ${
            state.isPlaybackStopped
                ? "hover:shadow-lime-500/50"
                : "hover:shadow-red-500/50"
        } hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:border-2 active:border-white ${
            state.isPlaybackStopped
                ? "active:shadow-lime-500/50"
                : "active:shadow-red-500/50"
        } active:text-white active:shadow-[0_0_20px_5px]`}
        onclick={() => {
            if (state.isPlaybackStopped) {
                state.playNotes(
                    state.endIndex == -1
                        ? state.currentBandishSectionSvaras.slice(
                              state.startIndex,
                          )
                        : state.currentBandishSectionSvaras.slice(
                              state.startIndex,
                              state.endIndex + 1,
                          ),
                    state.startIndex,
                );
            } else {
                state.stopPlayback();
            }
        }}
    >
        {state.isPlaybackStopped ? "▶ Play!" : "⏹ Stop"}
    </button>

    <!-- <div class="fixed bottom-1/2 translate-y-1/2 flex flex-col m-5 gap-4"> -->
    <ControlPanel {state} />
</main>

<NoteEditModal {state} />

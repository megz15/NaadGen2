<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/state";
    import { CompositionState } from "$lib/state/compositionState.svelte";

    import Header from "$lib/components/Header.svelte";
    import AboutModal from "$lib/components/AboutModal.svelte";
    // import RagaDetails from "$lib/components/RagaDetails.svelte";
    import ControlPanel from "$lib/components/ControlPanel.svelte";
    import PlaybackControls from "$lib/components/PlaybackControls.svelte";
    import SectionControls from "$lib/components/SectionControls.svelte";
    import SelectionControls from "$lib/components/SelectionControls.svelte";
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
        <div class="flex flex-wrap gap-2 justify-center">
            <RagaSvarasPanel {state} />
        </div>

        <MatraBar {state} />
        <CompositionGrid {state} />
    </div>
    <!-- <RagaDetails {state} /> -->

    <button
        id="controlPanelBtn"
        class={`text-black bg-yellow-500 fixed right-10 top-10 font-medium rounded-lg text-lg px-5 py-2 hover:scale-105 active:scale-90 border-2 hover:border-2 hover:border-white hover:shadow-yellow-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50 active:border-2 active:border-white active:shadow-yellow-500/50 active:text-white active:shadow-[0_0_20px_5px]`}
        onclick={() => {
            state.isControlPanelShown = !state.isControlPanelShown;
        }}>⚙ Control Panel</button
    >

    <button
        id="playBtn"
        class={`opacity-${
            state.currentBandishSectionSvaras.length != 0 ? "100" : "10"
        } text-black bg-${
            state.isPlaybackStopped ? "lime" : "red"
        }-500 fixed right-10 top-24 font-medium rounded-lg text-lg px-5 py-2 hover:scale-105 active:scale-90 border-2 hover:border-2 hover:border-white ${
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
    <div
        class={`flex flex-col gap-4 p-5 fixed bottom-1/2 translate-y-1/2 z-50 ${
            state.isControlPanelShown
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
        }`}
    >
        <div class="flex justify-between items-center mb-4">
            <div
                class="text-2xl font-bold text-white px-5 py-2 rounded-lg bg-[#1d2230b9] backdrop-blur shadow shadow-yellow-500"
            >
                ⚙ Control Panel
            </div>
            <button
                class="text-2xl cursor-pointer px-5 py-2 rounded-lg bg-[#1d2230b9] backdrop-blur shadow shadow-red-500"
                onclick={() => (state.isControlPanelShown = false)}>❌</button
            >
        </div>

        <div class="flex flex-wrap gap-4">
            <ControlPanel {state} />
            <PlaybackControls {state} />
        </div>

        <SectionControls {state} />
        <SelectionControls {state} />
    </div>
</main>

<NoteEditModal {state} />

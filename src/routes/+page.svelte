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

    <div class="flex flex-col m-5 gap-4">
        <!-- <RagaDetails {state} /> -->

        <div class="flex flex-wrap gap-4">
            <ControlPanel {state} />
            <PlaybackControls {state} />
        </div>

        <SectionControls {state} />
        <SelectionControls {state} />
    </div>
</main>

<NoteEditModal {state} />

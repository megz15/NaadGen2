<script lang="ts">
    import logo from "$lib/data/logo.png";
    import type { CompositionState } from "$lib/state/compositionState.svelte";

    let { state }: { state: CompositionState } = $props();
</script>

<img
    src={logo}
    width="300px"
    alt="NaadGen"
    class="drop-shadow-[0_0_5em_oklch(0.424_0.199_265.638)] mt-5"
/>
<div class="glow">NaadGen<sup class="text-gray-400">2</sup></div>

<div class="flex flex-wrap justify-center gap-4 mt-5 mb-2">
    <button
        class="text-black bg-yellow-400 font-medium rounded-lg text-sm px-5 py-1 hover:scale-105 active:scale-90 border-2 hover:border-2 hover:border-white hover:shadow-yellow-400/50 hover:text-white hover:shadow-[0_0_20px_5px] active:border-2 active:border-white active:shadow-yellow-400/50 active:text-white active:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50"
        onclick={() => state.startTour()}
    >
        How to Use?
    </button>

    <button
        class="text-black bg-yellow-400 font-medium rounded-lg text-sm px-5 py-1 hover:scale-105 active:scale-90 border-2 hover:border-2 hover:border-white hover:shadow-yellow-400/50 hover:text-white hover:shadow-[0_0_20px_5px] active:border-2 active:border-white active:shadow-yellow-400/50 active:text-white active:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50"
        onclick={() => (state.aboutModal = true)}
    >
        About
    </button>

    <a href="https://megz15.github.io/NaadGen/" target="_blank">
        <button
            class="text-black bg-yellow-400 font-medium rounded-lg text-sm px-5 py-1 hover:scale-105 active:scale-90 border-2 hover:border-2 hover:border-white hover:shadow-yellow-400/50 hover:text-white hover:shadow-[0_0_20px_5px] active:border-2 active:border-white active:shadow-yellow-400/50 active:text-white active:shadow-[0_0_20px_5px] transition-all duration-200 active:duration-50"
        >
            Visit Old site!
        </button>
    </a>
</div>

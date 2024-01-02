<script lang="ts">
    import logo from "$lib/assets/naadgen/logo.png";
    import ragas from "$lib/data/naadgen/ragas.json";
    import taals from "$lib/data/naadgen/taals.json";
    import { Select } from "flowbite-svelte";

    let selectedRaga = 'Kafi';
    const raga = [
        { value: 'Kafi', name: 'Kafi'},
    ];
</script>

<main>
    <img src={logo} alt="NaadGen">
    <Select items={raga} bind:value={selectedRaga} placeholder="Raga" />
</main>
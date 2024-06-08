<script lang="ts">
    import logo from "$lib/assets/naadgen/logo.png"
    import ragasData from "$lib/data/naadgen/ragas.json"
    import taalsData from "$lib/data/naadgen/taals.json"
    import { Button, Select } from "flowbite-svelte"

    function genSelectData(data: Record<string, Raga | Taal>) {
        return Object.keys(data).map((k) => ({ value: k, name: k.charAt(0).toUpperCase() + k.slice(1) }))
    }

    function resetSvaras() {
        current_svaras = ['S', 'R', 'G', 'm', 'P', 'D', 'N']
    }

    function genFreq(base_freq: number, n: number) {
        return base_freq*(2**(n/12))
    }

    type Raga = {
        vikrit: string[]
        vikrit_shuddha: string[]
        varjya: string[]
        vadi: string
        samvadi: string
    }

    type Taal = {
        matra: number,
        tali: number[],
        khali: number[],
    }

    const ragas: Record<string, Raga> = ragasData
    const taals: Record<string, Taal> = taalsData

    let selectedRaga = 'kafi'    
    let selectedTaal = 'deepchandi'

    const all_svaras = ['S', 'r', 'R', 'g', 'G', 'm', 'M', 'P', 'd', 'D', 'n', 'N']
    let current_svaras: string[]

    const base_freq = 440
    resetSvaras()

    $: current_svaras.forEach(svara => {
        // Remove varjya svaras
        current_svaras = current_svaras.filter(svara => !ragas[selectedRaga].varjya.includes(svara.toUpperCase()))

        // Add vikrit shudhh svaras
        if (ragas[selectedRaga].vikrit_shuddha.includes(svara)) {
            current_svaras.splice(current_svaras.indexOf(svara), 1, svara.toLowerCase(), svara.toUpperCase())
        } else if (ragas[selectedRaga].vikrit.includes(svara)) {
            current_svaras.splice(current_svaras.indexOf(svara), 1, svara.toUpperCase() == svara ? svara.toLowerCase() : svara.toUpperCase())
        }
    })
</script>

<main class="flex flex-col items-center">

    <img src={logo} width="500px" alt="NaadGen" />
    <a href="https://megz15.github.io/NaadGen/" target="_blank"><Button class="text-lg mb-5" color="red">🚧 NaadGen is under construction 🚧<br><br>🚧 Use this site till then 🚧</Button></a>
    
    <div class="flex gap-5">
        <Select items={genSelectData(ragas)} bind:value={selectedRaga} on:change={resetSvaras} placeholder="Raga" />
        <Select items={genSelectData(taals)} bind:value={selectedTaal} on:change={resetSvaras} placeholder="Taal" />
    </div>

    <div class="flex gap-1 flex-wrap justify-center m-10">
        {#each current_svaras as svara}
            <Button color="dark" class="text-lg">{svara}</Button>
        {/each}
    </div>
</main>
<script lang="ts">
    import logo from "$lib/assets/naadgen/logo.png"
    import ragasData from "$lib/data/naadgen/ragas.json"
    import taalsData from "$lib/data/naadgen/taals.json"
    import { Button, Select } from "flowbite-svelte"

    type Raga = {
        vikrit: string[]
        vikrit_shuddha: string[]
        varjya: string[]
        vadi: string
        samvadi: string
    }

    type Taal = number[]

    let ragas: Record<string, Raga> = ragasData
    let taals: Record<string, Taal> = taalsData

    let selectedRaga = 'kafi'
    const raga = Object.keys(ragas).map((k) => ({ value: k, name: k.charAt(0).toUpperCase() + k.slice(1) }))
    
    let selectedTaal = 'deepchandi'
    const taal = Object.keys(taals).map((k) => ({ value: k, name: k.charAt(0).toUpperCase() + k.slice(1) }))

    let svaras: string[]

    function resetSvaras() {
        svaras = ['S', 'R', 'G', 'm', 'P', 'D', 'N']
    }

    resetSvaras()

    $: svaras.forEach(svara => {
        // Remove varjya svaras
        if (ragas[selectedRaga].varjya.includes(svara.toUpperCase())) {
            svaras.splice(svaras.indexOf(svara), 1)
        }

        // // Replace vikrit svar with lowercase to indicate komal, and uppercase to indicate tivra M
        // if (ragas[selectedRaga].vikrit.includes(svara.toUpperCase())) {
        //     svaras[svaras.indexOf(svara)] = svara == "m" ? svara = "M" : svara = svara.toLowerCase()
        // }

        if (ragas[selectedRaga].vikrit_shuddha.includes(svara.toUpperCase())) {
            svaras.splice(svaras.indexOf(svara), 1, svara == "m" ? "a" : ("a", svara.toLowerCase()))
        }
    })
</script>

<main>
    <center>
        <a href="https://megz15.github.io/NaadGen/" target="_blank"><Button class="mt-20 text-lg" color="red">🚧 NaadGen is under construction 🚧<br><br>🚧 Use this site till then 🚧</Button></a>
        <img src={logo} alt="NaadGen">
    </center>
    
    <div class="flex">
        <Select items={raga} bind:value={selectedRaga} on:change={resetSvaras} placeholder="Raga" />
        <Select items={taal} bind:value={selectedTaal} on:change={resetSvaras} placeholder="Taal" />
    </div>

    <div style="background-color: white;">
        {JSON.stringify(svaras)}
    </div>
</main>
<script lang="ts">
    import logo from "$lib/assets/naadgen/logo.png"
    import ragasData from "$lib/data/naadgen/ragas.json"
    import taalsData from "$lib/data/naadgen/taals.json"
    import { Button, Label, NumberInput, Select } from "flowbite-svelte"

    function genSelectData(data: Record<string, Raga | Taal>) {
        return Object.keys(data).map((k) => ({ value: k, name: k.charAt(0).toUpperCase() + k.slice(1) }))
    }

    function resetSvaras() {
        current_svaras = ['S', 'R', 'G', 'm', 'P', 'D', 'N']
    }

    function genFreq(baseFreq: number, n: number) {
        return Math.round( baseFreq*(2**(n/12)) * 1000 ) / 1000
    }

    function genSaptakFreq(shrutis: string[]) {
        return Object.fromEntries(shrutis.map(x => [x, genFreq(baseFreq, shrutis.indexOf(x))]))
    }

    function svaraClick(svara: string) {
        genSine(freqObject[svara])
        bandishSvaras.push(freqObject[svara])
        bandishSvaras = bandishSvaras
    }

    function genSine(freq: number) {

        let audioContext = new AudioContext()

        let sampleRate = audioContext.sampleRate
        let duration = 0.4 * sampleRate
        let numChannels = 1
        let buffer = audioContext.createBuffer(numChannels, duration, sampleRate)

        let channelData = buffer.getChannelData(0)
        for (let i = 0 ; i < sampleRate ; i++) {
            channelData[i] = Math.sin(2 * Math.PI * freq * i / sampleRate)
        }

        let source = audioContext.createBufferSource()
        source.buffer = buffer

        let gainNode = audioContext.createGain()
        source.connect(gainNode)
        gainNode.connect(audioContext.destination)

        let attackTime = 0.1
        let releaseTime = 0.3
        let currentTime = audioContext.currentTime

        gainNode.gain.setValueAtTime(0, currentTime)
        gainNode.gain.linearRampToValueAtTime(1, currentTime + attackTime)
        gainNode.gain.setValueAtTime(1, currentTime + 0.4 - releaseTime)
        gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.4)

        source.start(0)
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

    const shrutis = ['S', 'r', 'R', 'g', 'G', 'm', 'M', 'P', 'd', 'D', 'n', 'N']
    let current_svaras: string[]

    let baseFreq = 220
    let freqObject = genSaptakFreq(shrutis)

    let bandishSvaras: number[] = []

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
        <NumberInput bind:value={baseFreq} on:change={() => freqObject = genSaptakFreq(shrutis)} />
    </div>

    <div class="flex gap-1 flex-wrap justify-center m-10">
        {#each current_svaras as svara}
            <Button color="dark" class="text-lg" on:click={() => svaraClick(svara)}>{svara}</Button>
        {/each}
    </div>

    <div class="mb-10">
        <div class="flex gap-1">
            {#each {length: taals[selectedTaal]["matra"]} as _, i}
                <Button color="dark" class="text-lg w-12">{i + 1}</Button>
            {/each}
        </div>

        <div class="flex flex-wrap gap-1 mt-4">
            {#each bandishSvaras as svara}
                <Button color="dark" class="text-lg w-12 basis-[calc(100%/14)]">{svara}</Button>
            {/each}
        </div>
    </div>
</main>
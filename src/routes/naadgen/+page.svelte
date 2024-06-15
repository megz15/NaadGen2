<script lang="ts">
    import logo from "$lib/assets/naadgen/logo.png"
    import ragasData from "$lib/data/naadgen/ragas.json"
    import taalsData from "$lib/data/naadgen/taals.json"
    import { Button, Input, NumberInput, Popover, Select } from "flowbite-svelte"
    import { onMount, tick } from "svelte"

    let matrasDiv: HTMLDivElement
    let compDiv: HTMLDivElement

    onMount(() => {
        matchDivWidth(compDiv, matrasDiv)
    })

    async function matchDivWidth(e1: HTMLDivElement, e2: HTMLDivElement) {
        if (matrasDiv && compDiv) {
            await tick()
            e1.style.maxWidth = `${e2.clientWidth}px`
        }
    }

    function genSelectData(data: Record<string, Raga | Taal>) {
        return Object.keys(data).map((k) => ({ value: k, name: k.charAt(0).toUpperCase() + k.slice(1) }))
    }

    function resetSvaras() {
        current_svaras = ['S', 'R', 'G', 'm', 'P', 'D', 'N']
    }

    function genFreq(baseFreq: number, n: number) {
        return Math.round( baseFreq*(2**(n/12)) * 1000 ) / 1000
    }

    function genSaptakFreq(shrutis: string[], baseFreq: number) {
        return Object.fromEntries(shrutis.map(x => [x, genFreq(baseFreq, shrutis.indexOf(x))]))
    }

    function svaraClick(svara: string, octave: number) {
        genSine(freqObject[svara] * 2**octave, noteTime)
        bandishSvaras.push([svara, octave])
        bandishSvaras = bandishSvaras
    }

    function genSine(freq: number, noteTime: number) {

        let audioContext = new AudioContext()

        let sampleRate = audioContext.sampleRate
        let duration = noteTime * sampleRate
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

        let attackTime = noteTime / 4
        let releaseTime = noteTime * 3 / 4
        let currentTime = audioContext.currentTime

        gainNode.gain.setValueAtTime(0, currentTime)
        gainNode.gain.linearRampToValueAtTime(1, currentTime + attackTime)
        gainNode.gain.setValueAtTime(1, currentTime + noteTime - releaseTime)
        gainNode.gain.linearRampToValueAtTime(0, currentTime + noteTime)

        source.start(0)
    }

    function playNotes(notes: [string, number][], freqObject: { [x: string]: number }) {
        let totalTime = 0

        notes.forEach(note => {
            setTimeout(() => {
                genSine(freqObject[note[0]] * 2**note[1], noteTime)
            }, totalTime)

            totalTime += noteTime * 500
        })
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

    const noteTime = 0.5
    let octave = 0
    let currBaseFreq = 220
    let freqObject = genSaptakFreq(shrutis, currBaseFreq)

    let bandishSvaras: [string, number][] = []
    let lastRemovedSvara: [string, number] = ["S", 0]

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
    <a href="https://megz15.github.io/NaadGen/" target="_blank"><Button class="text-lg my-5 mx-10" color="red">🚧 NaadGen is under construction 🚧<br><br>🚧 Use this site till then 🚧</Button></a>
    
    <div class="flex gap-2  mx-10">
        <Select items={genSelectData(ragas)} bind:value={selectedRaga} on:change={resetSvaras} placeholder="Raga" />
        <Select items={genSelectData(taals)} bind:value={selectedTaal} on:change={() => matchDivWidth(compDiv, matrasDiv)} placeholder="Taal" />
        <NumberInput bind:value={currBaseFreq} on:change={() => freqObject = genSaptakFreq(shrutis, currBaseFreq)} />
        <Input bind:value={octave} readonly/>
    </div>

    <div class="overflow-x-scroll p-10 max-w-full">

        <div class="w-fit">
            <div class="flex gap-1 mb-1">
                {#each current_svaras as svara}
                    <Button color="dark" class="text-lg w-12" on:click={() => svaraClick(svara, octave)}>{svara}</Button>
                {/each}

                <Button color="green" class="text-lg" on:click={() => {
                    bandishSvaras.push(["-", 0])
                    bandishSvaras = bandishSvaras
                }}>Rest</Button>
            </div>
            
            <div class="flex gap-1 justify-between">
                <Button color="red" class="text-lg w-12" on:click={() => {
                    currBaseFreq/=2
                    octave--
                    // freqObject = genSaptakFreq(shrutis, currBaseFreq)
                }}>-</Button>

                <Button color="green" class="text-lg w-12" on:click={() => {
                    currBaseFreq*=2
                    octave++
                    // freqObject = genSaptakFreq(shrutis, currBaseFreq)
                }}>+</Button>

                <div class="flex-1"/>

                <Button color="red" class="text-lg" on:click={() => {
                    lastRemovedSvara = bandishSvaras.pop() ?? ["S", 0]
                    bandishSvaras = bandishSvaras
                }}>Del</Button>

                <Button color="green" class="text-lg w-12" on:click={() => {
                    bandishSvaras.push(lastRemovedSvara)
                    bandishSvaras = bandishSvaras
                }}>↺</Button>

                <Button color="red" class="text-lg" on:click={() => {
                    bandishSvaras = []
                }}>Clear</Button>

                <Button color="green" class="text-lg w-12" on:click={() => {
                    playNotes(bandishSvaras, freqObject)
                }}>▶</Button>
            </div>
        </div>

        <div class="flex gap-1 py-4" bind:this={matrasDiv}>
            {#each {length: taals[selectedTaal]["matra"]} as _, i}
                <Button color="dark" class="text-lg w-12">{i + 1}</Button>
            {/each}
        </div>

        <div class="flex flex-wrap gap-1" bind:this={compDiv}>
            {#each bandishSvaras as svara}
                <Button color="dark" on:click={
                    () => alert(svara)
                } class="text-lg w-12">{
                    svara[1]?svara[0]:svara[0]
                }</Button>

                <Popover>Note: {svara[0]}<br>Octave: {svara[1]}</Popover>
            {/each}
        </div>

    </div>
</main>
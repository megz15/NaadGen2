<script lang="ts">
    import logo from "$lib/assets/naadgen/logo.png"
    import ragasData from "$lib/data/naadgen/ragas.json"
    import taalsData from "$lib/data/naadgen/taals.json"
    import { Button, Input, NumberInput, Popover, Select, Modal, Checkbox, Fileupload } from "flowbite-svelte"
    import { onMount, tick } from "svelte"

    let matrasDiv: HTMLDivElement
    let compDiv: HTMLDivElement
    let importFileInput: HTMLInputElement

    onMount(() => {
        matchDivWidth(compDiv, matrasDiv)
    })

    async function matchDivWidth(e1: HTMLDivElement, e2: HTMLDivElement) {
        if (e1 && e2) {
            await tick()
            e1.style.width = `${e2.scrollWidth}px`
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
        bandishSvaras.push([[svara, octave]])
        bandishSvaras = bandishSvaras
    }

    function genSine(freq: number, noteTime: number, volume = 1) {

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

        gainNode.gain.value = volume

        let attackTime = noteTime / 4
        let releaseTime = noteTime * 3 / 4
        let currentTime = audioContext.currentTime

        gainNode.gain.setValueAtTime(0, currentTime)
        gainNode.gain.linearRampToValueAtTime(volume, currentTime + attackTime)
        gainNode.gain.setValueAtTime(volume, currentTime + noteTime - releaseTime)
        gainNode.gain.linearRampToValueAtTime(0, currentTime + noteTime)

        source.start(0)
    }

    function playNotes(notes: [[string, number]][], startIndex = 0, endIndex = -1) {
        let totalTime = 0

        notes.slice(startIndex, endIndex == -1 ? notes.length : endIndex + 1).forEach((note, i) => {
            const volume = (
                taals[selectedTaal]["tali"].includes(i % taals[selectedTaal]["matra"])
            || taals[selectedTaal]["khali"].includes(i % taals[selectedTaal]["matra"])
            ) ? 2 : 1
            
            const noteDuration = tempoMS / note.length

            note.forEach(split => {
                setTimeout(() => {
                    if (split[0] != "-") genSine(freqObject[split[0]] * 2**split[1], noteTime / note.length, volume)
                    document.getElementById(`comp-${startIndex + i}`)?.classList.add("bg-yellow-400")
                    document.getElementById(`comp-${startIndex + i - 1}`)?.classList.remove("bg-yellow-400")
                }, totalTime)
                
                totalTime += noteDuration
            })
        })

        setTimeout(() => {
            document.getElementById(`comp-${notes.length - 1}`)?.classList.remove("bg-yellow-400")
        }, totalTime)

        if (isPlaybackLooped) {
            setTimeout(() => {
                playNotes(notes, startIndex, endIndex)
            }, totalTime)
        }
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

    let noteTime = 0.25
    let tempoMS = 200

    let octave = 0
    let currBaseFreq = 220
    let freqObject = genSaptakFreq(shrutis, currBaseFreq)

    let bandishSvaras: [[string, number]][] = []
    let lastRemovedSvara: [[string, number]] = [["S", 0]]

    let isPlaybackLooped = false
    let isPlaybackPaused = false
    let startIndex = 0
    let endIndex = -1

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

    let noteEditModal = false
    let noteModalNoteIndex = 0

    function openNoteModal(i: number): void {
        noteEditModal = true
        noteModalNoteIndex = i
    }

    function handleFileInput(e: Event) {
        let input = e.target as HTMLInputElement
        
        if (input.files && input.files[0]) {
            let reader = new FileReader()
            reader.onload = function(){
                bandishSvaras = JSON.parse(reader.result as string)
            }
            reader.readAsText(input.files[0])
        }
    }
</script>

<main class="flex flex-col items-center">

    <img src={logo} width="500px" alt="NaadGen" />
    
    <a href="https://megz15.github.io/NaadGen/" target="_blank">
        <Button class="m-5 text-black" color="yellow">
            Visit predecessor site!
        </Button>
    </a>
    
    <div class="flex gap-2 flex-wrap justify-center">

        <div class="flex gap-1 p-5 bg-[#1d2230b9] rounded-lg backdrop-blur shadow shadow-black border-2 border-gray-400">
            <div class="flex flex-col w-44 gap-0.5">
                <Select items={genSelectData(ragas)} bind:value={selectedRaga} on:change={resetSvaras} placeholder="Raga" />
                <Select items={genSelectData(taals)} bind:value={selectedTaal} on:change={() => matchDivWidth(compDiv, matrasDiv)} placeholder="Taal" />
                <Checkbox bind:checked={isPlaybackLooped} class="text-white mt-2 text-lg">Loop Playback</Checkbox>
            </div>

            <div class="flex flex-col w-24 gap-0.5">
                <NumberInput bind:value={currBaseFreq} on:change={() => freqObject = genSaptakFreq(shrutis, currBaseFreq)} />
                <NumberInput bind:value={tempoMS} />
                <NumberInput bind:value={noteTime} />
            </div>
        </div>

        <div class="flex flex-col gap-1 justify-around p-5 bg-[#1d2230b9] rounded-lg backdrop-blur shadow shadow-black border-2 border-gray-400">
            <Button on:click={() => {
                
                const blob = new Blob([JSON.stringify(bandishSvaras)])
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement("a")
                
                a.href = url
                a.download = `${selectedRaga}_${selectedTaal}_${new Date().toISOString().replaceAll(':','-')}.ng`
                a.click()
                window.URL.revokeObjectURL(url)
            
            }}>Export</Button>
            
            <input type="file" accept='.ng,.ngr' bind:this={importFileInput} on:change={handleFileInput} class="hidden" />
            <Button on:click={
                () => importFileInput.click()
            }>Import</Button>
        </div>

    </div>

    <div class="overflow-x-scroll p-5 max-w-full">

        <div class="w-fit">
            <div class="flex gap-1 mb-1">
                {#each current_svaras as svara}
                    <Button color="dark" class="text-lg w-12" on:click={() => svaraClick(svara, octave)}>{svara}</Button>
                {/each}

                <div class="flex-1"/>

                <Button color="green" class="text-lg" on:click={() => {
                    bandishSvaras.push([["-", 0]])
                    bandishSvaras = bandishSvaras
                }}>Rest</Button>
            </div>
            
            <div class="flex gap-1 justify-between">
                <Button color="red" class="text-lg w-12" on:click={() => {
                    currBaseFreq/=2
                    octave--
                    // freqObject = genSaptakFreq(shrutis, currBaseFreq)
                }}>-</Button>

                <Input bind:value={octave} size="lg" floatClass="w-12" defaultClass="w-12" readonly/>

                <Button color="green" class="text-lg w-12" on:click={() => {
                    currBaseFreq*=2
                    octave++
                    // freqObject = genSaptakFreq(shrutis, currBaseFreq)
                }}>+</Button>

                <div class="flex-1"/>

                <Button color="red" class="text-lg" on:click={() => {
                    lastRemovedSvara = bandishSvaras.pop() ?? [["S", 0]]
                    bandishSvaras = bandishSvaras
                }}>Del</Button>

                <Button color="green" class="text-lg w-12" on:click={() => {
                    bandishSvaras.push(lastRemovedSvara)
                    bandishSvaras = bandishSvaras
                }}>↺</Button>

                <Button color="red" class="text-lg" on:click={() => {
                    bandishSvaras = []
                    lastRemovedSvara = [["S", 0]]
                    
                    currBaseFreq = 220
                    octave = 0

                    noteTime = 0.25
                    tempoMS = 200
                }}>Clear</Button>

                <Button color="green" class="text-lg w-12" on:click={() => {
                    playNotes(bandishSvaras, startIndex, endIndex)
                }}>▶</Button>
            </div>
        </div>

        <div class="flex gap-1 py-4 w-fit" bind:this={matrasDiv}>
            {#each {length: taals[selectedTaal]["matra"]} as _, i}
                <Button color={
                    taals[selectedTaal]["tali"].includes(i) ? "alternative" : taals[selectedTaal]["khali"].includes(i) ? "primary" : "dark"
                } class="text-lg w-12">{i + 1}</Button>
            {/each}
            <div class="pr-10"></div>
        </div>

        <div class="flex flex-wrap gap-1" bind:this={compDiv}>
            {#each bandishSvaras as svaras, i}
                {@const svaraLabel = svaras.map(svara => svara[0])}
                <Button id={`comp-${i}`} color={
                    taals[selectedTaal]["tali"].includes(i % taals[selectedTaal]["matra"]) ? "alternative" : taals[selectedTaal]["khali"].includes(i % taals[selectedTaal]["matra"]) ? "primary" : "dark"
                } on:click={
                    () => openNoteModal(i)
                } class="text-lg w-12">{
                    svaraLabel.join("").length > 4 ? svaraLabel.splice(0,1) + ".." : svaraLabel.join("")
                }</Button>

                <Popover>Note: {svaras.map(svara => svara[0])}<br>Octave: {svaras.map(svara => svara[1])}</Popover>
            {/each}
        </div>

    </div>
</main>

<Modal title="Note Control Panel" bind:open={noteEditModal} size="xs" class="w-2/3">
    <div class="flex justify-between gap-1">
        <div class="flex flex-col gap-1">
            {#each bandishSvaras[noteModalNoteIndex] as svaras, i}
                <div class="flex">
                    <Input bind:value={svaras[0]} floatClass="w-12" defaultClass="w-12"/>
                    <Input bind:value={svaras[1]} floatClass="w-12" defaultClass="w-12"/>
                    <span>&nbsp;</span>
                    <Button color="red" class="w-12" on:click={() => {
                        if (bandishSvaras[noteModalNoteIndex].length > 1) {
                            bandishSvaras[noteModalNoteIndex].splice(i, 1)
                            bandishSvaras = bandishSvaras
                        } else alert("Can't delete base note!")
                    }}>🗑️</Button>
                </div>
            {/each}
        </div>
        
        <div class="flex flex-col gap-1">
            <Button on:click={() => {
                bandishSvaras[noteModalNoteIndex].push([...bandishSvaras[noteModalNoteIndex][bandishSvaras[noteModalNoteIndex].length - 1]])
                bandishSvaras = bandishSvaras
            }}>Split</Button>

            <Button on:click={() => {
                bandishSvaras[noteModalNoteIndex] = [bandishSvaras[noteModalNoteIndex][0]]
                bandishSvaras = bandishSvaras
            }}>Clear</Button>

            <Button on:click={() => {
                document.getElementById(`comp-${startIndex}`)?.classList.remove("bg-lime-500")
                startIndex = noteModalNoteIndex
                document.getElementById(`comp-${startIndex}`)?.classList.add("bg-lime-500")
            }}>Mark Start</Button>
            
            <Button on:click={() => {
                document.getElementById(`comp-${endIndex}`)?.classList.remove("bg-lime-800")
                endIndex = noteModalNoteIndex
                document.getElementById(`comp-${endIndex}`)?.classList.add("bg-lime-800")
            }}>Mark End</Button>
        </div>
    </div>
</Modal>
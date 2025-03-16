<svelte:head>
    <title>NaadGen</title> 
</svelte:head>

<script lang="ts">
    import { genSine, genSaptakFreq } from "$lib/utils/audioUtils"
    import type { Raga, Taal } from "$lib/types/types"
    import { onMount, tick } from "svelte"
    
    import logo from "$lib/data/logo.png"
    import ragasData from "$lib/data/ragas.json"
    import taalsData from "$lib/data/taals.json"

    // break down and move components after removing dependency on flowbite-svelte

    let matrasDiv: HTMLDivElement
    let compDiv: HTMLDivElement
    let importFileInput: HTMLInputElement

    let cardClasses = "flex gap-1 p-4 bg-[#1d2230b9] rounded-lg backdrop-blur shadow shadow-black border-2 border-gray-400 "

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

    function svaraClick(svara: string, octave: number) {
        genSine(freqObject[svara] * 2**octave, noteTime, noteVolume)
        bandishSvaras.push([[svara, octave]])
        bandishSvaras = bandishSvaras
    }

    function playNotes(notes: [[string, number]][], startIndex: number) {
        let totalTime = 0
        isPlaybackStopped = false

        notes.forEach((note, i) => {
            const volume = noteVolume * ((
                taals[selectedTaal]["tali"].includes(i % taals[selectedTaal]["matra"])
            || taals[selectedTaal]["khali"].includes(i % taals[selectedTaal]["matra"])
            ) ? 2 : 1)
            
            const noteDuration = (60000/tempoBPM) / note.length

            note.forEach(split => {
                const noteTimeout = setTimeout(() => {
                    if (!isPlaybackStopped) {
                        if (split[0] != ".") genSine(freqObject[split[0]] * 2**split[1], noteTime / note.length, volume)
                        document.getElementById(`comp-${startIndex + i}`)?.classList.add("bg-yellow-400")
                        document.getElementById(`comp-${startIndex + i - 1}`)?.classList.remove("bg-yellow-400")
                    }
                }, totalTime)
                
                playbackTimeouts.push(noteTimeout)
                totalTime += noteDuration
            })
        })

        setTimeout(() => {
            document.getElementById(`comp-${notes.length + startIndex - 1}`)?.classList.remove("bg-yellow-400")
        }, totalTime)

        if (isPlaybackLooped) {
            const loopedNoteTimeout = setTimeout(() => {
                if (!isPlaybackStopped) playNotes(notes, startIndex)
            }, totalTime)

            playbackTimeouts.push(loopedNoteTimeout)
        }
    }

    function stopPlayback() {
        isPlaybackStopped = true
        playbackTimeouts.forEach(timeout => clearTimeout(timeout))
        playbackTimeouts = []
    }

    const ragas: Record<string, Raga> = ragasData
    const taals: Record<string, Taal> = taalsData

    let selectedRaga = 'kafi'    
    let selectedTaal = 'deepchandi'

    const shrutis = ['S', 'r', 'R', 'g', 'G', 'm', 'M', 'P', 'd', 'D', 'n', 'N']
    let current_svaras: string[]

    let noteTime = 0.25
    const tempoMS = 200
    let tempoBPM = 60000 / tempoMS
    let noteVolume = 100

    let octave = 0
    let currBaseFreq = 220
    let freqObject = genSaptakFreq(shrutis, currBaseFreq)

    let bandishSvaras: [[string, number]][] = []
    let lastRemovedSvara: [[string, number]] = [["S", 0]]

    let playbackTimeouts: number[] = []
    let isPlaybackLooped = false
    let isPlaybackStopped = true
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
            reader.onload = function() {
                const data = JSON.parse(reader.result as string)
                
                selectedRaga = data["raga"]
                selectedTaal = data["taal"]
                matchDivWidth(compDiv, matrasDiv)
                
                currBaseFreq = data["freq"]
                freqObject = genSaptakFreq(shrutis, currBaseFreq)

                tempoBPM = data["tempo"]
                noteTime = data["noteTime"]
                
                bandishSvaras = data["bandish"]
            }
            reader.readAsText(input.files[0])
        }
    }
</script>

<main class="flex flex-col items-center">

    <img src={logo} width="500px" alt="NaadGen" />
    
    <a href="https://megz15.github.io/NaadGen/" target="_blank">
        <button class="text-black bg-yellow-400 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-5">
            Visit predecessor site!
        </button>
    </a>
    
    <div class="flex gap-4 justify-center items-stretch px-1">

        <div class={cardClasses + "flex-col justify-between"}>
            <div class="flex flex-col gap-1">
                
                    <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" bind:value={selectedRaga} on:change={resetSvaras}>
                        <option selected disabled>Raga</option>
                        {#each genSelectData(ragas) as raga}
                        <option value={raga.value}>{raga.name}</option>
                        {/each}
                    </select>

                    <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" bind:value={selectedTaal} on:change={() => matchDivWidth(compDiv, matrasDiv)}>
                        <option selected disabled>Taal</option>
                        {#each genSelectData(taals) as taal}
                        <option value={taal.value}>{taal.name}</option>
                        {/each}
                    </select>

            </div>
            
            <div class="flex gap-2 my-2 justify-between">
                <button class="text-black bg-blue-400 font-medium rounded-lg text-sm px-5 py-2.5" on:click={() => {
                
                    const blob = new Blob([JSON.stringify({
                        "raga": selectedRaga,
                        "taal": selectedTaal,
                        "freq": currBaseFreq,
                        "tempo": tempoBPM,
                        "noteTime": noteTime,
                        "bandish": bandishSvaras
                    })])
                    const url = window.URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    
                    a.href = url
                    a.download = `${selectedRaga}_${selectedTaal}_${new Date().toISOString().replaceAll(':','-')}.ng`
                    a.click()
                    window.URL.revokeObjectURL(url)
                
                }}>Export</button>
                
                <input type="file" accept='.ng,.ngr' bind:this={importFileInput} on:change={handleFileInput} class="hidden" />
                <button class="text-black bg-blue-400 font-medium rounded-lg text-sm px-5 py-2.5" on:click={
                    () => importFileInput.click()
                }>Import</button>
            </div>

            <div class="flex gap-2">
                <div class="text-white">Loop Playback</div>
                <input type="checkbox" bind:checked={isPlaybackLooped} class="text-white"/>
            </div>
        </div>

        <div class={cardClasses + "flex-col"}>
            <div>
                <div class="text-white">Frequency: {currBaseFreq} Hz</div>
                <input type="range" min=20 max=1000 bind:value={currBaseFreq} on:change={() => freqObject = genSaptakFreq(shrutis, currBaseFreq)} class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
            </div>

            <div>
                <div class="text-white">Tempo: {tempoBPM} BPM</div>
                <input type="range" min=20 max=1000 bind:value={tempoBPM} class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
            </div>

            <div>
                <div class="text-white">Note Duration: {noteTime} Sec</div>
                <input type="range" min=0.05 max=1 step=0.01 bind:value={noteTime} class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
            </div>

            <div>
                <div class="text-white">Volume: {noteVolume}%</div>
                <input type="range" min=0 max=200 bind:value={noteVolume} class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
            </div>
        </div>

    </div>

    <div>
        <button class="text-black bg-lime-500 font-medium rounded-lg text-lg px-5 py-2.5 me-2 mt-5 border-2" on:click={() => {
            playNotes(endIndex == -1 ? bandishSvaras.slice(startIndex) : bandishSvaras.slice(startIndex, endIndex + 1), startIndex)
        }}>▶️ Play</button>

        <button class="text-black bg-red-500 font-medium rounded-lg text-lg px-5 py-2.5 me-2 mt-5 border-2" on:click={() => {
            stopPlayback()
        }}>⏸ Stop</button>
    </div>

    <div class="overflow-x-scroll p-5 max-w-full">

        <div class="w-fit">
            <div class="flex gap-1 mb-1">
                {#each current_svaras as svara}
                    <button class="text-lg w-12 text-black bg-gray-200 font-medium rounded-lg px-5 py-2.5" on:click={() => svaraClick(svara, octave)}>{svara}</button>
                {/each}

                <div class="flex-1"/>

                <button class="text-lg text-black bg-green-500 font-medium rounded-lg px-5 py-2.5" on:click={() => {
                    bandishSvaras.push([[".", 0]])
                    bandishSvaras = bandishSvaras
                }}>Rest</button>
            </div>
            
            <div class="flex gap-1 justify-between">
                <button class="text-lg w-12 text-black bg-red-500 font-medium rounded-lg px-5 py-2.5" on:click={() => {
                    currBaseFreq/=2
                    octave--
                    // freqObject = genSaptakFreq(shrutis, currBaseFreq)
                }}>-</button>

                <input bind:value={octave} class="w-12 bg-gray-50 border-2 text-black text-sm rounded-lg p-2.5" readonly/>

                <button class="text-lg w-12 text-black bg-green-500 font-medium rounded-lg px-5 py-2.5" on:click={() => {
                    currBaseFreq*=2
                    octave++
                    // freqObject = genSaptakFreq(shrutis, currBaseFreq)
                }}>+</button>

                <div class="flex-1"/>

                <button class="text-lg text-black bg-red-500 font-medium rounded-lg px-5 py-2.5" on:click={() => {
                    lastRemovedSvara = bandishSvaras.pop() ?? [["S", 0]]
                    bandishSvaras = bandishSvaras
                }}>Del</button>

                <button class="text-lg w-12 text-black bg-green-500 font-medium rounded-lg px-5 py-2.5" on:click={() => {
                    bandishSvaras.push(lastRemovedSvara)
                    bandishSvaras = bandishSvaras
                }}>↺</button>

                <button class="text-lg text-black bg-red-500 font-medium rounded-lg px-5 py-2.5" on:click={() => {
                    bandishSvaras = []
                    lastRemovedSvara = [["S", 0]]
                    
                    currBaseFreq = 220
                    octave = 0

                    noteTime = 0.25
                    tempoBPM = 60000 / tempoMS
                }}>Clear</button>
            </div>
        </div>

        <div class="flex gap-1 py-4 w-fit" bind:this={matrasDiv}>
            {#each {length: taals[selectedTaal]["matra"]} as _, i}
                <button 
                    class="text-lg w-12 font-medium rounded-lg py-2.5 
                        {taals[selectedTaal]['tali'].includes(i) ? 'bg-gray-200 text-black' : 
                        taals[selectedTaal]['khali'].includes(i) ? 'bg-blue-500 text-white' : 
                        'bg-gray-600 text-white'}">
                    {i + 1}
                </button>
            {/each}
            <div class="pr-10"></div>
        </div>

        <div class="flex flex-wrap gap-1" bind:this={compDiv}>
            {#each bandishSvaras as svaras, i}
                {@const svaraLabel = svaras.map(svara => svara[0])}
                <button 
                    id={`comp-${i}`} 
                    class="text-lg w-12 font-medium rounded-lg py-2.5 
                        {taals[selectedTaal]['tali'].includes(i % taals[selectedTaal]['matra']) ? 'bg-gray-400 text-black' : 
                        taals[selectedTaal]['khali'].includes(i % taals[selectedTaal]['matra']) ? 'bg-blue-500 text-white' : 
                        'bg-gray-900 text-white'}"
                    on:click={() => openNoteModal(i)}
                >
                    {svaraLabel.join("").length > 4 ? svaraLabel.splice(0,1) + ">" : svaraLabel.join("")}
                </button>

                <!-- <Popover>Note: {svaras.map(svara => svara[0])}<br>Octave: {svaras.map(svara => svara[1])}</Popover> -->
            {/each}
        </div>

    </div>
</main>

<div
    class={`fixed bottom-0 z-50 p-5 m-2 rounded-lg bg-[#1d2230b9] backdrop-blur shadow shadow-black border-2 border-gray-400 text-white`} class:hidden={!noteEditModal}
>
    <h1 class="text-xl mb-8">🚧 Note Control Panel</h1>
    <button class="absolute top-4 right-4 text-2xl text-white" on:click={() => noteEditModal = false}>❌</button>

    <div class="flex justify-between gap-1">
        <div class="flex flex-col gap-1">
            {#each bandishSvaras[noteModalNoteIndex] as svaras, i}
                <div class="flex">
                    <input bind:value={svaras[0]} class="w-12 bg-gray-50 border-2 text-black text-sm rounded-lg p-2.5"/>
                    <input bind:value={svaras[1]} class="w-12 bg-gray-50 border-2 text-black text-sm rounded-lg p-2.5"/>
                    <button class="text-lg text-white w-12 bg-red-700 font-medium rounded-lg py-2.5 ml-1 mr-2" on:click={() => {
                        if (bandishSvaras[noteModalNoteIndex].length > 1) {
                            bandishSvaras[noteModalNoteIndex].splice(i, 1)
                            bandishSvaras = bandishSvaras
                        } else alert("Can't delete base note!")
                    }}>🗑️</button>
                </div>
            {/each}
        </div>
        
        <div class="flex flex-col gap-1 pr-5">
            <button class="text-black bg-blue-400 font-medium rounded-lg text-sm px-5 py-2.5" on:click={() => {
                bandishSvaras[noteModalNoteIndex].push([...bandishSvaras[noteModalNoteIndex][bandishSvaras[noteModalNoteIndex].length - 1]])
                bandishSvaras = bandishSvaras
            }}>Split</button>

            <button class="text-black bg-blue-400 font-medium rounded-lg text-sm px-5 py-2.5" on:click={() => {
                bandishSvaras[noteModalNoteIndex] = [bandishSvaras[noteModalNoteIndex][0]]
                bandishSvaras = bandishSvaras
            }}>Clear</button>

            <button class="text-black bg-blue-400 font-medium rounded-lg text-sm px-5 py-2.5" on:click={() => {
                document.getElementById(`comp-${startIndex}`)?.classList.remove("bg-lime-500")
                startIndex = noteModalNoteIndex
                document.getElementById(`comp-${startIndex}`)?.classList.add("bg-lime-500")
            }}>Mark Start</button>
            
            <button class="text-black bg-blue-400 font-medium rounded-lg text-sm px-5 py-2.5" on:click={() => {
                document.getElementById(`comp-${endIndex}`)?.classList.remove("bg-lime-800")
                endIndex = noteModalNoteIndex
                document.getElementById(`comp-${endIndex}`)?.classList.add("bg-lime-800")
            }}>Mark End</button>
        </div>
    </div>
</div>
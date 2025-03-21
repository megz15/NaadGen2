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
        return Object.keys(data).sort().map((k) => ({ value: k, name: k.charAt(0).toUpperCase() + k.slice(1) }))
    }

    function resetSvaras() {
        current_svaras = ['S', 'R', 'G', 'm', 'P', 'D', 'N']

        current_svaras.forEach(svara => {
            // Remove varjya svaras
            current_svaras = current_svaras.filter(svara => !ragas[selectedRaga].varjya.includes(svara.toUpperCase()))

            // Add vikrit shudhh svaras
            if (ragas[selectedRaga].vikrit_shuddha.includes(svara)) {
                current_svaras.splice(current_svaras.indexOf(svara), 1, svara.toLowerCase(), svara.toUpperCase())
            } else if (ragas[selectedRaga].vikrit.includes(svara)) {
                current_svaras.splice(current_svaras.indexOf(svara), 1, svara.toUpperCase() == svara ? svara.toLowerCase() : svara.toUpperCase())
            }
        })
    }

    function svaraClick(svara: string, octave: number) {
        genSine(freqObject[svara] * 2**octave, noteTime, noteVolume)
        currentBandishSectionSvaras.push([[svara, octave]])
        currentBandishSectionSvaras = currentBandishSectionSvaras
    }

    function playNotes(notes: [[string, number]][], startIndex: number) {
        if (notes.length == 0) return

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
                        if (split[0] != "." && shrutis.includes(split[0])) {
                            genSine(freqObject[split[0]] * 2**split[1], noteTime / note.length, volume)
                        }
                        document.getElementById(`comp-${startIndex + i}`)?.classList.add("bg-yellow-400")
                        document.getElementById(`comp-${startIndex + i - 1}`)?.classList.remove("bg-yellow-400")
                    }
                }, totalTime)
                
                playbackTimeouts.push(noteTimeout)
                totalTime += noteDuration
            })
        })

        const finalTimeout = setTimeout(() => {
            document.getElementById(`comp-${notes.length + startIndex - 1}`)?.classList.remove("bg-yellow-400")
            if (!isPlaybackLooped) {
                stopPlayback()
            }
        }, totalTime)

        playbackTimeouts.push(finalTimeout)

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

        if (Array.from(document.querySelectorAll("[id^='comp-']")).every(note => note.classList.contains("bg-yellow-400"))) {
            alert("and it was all yellow... 🎶")
        }
    }

    function addSection() {
        const sectionName = prompt("Enter new section name", "New Section")
        if (!sectionName) return
        bandishSections.push({sectionName: sectionName, svaras: []})
        bandishSections = bandishSections
        currentSection = sectionName
    }

    function deleteSection(sectionName: string) {
        if (bandishSections.length > 1) {
            if (confirm(`Are you sure you want to delete section "${sectionName}"?`)) {
                bandishSections = bandishSections.filter(section => section.sectionName != sectionName)
                currentSection = bandishSections[0].sectionName
            } else alert(`Section "${sectionName}" hath been spared from the sword of deletion!`)
        } else alert("Can't delete all sections!")
    }

    function renameSection(sectionName: string) {
        const renameToName = prompt("Enter new section name", sectionName)
        if (renameToName) {
            bandishSections.find(section => section.sectionName === sectionName).sectionName = renameToName
            bandishSections = bandishSections
            currentSection = renameToName
        }
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

    let bandishSections = [{sectionName: "Default", svaras: []}]
    let currentSection = "Default"

    // let bandishSvaras: [[string, number]][] = bandishSections[0].svaras
    $: currentBandishSectionSvaras = bandishSections.find(section => section.sectionName === currentSection).svaras
    let lastRemovedSvara: [[string, number]] = [["S", 0]]

    let playbackTimeouts: number[] = []
    let isPlaybackLooped = false
    let isPlaybackStopped = true
    let startIndex = 0
    let endIndex = -1

    resetSvaras()

    let aboutModal = false
    let noteEditModal = false
    let noteModalNoteIndex = 0

    function openNoteModal(i: number) {
        noteEditModal = true
        noteModalNoteIndex = i
    }

    function handleFileInput(e: Event) {
        const input = e.target as HTMLInputElement
        
        if (input.files && input.files[0]) {
            const reader = new FileReader()
            reader.onload = function() {
                const data = JSON.parse(reader.result as string)
                
                selectedRaga = data["raga"]
                selectedTaal = data["taal"]
                resetSvaras()
                matchDivWidth(compDiv, matrasDiv)
                
                currBaseFreq = data["freq"]
                freqObject = genSaptakFreq(shrutis, currBaseFreq)

                tempoBPM = data["tempo"]
                noteTime = data["noteTime"]
                
                bandishSections = data["totalBandish"]
            }
            reader.readAsText(input.files[0])
        }
    }

    function focusOnSelectedNoteRange(startIndex: number, endIndex: number) {
        for (let i = 0; i < currentBandishSectionSvaras.length; i++) {
            const note = document.getElementById(`comp-${i}`)
            
            if (i >= startIndex && i <= (endIndex == -1 ? currentBandishSectionSvaras.length : endIndex)) {
                note?.classList.remove("opacity-10")
            } else {
                note?.classList.add("opacity-10")
            }
        }    
        
        document.getElementById(`comp-${startIndex}`)?.classList.remove("opacity-10")
    }

    function clearSelection() {
        startIndex = 0
        endIndex = -1
        focusOnSelectedNoteRange(startIndex, endIndex)
    }
</script>

<main class="flex flex-col items-center">

    <!-- IntroModal -->
    <div
        class={`h-fit max-h-3/4 fixed top-0 left-0 z-50 p-5 m-2 rounded-lg bg-[#1d2230b9] backdrop-blur shadow shadow-black border-2 border-gray-400 text-white sm:w-1/2 lg:w-1/3 overflow-auto [&>p:not(:last-child)]:mb-8 transition-opacity duration-1000 ease-in-out ${
            aboutModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
    >
        <div class="flex justify-between items-center mb-4">
            <div class="text-2xl font-bold">🚧 NaadGen v2 🚧</div>
            <button class="text-2xl" on:click={() => aboutModal = false}>❌</button>
        </div>

        <p>Welcome to NaadGen! I'm excited to share this as it is nearing completion (finally). As a solo developer in my 3rd year who also recently got reality-checked by the release of midsemester gradings, it takes time and effort to bring forth a polished experience, so please bear with me 🐻</p>
        <p>I hope you enjoy using this as much as I did making it! If you find bugs or have suggestions for improvement, reach out via a GitHub issue by <a href="https://github.com/megz15/NaadGen2/issues" class="text-blue-900 font-semibold bg-blue-100 py-0.5 px-2 rounded" target="_blank"><nobr>clicking here</nobr></a></p>
        <p>Check out some of my other projects in this domain,<br><a href="https://play.google.com/store/apps/details?id=megh.dailyraga" class="text-blue-900 font-semibold bg-blue-100 py-0.5 px-2 rounded" target="_blank">DailyRaga</a> and <a href="https://swaranjali.vercel.app/" class="text-blue-900 font-semibold bg-blue-100 py-0.5 px-2 rounded" target="_blank"><nobr>Swaranjali Web</nobr></a></p>
        <p>~ Meghraj</p>
    </div>

    <img src={logo} width="300px" alt="NaadGen" class="drop-shadow-[0_0_5em_#A71B28] mt-5" />
    
    <div class="flex flex-wrap justify-center gap-4 mt-5 mb-2">
        <a href="https://megz15.github.io/NaadGen/" target="_blank">
            <button class="text-black bg-yellow-400 font-medium rounded-lg text-sm px-5 py-2.5 hover:scale-105 active:scale-95 border-2 hover:border-2 hover:border-white hover:shadow-yellow-400/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200">
                Visit Old site!
            </button>
        </a>

        <button class="text-black bg-yellow-400 font-medium rounded-lg text-sm px-5 py-2.5 hover:scale-105 active:scale-95 border-2 hover:border-2 hover:border-white hover:shadow-yellow-400/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200" on:click={() => {
            aboutModal = true
        }}>How to Use</button>

        <button class="text-black bg-yellow-400 font-medium rounded-lg text-sm px-5 py-2.5 hover:scale-105 active:scale-95 border-2 hover:border-2 hover:border-white hover:shadow-yellow-400/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200" on:click={() => {
            aboutModal = true
        }}>About</button>
    </div>
    
    <div class="flex flex-col m-5 gap-2 max-sm:gap-3">
        <div class="flex flex-wrap gap-2 max-sm:gap-3">
            <div class="relative flex gap-1 p-4 pt-5 bg-[#1d2230b9] rounded-lg backdrop-blur shadow shadow-black border-2 border-gray-400 flex-col justify-between max-sm:w-full opacity-{isPlaybackStopped ? 100 : 10} pointer-events-{isPlaybackStopped ? 'auto' : 'none'}">
                <div class="absolute -top-2 text-sm font-semibold bg-[#1d2230] text-white px-2 rounded-lg border border-gray-400">🔧 Control Panel:</div>

                <div class="flex flex-col gap-1">
                    <select class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 placeholder-gray-400 hover:border-white hover:shadow-gray-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 w-full" bind:value={selectedRaga} on:change={resetSvaras}>
                        <option selected disabled>Raga</option>
                        {#each genSelectData(ragas) as raga}
                            <option value={raga.value}>{raga.name}</option>
                        {/each}
                    </select>
                    <select class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 placeholder-gray-400 hover:border-white hover:shadow-gray-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200 w-full" bind:value={selectedTaal} on:change={() => matchDivWidth(compDiv, matrasDiv)}>
                        <option selected disabled>Taal</option>
                        {#each genSelectData(taals) as taal}
                            <option value={taal.value}>{taal.name}</option>
                        {/each}
                    </select>
                </div>
                
                <div class="flex flex-col gap-1 my-2">
                    <button class="text-black bg-blue-400 font-medium rounded-lg text-sm px-5 py-2.5 hover:scale-105 active:scale-95 border-2 hover:border-2 hover:border-white hover:shadow-blue-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200" on:click={() => {
                    
                        const blob = new Blob([JSON.stringify({
                            "raga": selectedRaga,
                            "taal": selectedTaal,
                            "freq": currBaseFreq / 2**octave,
                            "tempo": tempoBPM,
                            "noteTime": noteTime,
                            "totalBandish": bandishSections,
                        })])
                        const url = window.URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        
                        a.href = url
                        a.download = `${selectedRaga}_${selectedTaal}_${new Date().toISOString().replaceAll(':','-')}.ng`
                        a.click()
                        window.URL.revokeObjectURL(url)
                    
                    }}>Export</button>
                    
                    <input type="file" accept='.ng,.ngr' bind:this={importFileInput} on:change={handleFileInput} class="hidden" />
                    <button class="text-black bg-blue-400 font-medium rounded-lg text-sm px-5 py-2.5 hover:scale-105 hover:text-white active:scale-95 border-2 hover:border-2 hover:border-white hover:shadow-blue-500/50 hover:shadow-[0_0_20px_5px] transition-all duration-200" on:click={
                        () => importFileInput.click()
                    }>Import</button>
                </div>

                <div class="flex gap-2">
                    <div class="text-white">Loop Playback</div>
                    <input type="checkbox" bind:checked={isPlaybackLooped} class="text-white"/>
                </div>
            </div>

            <div class="relative flex grow gap-1 p-4 pt-5 bg-[#1d2230b9] rounded-lg backdrop-blur shadow shadow-black border-2 border-gray-400 flex-col max-sm:w-full opacity-{isPlaybackStopped ? 100 : 10} pointer-events-{isPlaybackStopped ? 'auto' : 'none'}">
                <div class="absolute -top-2 text-sm font-semibold bg-[#1d2230] text-white px-2 rounded-lg border border-gray-400">🎚️ Playback:</div>
                <div>
                    <div class="flex items-center justify-between gap-2">
                        <div class="text-white">Frequency (Hz)</div>
                        <input type="number" bind:value={currBaseFreq} class="w-20 bg-gray-50 border-2 text-black text-sm rounded-lg px-2 py-1"/>
                    </div>
                    <input type="range" min=20 max=1000 step=10 bind:value={currBaseFreq} on:change={() => freqObject = genSaptakFreq(shrutis, currBaseFreq)} class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700">
                </div>

                <div>
                    <div class="flex items-center justify-between gap-2">
                        <div class="text-white">Tempo (BPM)</div>
                        <input type="number" bind:value={tempoBPM} class="w-20 bg-gray-50 border-2 text-black text-sm rounded-lg px-2 py-1"/>
                    </div>
                    <input type="range" min=20 max=1000 step=10 bind:value={tempoBPM} class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700">
                </div>

                <div>
                    <div class="flex items-center justify-between gap-2">
                        <div class="text-white">Note Duration</div>
                        <input type="number" bind:value={noteTime} step=0.01 class="w-20 bg-gray-50 border-2 text-black text-sm rounded-lg px-2 py-1"/>
                    </div>
                    <input type="range" min=0.05 max=1 step=0.05 bind:value={noteTime} class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700">
                </div>

                <div>
                    <div class="flex items-center justify-between gap-2">
                        <div class="text-white">Volume %</div>
                        <input type="number" bind:value={noteVolume} class="w-20 bg-gray-50 border-2 text-black text-sm rounded-lg px-2 py-1"/>
                    </div>
                    <input type="range" min=0 max=200 step=5 bind:value={noteVolume} class="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700">
                </div>
            </div>
        </div>

        <div class="relative grid grid-cols-4 max-sm:grid-cols-2 gap-1.5 p-4 pt-5 bg-[#1d2230b9] rounded-lg backdrop-blur shadow shadow-black border-2 border-gray-400 opacity-{isPlaybackStopped ? 100 : 10} pointer-events-{isPlaybackStopped ? 'auto' : 'none'}">
            <div class="absolute -top-2 left-4 text-sm font-semibold bg-[#1d2230] text-white px-2 rounded-lg border border-gray-400">📒 Sections:</div>

            <select class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 placeholder-gray-400 hover:border-white hover:shadow-gray-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200" bind:value={currentSection}>
                <option selected disabled>Section</option>
                {#each bandishSections.map(section => section.sectionName) as section}
                    <option value={section}>{section}</option>
                {/each}
            </select>

            <button class="text-black bg-lime-500 font-medium rounded-lg text-sm px-5 py-2.5 hover:scale-105 active:scale-95 border-2 hover:border-2 hover:border-white hover:shadow-lime-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200" on:click={() => {
                addSection()
            }}>Add New</button>

            <button class="text-black bg-orange-500 font-medium rounded-lg text-sm px-5 py-2.5 hover:scale-105 active:scale-95 border-2 hover:border-2 hover:border-white hover:shadow-orange-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200" on:click={() => {
                renameSection(currentSection)
            }}>Rename</button>

            <button class="text-black bg-red-500 font-medium rounded-lg text-sm px-5 py-2.5 hover:scale-105 active:scale-95 border-2 hover:border-2 hover:border-white hover:shadow-red-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200" on:click={() => {
                deleteSection(currentSection)
            }}>Delete</button>
        </div>

        <div class="relative grid grid-cols-4 max-sm:grid-cols-2 gap-1.5 p-4 pt-5 bg-[#1d2230b9] rounded-lg backdrop-blur shadow shadow-black border-2 border-gray-400 opacity-{isPlaybackStopped ? 100 : 10} pointer-events-{isPlaybackStopped ? 'auto' : 'none'}">
            <div class="absolute -top-2 left-4 text-sm font-semibold bg-[#1d2230] text-white px-2 rounded-lg border border-gray-400">✂️ Selection:</div>

            <button class="text-black bg-blue-400 font-medium rounded-lg text-sm px-5 py-2.5 hover:scale-105 active:scale-95 border-2 hover:border-2 hover:border-white hover:shadow-blue-400/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200" on:click={() => {
                clearSelection()
            }}>Clear</button>

            <button class="text-black bg-lime-500 font-medium rounded-lg text-sm px-5 py-2.5 hover:scale-105 active:scale-95 border-2 hover:border-2 hover:border-white hover:shadow-lime-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200" on:click={() => {
                const dupedNotes = structuredClone(currentBandishSectionSvaras.slice(startIndex, (endIndex == -1 ? currentBandishSectionSvaras.length : endIndex) + 1))
                currentBandishSectionSvaras.push(...dupedNotes)
                currentBandishSectionSvaras = currentBandishSectionSvaras
            }}>Duplicate</button>

            <button class="text-black bg-orange-500 font-medium rounded-lg text-sm px-5 py-2.5 hover:scale-105 active:scale-95 border-2 hover:border-2 hover:border-white hover:shadow-orange-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200" on:click={() => {
                currentBandishSectionSvaras.splice(startIndex, (endIndex == -1 ? currentBandishSectionSvaras.length : endIndex) - startIndex + 1)
                currentBandishSectionSvaras = currentBandishSectionSvaras
                clearSelection()
            }}>Delete</button>

            <button class="text-black bg-red-500 font-medium rounded-lg text-sm px-5 py-2.5 hover:scale-105 active:scale-95 border-2 hover:border-2 hover:border-white hover:shadow-red-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200" on:click={() => {
                currentBandishSectionSvaras = currentBandishSectionSvaras.splice(startIndex, (endIndex == -1 ? currentBandishSectionSvaras.length : endIndex) - startIndex + 1)
                clearSelection()
            }}>Crop</button>
        </div>
    </div>

    <div class="overflow-x-scroll p-5 max-w-full">

        <div class="flex flex-wrap gap-2 items-baseline">
            <div class="w-fit opacity-{isPlaybackStopped ? 100 : 10} pointer-events-{isPlaybackStopped ? 'auto' : 'none'}">
                <div class="flex gap-1 mb-1 relative p-4 pt-5 bg-[#1d2230b9] rounded-lg backdrop-blur shadow shadow-black border-2 border-gray-400">
                    <div class="absolute -top-2 text-sm font-semibold bg-[#1d2230] text-white px-2 rounded-lg border border-gray-400 capitalize">🎶 Raga {selectedRaga} Svaras:</div>

                    {#each current_svaras as svara}
                        <button class="text-lg w-12 text-black bg-gray-200 font-medium rounded-lg px-5 py-2.5 hover:scale-112 active:scale-95 hover:shadow-yellow-400/50 hover:bg-yellow-200 hover:shadow-[0_0_10px_5px] transition-all duration-200" on:click={() => svaraClick(svara, octave)}>{svara}</button>
                    {/each}

                    <div class="flex-1"/>

                    <button class="text-lg text-black bg-blue-400 font-medium rounded-lg px-5 py-2.5 hover:scale-105 active:scale-95 border-2 hover:border-2 hover:border-white hover:shadow-blue-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200" on:click={() => {
                        currentBandishSectionSvaras.push([[".", 0]])                // Adding "octave" here isn't redundant or just for consistency
                        currentBandishSectionSvaras = currentBandishSectionSvaras   // it could be mapped to "chikari" / filler sounds later
                    }}>Rest</button>
                </div>
                
                <div class="flex gap-1 justify-between">
                    <div class="flex items-center relative p-4 pt-5 bg-[#1d2230b9] rounded-lg backdrop-blur shadow shadow-black border-2 border-gray-400">
                        <div class="absolute -top-2 text-sm font-semibold bg-[#1d2230] text-white px-2 rounded-lg border border-gray-400">📈 Note Octave:</div>

                        <button class="text-lg h-10 w-12 text-black bg-orange-500 font-medium rounded-l-lg hover:scale-108 active:scale-95 hover:shadow-orange-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200" on:click={() => {
                            currBaseFreq/=2
                            octave--
                            // freqObject = genSaptakFreq(shrutis, currBaseFreq)
                        }}>-</button>

                        <input bind:value={octave} class="z-10 h-12 w-12 bg-gray-50 border text-black text-sm p-2.5 rounded-lg" readonly/>

                        <button class="text-lg h-10 w-12 text-black bg-lime-500 font-medium rounded-r-lg hover:scale-108 active:scale-95 hover:shadow-lime-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200" on:click={() => {
                            currBaseFreq*=2
                            octave++
                            // freqObject = genSaptakFreq(shrutis, currBaseFreq)
                        }}>+</button>
                    </div>

                    <div class="flex p-4 pt-5 bg-[#1d2230b9] rounded-lg backdrop-blur shadow shadow-black border-2 border-gray-400">
                    <button class="text-black bg-red-500 font-medium rounded-l-lg px-5 py-2.5 hover:scale-105 active:scale-95 hover:shadow-red-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200" on:click={() => {
                            lastRemovedSvara = currentBandishSectionSvaras.pop() ?? [["S", 0]]
                            currentBandishSectionSvaras = currentBandishSectionSvaras
                        }}>Delete</button>

                        <button class="text-black bg-lime-500 font-medium rounded-r-lg px-5 py-2.5 hover:scale-105 active:scale-95 hover:shadow-lime-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200" on:click={() => {
                            currentBandishSectionSvaras.push(lastRemovedSvara)
                            currentBandishSectionSvaras = currentBandishSectionSvaras
                        }}>Undo</button>

                        <button class="text-black bg-red-500 font-medium rounded-lg px-5 py-2.5 ml-1 hover:scale-105 active:scale-95 hover:shadow-red-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200" on:click={() => {
                            currentBandishSectionSvaras.length = 0
                            lastRemovedSvara = [["S", 0]]
                            
                            currBaseFreq = 220
                            octave = 0

                            noteTime = 0.25
                            tempoBPM = 60000 / tempoMS

                            clearSelection()
                        }}>Clear</button>
                    </div>
                </div>
            </div>

            <button class="opacity-{currentBandishSectionSvaras.length!=0 ? 100 : 10} text-black bg-{isPlaybackStopped ? "lime" : "red"}-500 font-medium rounded-lg text-lg px-5 py-2.5 hover:scale-105 active:scale-95 border-2 hover:border-2 hover:border-white {isPlaybackStopped ? "hover:shadow-lime-500/50" : "hover:shadow-red-500/50"} hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200" on:click={() => {
                if (isPlaybackStopped) {
                    playNotes(endIndex == -1 ? currentBandishSectionSvaras.slice(startIndex) : currentBandishSectionSvaras.slice(startIndex, endIndex + 1), startIndex)
                } else {
                    stopPlayback()
                }
            }}>{isPlaybackStopped ? "▶️ Play!" : "⏹️ Stop"}</button>
        </div>

        <div class="flex gap-1 py-4 w-fit" bind:this={matrasDiv}>
            {#each {length: taals[selectedTaal]["matra"]} as _, i}
                <div 
                    class="text-lg w-12 font-medium rounded-lg py-2.5 text-center
                        {taals[selectedTaal]['tali'].includes(i) ? 'bg-gray-600 text-white' : 
                        taals[selectedTaal]['khali'].includes(i) ? 'bg-orange-500 text-black' : 
                        'bg-gray-200 text-black'}">
                    {i + 1}
                </div>
            {/each}
            <!-- <div class="pr-10"></div> -->
        </div>

        <div class="flex flex-wrap gap-1" bind:this={compDiv}>
            {#each currentBandishSectionSvaras as svaras, i}
                {@const svaraLabel = svaras.map(svara => svara[0])}
                <button 
                    id={`comp-${i}`} 
                    class="relative text-lg h-12 w-12 font-medium rounded-lg py-2.5 hover:scale-112 active:scale-95 hover:shadow-blue-400/50 hover:bg-blue-300 hover:shadow-[0_0_20px_5px] transition-all duration-200
                        {taals[selectedTaal]['tali'].includes(i % taals[selectedTaal]['matra']) ? 'bg-gray-600 text-white' : 
                        taals[selectedTaal]['khali'].includes(i % taals[selectedTaal]['matra']) ? 'bg-orange-500 text-black' : 
                        'bg-gray-200 text-black'}"
                    on:click={() => openNoteModal(i)}
                >
                    <!-- {svaraLabel.join("").length > 4 ? svaraLabel.splice(0,1) + ">" : svaraLabel.join("")} -->
                    {#if svaraLabel.join("").length > 4}
                        {svaraLabel[0] + ">"}
                    {:else if svaraLabel.join("").length == 3 || svaraLabel.join("").length == 4}
                        <div class="absolute inset-0 grid grid-cols-2 grid-rows-2 items-center justify-center">
                            {#each svaraLabel as svara}
                                <div>{svara}</div>
                            {/each}
                        </div>
                    {:else}
                        {svaraLabel.join("")}
                    {/if}
                </button>

                <!-- <Popover>Note: {svaras.map(svara => svara[0])}<br>Octave: {svaras.map(svara => svara[1])}</Popover> -->
            {/each}
        </div>

    </div>
</main>

<div
    class={`fixed bottom-0 z-50 p-5 m-2 rounded-lg bg-[#1d2230b9] backdrop-blur shadow shadow-black border-2 border-gray-400 text-white transition-opacity duration-500 ease-in-out ${
            noteEditModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
    <div class="flex justify-between items-center mb-2">
        <div class="text-xl font-bold">🔧 Note Edit</div>
        <button class="text-2xl" on:click={() => noteEditModal = false}>❌</button>
    </div>

    <div class="flex flex-col justify-between gap-1 opacity-{isPlaybackStopped ? 100 : 10} pointer-events-{isPlaybackStopped ? 'auto' : 'none'}">
        <div class="flex flex-col gap-1">
            {#each currentBandishSectionSvaras[noteModalNoteIndex] as svaras, i}
                <div class="flex justify-between">
                    <input bind:value={svaras[0]} maxlength=1 on:click={this.select} class="w-12 bg-gray-50 border-2 text-black text-sm rounded-lg p-2.5"/>
                    <!-- <input bind:value={svaras[1]} type="number" class="w-16 bg-gray-50 border-2 text-black text-sm rounded-lg p-2.5"/> -->

                    <div class="flex items-center">
                        <button class="text-lg h-10 w-12 text-black bg-orange-500 font-medium rounded-l-lg hover:scale-108 active:scale-95 hover:shadow-orange-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200" on:click={() => {
                            svaras[1]--
                        }}>-</button>

                        <input bind:value={svaras[1]} class="h-12 w-12 rounded-lg bg-gray-50 border text-black text-sm p-2.5" readonly/>

                        <button class="text-lg h-10 w-12 text-black bg-lime-500 font-medium rounded-r-lg hover:scale-108 active:scale-95 hover:shadow-lime-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200" on:click={() => {
                            svaras[1]++
                        }}>+</button>
                    </div>

                    <button class="text-lg text-white w-12 bg-red-500 font-medium rounded-lg py-2.5 hover:scale-105 active:scale-95 hover:shadow-red-500/50 hover:shadow-[0_0_20px_5px] transition-all duration-200" on:click={() => {
                        if (currentBandishSectionSvaras[noteModalNoteIndex].length > 1) {
                            currentBandishSectionSvaras[noteModalNoteIndex].splice(i, 1)
                            currentBandishSectionSvaras = currentBandishSectionSvaras
                        } else alert("Can't delete base note!")
                    }}>🔪</button>
                </div>
            {/each}
        </div>
        
        <div class="grid grid-cols-2 gap-1">
            <button class="text-black bg-blue-400 font-medium rounded-lg text-sm px-5 py-2.5 hover:scale-105 active:scale-95 border-2 hover:border-2 hover:border-white hover:shadow-blue-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200" on:click={() => {
                currentBandishSectionSvaras[noteModalNoteIndex].push([...currentBandishSectionSvaras[noteModalNoteIndex][currentBandishSectionSvaras[noteModalNoteIndex].length - 1]])
                currentBandishSectionSvaras = currentBandishSectionSvaras
            }}>Split</button>

            <button class="text-black bg-blue-400 font-medium rounded-lg text-sm px-5 py-2.5 hover:scale-105 active:scale-95 border-2 hover:border-2 hover:border-white hover:shadow-blue-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200" on:click={() => {
                currentBandishSectionSvaras[noteModalNoteIndex] = [currentBandishSectionSvaras[noteModalNoteIndex][0]]
                currentBandishSectionSvaras = currentBandishSectionSvaras
            }}>Clear</button>

            <button class="text-black bg-blue-400 font-medium rounded-lg text-sm px-5 py-2.5 hover:scale-105 active:scale-95 border-2 hover:border-2 hover:border-white hover:shadow-blue-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200" on:click={() => {
                startIndex = noteModalNoteIndex
                focusOnSelectedNoteRange(startIndex, endIndex)
            }}>Mark Start</button>
            
            <button class="text-black bg-blue-400 font-medium rounded-lg text-sm px-5 py-2.5 hover:scale-105 active:scale-95 border-2 hover:border-2 hover:border-white hover:shadow-blue-500/50 hover:text-white hover:shadow-[0_0_20px_5px] transition-all duration-200" on:click={() => {
                endIndex = noteModalNoteIndex
                focusOnSelectedNoteRange(startIndex, endIndex)
            }}>Mark End</button>
        </div>
    </div>
</div>
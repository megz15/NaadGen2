import { genSine, genSaptakFreq } from "$lib/utils/audioUtils";
import type { Raga, Taal, BandishSection, BandishNote } from "$lib/types/types";
import ragasData from "$lib/data/ragas.json";
import taalsData from "$lib/data/taals.json";
import { exportCompositionToFile, fetchCompositionFromUrl } from "$lib/utils/fileUtils";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { tick } from "svelte";

export const ragas: Record<string, Raga> = ragasData;
export const taals: Record<string, Taal> = taalsData;

export const shrutis = [
    "S",
    "r",
    "R",
    "g",
    "G",
    "m",
    "M",
    "P",
    "d",
    "D",
    "n",
    "N",
];

export const shrutiNames: Record<string, string> = {
    s: "Shadaj",
    r: "Rishabh",
    g: "Gandhar",
    m: "Madhyam",
    p: "Pancham",
    d: "Dhaivat",
    n: "Nishad",
};

export class CompositionState {
    selectedRaga = $state("kafi");
    selectedTaal = $state("deepchandi");

    noteTime = $state(0.25);
    tempoBPM = $state(300);
    noteVolume = $state(100);

    octave = $state(0);
    currBaseFreq = $state(220);

    bandishSections = $state<BandishSection[]>([
        { sectionName: "Default", svaras: [] },
    ]);
    currentSection = $state("Default");

    lastRemovedSvara = $state<BandishNote>([["S", 0]]);

    playbackTimeouts = $state<number[]>([]);
    isPlaybackLooped = $state(false);
    isPlaybackStopped = $state(true);
    startIndex = $state(0);
    endIndex = $state(-1);

    aboutModal = $state(false);
    noteEditModal = $state(false);
    noteModalNoteIndex = $state(0);

    current_svaras = $state<string[]>([]);

    // References to DOM elements needed for width sync & driver.js
    matrasDiv = $state<HTMLDivElement | null>(null);
    compDiv = $state<HTMLDivElement | null>(null);
    importFileInput = $state<HTMLInputElement | null>(null);

    constructor() {
        this.resetSvaras();
    }

    get freqObject(): Record<string, number> {
        return genSaptakFreq(shrutis, this.currBaseFreq);
    }

    get currentBandishSection(): BandishSection {
        return (
            this.bandishSections.find(
                (section) => section.sectionName === this.currentSection,
            ) ??
            this.bandishSections[0] ?? { sectionName: "Default", svaras: [] }
        );
    }

    get currentBandishSectionSvaras(): BandishNote[] {
        return this.currentBandishSection.svaras;
    }

    set currentBandishSectionSvaras(val: BandishNote[]) {
        let sec = this.bandishSections.find(
            (section) => section.sectionName === this.currentSection,
        );
        if (!sec && this.bandishSections.length > 0) {
            sec = this.bandishSections[0];
        }
        if (sec) {
            sec.svaras = val;
        }
    }

    genSelectData(data: Record<string, Raga | Taal>) {
        return Object.keys(data)
            .sort()
            .map((k) => ({
                value: k,
                name: k.charAt(0).toUpperCase() + k.slice(1),
            }));
    }

    resetSvaras = () => {
        let tempSvaras = ["S", "R", "G", "m", "P", "D", "N"];

        tempSvaras.forEach((svara) => {
            // Remove varjya svaras
            tempSvaras = tempSvaras.filter(
                (s) => !ragas[this.selectedRaga].varjya.includes(s.toUpperCase()),
            );

            // Add vikrit shuddh svaras
            if (ragas[this.selectedRaga].vikrit_shuddha.includes(svara)) {
                tempSvaras.splice(
                    tempSvaras.indexOf(svara),
                    1,
                    svara.toLowerCase(),
                    svara.toUpperCase(),
                );
            } else if (ragas[this.selectedRaga].vikrit.includes(svara)) {
                tempSvaras.splice(
                    tempSvaras.indexOf(svara),
                    1,
                    svara.toUpperCase() == svara
                        ? svara.toLowerCase()
                        : svara.toUpperCase(),
                );
            }
        });

        this.current_svaras = tempSvaras;
    };

    svaraClick = (svara: string, oct: number) => {
        genSine(this.freqObject[svara] * 2 ** oct, this.noteTime, this.noteVolume);
        this.currentBandishSectionSvaras.push([[svara, oct]]);
    };

    playNotes = (notes: BandishNote[], startIdx: number) => {
        if (notes.length === 0) return;

        let totalTime = 0;
        this.isPlaybackStopped = false;

        notes.forEach((note, i) => {
            const volume =
                this.noteVolume *
                (taals[this.selectedTaal]["tali"].includes(
                    i % taals[this.selectedTaal]["matra"],
                ) ||
                    taals[this.selectedTaal]["khali"].includes(
                        i % taals[this.selectedTaal]["matra"],
                    )
                    ? 2
                    : 1);

            const noteDuration = 60000 / this.tempoBPM / note.length;

            note.forEach((split) => {
                const noteTimeout = setTimeout(() => {
                    if (!this.isPlaybackStopped) {
                        if (split[0] != "." && shrutis.includes(split[0])) {
                            genSine(
                                this.freqObject[split[0]] * 2 ** split[1],
                                this.noteTime / note.length,
                                volume,
                            );
                        }
                        document
                            .getElementById(`comp-${startIdx + i}`)
                            ?.classList.add("bg-yellow-400");
                        document
                            .getElementById(`comp-${startIdx + i - 1}`)
                            ?.classList.remove("bg-yellow-400");
                    }
                }, totalTime);

                this.playbackTimeouts.push(noteTimeout as unknown as number);
                totalTime += noteDuration;
            });
        });

        const finalTimeout = setTimeout(() => {
            document
                .getElementById(`comp-${notes.length + startIdx - 1}`)
                ?.classList.remove("bg-yellow-400");
            if (!this.isPlaybackLooped) {
                this.stopPlayback();
            }
        }, totalTime);

        this.playbackTimeouts.push(finalTimeout as unknown as number);

        if (this.isPlaybackLooped) {
            const loopedNoteTimeout = setTimeout(() => {
                if (!this.isPlaybackStopped) this.playNotes(notes, startIdx);
            }, totalTime);

            this.playbackTimeouts.push(loopedNoteTimeout as unknown as number);
        }
    };

    stopPlayback = () => {
        this.isPlaybackStopped = true;
        this.playbackTimeouts.forEach((timeout) => clearTimeout(timeout));
        this.playbackTimeouts = [];

        if (
            Array.from(document.querySelectorAll("[id^='comp-']")).every((note) =>
                note.classList.contains("bg-yellow-400"),
            ) && document.querySelectorAll("[id^='comp-']").length > 1
        ) {
            alert("and it was all yellow... 🎶");
        }
    };

    addSection = (sectionName: string) => {
        if (!sectionName) return;
        this.bandishSections.push({ sectionName: sectionName, svaras: [] });
        this.currentSection = sectionName;
    };

    deleteSection = (sectionName: string) => {
        if (this.bandishSections.length > 1) {
            if (
                confirm(
                    `Are you sure you want to delete section "${sectionName}"?`,
                )
            ) {
                this.bandishSections = this.bandishSections.filter(
                    (section) => section.sectionName != sectionName,
                );
                this.currentSection = this.bandishSections[0].sectionName;
            } else
                alert(
                    `Section "${sectionName}" hath been spared from the sword of deletion!`,
                );
        } else alert("Can't delete all sections!");
    };

    renameSection = (sectionName: string) => {
        const renameToName = prompt("Enter new section name", sectionName);
        if (renameToName) {
            const target = this.bandishSections.find(
                (section) => section.sectionName === sectionName,
            );
            if (target) target.sectionName = renameToName;
            this.currentSection = renameToName;
        }
    };

    openNoteModal = (i: number) => {
        this.noteEditModal = true;
        this.noteModalNoteIndex = i;
    };

    exportData = () => {
        exportCompositionToFile(
            this.selectedRaga,
            this.selectedTaal,
            this.currBaseFreq,
            this.octave,
            this.tempoBPM,
            this.noteTime,
            $state.snapshot(this.bandishSections),
        );
    };

    handleFileInput = (e: Event) => {
        const input = e.target as HTMLInputElement;

        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                this.importDataFromText(reader.result as string);
            };
            reader.readAsText(input.files[0]);
        }
    };

    importDataFromText = (text: string) => {
        try {
            const data = JSON.parse(text);

            this.selectedRaga = data["raga"];
            this.selectedTaal = data["taal"];
            this.resetSvaras();
            this.matchDivWidth();

            this.currBaseFreq = data["freq"];
            this.tempoBPM = data["tempo"];
            this.noteTime = data["noteTime"];

            this.bandishSections = data["totalBandish"];
            this.currentSection = this.bandishSections[0].sectionName;

            alert("Imported successfully!");
        } catch (e: any) {
            alert("Import failed: " + (e?.message ?? e));
        }
    };

    handleImportClick = async () => {
        const url = prompt(
            "Enter a direct URL to a .ng file, or leave blank to choose a local file",
        );
        if (url && url.trim().length > 0) {
            await this.loadFromUrl(url);
        } else {
            this.importFileInput?.click();
        }
    };

    loadFromUrl = async (url: string) => {
        try {
            const text = await fetchCompositionFromUrl(url);
            this.importDataFromText(text);
        } catch (e: any) {
            alert("Could not fetch file from URL: " + (e?.message ?? e));
        }
    };

    focusOnSelectedNoteRange = async (startIdx: number, endIdx: number) => {
        await tick();
        for (let i = 0; i < this.currentBandishSectionSvaras.length; i++) {
            const note = document.getElementById(`comp-${i}`);

            if (
                i >= startIdx &&
                i <=
                (endIdx == -1
                    ? this.currentBandishSectionSvaras.length
                    : endIdx)
            ) {
                note?.classList.remove("opacity-10");
            } else {
                note?.classList.add("opacity-10");
            }
        }

        document
            .getElementById(`comp-${startIdx}`)
            ?.classList.remove("opacity-10");
    };

    clearSelection = () => {
        this.startIndex = 0;
        this.endIndex = -1;
        this.focusOnSelectedNoteRange(this.startIndex, this.endIndex);
    };

    duplicateSelection = () => {
        const end =
            this.endIndex == -1
                ? this.currentBandishSectionSvaras.length
                : this.endIndex;
        const dupedNotes = $state.snapshot(
            this.currentBandishSectionSvaras.slice(this.startIndex, end + 1),
        );
        this.currentBandishSectionSvaras.push(...dupedNotes);
    };

    moveSelectionToSection = () => {
        if (this.currentBandishSectionSvaras.length === 0) {
            alert("Add some notes before moving them around!");
            return;
        }

        const end =
            this.endIndex == -1
                ? this.currentBandishSectionSvaras.length
                : this.endIndex;
        if (this.startIndex > end || this.startIndex < 0 || end < 0) {
            alert("Invalid selection range. End usually happens after start.");
            return;
        }

        const selection = $state.snapshot(
            this.currentBandishSectionSvaras.slice(this.startIndex, end + 1),
        );
        if (selection.length === 0) {
            alert("Nothing selected to move.");
            return;
        }

        const existingSectionNames = this.bandishSections
            .map((s) => s.sectionName)
            .join(", ");
        const targetSectionInput = prompt(
            `Enter target section name (existing: ${existingSectionNames}). New name will create a section:`,
            existingSectionNames.split(", ")[0] ?? "Default",
        );
        if (!targetSectionInput) return;
        const targetSectionName = targetSectionInput.trim();
        if (!targetSectionName) return;

        if (targetSectionName === this.currentSection) {
            alert("Selected range did not budge.");
            return;
        }

        this.currentBandishSectionSvaras.splice(this.startIndex, selection.length);

        let targetSection = this.bandishSections.find(
            (s) => s.sectionName === targetSectionName,
        );
        if (!targetSection) {
            this.addSection(targetSectionName);
            targetSection = this.bandishSections.find(
                (s) => s.sectionName === targetSectionName,
            );
        }

        targetSection?.svaras.push(...selection);
        this.currentSection = targetSectionName;
        this.clearSelection();
        alert(`Moved ${selection.length} notes to "${targetSectionName}"!`);
    };

    deleteSelection = () => {
        if (
            confirm(
                "Are you sure you want to delete the selected range? This action cannot be undone!",
            )
        ) {
            const end =
                this.endIndex == -1
                    ? this.currentBandishSectionSvaras.length
                    : this.endIndex;
            this.currentBandishSectionSvaras.splice(
                this.startIndex,
                end - this.startIndex + 1,
            );
            this.clearSelection();
        } else {
            alert(
                "Selected range hath been spared from the sword of deletion!",
            );
        }
    };

    deleteLastSvara = () => {
        const popped = this.currentBandishSectionSvaras.pop();
        this.lastRemovedSvara = popped ? $state.snapshot(popped) : [["S", 0]];
    };

    undoLastSvara = () => {
        this.currentBandishSectionSvaras.push(
            this.lastRemovedSvara.map((svara) => [...svara]),
        );
    };

    clearCurrentSection = () => {
        if (this.currentBandishSectionSvaras.length != 0) {
            if (
                confirm(
                    `Warning: This will delete ALL notes in the current section "${this.currentSection}". Are you sure you want to continue? This action cannot be undone!`,
                )
            ) {
                this.currentBandishSectionSvaras.length = 0;
                this.lastRemovedSvara = [["S", 0]];

                this.currBaseFreq = 220;
                this.octave = 0;

                this.noteTime = 0.25;
                this.tempoBPM = 300;
                this.isPlaybackLooped = false;

                this.clearSelection();
            } else
                alert(
                    `The section "${this.currentSection}" hath been spared from the sword of deletion!`,
                );
        } else
            alert("Nothing to clear here. Move along, move along...");
    };

    matchDivWidth = async () => {
        await tick();
        if (this.compDiv && this.matrasDiv) {
            this.compDiv.style.width = `${this.matrasDiv.scrollWidth}px`;
        }
    };

    startTour = async () => {
        this.aboutModal = false;
        await tick();

        const driverObj = driver({
            showProgress: true,
            // allowClose: false,
            overlayClickBehavior: undefined,
            smoothScroll: true,
            popoverClass: "driverjs-theme",
            showButtons: ["next", "previous", "close"],
            steps: [
                {
                    popover: {
                        title: "Welcome to NaadGen!",
                        description:
                            "This guide will show you how to use the app to create compositions. Click 'Next' or your right arrow key to begin.",
                    },
                },
                {
                    element: "#ragaSelector",
                    popover: {
                        title: "Raga",
                        description: `First, select the raga you want to make your composition in. You can choose from a list of available ragas, or continue with the default for now, <b>Raga ${this.selectedRaga.charAt(0).toUpperCase() + this.selectedRaga.substring(1).toLowerCase()}</b>.`,
                        side: "right",
                        align: "start",
                    },
                },
                {
                    element: "#taalSelector",
                    popover: {
                        title: "Taal",
                        description: `Next, select the taal you want to set your composition to. You can choose from a list of available taals, or continue with the default for now, <b>${this.selectedTaal.charAt(0).toUpperCase() + this.selectedTaal.substring(1).toLowerCase()}</b>.`,
                        side: "right",
                        align: "start",
                    },
                },
                {
                    element: this.matrasDiv ?? undefined,
                    popover: {
                        title: "Matras",
                        description: `You can see the matras of the selected taal here. The Talis and Khalis are highlighted. Here, <b>${this.selectedTaal} has ${taals[this.selectedTaal].matra} matras</b>.`,
                        side: "top",
                        align: "center",
                    },
                },
                {
                    element: "#noteOctave",
                    popover: {
                        title: "Octave",
                        description:
                            "You can change the octave of the svaras you add here. The current octave is also shown here.",
                        side: "right",
                        align: "center",
                    },
                },
                {
                    element: "#ragaSvaras",
                    popover: {
                        title: "Svaras",
                        description:
                            "You can see the svaras of the selected Raga here. <b>Click on a few svaras</b> to add them to your composition.",
                        side: "top",
                        align: "center",
                    },
                },
                {
                    element: this.compDiv ?? undefined,
                    popover: {
                        title: "Composition",
                        description:
                            "This is your composition. Notes will be shown here once you add them from the Raga Svaras panel. If you've already added some notes, click on one to edit it in the <b>Svara/Matra Edit panel</b>.",
                        side: "top",
                        align: "center",
                    },
                },
                {
                    element: "#noteEditModal",
                    popover: {
                        title: "Svara/Matra Edit Panel",
                        description:
                            "If you'd clicked on a note before, you can change the svara and octave of the note, split it up or set it as the start or end of a range via this panel.",
                        side: "right",
                        align: "start",
                    },
                },
                {
                    element: "#playbackControls",
                    popover: {
                        title: "Playback Sliders",
                        description:
                            "Use the sliders to change the <b>frequency</b>, <b>tempo</b>, <b>note duration</b> and <b>volume</b> of the notes during playback.",
                        side: "left",
                        align: "center",
                    },
                },
                {
                    element: "#sectionControls",
                    popover: {
                        title: "Edit Sections",
                        description:
                            "You can manage the sections of your composition here. Sections can be used for multiple things: you could, for example, segment your composition into <b>Aalap</b>, <b>Sthayi</b>, <b>Antara</b>, <b>Taan</b> and <b>Jhala</b>. Add, rename, or delete sections as you like.",
                        side: "top",
                        align: "center",
                    },
                },
                {
                    element: "#selectionControls",
                    popover: {
                        title: "Selection Panel",
                        description:
                            "After selecting a range of notes in your composition, you can duplicate, delete, or crop the selected range.",
                        side: "top",
                        align: "center",
                    },
                },
                {
                    element: "#playBtn",
                    popover: {
                        title: "Play",
                        description:
                            "Click here to play your composition. You can also loop the playback from the Control Panel.",
                        side: "left",
                        align: "center",
                    },
                },
                {
                    element: "#savefileBtns",
                    popover: {
                        title: "Save/Load",
                        description:
                            'Finally, you can export your composition to a file or import a previously saved composition stored as a valid ".ng" (NaadGen) file, either from local storage or from a URL, using these buttons.',
                        side: "right",
                        align: "center",
                    },
                },
                {
                    element: "#dailyRagaPromo",
                    popover: {
                        title: "Shameless Plug",
                        description:
                            "If you enjoy NaadGen, you might like <b>DailyRaga</b>, a mobile app I made to check key attributes for many ragas at a quick glance. Click here to download it from the Play Store!",
                        side: "top",
                        align: "center",
                    },
                },
                {
                    popover: {
                        title: "Final Step",
                        description:
                            "You now know how to use NaadGen, young padawan. Have fun composing!",
                    },
                },
            ],
        });

        driverObj.drive();
    };
}

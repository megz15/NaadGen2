import type { BandishSection } from "$lib/types/types";

export function exportCompositionToFile(
    selectedRaga: string,
    selectedTaal: string,
    currBaseFreq: number,
    octave: number,
    tempoBPM: number,
    noteTime: number,
    bandishSections: BandishSection[]
) {
    const blob = new Blob([
        JSON.stringify({
            raga: selectedRaga,
            taal: selectedTaal,
            freq: currBaseFreq / 2 ** octave,
            tempo: tempoBPM,
            noteTime: noteTime,
            totalBandish: bandishSections,
        }),
    ]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `${selectedRaga}_${selectedTaal}_${new Date().toISOString().replaceAll(":", "-")}.ng`;
    a.click();
    window.URL.revokeObjectURL(url);
}

export async function fetchCompositionFromUrl(url: string): Promise<string> {
    const trimmedURL = url.trim();
    if (!/^https?:\/\//.test(trimmedURL)) {
        throw new Error("Invalid or missing URL: " + trimmedURL);
    }

    const proxyURL =
        "https://whateverorigin.org/get?url=" +
        encodeURIComponent(trimmedURL);

    const resp = await fetch(proxyURL, {
        headers: {
            origin: "https://naadgen.vercel.app/",
        },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    return data.contents;
}

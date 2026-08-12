export type Raga = {
    vikrit: string[]
    vikrit_shuddha: string[]
    varjya: string[]
    vadi: string
    samvadi: string
}

export type Taal = {
    matra: number,
    tali: number[],
    khali: number[],
}

export type Svara = [string, number]
export type BandishNote = Svara[]
export type BandishSection = {
    sectionName: string
    svaras: BandishNote[]
}
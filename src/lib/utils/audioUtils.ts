export function genFreq(baseFreq: number, n: number) {
    return Math.round( baseFreq*(2**(n/12)) * 1000 ) / 1000
}

export function genSaptakFreq(shrutis: string[], baseFreq: number) {
    return Object.fromEntries(shrutis.map(x => [x, genFreq(baseFreq, shrutis.indexOf(x))]))
}

export function genSine(freq: number, noteTime: number, volume: number) {

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

    gainNode.gain.value = volume / 100

    let attackTime = noteTime / 4
    let releaseTime = noteTime * 3 / 4
    let currentTime = audioContext.currentTime

    gainNode.gain.setValueAtTime(0, currentTime)
    gainNode.gain.linearRampToValueAtTime(volume / 100, currentTime + attackTime)
    gainNode.gain.setValueAtTime(volume / 100, currentTime + noteTime - releaseTime)
    gainNode.gain.linearRampToValueAtTime(0, currentTime + noteTime)

    source.start(0)
}
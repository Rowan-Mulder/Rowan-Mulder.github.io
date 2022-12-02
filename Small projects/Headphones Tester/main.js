let btnPlayLeft = document.getElementById("btnPlayLeft")
let btnPlayRight = document.getElementById("btnPlayRight")
let oscGainL = document.getElementById("oscGainL")
let oscGainR = document.getElementById("oscGainR")
let oscFrequencyL = document.getElementById("oscFrequencyL")
let oscFrequencyR = document.getElementById("oscFrequencyR")
let oscFrequencyLDisplay = document.getElementById("oscFrequencyDisplayL")
let oscFrequencyRDisplay = document.getElementById("oscFrequencyDisplayR")
let waveFormL = document.getElementById("waveFormL")
let waveFormR = document.getElementById("waveFormR")
let checkToggleL = document.getElementById("checkToggleL")
let checkToggleR = document.getElementById("checkToggleR")


let audioCtx

let oscillators = {
    left: {
        oscillator: null,
        nodes: {
            gain: null,
        },
        properties: {
            frequency: 203,
            gain: 0.5,
            type: "sine", // sine, sawtooth, triangle, square, custom
        },
        frequencyDisplay: oscFrequencyLDisplay,
        toggleToPlay: false,
        isPlaying: false,
    },
    right: {
        oscillator: null,
        nodes: {
            gain: null,
        },
        properties: {
            frequency: 203,
            gain: 0.5,
            type: "sine", // sine, sawtooth, triangle, square, custom
        },
        frequencyDisplay: oscFrequencyRDisplay,
        toggleToPlay: false,
        isPlaying: false,
    },
}

function play(side) {
    if (side === "left") {
        if (oscillators.left.isPlaying) {
            return
        }
        oscillators.left.isPlaying = true
        startOscillator(oscillators.left)
    } else if (side === "right") {
        if (oscillators.right.isPlaying) {
            return
        }
        oscillators.right.isPlaying = true
        startOscillator(oscillators.right)
    }
}

function stop(side) {
    if (!side.isPlaying) {
        return
    }
    side.isPlaying = false
    side.oscillator.stop(0)
}

function startOscillator(side) {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    }

    // Mono source
    side.oscillator = new OscillatorNode(audioCtx, {frequency: side.properties.frequency, type: side.properties.type})

    let splitter = audioCtx.createChannelSplitter(2)

    // Stereo source
    let merger = audioCtx.createChannelMerger(2)
    merger.connect(audioCtx.destination)

    side.oscillator.connect(splitter)

    let gainL = audioCtx.createGain()
    let gainR = audioCtx.createGain()

    splitter.connect(gainL)
    splitter.connect(gainR)

    gainL.connect(merger, 0, 0)
    gainR.connect(merger, 0, 1)

    if (side === oscillators.left) {
        gainL.gain.setValueAtTime(0.01, audioCtx.currentTime)
        gainR.gain.value = 0
        gainL.gain.linearRampToValueAtTime(Math.max(side.properties.gain, 0.001), audioCtx.currentTime + 0.02) // Adds some attack to prevent crackling audio
        side.nodes.gain = gainL
    } else if (side === oscillators.right) {
        gainL.gain.value = 0
        gainR.gain.setValueAtTime(0.01, audioCtx.currentTime)
        gainR.gain.linearRampToValueAtTime(Math.max(side.properties.gain, 0.001), audioCtx.currentTime + 0.02) // Adds some attack to prevent crackling audio
        side.nodes.gain = gainR
    }

    side.oscillator.start(audioCtx.currentTime)
}

function changeFrequency(side, amount, min, max) {
    let osc = side.oscillator
    let frequency = Math.round(logarithmicSlider(Number(amount), Number(min), Number(max), 20, 20000)) // Value in hertz
    if (osc) {
        osc.frequency.linearRampToValueAtTime(Math.max(frequency, 0.001), audioCtx.currentTime + 0.1) // Adds glissando to smooth fade
    }
    side.properties.frequency = frequency
    side.frequencyDisplay.innerText = frequency
}

function changeGain(side, amount) {
    let osc = side.oscillator
    let gain = clamp(Number(amount), 0, 1)
    if (osc) {
        let gainNode = side.nodes.gain
        if (gainNode) {
            gainNode.gain.linearRampToValueAtTime(Math.max(gain, 0.001), audioCtx.currentTime + 0.1) // Adds gain fade to reduce crackling audio
        }
    }
    side.properties.gain = gain
}

function changeWaveform(side, waveform) {
    let osc = side.oscillator
    if (osc) {
        osc.type = waveform
    }
    side.properties.type = waveform
}

function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max)
}

function logarithmicSlider(currentPos, minPos, maxPos, minVal, maxVal) {
    minVal = Math.log(minVal)
    maxVal = Math.log(maxVal)
    let scale = (maxVal - minVal) / (maxPos - minPos)
    return Math.exp(minVal + scale * (currentPos - minPos))
}



btnPlayRight.addEventListener("pointerdown", e => {
    if (!oscillators.right.toggleToPlay && e.button === 0) {
        play("right")
    }
})
btnPlayLeft.addEventListener("pointerdown", e => {
    if (!oscillators.left.toggleToPlay && e.button === 0) {
        play("left")
    }
})
window.addEventListener("pointerup", e => {
    if (!oscillators.left.toggleToPlay) {
        stop(oscillators.left)
    } else if (e.target.id === "btnPlayLeft") {
        if (oscillators.left.isPlaying) {
            stop(oscillators.left)
        } else {
            play("left")
        }
    }

    if (!oscillators.right.toggleToPlay) {
        stop(oscillators.right)
    } else if (e.target.id === "btnPlayRight") {
        if (oscillators.right.isPlaying) {
            stop(oscillators.right)
        } else {
            play("right")
        }
    }
})

oscFrequencyL.addEventListener("input", e => {
    changeFrequency(oscillators.left, e.target.value, e.target.min, e.target.max)
})
oscFrequencyR.addEventListener("input", e => {
    changeFrequency(oscillators.right, e.target.value, e.target.min, e.target.max)
})

oscGainL.addEventListener("input", e => {
    changeGain(oscillators.left, e.target.value)
})
oscGainR.addEventListener("input", e => {
    changeGain(oscillators.right, e.target.value)
})

waveFormL.addEventListener("change", e => {
    changeWaveform(oscillators.left, e.target.value.toLowerCase())
})
waveFormR.addEventListener("change", e => {
    changeWaveform(oscillators.right, e.target.value.toLowerCase())
})

checkToggleL.addEventListener("input", e => {
    oscillators.left.toggleToPlay = e.target.checked
    stop(oscillators.left)
})
checkToggleR.addEventListener("input", e => {
    oscillators.right.toggleToPlay = e.target.checked
    stop(oscillators.right)
})
const animation = () => {
    const container = document.querySelector(".container"),
        p = document.querySelectorAll("p")

    container.style.backdropFilter = "blur(10px)"
    p.forEach(element => element.style.opacity = 1)
    setTimeout(() => {
        for (let i = 0; i < p.length; i++) {
            p[0].style.fontSize = "80px"
            p[1].style.fontSize = "60px"
        }
    }, 2000)
    document.querySelector("canvas").style.opacity = "1"
}

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        animation()
        loadAndPlaySound()
        const audioContext = new (window.AudioContext || window.webkitAudioContext)(),
            gainNode = audioContext.createGain(),
            analyser = audioContext.createAnalyser()
        gainNode.connect(analyser)
        analyser.connect(audioContext.destination)

        let source = null
        const canvas = document.getElementById('visualizer'),
            canvasCtx = canvas.getContext('2d')
        async function loadAndPlaySound() {
            const response = await fetch('music.mp3')
            const arrayBuffer = await response.arrayBuffer()
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

            if (source) {
                source.stop()
            }

            source = audioContext.createBufferSource()
            source.buffer = audioBuffer
            source.connect(gainNode)
            source.start()
        }

        function draw() {
            requestAnimationFrame(draw)
            const bufferLength = analyser.frequencyBinCount
            const dataArray = new Uint8Array(bufferLength)
            analyser.getByteFrequencyData(dataArray)

            canvasCtx.clearRect(0, 0, canvas.width, canvas.height)

            const barWidth = canvas.width / bufferLength
            let x = 0

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i] / 2,
                    gradient = canvasCtx.createLinearGradient(0, 0, 0, canvas.height)
                gradient.addColorStop(0, 'rgba(0, 0, 255, 0.9)')
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0.9)')

                canvasCtx.fillStyle = gradient
                canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

                x += barWidth + 1
            }
        }

        draw()
    }
})
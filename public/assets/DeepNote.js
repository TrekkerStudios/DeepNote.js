document.addEventListener("DOMContentLoaded", async function () {
    // Parameters for generation, official values are noted below
    var totalOsc = 30; // 30 oscillators (original), 80 oscillators (modern)
    const baseHz = 200; // 200Hz floor
    const rangeHz = 200; // 400Hz max
    var totalTime = 15; // Default 15 seconds
    var timeOfResolve = (totalTime * 0.6);
    var timeOfHold = (totalTime * 0.4);

    // Get inputs from UI
    const voicesInput = document.querySelector("#voices");
    const timeInput = document.querySelector("#time");
    const volumeInput = document.querySelector("#volume");
    const volumeDisplay = document.querySelector("#volume-display");
    voicesInput.addEventListener("selectionchange", () => {
        totalOsc = voicesInput.value
    });
    timeInput.addEventListener("selectionchange", () => {
        totalTime = timeInput.value
    });
    volumeInput.addEventListener("input", () => {
        const volumePercent = volumeInput.value;
        volumeDisplay.textContent = `${volumePercent}%`;
    });

    const targetFrequencies = [
        // D1 - 2 voices
        36.71,    // D1 (voice 1)
        36.85,    // D1 (voice 2, +0.38 cents)

        // D2 - 4 voices
        73.42,    // D2 (voice 1)
        73.56,    // D2 (voice 2, +0.38 cents)
        73.70,    // D2 (voice 3, +0.76 cents)
        73.28,    // D2 (voice 4, -0.38 cents)

        // A2 - 3 voices (just intonation 3:2 ratio)
        110.13,   // A2 (voice 1, just intonation)
        110.27,   // A2 (voice 2, +0.38 cents)
        109.99,   // A2 (voice 3, -0.38 cents)

        // D3 - 3 voices
        146.83,   // D3 (voice 1)
        146.97,   // D3 (voice 2, +0.38 cents)
        146.69,   // D3 (voice 3, -0.38 cents)

        // A3 - 3 voices (just intonation 3:2 ratio)
        220.25,   // A3 (voice 1, just intonation)
        220.39,   // A3 (voice 2, +0.38 cents)
        220.11,   // A3 (voice 3, -0.38 cents)

        // D4 - 4 voices
        293.66,   // D4 (voice 1)
        293.80,   // D4 (voice 2, +0.38 cents)
        293.52,   // D4 (voice 3, -0.38 cents)
        293.94,   // D4 (voice 4, +0.76 cents)

        // A4 - 4 voices (just intonation 3:2 ratio)
        440.50,   // A4 (voice 1, just intonation)
        440.64,   // A4 (voice 2, +0.38 cents)
        440.36,   // A4 (voice 3, -0.38 cents)
        440.78,   // A4 (voice 4, +0.76 cents)

        // D5 - 2 voices
        587.33,   // D5 (voice 1)
        587.47,   // D5 (voice 2, +0.38 cents)

        // A5 - 2 voices (just intonation 3:2 ratio)
        881.00,   // A5 (voice 1, just intonation)
        881.14,   // A5 (voice 2, +0.38 cents)

        // D6 - 2 voices
        1174.66,  // D6 (voice 1)
        1174.80,  // D6 (voice 2, +0.38 cents)

        // F#6 - 1 voice (just intonation 5:4 ratio)
        1468.50   // F#6 (just intonation major third)
    ];

    class DeepNoteMixer {
        constructor(audioContext, reverb) {
            this.context = audioContext;

            this.mixerNode = this.context.createGain();
            this.mixerNode.gain.value = 0.5;

            this.filter = this.context.createBiquadFilter();
            this.filter.type = 'lowpass';
            this.filter.frequency.value = 20000;
            this.filter.Q.value = 1;

            this.compressor = this.context.createDynamicsCompressor();
            this.compressor.threshold.value = -6.0;
            this.compressor.knee.value = 30;
            this.compressor.ratio.value = 3;
            this.compressor.attack.value = 0.003;
            this.compressor.release.value = 0.25;

            this.masterGain = this.context.createGain();
            this.masterGain.gain.value = 1;

            this.reverb = reverb;

            this.mixerNode.connect(this.filter);
            this.filter.connect(this.compressor);
            this.compressor.connect(this.reverb);
            this.reverb.connect(this.masterGain);
            this.masterGain.connect(this.context.destination);
        }

        connectSource(sourceNode) {
            sourceNode.connect(this.mixerNode);
        }

        setMasterVolume(value) {
            this.masterGain.gain.value = Math.max(0, Math.min(1, value));
        }

        setFilterFrequency(frequency) {
            this.filter.frequency.value = frequency;
        }

        setCompressorThreshold(threshold) {
            this.compressor.threshold.value = threshold;
        }

        // Cleanup
        disconnect() {
            this.mixerNode.disconnect();
            this.filter.disconnect();
            this.compressor.disconnect();
            this.reverb.disconnect();
            this.masterGain.disconnect();
        }
    }

    class OscillatorVisualizer {
        constructor(canvasId, analyserNode) {
            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas.getContext('2d');
            this.analyser = analyserNode;
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
            this.isActive = true;
        }

        draw() {
            if (!this.isActive) return;

            this.analyser.getByteTimeDomainData(this.dataArray);

            // Clear canvas
            this.ctx.fillStyle = '#44403b';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw waveform
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = '#ffd230';
            this.ctx.beginPath();

            const sliceWidth = this.canvas.width / this.bufferLength;
            let x = 0;

            for (let i = 0; i < this.bufferLength; i++) {
                const v = this.dataArray[i] / 128.0;
                const y = (v * this.canvas.height) / 2;

                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            this.ctx.stroke();
        }

        stop() {
            this.isActive = false;
            // Clear the canvas
            this.ctx.fillStyle = '#44403b';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    async function createReverb(audioCtx) {
        let convolver = audioCtx.createConvolver();
        let response = await fetch("/assets/hall.wav");
        let arraybuffer = await response.arrayBuffer();
        convolver.buffer = await audioCtx.decodeAudioData(arraybuffer);

        return convolver;
    }

    function moveToTargetFrequencies(audioCtx, oscillators, duration) {
        const startTime = audioCtx.currentTime;
        const changeInterval = (duration / 100); // every second
        const numChanges = Math.floor(duration / changeInterval);

        function scheduleNextChange(changeIndex) {
            if (changeIndex >= numChanges) {
                // Final move
                oscillators.forEach((oscillator) => {
                    oscillator.frequency.setTargetAtTime(
                        oscillator.targetFrequency,
                        startTime + duration,
                        (duration / 100)
                    );
                });
                return;
            }

            const changeTime = startTime + changeIndex * changeInterval;
            const progress = changeIndex / numChanges;

            oscillators.forEach((oscillator) => {
                const currentFreq = oscillator.frequency.value;
                const targetFreq = oscillator.targetFrequency;

                // Calculate intermediate frequency based on progress
                const intermediateFreq =
                    currentFreq + (targetFreq - currentFreq) * (progress * 0.4);

                oscillator.frequency.setTargetAtTime(
                    intermediateFreq,
                    changeTime,
                    Math.floor((duration * 0.7) / 100) // Time constant for the exponential approach
                );
            });

            // Schedule next change
            setTimeout(
                () => scheduleNextChange(changeIndex + 1),
                changeInterval * 1000
            );
        }

        scheduleNextChange(0);
    }

    function animateFilter(audioCtx, mixer, timeOfResolve) {
        const startTime = audioCtx.currentTime;
        const duration = timeOfResolve;

        const automationPoints = [
            { time: 0, frequency: 250, timeConstant: 0 },
            { time: (duration * 0.1), frequency: 20000, timeConstant: (duration * 0.7) },
            { time: (duration), frequency: 20000, timeConstant: 0 }
        ];

        automationPoints.forEach(point => {
            mixer.filter.frequency.setTargetAtTime(
                point.frequency,
                startTime + point.time,
                point.timeConstant
            );
        });
    }

    function fadeInOut(audioCtx, mixer, timeOfResolve, timeOfHold) {
        const startTime = audioCtx.currentTime;
        const durationResolve = timeOfResolve;
        const durationHold = timeOfHold;

        const automationPoints = [
            { time: 0, gain: 0, timeConstant: 0 },
            { time: (durationResolve * 0.1), gain: 1, timeConstant: 2 },
            { time: (durationResolve * 1.1), gain: 0, timeConstant: (durationHold * 0.1) },
            { time: ((durationResolve + durationHold) * 0.95), gain: 0, timeConstant: 0 }
        ];

        automationPoints.forEach(point => {
            mixer.masterGain.gain.setTargetAtTime(
                point.gain,
                startTime + point.time,
                point.timeConstant
            );
        });
    }

    function updateFilterDisplay(mixer, reset) {
        const container = document.getElementById('filter-status');
        if (reset) {
            container.innerHTML = '';
        } else {
            container.innerHTML = '<div class="filt-stat"><span>Filter: ' + mixer.filter.frequency.value.toFixed(0) + 'Hz</span></div>'
        }
    }

    function createVisualizerGrid(totalOsc) {
        const grid = document.getElementById('osc-grid');

        grid.innerHTML = '';

        for (let i = 0; i < totalOsc; i++) {
            const oscDiv = document.createElement('div');
            oscDiv.innerHTML = `
            <div class="osc-label">Osc ${i + 1}</div>
            <canvas id="canvas-${i}" width="64" height="64"></canvas>
        `;
            grid.appendChild(oscDiv);
        }
    }

    function createOscillatorsWithVisualizers(audioCtx, mixer, totalOsc) {
        createVisualizerGrid(totalOsc);

        const visualizers = [];

        const oscillatorArray = Array.from({ length: totalOsc }).map((x, index) => {
            const frequency = Math.floor(Math.random() * rangeHz) + baseHz;
            const pan = parseFloat(((Math.random() * 2) - 1).toFixed(2));

            const oscNode = new OscillatorNode(audioCtx, {
                type: "sawtooth",
                frequency: frequency,
            });

            const gainNode = new GainNode(audioCtx, {
                gain: 0.1,
            });

            const pannerNode = new PannerNode(audioCtx, {
                positionX: pan,
            });

            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 1024;
            analyser.smoothingTimeConstant = 0.2;

            oscNode.connect(analyser);
            analyser.connect(pannerNode);
            pannerNode.connect(gainNode);
            mixer.connectSource(gainNode);

            const visualizer = new OscillatorVisualizer(`canvas-${index}`, analyser);
            visualizers.push(visualizer);

            const selectedTarget = targetFrequencies[index % targetFrequencies.length];
            const deviation = parseFloat((((Math.random() * 50) - 25) / 100).toFixed(2));
            const targetFreq = parseFloat((selectedTarget + deviation).toFixed(2));
            console.log(targetFreq); //TODO REMOVE
            oscNode.targetFrequency = targetFreq;
            oscNode.gainNode = gainNode;
            oscNode.pannerNode = pannerNode;
            oscNode.analyser = analyser;

            return oscNode;
        });

        return { oscillatorArray, visualizers };
    }

    function animateVisualizers(visualizers) {
        function draw() {
            visualizers.forEach(visualizer => visualizer.draw());
            requestAnimationFrame(draw);
        }
        draw();
    }

    function resetDisplay() {
        const viewport = document.getElementById('main-viewer');
        viewport.innerHTML = '<div id="viewport" class="flex flex-col justify-center items-center"><div id="filter-status" class="flex flex-row text-lg font-light"></div><div id="osc-grid" class="grid grid-cols-6 gap-3 text-sm font-light"></div></div>'
    }

    const startButton = document.querySelector("#startButton");
    if (startButton) {
        startButton.addEventListener("click", async function () {
            timeOfResolve = (totalTime * 0.6);
            timeOfHold = (totalTime * 0.4);

            const audioCtx = new AudioContext();

            const mainReverb = await createReverb(audioCtx);

            const mixer = new DeepNoteMixer(audioCtx, mainReverb);

            const initialVolume = parseFloat(volumeInput.value) / 100;
            mixer.setMasterVolume(initialVolume);

            const volumeHandler = () => {
                const volume = parseFloat(volumeInput.value) / 100;
                mixer.setMasterVolume(volume);
                volumeDisplay.textContent = `${volumeInput.value}%`;
            };

            volumeInput.addEventListener("input", volumeHandler);

            const { oscillatorArray, visualizers } = createOscillatorsWithVisualizers(audioCtx, mixer, totalOsc);

            animateVisualizers(visualizers);

            audioCtx.resume().then(() => {

                console.log(`Time: ${totalTime}, Osc: ${totalOsc}, Resolve: ${timeOfResolve}, Hold: ${timeOfHold}`)

                oscillatorArray.forEach((oscNode, index) => {
                    oscNode.start();
                });

                animateFilter(audioCtx, mixer, Math.floor(timeOfResolve));

                fadeInOut(audioCtx, mixer, Math.floor(timeOfResolve), Math.floor(timeOfHold));

                setTimeout(() => {
                    moveToTargetFrequencies(audioCtx, oscillatorArray, Math.floor(timeOfResolve));
                }, 1000);

                var displayUpdate;
                updateFilterDisplay(mixer, true);
                setTimeout(() => {
                    displayUpdate = setInterval(() => {
                        updateFilterDisplay(mixer, false);
                    }, 1);
                }, 1000);

                setTimeout(() => {
                    oscillatorArray.forEach((oscNode) => {
                        try {
                            oscNode.stop();
                        } catch (error) {
                            console.error("Oscillator already stopped or error:", error);
                        }
                    });

                    visualizers.forEach(visualizer => visualizer.stop());

                    volumeInput.removeEventListener("input", volumeHandler);

                    mixer.disconnect();
                    clearInterval(displayUpdate);
                    resetDisplay();
                    audioCtx.close();
                }, ((timeOfResolve + timeOfHold) * 1000));
            });
        });
    } else {
        console.error("Start button not found!");
    }
});

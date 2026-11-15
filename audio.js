/**
 * SPACE MISSION 3D – NASA EXPLORER
 * Sound Synthesizer Engine (Web Audio API)
 * Procedural generation of realistic NASA spaceflight sounds, telemetry beeps, and alerts.
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.masterVolume = 0.7;
        this.masterGain = null;
        this.engineGain = null;
        this.engineOsc = null;
        this.engineNoise = null;
        this.isEngineRunning = false;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);
            this.initEngineAudio();
            this.initialized = true;
        } catch (e) {
            console.warn("Web Audio API not supported or blocked:", e);
        }
    }

    resume() {
        if (!this.initialized) {
            this.init();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.masterVolume, this.ctx.currentTime);
        }
        return this.muted;
    }

    setVolume(val) {
        this.masterVolume = Math.max(0, Math.min(1, val));
        if (this.masterGain && this.ctx && !this.muted) {
            this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
        }
    }

    // Continuous Propulsion Sound Loop
    initEngineAudio() {
        if (!this.ctx) return;
        // Low rumble oscillator
        this.engineOsc = this.ctx.createOscillator();
        this.engineOsc.type = 'triangle';
        this.engineOsc.frequency.setValueAtTime(45, this.ctx.currentTime);

        // Brown noise buffer for rocket exhaust turbulence
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5;
        }
        this.engineNoise = this.ctx.createBufferSource();
        this.engineNoise.buffer = noiseBuffer;
        this.engineNoise.loop = true;

        // Bandpass filter for rocket jet roar
        this.engineFilter = this.ctx.createBiquadFilter();
        this.engineFilter.type = 'lowpass';
        this.engineFilter.frequency.setValueAtTime(220, this.ctx.currentTime);

        this.engineGain = this.ctx.createGain();
        this.engineGain.gain.setValueAtTime(0, this.ctx.currentTime);

        this.engineOsc.connect(this.engineGain);
        this.engineNoise.connect(this.engineFilter);
        this.engineFilter.connect(this.engineGain);
        this.engineGain.connect(this.masterGain);

        this.engineOsc.start();
        this.engineNoise.start();
        this.isEngineRunning = true;
    }

    // Update rocket sound based on throttle (0.0 to 1.0)
    updateEngineSound(throttle) {
        if (!this.initialized || !this.engineGain || this.muted) return;
        const t = this.ctx.currentTime;
        const targetVol = throttle > 0.01 ? Math.min(0.45, throttle * 0.45) : 0;
        this.engineGain.gain.setTargetAtTime(targetVol, t, 0.08);
        if (this.engineOsc) {
            this.engineOsc.frequency.setTargetAtTime(40 + throttle * 80, t, 0.1);
        }
        if (this.engineFilter) {
            this.engineFilter.frequency.setTargetAtTime(180 + throttle * 550, t, 0.1);
        }
    }

    // RCS Thruster Cold Gas Burst
    playRCS() {
        if (!this.initialized || this.muted) return;
        const t = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.15;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.04));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, t);
        filter.Q.setValueAtTime(2.0, t);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        noise.start(t);
    }

    // Iconic NASA Quindar Comms Tone (Intro/Outro)
    playQuindar(intro = true) {
        if (!this.initialized || this.muted) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // 2524 Hz for intro beep, 2475 Hz for outro beep
        osc.type = 'sine';
        osc.frequency.setValueAtTime(intro ? 2524 : 2475, t);

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.setValueAtTime(0.12, t + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.095);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.1);
    }

    // UI Click / Switch Toggle
    playClick() {
        if (!this.initialized || this.muted) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.04);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.05);
    }

    // Science Scanner Pulse
    playScannerPulse() {
        if (!this.initialized || this.muted) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.exponentialRampToValueAtTime(1400, t + 0.35);

        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.42);
    }

    // Science Sample Discovery / Objective Complete Chime
    playSuccess() {
        if (!this.initialized || this.muted) return;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        const t = this.ctx.currentTime;
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t + idx * 0.1);
            gain.gain.setValueAtTime(0.14, t + idx * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.1 + 0.3);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(t + idx * 0.1);
            osc.stop(t + idx * 0.1 + 0.35);
        });
    }

    // Warning / Alarm Klaxon for Emergencies and Collisions
    playAlarm() {
        if (!this.initialized || this.muted) return;
        const t = this.ctx.currentTime;
        for (let i = 0; i < 2; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            const startT = t + i * 0.22;
            osc.frequency.setValueAtTime(880, startT);
            osc.frequency.linearRampToValueAtTime(580, startT + 0.18);

            gain.gain.setValueAtTime(0.18, startT);
            gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.2);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(startT);
            osc.stop(startT + 0.22);
        }
    }

    // Impact / Hull Collision Thud
    playImpact() {
        if (!this.initialized || this.muted) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(160, t);
        osc.frequency.exponentialRampToValueAtTime(30, t + 0.25);

        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.3);
    }
}

// Global Sound Instance
window.NASA_AUDIO = new SoundEngine();

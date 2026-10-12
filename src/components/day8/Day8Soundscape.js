// Soft, ethereal ambient sound effects synthesized via Web Audio API
// Lightweight, zero external files required, 100% reliable.

class Day8AudioEffects {
  constructor() {
    this.ctx = null;
    this.ambientOsc = null;
    this.ambientGain = null;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    } catch {
      // Audio not supported or blocked
    }
  }

  playChime(noteIndex = 0) {
    this.init();
    if (!this.ctx) return;

    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      // Ethereal Pentatonic Frequencies (C4, D4, E4, G4, A4, C5, E5)
      const frequencies = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 659.25];
      const freq = frequencies[noteIndex % frequencies.length] || 329.63;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.6);
    } catch {
      // Ignore
    }
  }

  playCosmicPulse() {
    this.init();
    if (!this.ctx) return;

    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(146.83, now); // D3
      osc.frequency.exponentialRampToValueAtTime(220.00, now + 1.2); // A3

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.5);
    } catch {
      // Ignore
    }
  }
}

export const day8Sound = new Day8AudioEffects();

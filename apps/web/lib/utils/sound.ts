'use client';

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    return this.audioContext;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  private playTone(frequency: number, duration: number, volume: number = 0.03, type: OscillatorType = 'sine') {
    if (!this.enabled) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not available
    }
  }

  click() {
    this.playTone(800, 0.06, 0.02, 'sine');
  }

  keypress() {
    this.playTone(600, 0.05, 0.015, 'triangle');
  }

  calculate() {
    this.playTone(1200, 0.1, 0.025, 'sine');
    setTimeout(() => this.playTone(1500, 0.08, 0.02, 'sine'), 50);
  }

  error() {
    this.playTone(200, 0.15, 0.03, 'sawtooth');
  }

  clear() {
    this.playTone(400, 0.08, 0.02, 'triangle');
  }
}

export const soundManager = new SoundManager();

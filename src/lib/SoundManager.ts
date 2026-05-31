class SoundManager {
  private ctx: AudioContext | null = null;
  private enabled = true;
  private clickSound: string = "glitch";
  private hoverSound: string = "tick";
  private audioInstances: HTMLAudioElement[] = [];

  private async playAudioFile(filePath: string, volume: number = 0.7) {
    try {
      const audio = new Audio(filePath);
      audio.volume = volume;
      audio.currentTime = 0;
      
      // Handle browser autoplay restrictions
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
      
      this.audioInstances.push(audio);
      audio.onended = () => {
        const idx = this.audioInstances.indexOf(audio);
        if (idx > -1) this.audioInstances.splice(idx, 1);
      };
      audio.onerror = (err) => {
        console.error(`Audio error for ${filePath}:`, err);
        const idx = this.audioInstances.indexOf(audio);
        if (idx > -1) this.audioInstances.splice(idx, 1);
      };
    } catch (err) {
      console.error(`Failed to play audio ${filePath}:`, err);
    }
  }

  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext();
    return this.ctx;
  }

  setEnabled(v: boolean) { this.enabled = v; }
  setClickSound(v: string) { this.clickSound = v; }
  setHoverSound(v: string) { this.hoverSound = v; }

  playClick() {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    const map: Record<string, () => void> = {
      glitch:  () => this._glitchClick(ctx),
      pop:     () => this._softPop(ctx),
      faah:    () => this._neonBuzz(ctx),
      tap:     () => this._digitalTap(ctx),
      crystal: () => this._crystalClick(ctx),
      yemete:  () => this._yemete(),
    };
    (map[this.clickSound] ?? map.glitch)();
  }

  playHover() {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    const map: Record<string, () => void> = {
      tick:    () => this._subtleTick(ctx),
      whoosh:  () => this._softWhoosh(ctx),
      blip:    () => this._digitalBlip(ctx),
      flicker: () => this._neonFlicker(ctx),
      swoosh:  () => this._softSwoosh(ctx),
    };
    (map[this.hoverSound] ?? map.tick)();
  }

  // ── CLICK SOUNDS ─────────────────────────────

  private _glitchClick(ctx: AudioContext) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1800;
    filter.Q.value = 0.8;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    src.start();
  }

  private _softPop(ctx: AudioContext) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.1);
  }

  private _neonBuzz(ctx: AudioContext) {
    this.playAudioFile("/faah.mp3");
  }

  private _digitalTap(ctx: AudioContext) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (i < 10 ? 1 : Math.random() * 0.3) * (1 - i / data.length);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    src.connect(gain); gain.connect(ctx.destination);
    src.start();
  }

  private _crystalClick(ctx: AudioContext) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(2400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.15);
  }

  private _yemete() {
    this.playAudioFile("/yemete.mp3");
  }

  // ── HOVER SOUNDS ─────────────────────────────

  private _subtleTick(ctx: AudioContext) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.04);
  }

  private _softWhoosh(ctx: AudioContext) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length;
      data[i] = (Math.random() * 2 - 1) * Math.sin(t * Math.PI) * 0.4;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1200;
    filter.Q.value = 0.5;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    src.start();
  }

  private _digitalBlip(ctx: AudioContext) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(900, ctx.currentTime);
    osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.02);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2000;
    osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.05);
  }

  private _neonFlicker(ctx: AudioContext) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(80, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.setValueAtTime(0.0,  ctx.currentTime + 0.015);
    gain.gain.setValueAtTime(0.03, ctx.currentTime + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 600;
    osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.06);
  }

  private _softSwoosh(ctx: AudioContext) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length;
      data[i] = (Math.random() * 2 - 1) * (t < 0.3 ? t / 0.3 : 1 - (t - 0.3) / 0.7) * 0.3;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 2000;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.07, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    src.start();
  }
}

export const soundManager = new SoundManager();
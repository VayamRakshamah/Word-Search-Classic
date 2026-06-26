// Web Audio API Synthesizer Sound Engine for high-performance offline arcade audio
let audioCtx: AudioContext | null = null;
let soundEnabled = true;
let hapticEnabled = true;

function getAudioContext(): AudioContext | null {
  if (!soundEnabled) return null;
  
  if (!audioCtx) {
    // Standard and vendor-prefixed AudioContext
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }

  // Resume context if suspended (browser security policy)
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  return audioCtx;
}

export const SoundEngine = {
  setSoundEnabled(enabled: boolean) {
    soundEnabled = enabled;
  },

  setHapticEnabled(enabled: boolean) {
    hapticEnabled = enabled;
  },

  // Simulates an Android haptic pulse
  vibrate(duration: number | number[]) {
    if (!hapticEnabled) return;
    if (navigator.vibrate) {
      try {
        navigator.vibrate(duration);
      } catch (e) {
        // Ignore haptic failures
      }
    }
  },

  playClick() {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  },

  playSuccess() {
    const ctx = getAudioContext();
    if (!ctx) {
      // Still vibrate even if sound is disabled
      this.vibrate(80);
      return;
    }

    this.vibrate([40, 30, 60]);

    const now = ctx.currentTime;
    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.12, start);
      gain.gain.linearRampToValueAtTime(0.001, start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + duration);
    };

    // Nice rapid major chord arpeggio (C5 -> E5 -> G5 -> C6)
    playTone(523.25, now, 0.12); // C5
    playTone(659.25, now + 0.08, 0.12); // E5
    playTone(783.99, now + 0.16, 0.12); // G5
    playTone(1046.50, now + 0.24, 0.25); // C6
  },

  playError() {
    const ctx = getAudioContext();
    if (!ctx) {
      this.vibrate(150);
      return;
    }

    this.vibrate(150);

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.25);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(now + 0.25);
  },

  playHint() {
    const ctx = getAudioContext();
    if (!ctx) {
      this.vibrate(40);
      return;
    }

    this.vibrate(40);
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, now); // A5
    osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.15); // A6

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(1318.51, now + 0.05); // E6

    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.linearRampToValueAtTime(0.001, now + 0.15);

    gain2.gain.setValueAtTime(0.06, now + 0.05);
    gain2.gain.linearRampToValueAtTime(0.001, now + 0.2);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start();
    osc2.start(now + 0.05);

    osc1.stop(now + 0.15);
    osc2.stop(now + 0.2);
  },

  playWin() {
    const ctx = getAudioContext();
    if (!ctx) {
      this.vibrate([100, 50, 100, 50, 150]);
      return;
    }

    this.vibrate([100, 50, 100, 50, 150]);
    const now = ctx.currentTime;

    const notes = [
      { f: 523.25, t: 0 },    // C5
      { f: 587.33, t: 0.15 }, // D5
      { f: 659.25, t: 0.3 },  // E5
      { f: 783.99, t: 0.45 }, // G5
      { f: 659.25, t: 0.6 },  // E5
      { f: 783.99, t: 0.75 }, // G5
      { f: 1046.50, t: 0.9 }, // C6
    ];

    notes.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(note.f, now + note.t);

      gain.gain.setValueAtTime(0.12, now + note.t);
      gain.gain.linearRampToValueAtTime(0.001, now + note.t + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + note.t);
      osc.stop(now + note.t + 0.25);
    });
  },
};

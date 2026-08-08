/**
 * Plays a short two-tone "ping" using the Web Audio API — no audio file needed,
 * works offline. Browsers block audio until the user has interacted with the
 * page, so any failure is swallowed silently.
 */
export function playPing() {
  if (typeof window === "undefined") return;
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return;

    const ctx = new Ctx();
    const now = ctx.currentTime;

    const tone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, now + start);
      gain.gain.exponentialRampToValueAtTime(0.22, now + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);
      osc.start(now + start);
      osc.stop(now + start + duration);
    };

    tone(880, 0, 0.18); // A5
    tone(1174.7, 0.16, 0.28); // D6

    window.setTimeout(() => ctx.close().catch(() => {}), 700);
  } catch {
    /* audio blocked or unavailable — ignore */
  }
}

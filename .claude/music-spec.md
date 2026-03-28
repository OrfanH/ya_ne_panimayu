PASS

# music-spec.md — Один Семестр Audio Identity

## Global audio rules

- All synthesis via Tone.js — no audio files, no CDN audio assets
- Master volume: 0.4 default, user-adjustable via UI slider
- All loops seamless — loopEnd aligned to bar length at the given BPM
- Mobile: audio starts only on first user interaction via `Tone.start()`
- Mute toggle: sets `Tone.Master.mute = true` instantly, silences reverb tails via immediate ramp to -Infinity dB over 50ms
- Dialogue open: crossfade master volume to 20% over 500ms using `Tone.Master.volume.rampTo()`
- Dialogue close: crossfade master volume back to location full level over 800ms
- Each location owns one `Tone.Transport` loop; on scene change, stop current loop, start new loop after crossfade-in delay
- Global reverb: `Tone.Reverb` with decay 2.5s, wet 0.25, shared across all melodic synths
- Global compressor: `Tone.Compressor` threshold -18dB, ratio 4, on master chain

---

## Locations

### Apartment

**Mood:** Quiet, slightly lonely, hopeful — home but not yet home.

- **Tempo:** 68–72 BPM
- **Key:** D minor (D–E–F–G–A–Bb–C)
- **Synth palette:**
  - Melody: `AMSynth` — harmonicity 1.5, modulation type "sine", attack 0.4s, release 2s
  - Pad: `PolySynth(Synth)` — triangle oscillator, long attack 1.2s, sustain 0.7, release 3s
  - Subtle texture: `NoiseSynth` — pink noise, very low volume (0.04), envelope attack 2s to mimic room hum
- **Melody:** 8-bar loop. Single-voice AMSynth plays a sparse descending motif: D4–C4–Bb3–A3, held notes (each 1.5–2 beats), rests of 1 bar between phrases. Pad holds a Dm chord (D3–F3–A3) as a sustained wash beneath.
- **Loop length:** 8 bars
- **Crossfade in:** 1200ms

---

### Park

**Mood:** Open, gentle, uncertain — first time outside alone.

- **Tempo:** 76–80 BPM
- **Key:** G major (G–A–B–C–D–E–F#)
- **Synth palette:**
  - Melody: `PluckSynth` — attackNoise 1, dampening 4000Hz, resonance 0.7 (evokes balalaika-like pluck)
  - Harmony: `PolySynth(Synth)` — sine oscillator, soft attack 0.3s, low volume (0.2)
  - Ambient: `AMSynth` — slow LFO modulation, very low volume (0.1), sustain notes only
- **Melody:** 8-bar loop. PluckSynth plays a gentle ascending arpeggio: G4–B4–D5–G5 over 2 bars, then a descending answer phrase: E5–D5–B4–G4, over 2 bars. Bars 5–8 repeat with minor variation — substitute E4 for G4 on repeat. PolySynth pads G major and Em chords on bars 1 and 5.
- **Loop length:** 8 bars
- **Crossfade in:** 1000ms

---

### Café

**Mood:** Warm hum, comfortable chatter — starting to belong.

- **Tempo:** 88–92 BPM
- **Key:** C major (C–D–E–F–G–A–B)
- **Synth palette:**
  - Melody: `FMSynth` — harmonicity 2, modulation index 5, sine carrier, envelope attack 0.1s, release 0.8s (warm, slightly buzzy)
  - Bass: `MonoSynth` — sawtooth oscillator, filter cutoff 400Hz, attack 0.05s (walking bass feel)
  - Percussion: `MembraneSynth` — low pitchDecay 0.08s, octaves 4, very soft volume (0.15), on beats 2 and 4
- **Melody:** 8-bar loop. FMSynth plays a cheerful stepwise motif: C5–D5–E5–G5 (bar 1), rest (bar 2), G5–A5–G5–E5 (bar 3), C5 held (bar 4). Repeat bars 1–4 with a turnaround: F5–E5–D5–C5 on bar 8. MonoSynth walks C3–E3–G3–B3–C4 across each chord change.
- **Loop length:** 8 bars
- **Crossfade in:** 800ms

---

### Market

**Mood:** Lively, layered, energy without chaos — dill and diesel.

- **Tempo:** 100–104 BPM
- **Key:** A minor (A–B–C–D–E–F–G)
- **Synth palette:**
  - Melody: `FMSynth` — harmonicity 3, modulation index 8, attack 0.05s, release 0.4s (bright, cutting)
  - Rhythm pad: `AMSynth` — square modulation, short attack 0.02s, release 0.3s, on offbeats
  - Bass: `MonoSynth` — square oscillator, filter cutoff 600Hz, resonance 2
  - Percussion: `MembraneSynth` — pitchDecay 0.05s, on beats 1 and 3; plus `MetalSynth` — frequency 400Hz, envelope 0.02s decay, on every beat as a light tap
- **Melody:** 4-bar loop (fast energy). FMSynth plays a short repeating figure: A4–C5–E5–A5 (bar 1), G5–E5–D5 (bar 2), C5–E5–F5–E5 (bar 3), A4 held (bar 4). AMSynth hits Am and C chords on beats 2 and 4. Bass pumps A2–A2–C3–E3 quarter notes throughout.
- **Loop length:** 4 bars
- **Crossfade in:** 600ms

---

### Train Station

**Mood:** Wide, transient, slightly anxious — things are changing.

- **Tempo:** 84–88 BPM
- **Key:** B minor (B–C#–D–E–F#–G–A)
- **Synth palette:**
  - Atmosphere: `AMSynth` — harmonicity 0.5, sine modulation, very slow attack 2s, long release 4s, low volume (0.15)
  - Melody: `PolySynth(Synth)` — sine oscillator, attack 0.2s, release 1.5s (sparse, thoughtful)
  - Texture: `NoiseSynth` — white noise, very low volume (0.03), slow attack 3s, creates distant hall ambience
  - Accent: `MetalSynth` — frequency 200Hz, decay 0.4s, very sparse (once every 4 bars), evokes distant bell/announcement chime
- **Melody:** 16-bar loop. PolySynth plays a sparse, wide-interval melody: B3 (2 bars rest), F#4–E4–D4 descending (bar 3), rest (bar 4), D4–E4–F#4–B4 ascending (bars 5–6), rest 2 bars, repeat with harmonic variation adding G4 passing tone. AMSynth sustains Bm and G chords beneath throughout.
- **Loop length:** 16 bars
- **Crossfade in:** 1500ms

---

### Police Station

**Mood:** Sparse, formal, careful — every word matters.

- **Tempo:** 60–64 BPM
- **Key:** E minor (E–F#–G–A–B–C–D)
- **Synth palette:**
  - Melody: `AMSynth` — harmonicity 1, modulation type "square", slow attack 0.6s, release 2.5s (cold, slightly mechanical)
  - Pad: `PolySynth(Synth)` — triangle oscillator, very long attack 2s, sustain 0.5, release 4s, low volume (0.18)
  - Sub: `MonoSynth` — sine oscillator, filter cutoff 120Hz, held root notes only, very low volume (0.12)
- **Melody:** 16-bar loop. Extremely sparse. AMSynth plays isolated single notes with long rests: E3 (hold 2 beats, rest 2 bars), B3 (hold 1 beat, rest 3 bars), G3–F#3 (half-step descent, 1 beat each, rest 4 bars). Pad sustains Em chord (E3–G3–B3) as a near-inaudible wash throughout. No rhythmic pulse — time feels suspended.
- **Loop length:** 16 bars
- **Crossfade in:** 2000ms

/* ============================================
   AudioManager — Tone.js ambient music system
   IIFE module. All audio via synthesis — no audio files.
   Audio starts only on first user interaction via Tone.start().
   ============================================ */

const AudioManager = (() => {
  /* ---- State ---- */
  let _currentLocation = null;
  let _isMuted = false;
  let _isStarted = false;
  let _activeEntry = null; // { synths: [], parts: [], cleanup: fn }
  let _muteBtn = null;
  let _userVolume = 80; // 0–100, maps to dB on Tone destination

  /* ---- Shared effects (created once on init) ---- */
  let _reverb = null;
  let _compressor = null;

  /* ---- Volume constants (dB) ---- */
  const VOL_NORMAL = 0;
  const VOL_DUCKED = -14;    // dialogue open — 20% perceived level
  const VOL_MUTED  = -Infinity;
  const VOL_MASTER_GAIN = 0.4;
  const VOL_MUTED_FLOOR = -40; // dB floor for user volume level 1

  /* ---- Ramp durations (seconds) ---- */
  const RAMP_DUCK   = 0.5;
  const RAMP_UNDUCK = 0.8;
  const RAMP_MUTE   = 0.05;

  /* ============================================================
     LOCATION FACTORIES
     Each returns { synths: [], parts: [], cleanup: fn }
  ============================================================ */

  function _createApartment() {
    // 68 BPM, D minor, 8 bars
    Tone.getTransport().bpm.value = 68;

    const synths = [];
    const parts = [];

    // PolySynth pad — Dm wash
    const pad = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 2, decay: 1, sustain: 0.8, release: 4 },
      volume: -18,
    }).connect(_reverb);
    synths.push(pad);

    const padPart = new Tone.Part((time) => {
      pad.triggerAttackRelease(['D3', 'F3', 'A3'], '4m', time);
    }, [['0:0:0']]);
    padPart.loop = true;
    padPart.loopEnd = '8m';
    parts.push(padPart);

    // AMSynth melody — sparse held notes
    const melody = new Tone.AMSynth({
      harmonicity: 2,
      envelope: { attack: 0.8, decay: 0.5, sustain: 0.6, release: 3 },
      volume: -20,
    }).connect(_reverb);
    synths.push(melody);

    const melodyNotes = [
      ['0:0:0', 'D4', '2n'],
      ['0:2:0', 'C4', '4n'],
      ['1:0:0', 'Bb3', '2n.'],
      ['2:0:0', 'A3', '1m'],
      ['4:0:0', 'D4', '2n'],
      ['5:0:0', 'C4', '4n'],
      ['6:0:0', 'Bb3', '2n'],
      ['7:0:0', 'A3', '1m'],
    ];
    const melodyPart = new Tone.Part((time, note) => {
      melody.triggerAttackRelease(note[0], note[1], time);
    }, melodyNotes.map(([t, n, d]) => [t, [n, d]]));
    melodyPart.loop = true;
    melodyPart.loopEnd = '8m';
    parts.push(melodyPart);

    // NoiseSynth — pink, very low
    const noise = new Tone.NoiseSynth({
      noise: { type: 'pink' },
      envelope: { attack: 2, decay: 0, sustain: 1, release: 2 },
      volume: -42,
    }).connect(_reverb);
    synths.push(noise);
    noise.triggerAttack();

    return {
      synths,
      parts,
      cleanup: () => { noise.triggerRelease(); },
    };
  }

  function _createPark() {
    // 76 BPM, G major, 8 bars
    Tone.getTransport().bpm.value = 76;

    const synths = [];
    const parts = [];

    // PolySynth harmony — G major and Em pads
    const pad = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 1.5, decay: 0.5, sustain: 0.7, release: 3 },
      volume: -20,
    }).connect(_reverb);
    synths.push(pad);

    const padPart = new Tone.Part((time, chord) => {
      pad.triggerAttackRelease(chord, '2m', time);
    }, [
      ['0:0:0', ['G3', 'B3', 'D4']],
      ['2:0:0', ['E3', 'G3', 'B3']],
      ['4:0:0', ['G3', 'B3', 'D4']],
      ['6:0:0', ['E3', 'G3', 'B3']],
    ]);
    padPart.loop = true;
    padPart.loopEnd = '8m';
    parts.push(padPart);

    // PluckSynth melody — ascending and descending
    const pluck = new Tone.PluckSynth({
      attackNoise: 1,
      dampening: 4000,
      resonance: 0.97,
      volume: -14,
    }).connect(_reverb);
    synths.push(pluck);

    const pluckNotes = [
      ['0:0:0', 'G4'],
      ['0:1:0', 'B4'],
      ['0:2:0', 'D5'],
      ['0:3:0', 'G5'],
      ['1:0:0', 'E5'],
      ['1:1:0', 'D5'],
      ['1:2:0', 'B4'],
      ['1:3:0', 'G4'],
      ['4:0:0', 'G4'],
      ['4:1:0', 'B4'],
      ['4:2:0', 'D5'],
      ['4:3:0', 'G5'],
      ['5:0:0', 'E5'],
      ['5:1:0', 'D5'],
      ['5:2:0', 'B4'],
      ['5:3:0', 'G4'],
    ];
    const pluckPart = new Tone.Part((time, note) => {
      pluck.triggerAttackRelease(note, '8n', time);
    }, pluckNotes);
    pluckPart.loop = true;
    pluckPart.loopEnd = '8m';
    parts.push(pluckPart);

    return { synths, parts, cleanup: () => {} };
  }

  function _createCafe() {
    // 88 BPM, C major, 8 bars
    Tone.getTransport().bpm.value = 88;

    const synths = [];
    const parts = [];

    // FMSynth melody — cheerful stepwise
    const fmMelody = new Tone.FMSynth({
      harmonicity: 3,
      modulationIndex: 10,
      envelope: { attack: 0.05, decay: 0.2, sustain: 0.5, release: 0.8 },
      modulationEnvelope: { attack: 0.05, decay: 0.2, sustain: 0.3, release: 0.8 },
      volume: -16,
    }).connect(_reverb);
    synths.push(fmMelody);

    const fmNotes = [
      ['0:0:0', 'C5', '8n'],
      ['0:1:0', 'D5', '8n'],
      ['0:2:0', 'E5', '8n'],
      ['0:3:0', 'G5', '4n'],
      ['1:2:0', 'E5', '8n'],
      ['1:3:0', 'D5', '8n'],
      ['2:0:0', 'C5', '4n.'],
      ['4:0:0', 'C5', '8n'],
      ['4:1:0', 'D5', '8n'],
      ['4:2:0', 'E5', '8n'],
      ['4:3:0', 'G5', '4n'],
      ['5:2:0', 'E5', '8n'],
      ['5:3:0', 'D5', '8n'],
      ['6:0:0', 'C5', '2n'],
    ];
    const fmPart = new Tone.Part((time, v) => {
      fmMelody.triggerAttackRelease(v[0], v[1], time);
    }, fmNotes.map(([t, n, d]) => [t, [n, d]]));
    fmPart.loop = true;
    fmPart.loopEnd = '8m';
    parts.push(fmPart);

    // MonoSynth bass — walking
    const bass = new Tone.MonoSynth({
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.05, decay: 0.1, sustain: 0.5, release: 0.3 },
      filterEnvelope: { attack: 0.05, decay: 0.2, sustain: 0.5, baseFrequency: 200, octaves: 3 },
      volume: -22,
    }).connect(_compressor);
    synths.push(bass);

    const bassNotes = [
      ['0:0:0', 'C3'],
      ['0:2:0', 'E3'],
      ['1:0:0', 'G3'],
      ['1:2:0', 'B3'],
      ['2:0:0', 'C3'],
      ['2:2:0', 'E3'],
      ['3:0:0', 'G3'],
      ['3:2:0', 'C3'],
      ['4:0:0', 'C3'],
      ['4:2:0', 'E3'],
      ['5:0:0', 'G3'],
      ['5:2:0', 'B3'],
      ['6:0:0', 'C3'],
      ['6:2:0', 'E3'],
      ['7:0:0', 'G3'],
      ['7:2:0', 'C3'],
    ];
    const bassPart = new Tone.Part((time, note) => {
      bass.triggerAttackRelease(note, '8n', time);
    }, bassNotes);
    bassPart.loop = true;
    bassPart.loopEnd = '8m';
    parts.push(bassPart);

    // MembraneSynth — soft hits on beats 2 and 4
    const drums = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 4,
      envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 },
      volume: -28,
    }).connect(_compressor);
    synths.push(drums);

    const drumPattern = [];
    for (let bar = 0; bar < 8; bar++) {
      drumPattern.push([`${bar}:1:0`, 'C2']);
      drumPattern.push([`${bar}:3:0`, 'C2']);
    }
    const drumPart = new Tone.Part((time, note) => {
      drums.triggerAttackRelease(note, '8n', time);
    }, drumPattern);
    drumPart.loop = true;
    drumPart.loopEnd = '8m';
    parts.push(drumPart);

    return { synths, parts, cleanup: () => {} };
  }

  function _createMarket() {
    // 100 BPM, A minor, 4 bars
    Tone.getTransport().bpm.value = 100;

    const synths = [];
    const parts = [];

    // FMSynth melody — bright
    const fmMelody = new Tone.FMSynth({
      harmonicity: 2,
      modulationIndex: 8,
      envelope: { attack: 0.02, decay: 0.1, sustain: 0.4, release: 0.5 },
      volume: -16,
    }).connect(_reverb);
    synths.push(fmMelody);

    const fmNotes = [
      ['0:0:0', 'A4', '8n'],
      ['0:1:0', 'C5', '8n'],
      ['0:2:0', 'E5', '8n'],
      ['0:3:0', 'A5', '4n'],
      ['2:0:0', 'A4', '8n'],
      ['2:1:0', 'C5', '8n'],
      ['2:2:0', 'E5', '8n'],
      ['2:3:0', 'A5', '4n'],
    ];
    const fmPart = new Tone.Part((time, v) => {
      fmMelody.triggerAttackRelease(v[0], v[1], time);
    }, fmNotes.map(([t, n, d]) => [t, [n, d]]));
    fmPart.loop = true;
    fmPart.loopEnd = '4m';
    parts.push(fmPart);

    // AMSynth rhythm — offbeat chords
    const amRhythm = new Tone.AMSynth({
      harmonicity: 1,
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.2 },
      volume: -22,
    }).connect(_reverb);
    synths.push(amRhythm);

    const amPattern = [];
    for (let bar = 0; bar < 4; bar++) {
      amPattern.push([`${bar}:0:2`, 'A4']);
      amPattern.push([`${bar}:1:2`, 'C5']);
      amPattern.push([`${bar}:2:2`, 'E5']);
      amPattern.push([`${bar}:3:2`, 'A4']);
    }
    const amPart = new Tone.Part((time, note) => {
      amRhythm.triggerAttackRelease(note, '16n', time);
    }, amPattern);
    amPart.loop = true;
    amPart.loopEnd = '4m';
    parts.push(amPart);

    // MonoSynth bass — A2 pump
    const bass = new Tone.MonoSynth({
      oscillator: { type: 'square' },
      envelope: { attack: 0.01, decay: 0.15, sustain: 0.3, release: 0.2 },
      volume: -20,
    }).connect(_compressor);
    synths.push(bass);

    const bassPattern = [];
    for (let bar = 0; bar < 4; bar++) {
      bassPattern.push([`${bar}:0:0`, 'A2']);
      bassPattern.push([`${bar}:2:0`, 'A2']);
    }
    const bassPart = new Tone.Part((time, note) => {
      bass.triggerAttackRelease(note, '8n', time);
    }, bassPattern);
    bassPart.loop = true;
    bassPart.loopEnd = '4m';
    parts.push(bassPart);

    // MembraneSynth + MetalSynth percussion
    const kick = new Tone.MembraneSynth({
      pitchDecay: 0.04,
      octaves: 6,
      envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 },
      volume: -24,
    }).connect(_compressor);
    synths.push(kick);

    const metal = new Tone.MetalSynth({
      frequency: 400,
      envelope: { attack: 0.001, decay: 0.1, release: 0.05 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5,
      volume: -30,
    }).connect(_compressor);
    synths.push(metal);

    const percPattern = [];
    for (let bar = 0; bar < 4; bar++) {
      percPattern.push([`${bar}:0:0`, 'kick']);
      percPattern.push([`${bar}:1:0`, 'metal']);
      percPattern.push([`${bar}:2:0`, 'kick']);
      percPattern.push([`${bar}:2:2`, 'metal']);
      percPattern.push([`${bar}:3:0`, 'metal']);
    }
    const percPart = new Tone.Part((time, type) => {
      if (type === 'kick') {
        kick.triggerAttackRelease('C2', '8n', time);
      } else {
        metal.triggerAttackRelease('16n', time);
      }
    }, percPattern);
    percPart.loop = true;
    percPart.loopEnd = '4m';
    parts.push(percPart);

    return { synths, parts, cleanup: () => {} };
  }

  function _createStation() {
    // 84 BPM, B minor, 16 bars
    Tone.getTransport().bpm.value = 84;

    const synths = [];
    const parts = [];

    // AMSynth atmosphere — slow sustained
    const atmos = new Tone.AMSynth({
      harmonicity: 0.5,
      envelope: { attack: 3, decay: 1, sustain: 0.7, release: 5 },
      volume: -24,
    }).connect(_reverb);
    synths.push(atmos);

    const atmosPart = new Tone.Part((time, note) => {
      atmos.triggerAttackRelease(note, '4m', time);
    }, [
      ['0:0:0', 'B2'],
      ['4:0:0', 'F#3'],
      ['8:0:0', 'B2'],
      ['12:0:0', 'D3'],
    ]);
    atmosPart.loop = true;
    atmosPart.loopEnd = '16m';
    parts.push(atmosPart);

    // PolySynth sparse melody
    const sparseMel = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 1, decay: 0.5, sustain: 0.6, release: 4 },
      volume: -20,
    }).connect(_reverb);
    synths.push(sparseMel);

    const sparsePart = new Tone.Part((time, note) => {
      sparseMel.triggerAttackRelease(note, '1m', time);
    }, [
      ['0:0:0', 'B3'],
      ['3:0:0', ['F#4', 'E4']],
      ['5:0:0', 'D4'],
      ['8:0:0', 'B3'],
      ['11:0:0', ['F#4', 'E4']],
      ['13:0:0', 'D4'],
    ]);
    sparsePart.loop = true;
    sparsePart.loopEnd = '16m';
    parts.push(sparsePart);

    // NoiseSynth — white ambient
    const noise = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 2, decay: 0, sustain: 1, release: 2 },
      volume: -46,
    }).connect(_reverb);
    synths.push(noise);
    noise.triggerAttack();

    // MetalSynth bell accent every 4 bars
    const bell = new Tone.MetalSynth({
      frequency: 300,
      envelope: { attack: 0.001, decay: 1.5, release: 0.5 },
      harmonicity: 5.1,
      modulationIndex: 16,
      resonance: 3200,
      octaves: 0.5,
      volume: -26,
    }).connect(_reverb);
    synths.push(bell);

    const bellPart = new Tone.Part((time) => {
      bell.triggerAttackRelease('8n', time);
    }, [['0:0:0'], ['4:0:0'], ['8:0:0'], ['12:0:0']]);
    bellPart.loop = true;
    bellPart.loopEnd = '16m';
    parts.push(bellPart);

    return {
      synths,
      parts,
      cleanup: () => { noise.triggerRelease(); },
    };
  }

  function _createPolice() {
    // 60 BPM, E minor, 16 bars
    Tone.getTransport().bpm.value = 60;

    const synths = [];
    const parts = [];

    // AMSynth sparse melody with long rests
    const sparseMel = new Tone.AMSynth({
      harmonicity: 1.5,
      envelope: { attack: 1.5, decay: 0.5, sustain: 0.4, release: 6 },
      volume: -22,
    }).connect(_reverb);
    synths.push(sparseMel);

    const sparsePart = new Tone.Part((time, note) => {
      sparseMel.triggerAttackRelease(note, '2n', time);
    }, [
      ['0:0:0', 'E3'],
      ['2:0:0', 'B3'],
      ['5:0:0', 'G3'],
      ['6:2:0', 'F#3'],
      ['8:0:0', 'E3'],
      ['10:0:0', 'B3'],
      ['13:0:0', 'G3'],
      ['14:2:0', 'F#3'],
    ]);
    sparsePart.loop = true;
    sparsePart.loopEnd = '16m';
    parts.push(sparsePart);

    // PolySynth pad — Em wash, nearly inaudible
    const pad = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 4, decay: 1, sustain: 0.6, release: 6 },
      volume: -34,
    }).connect(_reverb);
    synths.push(pad);

    const padPart = new Tone.Part((time) => {
      pad.triggerAttackRelease(['E3', 'G3', 'B3'], '8m', time);
    }, [['0:0:0'], ['8:0:0']]);
    padPart.loop = true;
    padPart.loopEnd = '16m';
    parts.push(padPart);

    // MonoSynth sub — 120Hz root notes
    const sub = new Tone.MonoSynth({
      oscillator: { type: 'sine' },
      envelope: { attack: 1, decay: 0.5, sustain: 0.8, release: 3 },
      volume: -28,
    }).connect(_compressor);
    synths.push(sub);

    // 120Hz ≈ B2 in equal temperament
    const subPart = new Tone.Part((time) => {
      sub.triggerAttackRelease('B2', '4m', time);
    }, [['0:0:0'], ['4:0:0'], ['8:0:0'], ['12:0:0']]);
    subPart.loop = true;
    subPart.loopEnd = '16m';
    parts.push(subPart);

    return { synths, parts, cleanup: () => {} };
  }

  /* ---- Location factory map ---- */
  const _locationFactories = {
    apartment: _createApartment,
    park:      _createPark,
    cafe:      _createCafe,
    market:    _createMarket,
    station:   _createStation,
    police:    _createPolice,
  };

  /* ============================================================
     PLAYBACK CONTROL
  ============================================================ */

  function _stopCurrent() {
    if (!_activeEntry) return;

    const entry = _activeEntry;
    _activeEntry = null;
    _currentLocation = null;

    // Stop and dispose all parts
    for (const part of entry.parts) {
      part.stop();
      part.dispose();
    }

    // Run custom cleanup (e.g. noise synth release)
    try { entry.cleanup(); } catch (_e) { /* silent */ }

    // Ramp out then dispose synths
    const dest = Tone.getDestination();
    dest.volume.rampTo(VOL_MUTED, RAMP_MUTE);

    Tone.getTransport().stop();
    Tone.getTransport().cancel();

    // Dispose synths after fade
    setTimeout(() => {
      for (const synth of entry.synths) {
        try { synth.dispose(); } catch (_e) { /* silent */ }
      }
      // Restore volume if not muted
      if (!_isMuted) {
        dest.volume.rampTo(VOL_NORMAL, 0.05);
      }
    }, 200);
  }

  function _playLocation(locationId) {
    if (!_isStarted) return;

    const factory = _locationFactories[locationId];
    if (!factory) return;

    if (_currentLocation === locationId) return;

    _stopCurrent();

    _currentLocation = locationId;

    // Small delay to allow previous synths to finish disposing
    setTimeout(() => {
      if (_currentLocation !== locationId) return; // location changed again

      const entry = factory();
      _activeEntry = entry;

      Tone.getTransport().stop();
      Tone.getTransport().cancel();
      Tone.getTransport().position = 0;

      for (const part of entry.parts) {
        part.start(0);
      }

      Tone.getTransport().start();

      if (!_isMuted) {
        Tone.getDestination().volume.rampTo(VOL_NORMAL, 0.3);
      }
    }, 250);
  }

  /* ============================================================
     DIALOGUE DUCKING
  ============================================================ */

  function _onDialogueOpen() {
    if (_isMuted) return;
    Tone.getDestination().volume.rampTo(VOL_DUCKED, RAMP_DUCK);
  }

  function _onDialogueClose() {
    if (_isMuted) return;
    Tone.getDestination().volume.rampTo(VOL_NORMAL, RAMP_UNDUCK);
  }

  /* ============================================================
     TONE.JS CONTEXT START (first interaction)
  ============================================================ */

  async function _ensureStarted() {
    if (_isStarted) return;
    try {
      await Tone.start();
      _isStarted = true;
      Tone.getDestination().volume.value = VOL_NORMAL;

      // Remove first-interaction listeners — no longer needed
      window.removeEventListener('click', _ensureStarted);
      window.removeEventListener('touchstart', _ensureStarted);
      window.removeEventListener('keydown', _ensureStarted);

      // If a location was already requested before audio started, play it now
      if (_currentLocation) {
        const loc = _currentLocation;
        _currentLocation = null; // reset so _playLocation won't skip
        _playLocation(loc);
      }
    } catch (_e) {
      /* AudioContext start failed — will retry on next interaction */
    }
  }

  /* ============================================================
     MUTE TOGGLE
  ============================================================ */

  function toggleMute() {
    _isMuted = !_isMuted;

    const dest = Tone.getDestination();
    if (_isMuted) {
      dest.volume.rampTo(VOL_MUTED, RAMP_MUTE);
    } else {
      dest.volume.rampTo(VOL_NORMAL, 0.3);
    }

    _updateMuteBtn();
  }

  function setVolume(level) {
    _userVolume = level;

    if (_isMuted) return; // mute takes priority; level stored for when unmute happens

    const dest = Tone.getDestination();
    if (level === 0) {
      dest.volume.rampTo(VOL_MUTED, RAMP_UNDUCK);
    } else {
      const db = (level / 100) * (VOL_NORMAL - VOL_MUTED_FLOOR) + VOL_MUTED_FLOOR;
      dest.volume.rampTo(db, RAMP_UNDUCK);
    }
  }

  function _updateMuteBtn() {
    if (!_muteBtn) return;
    _muteBtn.setAttribute('aria-label', _isMuted ? 'Unmute music' : 'Mute music');
    _muteBtn.classList.toggle('is-muted', _isMuted);
  }

  /* ============================================================
     MUTE BUTTON (HUD, bottom-left)
  ============================================================ */

  function _buildMuteBtn() {
    const parent = document.getElementById('hud') || document.getElementById('ui-overlay') || document.body;

    _muteBtn = document.createElement('button');
    _muteBtn.type = 'button';
    _muteBtn.id = 'audio-mute-btn';
    _muteBtn.className = 'hud-mute-btn';
    _muteBtn.setAttribute('aria-label', 'Mute music');

    // Speaker SVG — two states via CSS classes
    _muteBtn.innerHTML = `
      <svg class="mute-icon-on" width="20" height="20" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
           aria-hidden="true">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      </svg>
      <svg class="mute-icon-off" width="20" height="20" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
           aria-hidden="true">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>
      </svg>`;

    _muteBtn.addEventListener('click', () => {
      _ensureStarted();
      toggleMute();
    });

    parent.appendChild(_muteBtn);
  }

  /* ============================================================
     EVENT LISTENERS
  ============================================================ */

  function _registerListeners() {
    window.addEventListener(EVENTS.LOCATION_ENTER, (e) => {
      const id = e.detail && e.detail.id;
      if (!id) return;

      if (!_isStarted) {
        // Store the location so it plays once audio context starts
        _currentLocation = id;
        return;
      }
      _playLocation(id);
    });

    window.addEventListener(EVENTS.DIALOGUE_START, _onDialogueOpen);
    window.addEventListener(EVENTS.DIALOGUE_END, _onDialogueClose);

    // Start Tone.js context on first user interaction
    window.addEventListener('click', _ensureStarted, { once: false });
    window.addEventListener('touchstart', _ensureStarted, { once: false });
    window.addEventListener('keydown', _ensureStarted, { once: false });
  }

  /* ============================================================
     INIT + DESTROY
  ============================================================ */

  function init() {
    if (typeof Tone === 'undefined') return;

    // Shared effects chain
    _reverb = new Tone.Reverb({ decay: 2.5, wet: 0.25 }).toDestination();
    _compressor = new Tone.Compressor({ threshold: -18, ratio: 4 }).toDestination();

    // Set master gain — will be overridden once Tone context starts
    // (volume.value can't be set until context is running)
    Tone.getDestination().volume.value = VOL_NORMAL;

    _buildMuteBtn();
    _registerListeners();
  }

  function destroy() {
    _stopCurrent();

    window.removeEventListener(EVENTS.LOCATION_ENTER, _playLocation);
    window.removeEventListener(EVENTS.DIALOGUE_START, _onDialogueOpen);
    window.removeEventListener(EVENTS.DIALOGUE_END, _onDialogueClose);
    window.removeEventListener('click', _ensureStarted);
    window.removeEventListener('touchstart', _ensureStarted);
    window.removeEventListener('keydown', _ensureStarted);

    if (_reverb) { try { _reverb.dispose(); } catch (_e) { /* silent */ } _reverb = null; }
    if (_compressor) { try { _compressor.dispose(); } catch (_e) { /* silent */ } _compressor = null; }

    if (_muteBtn && _muteBtn.parentNode) {
      _muteBtn.parentNode.removeChild(_muteBtn);
      _muteBtn = null;
    }
  }

  // Boot after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init, destroy, toggleMute, setVolume };
})();

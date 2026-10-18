import { Injectable, signal } from '@angular/core';

interface NoteEvent {
  note: number;      // Frecuencia en Hz (0 = silencio)
  duration: number;  // Duración en tiempos/beats
  bass?: number[];   // Notas armónicas de fondo opcionales
}

@Injectable({
  providedIn: 'root'
})
export class AmbientAudioService {
  private audioCtx: AudioContext | null = null;
  private loopTimeoutId: number | null = null;
  private activeOscillators: OscillatorNode[] = [];
  
  readonly isPlaying = signal<boolean>(false);

  // Frecuencias base en Hz
  private readonly NOTE = {
    C3: 130.81, F3: 174.61, G3: 196.00, A3: 220.00, Bb3: 233.08, C4: 261.63,
    D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, Bb4: 466.16,
    C5: 523.25, D5: 587.33,
    REST: 0
  };

  // Frase principal de la Marcha Nupcial (Wagner)
  // [nota melodía, duración en pulsos, acordes de bajo opcionales]
  private readonly melody: NoteEvent[] = [
    // Compás 1: Ta - ta - ta - tán
    { note: this.NOTE.C4, duration: 1.0, bass: [this.NOTE.F3, this.NOTE.A3] },
    { note: this.NOTE.F4, duration: 1.5, bass: [this.NOTE.C3] },
    { note: this.NOTE.F4, duration: 0.5 },
    { note: this.NOTE.F4, duration: 1.0 },

    // Compás 2: Ta - ta - ta - tán
    { note: this.NOTE.C4, duration: 1.0, bass: [this.NOTE.C3, this.NOTE.G3] },
    { note: this.NOTE.G4, duration: 1.5 },
    { note: this.NOTE.E4, duration: 0.5 },
    { note: this.NOTE.F4, duration: 1.0 },

    // Compás 3: Ta - ta - ta - ta - tán
    { note: this.NOTE.C4, duration: 1.0, bass: [this.NOTE.F3, this.NOTE.A3] },
    { note: this.NOTE.F4, duration: 1.5 },
    { note: this.NOTE.A4, duration: 0.5 },
    { note: this.NOTE.C5, duration: 1.25, bass: [this.NOTE.Bb3, this.NOTE.D4] },
    { note: this.NOTE.Bb4, duration: 0.75 },

    // Compás 4: Resolución
    { note: this.NOTE.A4, duration: 1.0, bass: [this.NOTE.C3, this.NOTE.G3] },
    { note: this.NOTE.G4, duration: 2.0 },
    { note: this.NOTE.REST, duration: 1.0 },

    // Segunda frase (respuesta)
    { note: this.NOTE.C4, duration: 1.0, bass: [this.NOTE.F3, this.NOTE.A3] },
    { note: this.NOTE.F4, duration: 1.5, bass: [this.NOTE.C3] },
    { note: this.NOTE.F4, duration: 0.5 },
    { note: this.NOTE.F4, duration: 1.0 },

    { note: this.NOTE.C4, duration: 1.0, bass: [this.NOTE.C3, this.NOTE.G3] },
    { note: this.NOTE.G4, duration: 1.5 },
    { note: this.NOTE.E4, duration: 0.5 },
    { note: this.NOTE.F4, duration: 1.0 },

    { note: this.NOTE.C4, duration: 1.0, bass: [this.NOTE.F3, this.NOTE.A3] },
    { note: this.NOTE.A4, duration: 1.0 },
    { note: this.NOTE.G4, duration: 0.75, bass: [this.NOTE.C3, this.NOTE.Bb3] },
    { note: this.NOTE.F4, duration: 0.75 },
    { note: this.NOTE.E4, duration: 0.75 },
    { note: this.NOTE.F4, duration: 2.5, bass: [this.NOTE.F3, this.NOTE.A3] },
    { note: this.NOTE.REST, duration: 1.5 }
  ];

  private readonly beatDuration = 0.55; // Segundos por beat (~109 BPM andante)

  private init(): void {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggle(): void {
    if (this.isPlaying()) {
      this.stop();
    } else {
      this.play();
    }
  }

  play(): void {
    this.init();
    if (!this.audioCtx) return;

    this.stop(); // Limpia ejecuciones previas si las hubiera
    this.isPlaying.set(true);
    this.scheduleSequence();
  }

  stop(): void {
    this.isPlaying.set(false);

    if (this.loopTimeoutId !== null) {
      clearTimeout(this.loopTimeoutId);
      this.loopTimeoutId = null;
    }

    // Detener osciladores que estén sonando en cola
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Ya detenido
      }
    });
    this.activeOscillators = [];
  }

  private scheduleSequence(): void {
    if (!this.audioCtx || !this.isPlaying()) return;

    let timeOffset = this.audioCtx.currentTime + 0.05;

    for (const item of this.melody) {
      const durationSec = item.duration * this.beatDuration;

      // Sonido de la melodía principal
      if (item.note > 0) {
        this.playTone(item.note, timeOffset, durationSec, 0.08, 'sine');
        // Armónico sutil en octava superior para dar brillo de campana/órgano
        this.playTone(item.note * 2, timeOffset, durationSec * 0.6, 0.015, 'triangle');
      }

      // Notas de fondo / acompañamiento armónico
      if (item.bass) {
        item.bass.forEach((bassFreq) => {
          this.playTone(bassFreq, timeOffset, durationSec * 1.4, 0.035, 'sine');
        });
      }

      timeOffset += durationSec;
    }

    // Calcular el tiempo total de la secuencia y programar la repetición en bucle
    const totalDurationMs = (timeOffset - this.audioCtx.currentTime) * 1000;
    this.loopTimeoutId = window.setTimeout(() => {
      if (this.isPlaying()) {
        this.scheduleSequence();
      }
    }, Math.max(100, totalDurationMs - 50));
  }

  private playTone(
    freq: number,
    startTime: number,
    duration: number,
    volume: number,
    type: OscillatorType = 'sine'
  ): void {
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    // Envolvente de sonido suave (ataque rápido y decaimiento musical)
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(volume * 0.6, startTime + duration * 0.5);
    gain.gain.exponentialRampToValueAtTime(0.00001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);

    this.activeOscillators.push(osc);
    osc.onended = () => {
      const idx = this.activeOscillators.indexOf(osc);
      if (idx !== -1) {
        this.activeOscillators.splice(idx, 1);
      }
    };
  }
}
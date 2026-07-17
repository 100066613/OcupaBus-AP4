/**
 * Módulo: Multimedia + Cámara + Perfil
 * Responsable: Emmanuel Espinal (100063182)
 * Proyecto: OcupaBus — ISW-307, Grupo Z
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AudioTrack, CaptureItem } from '../models/app.models';
import { LocalStoreService } from './local-store.service';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private readonly tracks: AudioTrack[] = [
    {
      id: 'podcast-001',
      title: 'Bienvenida a OcupaBus',
      description: 'Introduccion al sistema de reporte de ocupacion de autobuses.',
      duration: '01:40',
      toneHz: 440,
    },
    {
      id: 'podcast-002',
      title: 'Conectividad y offline',
      description: 'Como funciona el modo sin conexion y la sincronizacion automatica.',
      duration: '01:55',
      toneHz: 554,
    },
    {
      id: 'podcast-003',
      title: 'Guia de uso rapido',
      description: 'Pasos para registrar un reporte y consultar el mapa del campus.',
      duration: '02:05',
      toneHz: 659,
    },
  ];

  private readonly tracksSubject = new BehaviorSubject<AudioTrack[]>(this.tracks);
  private readonly activeTrackSubject = new BehaviorSubject<AudioTrack>(this.tracks[0]);
  private readonly playbackSubject = new BehaviorSubject<'paused' | 'playing' | 'stopped'>('stopped');
  private readonly progressSubject = new BehaviorSubject<number>(0);
  private readonly capturesSubject = new BehaviorSubject<CaptureItem[]>(this.store.captures);
  private readonly sourceCache = new Map<string, string>();

  readonly tracks$ = this.tracksSubject.asObservable();
  readonly activeTrack$ = this.activeTrackSubject.asObservable();
  readonly playback$ = this.playbackSubject.asObservable();
  readonly progress$ = this.progressSubject.asObservable();
  readonly captures$ = this.capturesSubject.asObservable();

  private audioElement: HTMLAudioElement | null = null;
  private progressTimer?: number;

  constructor(private readonly store: LocalStoreService) {
    this.capturesSubject.next(this.store.captures);
  }

  get tracksList(): AudioTrack[] {
    return this.tracks;
  }

  get activeTrack(): AudioTrack {
    return this.activeTrackSubject.value;
  }

  get playback(): 'paused' | 'playing' | 'stopped' {
    return this.playbackSubject.value;
  }

  get progress(): number {
    return this.progressSubject.value;
  }

  get captures(): CaptureItem[] {
    return this.capturesSubject.value;
  }

  selectTrack(track: AudioTrack): void {
    this.stop();
    this.activeTrackSubject.next(track);
    this.prepareAudio(track);
    this.playbackSubject.next('paused');
  }

  play(): void {
    this.prepareAudio(this.activeTrackSubject.value);
    this.audioElement?.play().catch(() => {
      this.playbackSubject.next('stopped');
    });
    this.playbackSubject.next('playing');
    this.startProgressTimer();
  }

  pause(): void {
    this.audioElement?.pause();
    this.playbackSubject.next('paused');
    this.stopProgressTimer();
  }

  stop(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    this.playbackSubject.next('stopped');
    this.progressSubject.next(0);
    this.stopProgressTimer();
  }

  seek(value: number): void {
    if (!this.audioElement || Number.isNaN(value)) {
      return;
    }

    this.audioElement.currentTime = value;
    this.progressSubject.next(value);
  }

  capturePhoto(dataUrl: string, title: string): void {
    const preview = dataUrl.trim() || this.placeholderImage(title);
    this.store.addCapture({
      title,
      preview,
    });
    this.capturesSubject.next(this.store.captures);
  }

  attachMedia(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
      reader.readAsDataURL(file);
    });
  }

  private prepareAudio(track: AudioTrack): void {
    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.preload = 'auto';
      this.audioElement.addEventListener('ended', () => this.stop());
      this.audioElement.addEventListener('timeupdate', () => {
        this.progressSubject.next(this.audioElement?.currentTime || 0);
      });
    }

    const src = this.resolveSource(track);
    if (this.audioElement.src !== src) {
      this.audioElement.src = src;
      this.audioElement.load();
    }
  }

  private resolveSource(track: AudioTrack): string {
    const cached = this.sourceCache.get(track.id);
    if (cached) {
      return cached;
    }

    const source = this.buildToneUrl(track.toneHz, track.duration);
    this.sourceCache.set(track.id, source);
    return source;
  }

  private buildToneUrl(frequency: number, durationLabel: string): string {
    const seconds = Math.max(8, Math.min(12, Number.parseInt(durationLabel.replace(':', ''), 10) / 10));
    const sampleRate = 44100;
    const frameCount = Math.floor(sampleRate * seconds);
    const buffer = new ArrayBuffer(44 + frameCount * 2);
    const view = new DataView(buffer);
    const writeString = (offset: number, text: string): void => {
      for (let i = 0; i < text.length; i += 1) {
        view.setUint8(offset + i, text.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + frameCount * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, frameCount * 2, true);

    let offset = 44;
    for (let i = 0; i < frameCount; i += 1) {
      const time = i / sampleRate;
      const wave = Math.sin(2 * Math.PI * frequency * time) * 0.25;
      view.setInt16(offset, wave * 32767, true);
      offset += 2;
    }

    const blob = new Blob([buffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  }

  private placeholderImage(label: string): string {
    const safeLabel = encodeURIComponent(label);
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
        <defs>
          <linearGradient id="g" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stop-color="#1f7a3f"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </linearGradient>
        </defs>
        <rect width="900" height="600" rx="40" fill="url(#g)"/>
        <circle cx="750" cy="120" r="110" fill="rgba(255,255,255,0.12)"/>
        <text x="70" y="160" fill="#ffffff" font-size="54" font-family="Arial, sans-serif" font-weight="700">OcupaBus</text>
        <text x="70" y="240" fill="#dbeafe" font-size="30" font-family="Arial, sans-serif">${safeLabel}</text>
        <text x="70" y="330" fill="#ffffff" font-size="24" font-family="Arial, sans-serif">Captura de demostracion</text>
      </svg>
    `)}`;
  }

  private startProgressTimer(): void {
    this.stopProgressTimer();
    this.progressTimer = window.setInterval(() => {
      if (this.audioElement) {
        this.progressSubject.next(this.audioElement.currentTime);
      }
    }, 500);
  }

  private stopProgressTimer(): void {
    if (this.progressTimer) {
      window.clearInterval(this.progressTimer);
      this.progressTimer = undefined;
    }
  }
}

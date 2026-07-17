/**
 * Módulo: Multimedia + Cámara + Perfil
 * Responsable: Emmanuel Espinal (100063182)
 * Proyecto: OcupaBus — ISW-307, Grupo Z
 */
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRange,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { LocalStoreService } from '../services/local-store.service';
import { MediaService } from '../services/media.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonBadge,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonRange,
    IonText,
    IonTitle,
    IonToolbar,
  ],
})
export class ProfilePage {
  photoTitle = 'Foto de nota';
  qrCode = 'ASIST-307';
  readonly tracks$ = this.media.tracks$;
  readonly activeTrack$ = this.media.activeTrack$;
  readonly playback$ = this.media.playback$;
  readonly progress$ = this.media.progress$;
  readonly captures$ = this.media.captures$;
  readonly settings$ = this.store.settings$;

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  constructor(
    private readonly media: MediaService,
    private readonly store: LocalStoreService,
  ) {}

  selectTrack(id: string): void {
    const track = this.media.tracksList.find((item) => item.id === id);
    if (track) {
      this.media.selectTrack(track);
    }
  }

  play(): void {
    this.media.play();
  }

  pause(): void {
    this.media.pause();
  }

  stop(): void {
    this.media.stop();
  }

  seek(value: number | null): void {
    if (typeof value === 'number') {
      this.media.seek(value);
    }
  }

  openFilePicker(): void {
    this.fileInput?.nativeElement.click();
  }

  async handleFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) {
      return;
    }

    const dataUrl = await this.media.attachMedia(file);
    this.media.capturePhoto(dataUrl, this.photoTitle || file.name);
    if (input) {
      input.value = '';
    }
  }

  saveQr(): void {
    this.store.updateSettings({ name: this.qrCode || 'Franklin' });
  }
}

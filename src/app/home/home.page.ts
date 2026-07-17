/**
 * Módulo: Home + Servicios Web
 * Responsable: Franklin Alberto Beltré Fernández (100066613)
 * Proyecto: OcupaBus — ISW-307, Grupo Z
 */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import { LocalStoreService } from '../services/local-store.service';
import { NetworkBannerComponent } from '../components/network-banner/network-banner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    NetworkBannerComponent,
    IonBadge,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonChip,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonRefresher,
    IonRefresherContent,
    IonSpinner,
    IonText,
    IonTextarea,
    IonTitle,
    IonToolbar,
  ],
})
export class HomePage implements OnInit {
  feedback = '';
  readonly news$ = this.api.news$;
  readonly status$ = this.api.status$;
  readonly feedbackStatus$ = this.api.feedbackStatus$;
  readonly tasks$ = this.store.tasks$;
  readonly captures$ = this.store.captures$;
  readonly settings$ = this.store.settings$;

  constructor(
    private readonly api: ApiService,
    private readonly store: LocalStoreService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.api.loadNews();
  }

  async refresh(event: CustomEvent): Promise<void> {
    await this.api.loadNews();
    (event.target as HTMLIonRefresherElement | null)?.complete();
  }

  async sendFeedback(): Promise<void> {
    const success = await this.api.sendFeedback(this.feedback);
    if (success) {
      this.feedback = '';
    }
  }
}

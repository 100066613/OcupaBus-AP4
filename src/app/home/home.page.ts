import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  IonItem,
  IonLabel,
  IonList,
  IonText,
  IonToolbar,
  IonTitle,
} from '@ionic/angular/standalone';
import { addCircleOutline } from 'ionicons/icons';
import { NetworkBannerComponent } from '../components/network-banner/network-banner.component';
import { BusReport, OcupacionBus } from '../models/report.model';
import { OfflineReportService } from '../services/offline-report.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    NetworkBannerComponent,
    IonBadge,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonText,
    IonToolbar,
    IonTitle,
  ],
})
export class HomePage {
  protected readonly addCircleOutline = addCircleOutline;
  protected readonly pendingReports$ = this.offlineReportService.pendingReports$;
  protected readonly sentReports$ = this.offlineReportService.sentReports$;
  protected readonly message$ = this.offlineReportService.message$;

  constructor(private readonly offlineReportService: OfflineReportService) {}

  async registrarReporte(ocupacion: OcupacionBus): Promise<void> {
    const reporte: BusReport = {
      id: this.crearId(),
      tipo: 'ocupacion_bus',
      ocupacion,
      lat: 18.4861,
      lng: -69.9312,
      fecha: new Date().toISOString(),
      sincronizado: false,
    };

    await this.offlineReportService.guardarReporte(reporte);
  }

  private crearId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }

    return `rep_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }
}

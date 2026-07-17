/**
 * Módulo: Conectividad + Reportes Offline
 * Responsable: Angeleen Antonio Bello Hernández (100065707)
 * Proyecto: OcupaBus — ISW-307, Grupo Z
 */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { BusReport, OcupacionBus } from '../models/report.model';
import { ConnectivityLabService } from '../services/connectivity-lab.service';
import { NetworkBannerComponent } from '../components/network-banner/network-banner.component';
import { OfflineReportService } from '../services/offline-report.service';
import { NetworkService } from '../services/network.service';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.page.html',
  styleUrls: ['./devices.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NetworkBannerComponent,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonChip,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonRefresher,
    IonRefresherContent,
    IonText,
    IonTitle,
    IonToolbar,
  ],
})
export class DevicesPage {
  ocupacion: OcupacionBus = 'medio';
  nfcMessage = 'Validacion OcupaBus';
  readonly pendingReports$ = this.reports.pendingReports$;
  readonly sentReports$ = this.reports.sentReports$;
  readonly reportMessage$ = this.reports.message$;
  readonly bluetoothDevices$ = this.connectivity.bluetoothDevices$;
  readonly nfcDevices$ = this.connectivity.nfcDevices$;
  readonly logs$ = this.connectivity.logs$;
  readonly connectivityStatus$ = this.connectivity.status$;
  readonly nfcText$ = this.connectivity.nfcMessage$;

  constructor(
    public readonly network: NetworkService,
    private readonly connectivity: ConnectivityLabService,
    private readonly reports: OfflineReportService,
  ) {}

  refresh(event: CustomEvent): void {
    this.connectivity.discoverBluetooth();
    this.connectivity.readNfc();
    (event.target as HTMLIonRefresherElement | null)?.complete();
  }

  registrarReporte(ocupacion: OcupacionBus): void {
    const reporte: BusReport = {
      id: this.createId(),
      tipo: 'ocupacion_bus',
      ocupacion,
      lat: 18.4861,
      lng: -69.9312,
      fecha: new Date().toISOString(),
      sincronizado: false,
    };

    void this.reports.guardarReporte(reporte);
  }

  discoverBluetooth(): void {
    this.connectivity.discoverBluetooth();
  }

  pairBluetooth(id: string): void {
    const device = this.connectivity.bluetoothDevices.find((item) => item.id === id);
    if (device) {
      this.connectivity.pairBluetooth(device);
    }
  }

  readNfc(): void {
    this.connectivity.readNfc();
  }

  writeNfc(): void {
    this.connectivity.writeNfc(this.nfcMessage);
  }

  clearLogs(): void {
    this.connectivity.clearLogs();
  }

  private createId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }

    return `rep_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }
}

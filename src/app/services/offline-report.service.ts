import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, Subscription } from 'rxjs';
import { BusReport } from '../models/report.model';
import { NetworkService } from './network.service';

@Injectable({
  providedIn: 'root',
})
export class OfflineReportService implements OnDestroy {
  private readonly pendingKey = 'ocupabus_reportes_pendientes';
  private readonly sentKey = 'ocupabus_reportes_enviados';
  private readonly pendingSubject = new BehaviorSubject<BusReport[]>(this.readReports(this.pendingKey));
  private readonly sentSubject = new BehaviorSubject<BusReport[]>(this.readReports(this.sentKey));
  private readonly messageSubject = new BehaviorSubject<string>('Listo para registrar reportes de ocupacion.');
  private readonly syncSubscription: Subscription;

  readonly pendingReports$ = this.pendingSubject.asObservable();
  readonly sentReports$ = this.sentSubject.asObservable();
  readonly message$ = this.messageSubject.asObservable();

  constructor(private readonly networkService: NetworkService) {
    this.syncSubscription = this.networkService.isOnline$
      .pipe(distinctUntilChanged())
      .subscribe((isOnline) => {
        if (isOnline) {
          void this.sincronizarPendientes();
        } else {
          this.messageSubject.next('Modo offline activo. Los reportes se guardaran localmente.');
        }
      });
  }

  async guardarReporte(reporte: BusReport): Promise<void> {
    const status = await this.networkService.getCurrentStatus();

    if (status.connected) {
      await this.enviarReporte(reporte);
      this.registrarEnviados([{ ...reporte, sincronizado: true }, ...this.sentSubject.value]);
      this.messageSubject.next('Reporte enviado correctamente.');
      return;
    }

    const pendientes = [{ ...reporte, sincronizado: false }, ...this.pendingSubject.value];
    this.registrarPendientes(pendientes);
    this.messageSubject.next('Reporte guardado sin conexion. Se sincronizara cuando vuelva internet.');
  }

  async sincronizarPendientes(): Promise<void> {
    const pendientes = this.pendingSubject.value;

    if (pendientes.length === 0) {
      this.messageSubject.next('Conexion recuperada. No habia reportes pendientes.');
      return;
    }

    const enviados = [...this.sentSubject.value];

    for (const reporte of pendientes) {
      await this.enviarReporte({ ...reporte, sincronizado: true });
      enviados.unshift({ ...reporte, sincronizado: true });
    }

    this.registrarEnviados(enviados);
    this.registrarPendientes([]);
    this.messageSubject.next(`Se sincronizaron ${pendientes.length} reportes pendientes.`);
  }

  ngOnDestroy(): void {
    this.syncSubscription.unsubscribe();
  }

  private registrarPendientes(reportes: BusReport[]): void {
    this.pendingSubject.next(reportes);
    this.persistReports(this.pendingKey, reportes);
  }

  private registrarEnviados(reportes: BusReport[]): void {
    this.sentSubject.next(reportes);
    this.persistReports(this.sentKey, reportes);
  }

  private persistReports(key: string, reportes: BusReport[]): void {
    localStorage.setItem(key, JSON.stringify(reportes));
  }

  private readReports(key: string): BusReport[] {
    const raw = localStorage.getItem(key);

    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as BusReport[];
    } catch {
      return [];
    }
  }

  private async enviarReporte(reporte: BusReport): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    console.log('Reporte enviado:', reporte);
  }
}

/**
 * Módulo: Conectividad + Reportes Offline
 * Responsable: Angeleen Antonio Bello Hernández (100065707)
 * Proyecto: OcupaBus — ISW-307, Grupo Z
 */
import { Injectable, OnDestroy } from '@angular/core';
import type { PluginListenerHandle } from '@capacitor/core';
import { ConnectionStatus, Network } from '@capacitor/network';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NetworkService implements OnDestroy {
  private readonly isOnlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
  private readonly connectionTypeSubject = new BehaviorSubject<string>('unknown');
  private networkListener?: PluginListenerHandle;

  readonly isOnline$ = this.isOnlineSubject.asObservable();
  readonly connectionType$ = this.connectionTypeSubject.asObservable();
  readonly status$ = combineLatest([this.isOnline$, this.connectionType$]).pipe(
    map(([isOnline, connectionType]) => ({ isOnline, connectionType })),
  );

  constructor() {
    void this.initializeNetworkStatus();
  }

  async getCurrentStatus(): Promise<ConnectionStatus> {
    return Network.getStatus();
  }

  ngOnDestroy(): void {
    void this.networkListener?.remove();
  }

  private async initializeNetworkStatus(): Promise<void> {
    const status = await Network.getStatus();
    this.applyStatus(status);

    this.networkListener = await Network.addListener('networkStatusChange', (nextStatus) => {
      this.applyStatus(nextStatus);
    });
  }

  private applyStatus(status: ConnectionStatus): void {
    this.isOnlineSubject.next(status.connected);
    this.connectionTypeSubject.next(status.connectionType || 'unknown');
  }
}

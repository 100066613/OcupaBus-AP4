/**
 * Módulo: Conectividad + Reportes Offline
 * Responsable: Angeleen Antonio Bello Hernández (100065707)
 * Proyecto: OcupaBus — ISW-307, Grupo Z
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActivityLog, DemoDevice } from '../models/app.models';

@Injectable({
  providedIn: 'root',
})
export class ConnectivityLabService {
  private readonly bluetoothDevicesSubject = new BehaviorSubject<DemoDevice[]>(this.seedBluetooth());
  private readonly nfcDevicesSubject = new BehaviorSubject<DemoDevice[]>(this.seedNfc());
  private readonly logsSubject = new BehaviorSubject<ActivityLog[]>(this.seedLogs());
  private readonly statusSubject = new BehaviorSubject<string>('Herramientas de conectividad listas para la demostracion.');
  private readonly nfcMessageSubject = new BehaviorSubject<string>('OcupaBus comparte informacion via NFC.');
  private readonly connectedBluetoothSubject = new BehaviorSubject<DemoDevice | null>(null);

  readonly bluetoothDevices$ = this.bluetoothDevicesSubject.asObservable();
  readonly nfcDevices$ = this.nfcDevicesSubject.asObservable();
  readonly logs$ = this.logsSubject.asObservable();
  readonly status$ = this.statusSubject.asObservable();
  readonly nfcMessage$ = this.nfcMessageSubject.asObservable();
  readonly connectedBluetooth$ = this.connectedBluetoothSubject.asObservable();

  get bluetoothDevices(): DemoDevice[] {
    return this.bluetoothDevicesSubject.value;
  }

  get nfcDevices(): DemoDevice[] {
    return this.nfcDevicesSubject.value;
  }

  get logs(): ActivityLog[] {
    return this.logsSubject.value;
  }

  get status(): string {
    return this.statusSubject.value;
  }

  get nfcMessage(): string {
    return this.nfcMessageSubject.value;
  }

  get connectedBluetooth(): DemoDevice | null {
    return this.connectedBluetoothSubject.value;
  }

  discoverBluetooth(): void {
    if (!('bluetooth' in navigator)) {
      this.runSimulatedDiscovery('modo simulado — Web Bluetooth no disponible en este navegador');
      return;
    }

    // Web Bluetooth API: shows the native device-picker dialog in Chrome
    (navigator as Navigator & { bluetooth: { requestDevice: (opts: object) => Promise<{ id: string; name: string | null }> } })
      .bluetooth
      .requestDevice({ acceptAllDevices: true })
      .then((device) => {
        const realDevice: DemoDevice = {
          id: device.id || `ble-real-${Date.now()}`,
          name: device.name || 'Dispositivo sin nombre',
          detail: 'Detectado via Web Bluetooth API',
          status: 'Disponible',
          icon: 'bluetooth-outline',
        };
        const merged = [realDevice, ...this.seedBluetooth()];
        this.bluetoothDevicesSubject.next(merged);
        this.statusSubject.next(`Dispositivo real detectado: ${realDevice.name}`);
        this.addLog('Bluetooth', 'Escaneo real (Web Bluetooth)', `${realDevice.name} encontrado y añadido a la lista.`);
      })
      .catch((err: Error) => {
        // User cancelled the picker or permission denied — fall back to simulation
        const reason = err.name === 'NotFoundError' ? 'usuario cancelo la busqueda' : err.message;
        this.runSimulatedDiscovery(`modo simulado — ${reason}`);
      });
  }

  private runSimulatedDiscovery(logDetail: string): void {
    const next = [...this.seedBluetooth()].sort(() => Math.random() - 0.5);
    this.bluetoothDevicesSubject.next(next);
    this.statusSubject.next('Se detectaron equipos Bluetooth cercanos (simulacion).');
    this.addLog('Bluetooth', 'Escaneo simulado', logDetail);
  }

  pairBluetooth(device: DemoDevice): void {
    const paired = { ...device, status: 'Emparejado' as const };
    this.bluetoothDevicesSubject.next(this.bluetoothDevices.map((item) => (item.id === device.id ? paired : item)));
    this.connectedBluetoothSubject.next(paired);
    this.statusSubject.next(`Emparejado con ${device.name}.`);
    this.addLog('Bluetooth', 'Emparejamiento', `${device.name} quedo listo para compartir datos.`);
  }

  disconnectBluetooth(): void {
    const current = this.connectedBluetoothSubject.value;
    if (!current) {
      return;
    }

    this.connectedBluetoothSubject.next(null);
    this.statusSubject.next('Conexion Bluetooth cerrada.');
    this.addLog('Bluetooth', 'Desconexion', `${current.name} ya no esta enlazado.`);
  }

  readNfc(): void {
    const tag = this.nfcDevicesSubject.value[0];
    const message = `${tag?.name || 'Etiqueta NFC'}: ${tag?.detail || 'Lectura de ejemplo'}`;
    this.nfcMessageSubject.next(message);
    this.statusSubject.next('Etiqueta NFC leida correctamente.');
    this.addLog('NFC', 'Lectura NFC', message);
  }

  writeNfc(message: string): void {
    const trimmed = message.trim() || 'Mensaje de demostracion';
    this.nfcMessageSubject.next(`NFC preparado con: ${trimmed}`);
    this.statusSubject.next('Etiqueta NFC preparada para escritura.');
    this.addLog('NFC', 'Escritura NFC', trimmed);
  }

  clearLogs(): void {
    this.logsSubject.next([]);
    this.statusSubject.next('Historial de conectividad limpiado.');
  }

  private addLog(source: string, title: string, detail: string): void {
    const next: ActivityLog[] = [
      {
        when: this.clock(),
        source,
        title,
        detail,
      },
      ...this.logsSubject.value,
    ].slice(0, 16);

    this.logsSubject.next(next);
  }

  private clock(): string {
    return new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' });
  }

  private seedLogs(): ActivityLog[] {
    return [
      {
        when: this.clock(),
        source: 'Sistema',
        title: 'Modulo listo',
        detail: 'La app inicio con los paneles de conectividad y almacenamiento preparados.',
      },
    ];
  }

  private seedBluetooth(): DemoDevice[] {
    return [
      { id: 'ble-001', name: 'Laptop Franklin', detail: 'Perfil de prueba para intercambio cercano', status: 'Emparejado', icon: 'desktop-outline' },
      { id: 'ble-002', name: 'Galaxy A34', detail: 'Dispositivo disponible para sincronizar', status: 'Disponible', icon: 'phone-portrait-outline' },
      { id: 'ble-003', name: 'Tablet Samsung', detail: 'Bateria estable y lista para demo', status: 'Disponible', icon: 'tablet-portrait-outline' },
      { id: 'ble-004', name: 'Auriculares JBL', detail: 'Perfil de audio cercano', status: 'Disponible', icon: 'headset-outline' },
    ];
  }

  private seedNfc(): DemoDevice[] {
    return [
      { id: 'nfc-001', name: 'Tarjeta UAPA', detail: 'Permite validar acceso rapido', status: 'Activo', icon: 'qr-code-outline' },
      { id: 'nfc-002', name: 'Sticker Laboratorio', detail: 'Etiqueta NDEF de ejemplo', status: 'Disponible', icon: 'albums-outline' },
      { id: 'nfc-003', name: 'Pulsera de evento', detail: 'Lista para escritura y lectura', status: 'Disponible', icon: 'ticket-outline' },
    ];
  }
}

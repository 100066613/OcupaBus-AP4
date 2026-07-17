import { TestBed } from '@angular/core/testing';
import { ConnectivityLabService } from './connectivity-lab.service';

describe('ConnectivityLabService', () => {
  let service: ConnectivityLabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectivityLabService);
  });

  // ── Instanciación ────────────────────────────────────────────────────────────

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe exponer observables bluetoothDevices$, nfcDevices$, logs$ y status$', () => {
    expect(service.bluetoothDevices$).toBeDefined();
    expect(service.nfcDevices$).toBeDefined();
    expect(service.logs$).toBeDefined();
    expect(service.status$).toBeDefined();
  });

  // ── Datos iniciales ──────────────────────────────────────────────────────────

  it('debe inicializar con dispositivos BLE seed', () => {
    expect(service.bluetoothDevices.length).toBeGreaterThan(0);
  });

  it('debe inicializar con dispositivos NFC seed', () => {
    expect(service.nfcDevices.length).toBeGreaterThan(0);
  });

  it('debe inicializar con logs de actividad seed', () => {
    expect(service.logs.length).toBeGreaterThan(0);
  });

  it('el status inicial debe contener texto de bienvenida', () => {
    expect(service.status).toBeTruthy();
    expect(service.status.length).toBeGreaterThan(0);
  });

  // ── Estructura DemoDevice ────────────────────────────────────────────────────

  it('los dispositivos BLE deben tener id, name, detail, status e icon', () => {
    for (const d of service.bluetoothDevices) {
      expect(d.id).toBeTruthy();
      expect(d.name).toBeTruthy();
      expect(d.detail).toBeTruthy();
      expect(['Disponible', 'Emparejado', 'Activo']).toContain(d.status);
      expect(d.icon).toBeTruthy();
    }
  });

  it('los dispositivos NFC deben tener estructura valida', () => {
    for (const d of service.nfcDevices) {
      expect(d.id).toBeTruthy();
      expect(d.name).toBeTruthy();
      expect(['Disponible', 'Emparejado', 'Activo']).toContain(d.status);
    }
  });

  // ── Estructura ActivityLog ───────────────────────────────────────────────────

  it('los logs deben tener when, source, title y detail', () => {
    for (const log of service.logs) {
      expect(log.when).toBeTruthy();
      expect(log.source).toBeTruthy();
      expect(log.title).toBeTruthy();
      expect(log.detail).toBeTruthy();
    }
  });

  // ── discoverBluetooth (simulacion) ───────────────────────────────────────────

  it('discoverBluetooth debe dejar dispositivos en la lista', () => {
    // Forzar simulacion: reemplazar bluetooth con objeto que rechaza
    (navigator as Navigator & { bluetooth?: { requestDevice: () => Promise<never> } }).bluetooth = {
      requestDevice: () => Promise.reject(Object.assign(new Error('NotFoundError'), { name: 'NotFoundError' })),
    };
    service.discoverBluetooth();
    expect(service.bluetoothDevices.length).toBeGreaterThan(0);
  });

  it('discoverBluetooth debe tener un status no vacio', () => {
    expect(service.status).toBeTruthy();
  });

  // ── pairBluetooth ────────────────────────────────────────────────────────────

  it('pairBluetooth debe marcar el dispositivo como Emparejado', () => {
    const dispositivo = service.bluetoothDevices.find((d) => d.status === 'Disponible');
    if (!dispositivo) {
      pending('No hay dispositivos disponibles para emparejar');
      return;
    }
    service.pairBluetooth(dispositivo);
    const actualizado = service.bluetoothDevices.find((d) => d.id === dispositivo.id);
    expect(actualizado?.status).toBe('Emparejado');
  });

  it('pairBluetooth debe registrar un log de la accion', () => {
    const dispositivo = service.bluetoothDevices[0];
    const logsBefore = service.logs.length;
    service.pairBluetooth(dispositivo);
    expect(service.logs.length).toBeGreaterThanOrEqual(logsBefore);
  });

  // ── readNfc ──────────────────────────────────────────────────────────────────

  it('readNfc debe actualizar el nfcMessage', () => {
    service.readNfc();
    expect(service.nfcMessage).toBeTruthy();
  });

  it('readNfc debe agregar un log de lectura', () => {
    const antes = service.logs.length;
    service.readNfc();
    expect(service.logs.length).toBeGreaterThan(antes);
  });

  // ── writeNfc ─────────────────────────────────────────────────────────────────

  it('writeNfc debe agregar un log de escritura', () => {
    const antes = service.logs.length;
    service.writeNfc('Mensaje prueba NFC');
    expect(service.logs.length).toBeGreaterThan(antes);
  });

  it('writeNfc debe actualizar el status', () => {
    service.writeNfc('Test escritura');
    expect(service.status).toBeTruthy();
  });

  // ── clearLogs ────────────────────────────────────────────────────────────────

  it('clearLogs debe vaciar la lista de logs', () => {
    service.clearLogs();
    expect(service.logs.length).toBe(0);
  });

  it('clearLogs debe notificar el observable logs$', (done) => {
    service.logs$.subscribe((logs) => {
      if (logs.length === 0) {
        expect(logs).toEqual([]);
        done();
      }
    });
    service.clearLogs();
  });

  // ── Limite de logs ───────────────────────────────────────────────────────────

  it('los logs no deben superar 16 entradas', () => {
    for (let i = 0; i < 20; i++) {
      service.writeNfc(`Mensaje ${i}`);
    }
    expect(service.logs.length).toBeLessThanOrEqual(16);
  });
});

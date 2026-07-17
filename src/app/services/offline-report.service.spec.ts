import { TestBed } from '@angular/core/testing';
import { OfflineReportService } from './offline-report.service';
import { NetworkService } from './network.service';
import { BehaviorSubject } from 'rxjs';
import { BusReport } from '../models/report.model';

class MockNetworkService {
  private onlineSubject = new BehaviorSubject<boolean>(true);
  isOnline$ = this.onlineSubject.asObservable();
  connectionType$ = new BehaviorSubject<string>('wifi').asObservable();
  status$ = this.onlineSubject.asObservable();

  setOnline(value: boolean): void {
    this.onlineSubject.next(value);
  }

  async getCurrentStatus(): Promise<{ connected: boolean; connectionType: string }> {
    return { connected: this.onlineSubject.value, connectionType: 'wifi' };
  }
}

function makeReporte(ocupacion: 'vacío' | 'medio' | 'lleno' = 'medio'): BusReport {
  return {
    id: `rep-${Date.now()}`,
    tipo: 'ocupacion_bus',
    ocupacion,
    lat: 18.5156,
    lng: -69.8472,
    fecha: new Date().toISOString(),
    sincronizado: false,
  };
}

describe('OfflineReportService', () => {
  let service: OfflineReportService;
  let mockNetwork: MockNetworkService;

  beforeEach(() => {
    localStorage.clear();
    mockNetwork = new MockNetworkService();

    TestBed.configureTestingModule({
      providers: [
        OfflineReportService,
        { provide: NetworkService, useValue: mockNetwork },
      ],
    });

    service = TestBed.inject(OfflineReportService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ── Instanciación ────────────────────────────────────────────────────────────

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe exponer observables pendingReports$, sentReports$ y message$', () => {
    expect(service.pendingReports$).toBeDefined();
    expect(service.sentReports$).toBeDefined();
    expect(service.message$).toBeDefined();
  });

  // ── Estado inicial ───────────────────────────────────────────────────────────

  it('debe iniciar con listas vacias cuando localStorage esta limpio', (done) => {
    service.pendingReports$.subscribe((pending) => {
      expect(pending.length).toBe(0);
      done();
    });
  });

  // ── guardarReporte ONLINE ─────────────────────────────────────────────────────

  it('guardarReporte online debe mover el reporte a enviados', async () => {
    mockNetwork.setOnline(true);
    const reporte = makeReporte('lleno');

    await service.guardarReporte(reporte);

    let sentCount = 0;
    service.sentReports$.subscribe((sent) => {
      sentCount = sent.length;
    });

    expect(sentCount).toBe(1);
  });

  it('guardarReporte online debe dejar pendientes vacio', async () => {
    mockNetwork.setOnline(true);
    const reporte = makeReporte('vacío');

    await service.guardarReporte(reporte);

    let pendingCount = 0;
    service.pendingReports$.subscribe((p) => {
      pendingCount = p.length;
    });

    expect(pendingCount).toBe(0);
  });

  it('guardarReporte online debe actualizar el status a enviado', async () => {
    mockNetwork.setOnline(true);
    await service.guardarReporte(makeReporte('medio'));

    let message = '';
    service.message$.subscribe((m) => (message = m));
    expect(message).toContain('correctamente');
  });

  // ── guardarReporte OFFLINE ────────────────────────────────────────────────────

  it('guardarReporte offline debe guardar en pendientes', async () => {
    mockNetwork.setOnline(false);
    const reporte = makeReporte('lleno');

    await service.guardarReporte(reporte);

    let pendingCount = 0;
    service.pendingReports$.subscribe((p) => {
      pendingCount = p.length;
    });

    expect(pendingCount).toBe(1);
  });

  it('guardarReporte offline debe persistir en localStorage', async () => {
    mockNetwork.setOnline(false);
    await service.guardarReporte(makeReporte('vacío'));

    const raw = localStorage.getItem('ocupabus_reportes_pendientes');
    expect(raw).not.toBeNull();
    const parsed: BusReport[] = JSON.parse(raw!);
    expect(parsed.length).toBe(1);
  });

  it('guardarReporte offline debe indicar modo sin conexion en el status', async () => {
    mockNetwork.setOnline(false);
    await service.guardarReporte(makeReporte());

    let message = '';
    service.message$.subscribe((m) => (message = m));
    expect(message).toContain('sin conexion');
  });

  it('guardarReporte offline no debe mover nada a enviados', async () => {
    mockNetwork.setOnline(false);
    await service.guardarReporte(makeReporte());

    let sentCount = 0;
    service.sentReports$.subscribe((s) => (sentCount = s.length));
    expect(sentCount).toBe(0);
  });

  // ── sincronizarPendientes ─────────────────────────────────────────────────────

  it('sincronizarPendientes sin pendientes debe actualizar el status', async () => {
    await service.sincronizarPendientes();

    let message = '';
    service.message$.subscribe((m) => (message = m));
    expect(message).toContain('No habia reportes pendientes');
  });

  it('sincronizarPendientes debe mover todos los pendientes a enviados', async () => {
    mockNetwork.setOnline(false);
    await service.guardarReporte(makeReporte('vacío'));
    await service.guardarReporte(makeReporte('lleno'));

    mockNetwork.setOnline(true);
    await service.sincronizarPendientes();

    let pendingCount = 0;
    let sentCount = 0;
    service.pendingReports$.subscribe((p) => (pendingCount = p.length));
    service.sentReports$.subscribe((s) => (sentCount = s.length));

    expect(pendingCount).toBe(0);
    expect(sentCount).toBe(2);
  });

  it('sincronizarPendientes debe indicar la cantidad sincronizada', async () => {
    mockNetwork.setOnline(false);
    await service.guardarReporte(makeReporte());
    await service.guardarReporte(makeReporte());

    mockNetwork.setOnline(true);
    await service.sincronizarPendientes();

    let message = '';
    service.message$.subscribe((m) => (message = m));
    expect(message).toContain('2');
  });

  // ── Estructura BusReport ──────────────────────────────────────────────────────

  it('el reporte guardado debe conservar ocupacion, lat y lng', async () => {
    mockNetwork.setOnline(false);
    const reporte = makeReporte('lleno');
    reporte.lat = 18.5158;
    reporte.lng = -69.8471;

    await service.guardarReporte(reporte);

    let pending: BusReport[] = [];
    service.pendingReports$.subscribe((p) => (pending = p));

    expect(pending[0].ocupacion).toBe('lleno');
    expect(pending[0].lat).toBeCloseTo(18.5158, 3);
    expect(pending[0].lng).toBeCloseTo(-69.8471, 3);
  });
});

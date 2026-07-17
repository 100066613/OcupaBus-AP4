import { TestBed } from '@angular/core/testing';
import { GeolocationService } from './geolocation.service';

describe('GeolocationService', () => {
  let service: GeolocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeolocationService);
  });

  // ── Instanciación ────────────────────────────────────────────────────────────

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe exponer observables points$, selectedPoint$, position$ y status$', () => {
    expect(service.points$).toBeDefined();
    expect(service.selectedPoint$).toBeDefined();
    expect(service.position$).toBeDefined();
    expect(service.status$).toBeDefined();
  });

  // ── Puntos del campus (seed) ─────────────────────────────────────────────────

  it('debe inicializar con 5 puntos de referencia del campus', () => {
    expect(service.points.length).toBe(5);
  });

  it('todos los puntos deben tener id, name, lat, lng y type', () => {
    for (const point of service.points) {
      expect(point.id).toBeTruthy();
      expect(point.name).toBeTruthy();
      expect(point.lat).toBeDefined();
      expect(point.lng).toBeDefined();
      expect(point.type).toBeTruthy();
    }
  });

  it('los puntos deben estar dentro del bounding box real de UAPA SDO', () => {
    for (const point of service.points) {
      expect(point.lat).toBeGreaterThan(18.514);
      expect(point.lat).toBeLessThan(18.517);
      expect(point.lng).toBeGreaterThan(-69.849);
      expect(point.lng).toBeLessThan(-69.846);
    }
  });

  it('el primer punto debe ser la entrada principal del campus', () => {
    expect(service.points[0].id).toBe('campus-entrada');
  });

  // ── Posicion seed ────────────────────────────────────────────────────────────

  it('la posicion inicial debe ser el centro del campus UAPA', () => {
    const pos = service.position;
    expect(pos.latitude).toBeCloseTo(18.5156, 3);
    expect(pos.longitude).toBeCloseTo(-69.8472, 3);
    expect(pos.label).toContain('UAPA');
  });

  it('la posicion inicial debe tener label y updatedAt', () => {
    const pos = service.position;
    expect(pos.label).toBeTruthy();
    expect(pos.updatedAt).toBeTruthy();
  });

  // ── selectPoint ──────────────────────────────────────────────────────────────

  it('selectPoint debe actualizar selectedPoint', () => {
    const punto = service.points[2];
    service.selectPoint(punto);
    expect(service.selectedPoint.id).toBe(punto.id);
  });

  it('selectPoint debe actualizar el status con el nombre del punto', () => {
    const punto = service.points[1];
    service.selectPoint(punto);
    expect(service.status).toContain(punto.name);
  });

  it('selectPoint debe notificar el observable selectedPoint$', (done) => {
    const objetivo = service.points[3];
    service.selectedPoint$.subscribe((p) => {
      if (p.id === objetivo.id) {
        expect(p.name).toBe(objetivo.name);
        done();
      }
    });
    service.selectPoint(objetivo);
  });

  // ── focusCampus ──────────────────────────────────────────────────────────────

  it('focusCampus debe seleccionar el primer punto de la lista', () => {
    service.selectPoint(service.points[4]);
    service.focusCampus();
    expect(service.selectedPoint.id).toBe(service.points[0].id);
  });

  // ── refreshPosition ──────────────────────────────────────────────────────────

  it('refreshPosition debe actualizar el status al inicio', async () => {
    Object.defineProperty(navigator, 'geolocation', {
      value: undefined,
      configurable: true,
    });

    await service.refreshPosition();
    expect(service.status).toBeTruthy();
  });

  it('refreshPosition sin GPS debe usar la posicion seed', async () => {
    Object.defineProperty(navigator, 'geolocation', {
      value: undefined,
      configurable: true,
    });

    await service.refreshPosition();
    const pos = service.position;
    expect(pos.latitude).toBeCloseTo(18.5156, 2);
  });

  it('refreshPosition con GPS exitoso debe actualizar la posicion', async () => {
    const mockPosition = {
      coords: { latitude: 18.5160, longitude: -69.8470, accuracy: 10 },
    } as GeolocationPosition;

    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition: (success: PositionCallback) => success(mockPosition),
      },
      configurable: true,
    });

    await service.refreshPosition();
    expect(service.position.latitude).toBeCloseTo(18.516, 3);
    expect(service.position.label).toContain('detectada');
  });

  it('refreshPosition con error GPS debe conservar la posicion seed', async () => {
    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition: (_: unknown, error: PositionErrorCallback) =>
          error({ code: 1, message: 'denied' } as GeolocationPositionError),
      },
      configurable: true,
    });

    await service.refreshPosition();
    expect(service.position.label).toContain('UAPA');
  });
});

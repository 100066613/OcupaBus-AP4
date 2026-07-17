import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiService);
  });

  // ── Instanciación ────────────────────────────────────────────────────────────

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe exponer observables news$, status$ y draft$', () => {
    expect(service.news$).toBeDefined();
    expect(service.status$).toBeDefined();
    expect(service.draft$).toBeDefined();
  });

  // ── Estado inicial ───────────────────────────────────────────────────────────

  it('debe inicializar con noticias seed (3 items)', () => {
    expect(service.news.length).toBe(3);
  });

  it('el status inicial debe ser el mensaje de bienvenida', () => {
    expect(service.status).toContain('Listo para cargar');
  });

  it('el draft inicial debe estar vacio', () => {
    expect(service.draft).toBe('');
  });

  // ── setDraft ─────────────────────────────────────────────────────────────────

  it('setDraft debe actualizar el valor del borrador', () => {
    service.setDraft('Nuevo mensaje');
    expect(service.draft).toBe('Nuevo mensaje');
  });

  it('setDraft debe notificar el observable draft$', (done) => {
    service.draft$.subscribe((val) => {
      if (val === 'Test draft observable') {
        expect(val).toBe('Test draft observable');
        done();
      }
    });
    service.setDraft('Test draft observable');
  });

  // ── sendFeedback ─────────────────────────────────────────────────────────────

  it('sendFeedback con mensaje vacio debe actualizar status de error', async () => {
    await service.sendFeedback('');
    expect(service.status).toContain('Escribe un mensaje');
  });

  it('sendFeedback con mensaje en blanco debe actualizar status de error', async () => {
    await service.sendFeedback('   ');
    expect(service.status).toContain('Escribe un mensaje');
  });

  it('sendFeedback con mensaje valido debe cambiar status a enviando', async () => {
    const originalFetch = window.fetch;
    window.fetch = jasmine.createSpy('fetch').and.returnValue(
      Promise.resolve({ ok: true, json: () => Promise.resolve({ id: 101 }) } as Response)
    );

    await service.sendFeedback('Buena aplicacion');
    expect(service.status).toContain('Comentario #101');

    window.fetch = originalFetch;
  });

  it('sendFeedback debe manejar error de red sin lanzar excepcion', async () => {
    const originalFetch = window.fetch;
    window.fetch = jasmine.createSpy('fetch').and.returnValue(Promise.reject(new Error('network error')));

    await expectAsync(service.sendFeedback('Mensaje test')).toBeResolved();
    expect(service.status).toBeTruthy();

    window.fetch = originalFetch;
  });

  // ── loadNews ─────────────────────────────────────────────────────────────────

  it('loadNews debe cambiar status a cargando mientras procesa', async () => {
    const statuses: string[] = [];
    const sub = service.status$.subscribe((s) => statuses.push(s));

    const originalFetch = window.fetch;
    window.fetch = jasmine.createSpy('fetch').and.returnValue(
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { id: 1, title: 'noticia uno', body: 'cuerpo uno' },
            { id: 2, title: 'noticia dos', body: 'cuerpo dos' },
          ]),
      } as Response)
    );

    await service.loadNews();
    sub.unsubscribe();
    window.fetch = originalFetch;

    expect(statuses.some((s) => s.includes('Consultando'))).toBeTrue();
  });

  it('loadNews con respuesta exitosa debe actualizar las noticias', async () => {
    const originalFetch = window.fetch;
    window.fetch = jasmine.createSpy('fetch').and.returnValue(
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { id: 10, title: 'titulo uno', body: 'resumen uno' },
            { id: 11, title: 'titulo dos', body: 'resumen dos' },
            { id: 12, title: 'titulo tres', body: 'resumen tres' },
          ]),
      } as Response)
    );

    await service.loadNews();
    window.fetch = originalFetch;

    expect(service.news.length).toBe(3);
    expect(service.news[0].source).toBe('JSONPlaceholder');
    expect(service.status).toContain('actualizadas');
  });

  it('loadNews con error de red debe usar noticias seed', async () => {
    const originalFetch = window.fetch;
    window.fetch = jasmine.createSpy('fetch').and.returnValue(Promise.reject(new Error('offline')));

    await service.loadNews();
    window.fetch = originalFetch;

    expect(service.news.length).toBeGreaterThan(0);
    expect(service.status).toContain('Sin internet');
  });

  // ── Estructura NewsItem ───────────────────────────────────────────────────────

  it('las noticias seed deben tener id, title, summary, category, source y publishedAt', () => {
    const noticia = service.news[0];
    expect(noticia.id).toBeDefined();
    expect(noticia.title).toBeTruthy();
    expect(noticia.summary).toBeTruthy();
    expect(noticia.category).toBeTruthy();
    expect(noticia.source).toBeTruthy();
    expect(noticia.publishedAt).toBeTruthy();
  });
});

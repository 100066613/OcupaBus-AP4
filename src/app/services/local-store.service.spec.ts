import { TestBed } from '@angular/core/testing';
import { LocalStoreService } from './local-store.service';
import { AppTask } from '../models/app.models';

describe('LocalStoreService', () => {
  let service: LocalStoreService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStoreService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ── Instanciación ────────────────────────────────────────────────────────────

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe exponer observables tasks$, captures$ y settings$', () => {
    expect(service.tasks$).toBeDefined();
    expect(service.captures$).toBeDefined();
    expect(service.settings$).toBeDefined();
  });

  // ── Tareas seed ──────────────────────────────────────────────────────────────

  it('debe inicializar con tareas seed cuando localStorage esta vacio', () => {
    const tasks = service.tasks;
    expect(tasks.length).toBeGreaterThan(0);
    expect(tasks[0].id).toBeDefined();
    expect(tasks[0].title).toBeTruthy();
  });

  // ── addTask ──────────────────────────────────────────────────────────────────

  it('addTask debe agregar una tarea al inicio de la lista', () => {
    const inicial = service.tasks.length;
    service.addTask({ title: 'Tarea de prueba', notes: '', priority: 'Alta' });
    expect(service.tasks.length).toBe(inicial + 1);
    expect(service.tasks[0].title).toBe('Tarea de prueba');
  });

  it('addTask debe asignar id, createdAt y completed=false', () => {
    service.addTask({ title: 'Test', notes: 'nota', priority: 'Media' });
    const tarea = service.tasks[0];
    expect(tarea.id).toBeTruthy();
    expect(tarea.completed).toBeFalse();
    expect(tarea.createdAt).toBeTruthy();
  });

  it('addTask debe persistir en localStorage', () => {
    service.addTask({ title: 'Persistida', notes: '', priority: 'Baja' });
    const raw = localStorage.getItem('ocupabus_tasks');
    expect(raw).not.toBeNull();
    const parsed: AppTask[] = JSON.parse(raw!);
    expect(parsed.some((t) => t.title === 'Persistida')).toBeTrue();
  });

  it('addTask debe notificar el observable tasks$', (done) => {
    service.tasks$.subscribe((tasks) => {
      if (tasks.some((t) => t.title === 'Observable Test')) {
        expect(true).toBeTrue();
        done();
      }
    });
    service.addTask({ title: 'Observable Test', notes: '', priority: 'Alta' });
  });

  // ── toggleTask ───────────────────────────────────────────────────────────────

  it('toggleTask debe marcar una tarea como completada', () => {
    service.addTask({ title: 'Para completar', notes: '', priority: 'Baja' });
    const id = service.tasks[0].id;
    service.toggleTask(id);
    expect(service.tasks.find((t) => t.id === id)?.completed).toBeTrue();
  });

  it('toggleTask debe desmarcar una tarea ya completada', () => {
    service.addTask({ title: 'Toggle doble', notes: '', priority: 'Media' });
    const id = service.tasks[0].id;
    service.toggleTask(id);
    service.toggleTask(id);
    expect(service.tasks.find((t) => t.id === id)?.completed).toBeFalse();
  });

  // ── removeTask ───────────────────────────────────────────────────────────────

  it('removeTask debe eliminar la tarea con el id indicado', () => {
    service.addTask({ title: 'A eliminar', notes: '', priority: 'Alta' });
    const id = service.tasks[0].id;
    service.removeTask(id);
    expect(service.tasks.find((t) => t.id === id)).toBeUndefined();
  });

  it('removeTask no debe afectar otras tareas', () => {
    service.addTask({ title: 'Tarea A para eliminar', notes: '', priority: 'Alta' });
    service.addTask({ title: 'Tarea B para conservar', notes: '', priority: 'Baja' });
    const idA = service.tasks.find((t) => t.title === 'Tarea A para eliminar')!.id;
    service.removeTask(idA);
    expect(service.tasks.some((t) => t.title === 'Tarea B para conservar')).toBeTrue();
  });

  // ── clearCompleted ───────────────────────────────────────────────────────────

  it('clearCompleted debe eliminar solo las tareas completadas', () => {
    service.addTask({ title: 'Tarea para completar CC', notes: '', priority: 'Alta' });
    service.addTask({ title: 'Tarea pendiente CC', notes: '', priority: 'Baja' });
    const idCompleta = service.tasks.find((t) => t.title === 'Tarea para completar CC')!.id;
    service.toggleTask(idCompleta);
    service.clearCompleted();
    expect(service.tasks.every((t) => !t.completed)).toBeTrue();
    expect(service.tasks.some((t) => t.title === 'Tarea pendiente CC')).toBeTrue();
  });

  // ── reorderTasks ─────────────────────────────────────────────────────────────

  it('reorderTasks debe mover elemento de posicion correctamente', () => {
    localStorage.clear();
    service.addTask({ title: 'C', notes: '', priority: 'Baja' });
    service.addTask({ title: 'B', notes: '', priority: 'Baja' });
    service.addTask({ title: 'A', notes: '', priority: 'Baja' });
    // Lista: [A, B, C] — mueve indice 2 (C) a indice 0
    service.reorderTasks(2, 0);
    expect(service.tasks[0].title).toBe('C');
  });

  // ── addCapture ───────────────────────────────────────────────────────────────

  it('addCapture debe agregar una captura con id y createdAt', () => {
    service.addCapture({ title: 'Foto campus', preview: 'data:image/png;base64,abc' });
    expect(service.captures.length).toBe(1);
    expect(service.captures[0].id).toBeTruthy();
    expect(service.captures[0].title).toBe('Foto campus');
  });

  // ── updateSettings ───────────────────────────────────────────────────────────

  it('updateSettings debe actualizar parcialmente la configuracion', () => {
    service.updateSettings({ name: 'Maria', notifications: false });
    expect(service.settings.name).toBe('Maria');
    expect(service.settings.notifications).toBeFalse();
    expect(service.settings.program).toBeTruthy();
  });

  it('updateSettings debe persistir en localStorage', () => {
    service.updateSettings({ name: 'Luis' });
    const raw = localStorage.getItem('ocupabus_settings');
    const parsed = JSON.parse(raw!);
    expect(parsed.name).toBe('Luis');
  });

  // ── refreshSnapshot ──────────────────────────────────────────────────────────

  it('refreshSnapshot debe recargar datos desde localStorage', () => {
    service.addTask({ title: 'Antes del refresh', notes: '', priority: 'Alta' });
    service.refreshSnapshot();
    expect(service.tasks.some((t) => t.title === 'Antes del refresh')).toBeTrue();
  });
});

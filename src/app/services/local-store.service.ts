/**
 * Módulo: Tareas + Almacenamiento
 * Responsable: Smailyn Ceballo Viva (100064094)
 * Proyecto: OcupaBus — ISW-307, Grupo Z
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  AppTask,
  CaptureItem,
  ProfileSettings,
} from '../models/app.models';

@Injectable({
  providedIn: 'root',
})
export class LocalStoreService {
  private readonly tasksKey = 'ocupabus_tasks';
  private readonly capturesKey = 'ocupabus_captures';
  private readonly settingsKey = 'ocupabus_settings';

  private readonly tasksSubject = new BehaviorSubject<AppTask[]>(this.read<AppTask[]>(this.tasksKey, this.seedTasks()));
  private readonly capturesSubject = new BehaviorSubject<CaptureItem[]>(this.read<CaptureItem[]>(this.capturesKey, []));
  private readonly settingsSubject = new BehaviorSubject<ProfileSettings>(
    this.read<ProfileSettings>(this.settingsKey, {
      name: 'Franklin',
      program: 'Ingenieria de Software',
      email: 'franklin@uapa.edu.do',
      notifications: true,
      offlineMode: true,
    }),
  );

  readonly tasks$ = this.tasksSubject.asObservable();
  readonly captures$ = this.capturesSubject.asObservable();
  readonly settings$ = this.settingsSubject.asObservable();

  get tasks(): AppTask[] {
    return this.tasksSubject.value;
  }

  get captures(): CaptureItem[] {
    return this.capturesSubject.value;
  }

  get settings(): ProfileSettings {
    return this.settingsSubject.value;
  }

  addTask(task: Omit<AppTask, 'id' | 'completed' | 'createdAt'>): void {
    const next: AppTask[] = [
      {
        id: this.makeId('tsk'),
        createdAt: new Date().toISOString(),
        completed: false,
        ...task,
      },
      ...this.tasksSubject.value,
    ];

    this.persistTasks(next);
  }

  toggleTask(id: string): void {
    this.persistTasks(this.tasksSubject.value.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  }

  removeTask(id: string): void {
    this.persistTasks(this.tasksSubject.value.filter((task) => task.id !== id));
  }

  clearCompleted(): void {
    this.persistTasks(this.tasksSubject.value.filter((task) => !task.completed));
  }

  reorderTasks(fromIndex: number, toIndex: number): void {
    const next = [...this.tasksSubject.value];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    this.persistTasks(next);
  }

  addCapture(item: Omit<CaptureItem, 'id' | 'createdAt'>): void {
    const next: CaptureItem[] = [
      {
        id: this.makeId('cap'),
        createdAt: new Date().toISOString(),
        ...item,
      },
      ...this.capturesSubject.value,
    ];

    this.persistCaptures(next);
  }

  updateSettings(patch: Partial<ProfileSettings>): void {
    const next = { ...this.settingsSubject.value, ...patch };
    this.settingsSubject.next(next);
    this.persist(this.settingsKey, next);
  }

  refreshSnapshot(): void {
    this.tasksSubject.next(this.read<AppTask[]>(this.tasksKey, this.seedTasks()));
    this.capturesSubject.next(this.read<CaptureItem[]>(this.capturesKey, []));
    this.settingsSubject.next(
      this.read<ProfileSettings>(this.settingsKey, {
        name: 'Franklin',
        program: 'Ingenieria de Software',
        email: 'franklin@uapa.edu.do',
        notifications: true,
        offlineMode: true,
      }),
    );
  }

  private persistTasks(tasks: AppTask[]): void {
    this.tasksSubject.next(tasks);
    this.persist(this.tasksKey, tasks);
  }

  private persistCaptures(items: CaptureItem[]): void {
    this.capturesSubject.next(items);
    this.persist(this.capturesKey, items);
  }

  private persist(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  private read<T>(key: string, fallback: T): T {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  private seedTasks(): AppTask[] {
    return [
      {
        id: 'tsk-001',
        title: 'Preparar defensa del modulo',
        notes: 'Repasar conectividad, storage y flujo offline.',
        priority: 'Alta',
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'tsk-002',
        title: 'Subir capturas al documento',
        notes: 'Agregar evidencias de navegador y dispositivo.',
        priority: 'Media',
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ];
  }

  private makeId(prefix: string): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return `${prefix}-${crypto.randomUUID()}`;
    }

    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

/**
 * Módulo: Tareas + Almacenamiento
 * Responsable: Smailyn Ceballo Viva (100064094)
 * Proyecto: OcupaBus — ISW-307, Grupo Z
 */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonReorder,
  IonReorderGroup,
  IonRefresher,
  IonRefresherContent,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AppTask, TaskPriority } from '../models/app.models';
import { LocalStoreService } from '../services/local-store.service';

@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.page.html',
  styleUrls: ['./transfers.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonBadge,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCheckbox,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonList,
    IonReorder,
    IonReorderGroup,
    IonRefresher,
    IonRefresherContent,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonTitle,
    IonToolbar,
  ],
})
export class TransfersPage {
  title = '';
  notes = '';
  priority: TaskPriority = 'Media';
  readonly tasks$ = this.store.tasks$;

  constructor(private readonly store: LocalStoreService) {}

  refresh(event: CustomEvent): void {
    this.store.refreshSnapshot();
    (event.target as HTMLIonRefresherElement | null)?.complete();
  }

  addTask(): void {
    const title = this.title.trim();
    if (!title) {
      return;
    }

    this.store.addTask({
      title,
      notes: this.notes.trim() || 'Sin observaciones adicionales.',
      priority: this.priority,
    });

    this.title = '';
    this.notes = '';
    this.priority = 'Media';
  }

  toggleTask(task: AppTask): void {
    this.store.toggleTask(task.id);
  }

  removeTask(task: AppTask): void {
    this.store.removeTask(task.id);
  }

  clearCompleted(): void {
    this.store.clearCompleted();
  }

  reorder(event: CustomEvent): void {
    const detail = event.detail as { from: number; to: number; complete: (list?: unknown) => void };
    this.store.reorderTasks(detail.from, detail.to);
    detail.complete();
  }

  trackById(_: number, task: AppTask): string {
    return task.id;
  }
}

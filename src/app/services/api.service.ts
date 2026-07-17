/**
 * Módulo: Home + Servicios Web
 * Responsable: Franklin Alberto Beltré Fernández (100066613)
 * Proyecto: OcupaBus — ISW-307, Grupo Z
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NewsItem } from '../models/app.models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly newsSubject = new BehaviorSubject<NewsItem[]>(this.seedNews());
  private readonly statusSubject = new BehaviorSubject<string>('Listo para cargar noticias y enviar retroalimentacion.');
  private readonly draftSubject = new BehaviorSubject<string>('');

  readonly news$ = this.newsSubject.asObservable();
  readonly status$ = this.statusSubject.asObservable();
  readonly draft$ = this.draftSubject.asObservable();

  get news(): NewsItem[] {
    return this.newsSubject.value;
  }

  get status(): string {
    return this.statusSubject.value;
  }

  get draft(): string {
    return this.draftSubject.value;
  }

  setDraft(value: string): void {
    this.draftSubject.next(value);
  }

  async loadNews(): Promise<void> {
    this.statusSubject.next('Consultando noticias del servicio web...');

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
      const payload = (await response.json()) as Array<{ id: number; title: string; body: string }>;

      this.newsSubject.next(
        payload.map((item, index) => ({
          id: item.id,
          title: this.capitalize(item.title),
          summary: item.body,
          category: ['Noticias', 'Campus', 'Eventos', 'Servicios', 'Vida estudiantil'][index % 5],
          source: 'JSONPlaceholder',
          publishedAt: this.formatDate(index),
        })),
      );
      this.statusSubject.next('Noticias actualizadas correctamente.');
    } catch {
      this.newsSubject.next(this.seedNews());
      this.statusSubject.next('Sin internet, se muestran noticias de ejemplo.');
    }
  }

  async sendFeedback(message: string): Promise<void> {
    const trimmed = message.trim();
    if (!trimmed) {
      this.statusSubject.next('Escribe un mensaje antes de enviar.');
      return;
    }

    this.statusSubject.next('Enviando mensaje de retroalimentacion...');

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Feedback OcupaBus',
          body: trimmed,
          userId: 307,
        }),
      });

      if (!response.ok) {
        throw new Error('bad response');
      }

      this.statusSubject.next('Retroalimentacion enviada al servicio web.');
    } catch {
      this.statusSubject.next('No fue posible enviar el mensaje; queda como demostracion local.');
    }
  }

  private seedNews(): NewsItem[] {
    return [
      {
        id: 1,
        title: 'Aplicacion preparada para defensa',
        summary: 'El panel de inicio concentra las funciones principales del proyecto para la presentacion final.',
        category: 'Campus',
        source: 'Equipo OcupaBus',
        publishedAt: this.formatDate(0),
      },
      {
        id: 2,
        title: 'Modo offline activo',
        summary: 'Los reportes se almacenan localmente y se sincronizan cuando vuelve la conexion.',
        category: 'Servicios',
        source: 'Equipo OcupaBus',
        publishedAt: this.formatDate(1),
      },
      {
        id: 3,
        title: 'Mapa y GPS integrados',
        summary: 'La vista de ubicacion muestra puntos de referencia y permite centrar la posicion actual.',
        category: 'Movilidad',
        source: 'Equipo OcupaBus',
        publishedAt: this.formatDate(2),
      },
    ];
  }

  private formatDate(offsetDays: number): string {
    const date = new Date();
    date.setDate(date.getDate() - offsetDays);
    return date.toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  private capitalize(text: string): string {
    return text
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

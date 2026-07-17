/**
 * Módulo: Home + Servicios Web
 * Responsable: Franklin Alberto Beltré Fernández (100066613)
 * Proyecto: OcupaBus — ISW-307, Grupo Z
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NewsItem } from '../models/app.models';

export type FeedbackStatus = 'idle' | 'enviando' | 'enviado' | 'error';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly newsSubject = new BehaviorSubject<NewsItem[]>(this.seedNews());
  private readonly statusSubject = new BehaviorSubject<string>('Listo para cargar noticias y enviar retroalimentacion.');
  private readonly draftSubject = new BehaviorSubject<string>('');
  private readonly feedbackStatusSubject = new BehaviorSubject<FeedbackStatus>('idle');

  readonly news$ = this.newsSubject.asObservable();
  readonly status$ = this.statusSubject.asObservable();
  readonly draft$ = this.draftSubject.asObservable();
  readonly feedbackStatus$ = this.feedbackStatusSubject.asObservable();

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
      const offset = Math.floor(Math.random() * 91); // 0-90, deja espacio para _limit=5 dentro de 100 posts
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_start=${offset}&_limit=5`);
      const payload = (await response.json()) as Array<{ id: number; userId: number; title: string; body: string }>;

      const draftNews: NewsItem[] = payload.map((item, index) => {
        const topic = this.academicTopics[item.id % this.academicTopics.length];
        return {
          id: item.id,
          title: topic.title,
          summary: topic.summary,
          category: ['Noticias', 'Campus', 'Eventos', 'Servicios', 'Vida estudiantil'][index % 5],
          source: 'JSONPlaceholder',
          publishedAt: this.formatNow(),
          author: 'Cargando autor...',
        };
      });

      this.newsSubject.next(draftNews);
      this.statusSubject.next('Noticias actualizadas correctamente.');

      await Promise.all(
        payload.map(async (item, index) => {
          const author = await this.fetchAuthorName(item.userId);
          const current = [...this.newsSubject.value];
          if (current[index]) {
            current[index] = { ...current[index], author };
            this.newsSubject.next(current);
          }
        }),
      );
    } catch {
      this.newsSubject.next(this.seedNews());
      this.statusSubject.next('Sin internet, se muestran noticias de ejemplo.');
    }
  }

  private async fetchAuthorName(userId: number): Promise<string> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 400));
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
      if (!response.ok) {
        throw new Error('bad response');
      }
      const user = (await response.json()) as { name?: string };
      return user.name ?? 'Autor desconocido';
    } catch {
      return 'Autor desconocido';
    }
  }

  async sendFeedback(message: string): Promise<boolean> {
    const trimmed = message.trim();
    if (!trimmed) {
      this.statusSubject.next('Escribe un mensaje antes de enviar.');
      return false;
    }

    this.statusSubject.next('Enviando mensaje de retroalimentacion...');
    this.feedbackStatusSubject.next('enviando');

    let success = false;

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

      const created = (await response.json()) as { id?: number };
      this.statusSubject.next(
        created.id !== undefined
          ? `Comentario #${created.id} registrado correctamente.`
          : 'Retroalimentacion enviada al servicio web.',
      );
      this.feedbackStatusSubject.next('enviado');
      success = true;
    } catch {
      this.statusSubject.next('No fue posible enviar el mensaje; queda como demostracion local.');
      this.feedbackStatusSubject.next('error');
    }

    setTimeout(() => this.feedbackStatusSubject.next('idle'), 3000);

    return success;
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

  private formatNow(): string {
    return new Date().toLocaleString('es-DO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private readonly academicTopics: Array<{ title: string; summary: string }> = [
    { title: 'Inscripciones del nuevo cuatrimestre abiertas', summary: 'La UAPA habilita el proceso de inscripcion en linea para estudiantes regulares y de nuevo ingreso.' },
    { title: 'Biblioteca extiende horario en epoca de examenes', summary: 'Las salas de estudio permaneceran abiertas hasta altas horas durante la semana de parciales.' },
    { title: 'Nueva ruta de autobus hacia el recinto', summary: 'Se incorpora una ruta adicional para reducir los tiempos de espera en horas pico.' },
    { title: 'Jornada de vacunacion en el campus', summary: 'El departamento de bienestar estudiantil organiza una jornada de salud abierta a toda la comunidad.' },
    { title: 'Taller de oratoria para estudiantes', summary: 'La escuela de comunicacion social invita a un taller practico sobre hablar en publico.' },
    { title: 'Actualizacion del reglamento academico', summary: 'Se publican los cambios aprobados al reglamento de evaluaciones y asistencia.' },
    { title: 'Feria de empleo para egresados', summary: 'Empresas aliadas participaran en la feria anual de empleo organizada por la universidad.' },
    { title: 'Mantenimiento programado en el estacionamiento', summary: 'Labores de repavimentacion afectaran temporalmente el acceso al area de parqueo.' },
    { title: 'Convocatoria para intercambio estudiantil', summary: 'Se abre la convocatoria para el programa de movilidad academica internacional.' },
    { title: 'Nuevos horarios en la cafeteria central', summary: 'El servicio de alimentacion amplia su oferta y horario de atencion.' },
    { title: 'Charla sobre seguridad vial universitaria', summary: 'Transito y seguridad del campus ofrecen una charla sobre uso responsable del transporte.' },
    { title: 'Resultados del concurso de innovacion estudiantil', summary: 'Se anuncian los proyectos ganadores del concurso de innovacion y emprendimiento.' },
    { title: 'Mantenimiento de la plataforma virtual', summary: 'El aula virtual estara en mantenimiento programado durante la madrugada.' },
    { title: 'Campaña de reciclaje en el recinto', summary: 'Estudiantes de ingenieria ambiental lideran una campaña de reciclaje en los pasillos principales.' },
    { title: 'Actualizacion de la app de transporte', summary: 'La aplicacion de rutas de autobus incorpora mejoras en la precision del GPS.' },
    { title: 'Semana de bienestar mental', summary: 'El departamento de orientacion organiza actividades enfocadas en la salud mental estudiantil.' },
    { title: 'Nuevos laboratorios de computacion', summary: 'Se inauguran laboratorios equipados con nuevo hardware para las carreras tecnologicas.' },
    { title: 'Torneo deportivo interfacultades', summary: 'Las distintas facultades competiran en el torneo deportivo anual del recinto.' },
  ];
}

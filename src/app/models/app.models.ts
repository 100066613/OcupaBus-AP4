export type TaskPriority = 'Baja' | 'Media' | 'Alta';

export interface AppTask {
  id: string;
  title: string;
  notes: string;
  priority: TaskPriority;
  completed: boolean;
  createdAt: string;
}

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  category: string;
  source: string;
  publishedAt: string;
  author?: string;
}

export interface CampusPoint {
  id: string;
  name: string;
  detail: string;
  x: number;
  y: number;
  lat: number;
  lng: number;
  type: 'acceso' | 'aula' | 'servicio' | 'social';
}

export interface GeoPosition {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  label: string;
  updatedAt: string;
}

export interface DemoDevice {
  id: string;
  name: string;
  detail: string;
  status: 'Disponible' | 'Emparejado' | 'Activo';
  icon: string;
}

export interface ActivityLog {
  when: string;
  source: string;
  title: string;
  detail: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  description: string;
  duration: string;
  toneHz: number;
}

export interface CaptureItem {
  id: string;
  title: string;
  preview: string;
  createdAt: string;
}

export interface ProfileSettings {
  name: string;
  program: string;
  email: string;
  notifications: boolean;
  offlineMode: boolean;
}

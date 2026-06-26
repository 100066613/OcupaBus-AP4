export type OcupacionBus = 'vacío' | 'medio' | 'lleno';

export interface BusReport {
  id: string;
  tipo: 'ocupacion_bus';
  ocupacion: OcupacionBus;
  lat: number;
  lng: number;
  fecha: string;
  sincronizado: boolean;
}

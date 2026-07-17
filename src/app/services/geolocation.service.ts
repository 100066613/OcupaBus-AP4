/**
 * Módulo: Geolocalización + Mapa
 * Responsable: Francisco Ferreira (100052613)
 * Proyecto: OcupaBus — ISW-307, Grupo Z
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CampusPoint, GeoPosition } from '../models/app.models';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private readonly pointsSubject = new BehaviorSubject<CampusPoint[]>(this.seedPoints());
  private readonly selectedPointSubject = new BehaviorSubject<CampusPoint>(this.seedPoints()[0]);
  private readonly positionSubject = new BehaviorSubject<GeoPosition>(this.seedPosition());
  private readonly statusSubject = new BehaviorSubject<string>('Mapa listo para centrar la ubicacion actual.');

  readonly points$ = this.pointsSubject.asObservable();
  readonly selectedPoint$ = this.selectedPointSubject.asObservable();
  readonly position$ = this.positionSubject.asObservable();
  readonly status$ = this.statusSubject.asObservable();

  get points(): CampusPoint[] {
    return this.pointsSubject.value;
  }

  get selectedPoint(): CampusPoint {
    return this.selectedPointSubject.value;
  }

  get position(): GeoPosition {
    return this.positionSubject.value;
  }

  get status(): string {
    return this.statusSubject.value;
  }

  async refreshPosition(): Promise<void> {
    this.statusSubject.next('Buscando ubicacion actual...');

    if (!navigator.geolocation) {
      this.statusSubject.next('El navegador no expone GPS, se uso una ubicacion de ejemplo.');
      this.positionSubject.next(this.seedPosition());
      return;
    }

    try {
      const position = await this.getPosition();
      const next: GeoPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        label: 'Ubicacion actual detectada',
        updatedAt: this.clock(),
      };

      this.positionSubject.next(next);
      this.statusSubject.next('Ubicacion actualizada correctamente.');
    } catch {
      this.positionSubject.next(this.seedPosition());
      this.statusSubject.next('No fue posible obtener GPS, se uso el punto de referencia.');
    }
  }

  selectPoint(point: CampusPoint): void {
    this.selectedPointSubject.next(point);
    this.statusSubject.next(`Marcador seleccionado: ${point.name}.`);
  }

  focusCampus(): void {
    const point = this.pointsSubject.value[0];
    this.selectPoint(point);
  }

  private getPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 5000,
      });
    });
  }

  // Coordenadas obtenidas de OpenStreetMap / Nominatim para
  // UAPA Recinto Santo Domingo Oriental, Residencial Rosario Mieses,
  // Santo Domingo Este (osm_id: 224239757, amenity: university).
  // Offsets de puntos internos calculados dentro del bounding box
  // confirmado del campus: lat 18.5147–18.5162, lng −69.8478–−69.8466.
  private seedPoints(): CampusPoint[] {
    return [
      { id: 'campus-entrada',       name: 'Entrada principal',       detail: 'Acceso vehicular y peatonal principal',    x: 80, y: 50, lat: 18.5156226, lng: -69.8469540, type: 'acceso'  },
      { id: 'campus-edificio-a',    name: 'Edificio academico',      detail: 'Aulas y salones de clase',                x: 40, y: 35, lat: 18.5158000, lng: -69.8474000, type: 'aula'    },
      { id: 'campus-administracion',name: 'Administracion',          detail: 'Registro, finanzas y servicios generales', x: 50, y: 55, lat: 18.5155000, lng: -69.8472000, type: 'servicio'},
      { id: 'campus-biblioteca',    name: 'Area de estudio',         detail: 'Zona de consulta y recursos academicos',  x: 30, y: 60, lat: 18.5152000, lng: -69.8475000, type: 'servicio'},
      { id: 'campus-estacionamiento',name: 'Estacionamiento',        detail: 'Parqueo interno del campus',              x: 65, y: 70, lat: 18.5149000, lng: -69.8470000, type: 'social'  },
    ];
  }

  private seedPosition(): GeoPosition {
    return {
      latitude: 18.5156165,
      longitude: -69.8472509,
      accuracy: 30,
      label: 'UAPA Santo Domingo Oriental',
      updatedAt: this.clock(),
    };
  }

  private clock(): string {
    return new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' });
  }
}

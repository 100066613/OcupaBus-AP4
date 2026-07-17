/**
 * Módulo: Geolocalización + Mapa
 * Responsable: Francisco Ferreira (100052613)
 * Proyecto: OcupaBus — ISW-307, Grupo Z
 */
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { CampusPoint, GeoPosition } from '../models/app.models';
import { GeolocationService } from '../services/geolocation.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonBadge,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonText,
    IonTitle,
    IonToolbar,
  ],
})
export class HistoryPage implements OnInit, AfterViewInit, OnDestroy {
  readonly points$ = this.geo.points$;
  readonly selectedPoint$ = this.geo.selectedPoint$;
  readonly position$ = this.geo.position$;
  readonly status$ = this.geo.status$;

  private map?: L.Map;
  private userMarker?: L.Marker;
  private readonly refMarkers: L.Marker[] = [];
  private readonly subs = new Subscription();

  private readonly userIcon = L.divIcon({
    className: '',
    html: `<div style="
      width:18px;height:18px;
      background:#1d4ed8;
      border:3px solid #fff;
      border-radius:50%;
      box-shadow:0 2px 8px rgba(29,78,216,.5)">
    </div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

  private readonly refIcon = L.divIcon({
    className: '',
    html: `<div style="
      width:14px;height:14px;
      background:#0f766e;
      border:2px solid #fff;
      border-radius:50%;
      box-shadow:0 2px 6px rgba(15,118,110,.45)">
    </div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

  constructor(private readonly geo: GeolocationService) {}

  async ngOnInit(): Promise<void> {
    await this.geo.refreshPosition();
  }

  ngAfterViewInit(): void {
    this.initMap();

    this.subs.add(
      this.geo.position$.subscribe((pos) => this.updateUserMarker(pos)),
    );

    this.subs.add(
      this.geo.points$.subscribe((points) => this.renderRefMarkers(points)),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.map?.remove();
  }

  async refresh(): Promise<void> {
    await this.geo.refreshPosition();
  }

  focus(pointId: string): void {
    const point = this.geo.points.find((item) => item.id === pointId);
    if (point) {
      this.geo.selectPoint(point);
      this.map?.setView([point.lat, point.lng], 17, { animate: true });
    }
  }

  focusCampus(): void {
    this.geo.focusCampus();
    const campus = this.geo.selectedPoint;
    this.map?.setView([campus.lat, campus.lng], 16, { animate: true });
  }

  private initMap(): void {
    const pos = this.geo.position;

    this.map = L.map('leaflet-map', {
      center: [pos.latitude, pos.longitude],
      zoom: 16,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(this.map);

    this.updateUserMarker(pos);
    this.renderRefMarkers(this.geo.points);

    // Leaflet needs a size invalidation when the container becomes visible
    setTimeout(() => this.map?.invalidateSize(), 300);
  }

  private updateUserMarker(pos: GeoPosition): void {
    if (!this.map) return;
    const latlng: L.LatLngExpression = [pos.latitude, pos.longitude];
    if (this.userMarker) {
      this.userMarker.setLatLng(latlng);
    } else {
      this.userMarker = L.marker(latlng, { icon: this.userIcon, zIndexOffset: 1000 })
        .addTo(this.map)
        .bindPopup(`<strong>${pos.label}</strong><br>${pos.latitude.toFixed(5)}, ${pos.longitude.toFixed(5)}`);
    }
  }

  private renderRefMarkers(points: CampusPoint[]): void {
    if (!this.map) return;
    this.refMarkers.forEach((m) => m.remove());
    this.refMarkers.length = 0;
    points.forEach((point) => {
      const m = L.marker([point.lat, point.lng], { icon: this.refIcon })
        .addTo(this.map!)
        .bindPopup(`<strong>${point.name}</strong><br><small>${point.detail}</small>`);
      this.refMarkers.push(m);
    });
  }
}

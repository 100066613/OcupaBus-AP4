/**
 * Módulo: Home + Servicios Web
 * Responsable: Franklin Alberto Beltré Fernández (100066613)
 * Proyecto: OcupaBus — ISW-307, Grupo Z
 */
import { Component } from '@angular/core';
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bluetoothOutline, homeOutline, listOutline, locationOutline, musicalNotesOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  constructor() {
    addIcons({ bluetoothOutline, homeOutline, listOutline, locationOutline, musicalNotesOutline });
  }
}

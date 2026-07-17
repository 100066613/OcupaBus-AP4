/**
 * Módulo: Home + Servicios Web
 * Responsable: Franklin Alberto Beltré Fernández (100066613)
 * Proyecto: OcupaBus — ISW-307, Grupo Z
 */
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'tasks',
        loadComponent: () => import('./transfers/transfers.page').then((m) => m.TransfersPage),
      },
      {
        path: 'connectivity',
        loadComponent: () => import('./devices/devices.page').then((m) => m.DevicesPage),
      },
      {
        path: 'map',
        loadComponent: () => import('./history/history.page').then((m) => m.HistoryPage),
      },
      {
        path: 'media',
        loadComponent: () => import('./profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'tabs/home',
  },
];

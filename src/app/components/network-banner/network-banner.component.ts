import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonChip, IonIcon } from '@ionic/angular/standalone';
import { cloudOffline, refreshOutline, wifiOutline } from 'ionicons/icons';
import { NetworkService } from '../../services/network.service';

@Component({
  selector: 'app-network-banner',
  standalone: true,
  imports: [CommonModule, IonChip, IonIcon],
  template: `
    <section class="banner" [class.online]="(networkService.isOnline$ | async) === true" [class.offline]="(networkService.isOnline$ | async) === false">
      <ion-chip class="state-chip" [class.online-chip]="(networkService.isOnline$ | async) === true" [class.offline-chip]="(networkService.isOnline$ | async) === false">
        <ion-icon [icon]="(networkService.isOnline$ | async) === true ? wifiOutline : cloudOffline"></ion-icon>
        <span>{{ (networkService.isOnline$ | async) === true ? 'Conectado' : 'Modo offline' }}</span>
      </ion-chip>

      <div class="banner-text">
        <strong>{{ (networkService.isOnline$ | async) === true ? 'La app esta en linea' : 'La app sigue funcionando sin internet' }}</strong>
        <p>{{ (networkService.isOnline$ | async) === true ? 'Los reportes se enviaran al instante.' : 'Los reportes se guardaran localmente hasta recuperar la conexion.' }}</p>
      </div>

      <div class="connection-type">
        <ion-icon [icon]="refreshOutline"></ion-icon>
        <span>Conexion: {{ networkService.connectionType$ | async }}</span>
      </div>
    </section>
  `,
  styles: [`
    .banner {
      display: grid;
      gap: 0.85rem;
      padding: 1rem;
      border-radius: 1.25rem;
      color: #ffffff;
      background: linear-gradient(135deg, #0f172a, #1f2937);
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.2);
    }

    .banner.online {
      background: linear-gradient(135deg, #0f766e, #14b8a6);
    }

    .banner.offline {
      background: linear-gradient(135deg, #7f1d1d, #ef4444);
    }

    .state-chip,
    .connection-type {
      width: fit-content;
      margin: 0;
      --background: rgba(255, 255, 255, 0.14);
      --color: #fff;
      font-weight: 700;
    }

    .banner-text strong,
    .banner-text p,
    .connection-type span {
      display: block;
      margin: 0;
    }

    .banner-text strong {
      font-size: 1.05rem;
    }

    .banner-text p {
      margin-top: 0.35rem;
      line-height: 1.45;
      opacity: 0.95;
    }

    .connection-type {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.45rem 0.75rem;
      border-radius: 999px;
    }
  `],
})
export class NetworkBannerComponent {
  protected readonly wifiOutline = wifiOutline;
  protected readonly cloudOffline = cloudOffline;
  protected readonly refreshOutline = refreshOutline;

  constructor(public readonly networkService: NetworkService) {}
}

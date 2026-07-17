import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  albumsOutline,
  bluetoothOutline,
  cameraOutline,
  checkmarkCircleOutline,
  cloudOfflineOutline,
  homeOutline,
  listOutline,
  locationOutline,
  locateOutline,
  newspaperOutline,
  musicalNotesOutline,
  pauseOutline,
  personOutline,
  playOutline,
  qrCodeOutline,
  radioOutline,
  refreshOutline,
  reorderThreeOutline,
  sendOutline,
  sparklesOutline,
  starOutline,
  stopOutline,
  trashOutline,
  wifiOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    addIcons({
      addOutline,
      albumsOutline,
      bluetoothOutline,
      cameraOutline,
      checkmarkCircleOutline,
      cloudOfflineOutline,
      homeOutline,
      listOutline,
      locationOutline,
      locateOutline,
      newspaperOutline,
      musicalNotesOutline,
      pauseOutline,
      personOutline,
      playOutline,
      qrCodeOutline,
      radioOutline,
      refreshOutline,
      reorderThreeOutline,
      sendOutline,
      sparklesOutline,
      starOutline,
      stopOutline,
      trashOutline,
      wifiOutline,
    });
  }
}

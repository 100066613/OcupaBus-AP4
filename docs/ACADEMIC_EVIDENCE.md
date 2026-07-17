# Evidencia académica — OcupaBus AP4

> Para una evaluación completa, este repositorio debe revisarse junto con la documentación y las evidencias externas enlazadas a continuación.

---

## 1. Datos institucionales

| Campo | Detalle |
|---|---|
| Universidad | Universidad Abierta para Adultos (UAPA) |
| Escuela | Escuela de Ingeniería y Tecnología |
| Carrera | Ingeniería de Software |
| Asignatura | Programación de Dispositivos Móviles — ISW-307 |
| Facilitador | Joan Manuel Gregorio Pérez |
| Grupo | Z |
| Periodo | Julio 2026 |
| Tipo de entregable | Proyecto Práctico Final |

---

## 2. Equipo y módulos asignados

| Integrante | Matrícula | Módulo asignado | Archivos principales |
|---|:---:|---|---|
| Franklin Alberto Beltré Fernández | 100066613 | Home + Servicios Web | `src/app/home/`, `src/app/services/api.service.ts`, `src/app/app.routes.ts`, `src/app/tabs/` |
| Smailyn Ceballo Viva | 100064094 | Tareas + Almacenamiento | `src/app/transfers/`, `src/app/services/local-store.service.ts` |
| Angeleen Antonio Bello Hernández | 100065707 | Conectividad + Reportes Offline First | `src/app/devices/`, `src/app/services/network.service.ts`, `src/app/services/offline-report.service.ts`, `src/app/services/connectivity-lab.service.ts` |
| Francisco Ferreira | 100052613 | Geolocalización + Mapa | `src/app/history/`, `src/app/services/geolocation.service.ts` |
| Emmanuel Espinal | 100063182 | Multimedia + Cámara + Perfil | `src/app/profile/`, `src/app/services/media.service.ts` |

---

## 3. Repositorios y evidencias

| Recurso | Enlace |
|---|---|
| Código fuente (este repositorio) | [https://github.com/100066613/OcupaBus-AP4](https://github.com/100066613/OcupaBus-AP4) |
| Documentación técnica, videos y evidencias | [Google Drive — Repositorio de evidencias](https://drive.google.com/drive/folders/10WL5UBNh8GSHjXJN0AkIKcnipiaj3Lo3?usp=sharing) |

---

## 4. Entregables

| Entregable | Ubicación | Estado |
|---|---|---|
| Código fuente completo | Este repositorio | Disponible |
| Documento técnico del proyecto | Google Drive / `documentacion/documentacion_tecnica_AP4.md` | Disponible |
| Diagrama de flujo | `documentacion/diagrama_flujo.txt` | Disponible |
| Capturas de pantalla (navegador y emulador) | `documentacion/*.png` (6 imágenes) | Disponible |
| APK debug compilado | `android/app/build/outputs/apk/debug/OcupaBus-AP4-debug.apk` | Compilar con `./gradlew assembleDebug` |
| Video general del proyecto | Google Drive | Disponible |
| Videos individuales por módulo (5) | Google Drive | Disponible |
| Evidencia de pruebas automatizadas (84 tests) | Google Drive / ejecutar `npm test` | Disponible |

---

## 5. Trazabilidad académica — funcionalidades vs. unidades ISW-307

| Funcionalidad implementada | Módulo en el proyecto | Tecnología / API |
|---|---|---|
| Interfaz móvil con componentes nativos | Todos los módulos | Ionic 8, Angular 20 |
| Navegación nativa entre pantallas | `TabsPage`, `app.routes.ts` | `IonTabs`, `IonicRouteStrategy`, lazy loading |
| Consumo de servicios web REST | Home | `fetch()` + JSONPlaceholder |
| Persistencia de datos local | Tareas, Media, Perfil | `localStorage` vía `LocalStoreService` |
| Detección de estado de red | Conectividad | `@capacitor/network` |
| Estrategia Offline First | Conectividad | `OfflineReportService` + `BehaviorSubject` |
| Integración de hardware (Bluetooth) | Conectividad | Web Bluetooth API (`navigator.bluetooth`) |
| Integración de hardware (NFC) | Conectividad | Simulado (sin `NDEFReader`) |
| Geolocalización | Mapa | `navigator.geolocation` |
| Mapa interactivo | Mapa | Leaflet 1.9.4 + OpenStreetMap |
| Multimedia — audio | Media | Web Audio API (`AudioContext`) |
| Multimedia — cámara e imágenes | Media | `<input type="file">` + `FileReader` |
| Estado reactivo | Todos los servicios | RxJS `BehaviorSubject`, `async` pipe |
| Pruebas unitarias | 5 servicios + 2 componentes | Jasmine + Karma |
| Compilación para Android | Proyecto completo | Capacitor 8.4, Gradle |

---

## 6. Evidencias incluidas en el repositorio

| Imagen | Descripción |
|---|---|
| `documentacion/01_navegador_conectado.png` | App ejecutándose en navegador con conexión activa |
| `documentacion/02_navegador_offline.png` | App en navegador sin conexión (banner offline visible) |
| `documentacion/03_emulador_conectado.png` | App en emulador Android con conexión activa |
| `documentacion/04_emulador_conectado_reporte_enviado.png` | Reporte enviado correctamente en emulador |
| `documentacion/05_emulador_offline.png` | Emulador en modo offline |
| `documentacion/06_emulador_offline_reporte_pendiente.png` | Reporte en cola de pendientes (emulador offline) |

---

## 7. Cómo reproducir las pruebas

```bash
git clone https://github.com/100066613/OcupaBus-AP4.git
cd OcupaBus-AP4
npm install
npm test
```

Las 84 pruebas deben completarse sin errores en Chrome Headless.

---

## 8. Cómo compilar el APK

```bash
npm run build
npm run android:sync
cd android
./gradlew assembleDebug
```

APK resultante: `android/app/build/outputs/apk/debug/OcupaBus-AP4-debug.apk`

# OcupaBus AP4

**Aplicación móvil académica para el reporte de ocupación de autobuses y la demostración integrada de funcionalidades móviles desarrolladas en ISW-307.**

---

## 1. Estado del proyecto

> [!NOTE]
> Este repositorio corresponde al **Proyecto Práctico Final** de la asignatura **Programación de Dispositivos Móviles (ISW-307)** de la Universidad Abierta para Adultos (UAPA), periodo julio de 2026.

- Finalizado para evaluación académica.
- De naturaleza demostrativa; no está destinado a producción.
- Sin mantenimiento activo posterior a la entrega.

---

## 2. Descripción general

OcupaBus es una aplicación móvil que simula un sistema de reporte de ocupación de autobuses en tiempo real. Su propósito principal es **académico y demostrativo**: integra en una sola experiencia cinco módulos funcionales que cubren las unidades prácticas de la asignatura ISW-307.

No existe un backend propio ni infraestructura de transporte real. Los datos se obtienen de una API pública de prueba (JSONPlaceholder) y se persisten exclusivamente en `localStorage` del navegador.

---

## 3. Objetivo del proyecto

Desarrollar una aplicación móvil multiplataforma con Ionic, Angular y Capacitor que demuestre la integración de funcionalidades nativas y web en un escenario educativo coherente, cubriendo servicios web, almacenamiento local, conectividad, geolocalización, multimedia y estrategia Offline First.

---

## 4. Alcance

### Incluye

- Interfaz móvil con componentes Ionic 8.
- Navegación por pestañas con carga diferida (lazy loading).
- Gestión local de tareas (CRUD, reordenamiento, prioridad).
- Consumo de API REST pública de prueba (JSONPlaceholder).
- Detección del estado de red mediante `@capacitor/network`.
- Reportes de ocupación con estrategia Offline First y sincronización demostrativa.
- Mapa interactivo con Leaflet y tiles de OpenStreetMap.
- Geolocalización mediante `navigator.geolocation`.
- Generación procedural de audio WAV mediante Web Audio API.
- Captura y visualización de imágenes mediante `<input type="file">` y `FileReader`.
- 84 pruebas unitarias con Jasmine y Karma.
- APK debug compilado con Capacitor para Android 7.0+.

### No incluye

- Backend propio ni base de datos remota.
- Autenticación de usuarios.
- API de transporte público real.
- NFC nativo (completamente simulado en memoria).
- Emparejamiento Bluetooth nativo completo (parcial, solo Chrome/Edge de escritorio).
- Publicación en Google Play Store.

---

## 5. Funcionalidades principales

| Módulo | Funcionalidad | Estado | Implementación |
|--------|---------------|--------|----------------|
| Home | Feed de noticias desde JSONPlaceholder | Comprobado | `ApiService` + `fetch()` |
| Home | Envío de retroalimentación (POST simulado) | Comprobado | `ApiService.sendFeedback()` |
| Home | Fallback a noticias semilla sin red | Comprobado | `seedNews()` en `ApiService` |
| Tareas | CRUD de tareas con prioridad | Comprobado | `LocalStoreService` + `localStorage` |
| Tareas | Reordenamiento por arrastre | Comprobado | `IonReorderGroup` + `reorderTasks()` |
| Tareas | Eliminación por deslizamiento | Comprobado | `IonItemSliding` |
| Tareas | Persistencia entre sesiones | Comprobado | `localStorage` clave `ocupabus_tasks` |
| Conectividad | Detección de red en tiempo real | Comprobado | `@capacitor/network` → `NetworkService` |
| Conectividad | Banner online/offline reactivo | Comprobado | `NetworkBannerComponent` |
| Conectividad | Reportes Offline First | Comprobado | `OfflineReportService` |
| Conectividad | Sincronización automática al reconectar | Comprobado (simulado sin HTTP real) | `sincronizarPendientes()` |
| Conectividad | Descubrimiento Bluetooth | Parcial | `navigator.bluetooth.requestDevice()` solo en Chrome/Edge |
| Conectividad | Emparejamiento Bluetooth | Simulado | Actualización en memoria sin llamada nativa |
| Conectividad | Lectura y escritura NFC | Simulado | Sin `NDEFReader` ni plugin nativo |
| Mapa | Mapa interactivo con OpenStreetMap | Comprobado | Leaflet 1.9.4 + `L.map()` |
| Mapa | Geolocalización GPS del usuario | Dependiente del dispositivo | `navigator.geolocation.getCurrentPosition()` |
| Mapa | Puntos de referencia del campus UAPA | Comprobado | Coordenadas reales embebidas |
| Mapa | Fallback a posición semilla UAPA | Comprobado | `seedPosition()` en `GeolocationService` |
| Media | Generación de audio WAV procedural | Comprobado | `AudioContext` + síntesis sinusoidal |
| Media | Captura y almacenamiento de imágenes | Comprobado | `FileReader.readAsDataURL()` + `localStorage` |
| Media | Perfil de usuario local | Comprobado | `LocalStoreService` clave `ocupabus_settings` |

---

## 6. Capturas de pantalla

Las capturas de pantalla (navegador conectado/offline, emulador conectado/offline, reporte enviado/pendiente) no se versionan en este repositorio y están disponibles en el repositorio de evidencias enlazado en la sección [Documentación y evidencias](#20-documentación-y-evidencias). Ver el detalle de cada captura en [docs/ACADEMIC_EVIDENCE.md](docs/ACADEMIC_EVIDENCE.md).

---

## 7. Arquitectura resumida

OcupaBus tiene una **organización lógica por responsabilidades funcionales**, coherente con las convenciones de Ionic/Angular para proyectos de escala media:

- **Páginas** (`*.page.ts`): coordinan eventos de usuario y presentación. No contienen lógica de persistencia.
- **Servicios** (`*.service.ts`): concentran el estado reactivo (`BehaviorSubject`), la lógica de negocio y el acceso a datos en la misma clase. No existe una capa de dominio o repositorio separada.
- **Modelos** (`app.models.ts`, `report.model.ts`): interfaces TypeScript compartidas.
- **Persistencia**: `localStorage` exclusivamente, gestionado por `LocalStoreService` y `OfflineReportService`.

> Esta no es una arquitectura empresarial por capas con dominio, repositorios y casos de uso separados. Es una separación lógica apropiada para el alcance académico del proyecto.

```mermaid
graph TD
    U[Usuario] --> UI[Ionic 8 / Angular 20]
    UI --> TABS[TabsPage]
    TABS --> HOME[HomePage]
    TABS --> TRANS[TransfersPage]
    TABS --> DEV[DevicesPage]
    TABS --> HIST[HistoryPage]
    TABS --> PROF[ProfilePage]

    HOME --> API[ApiService]
    HOME --> LS[LocalStoreService]
    TRANS --> LS
    DEV --> CONN[ConnectivityLabService]
    DEV --> ORS[OfflineReportService]
    DEV --> NET[NetworkService]
    HIST --> GEO[GeolocationService]
    PROF --> MEDIA[MediaService]
    PROF --> LS
    ORS --> NET

    LS --> LSTORE[(localStorage)]
    ORS --> LSTORE
    API --> |fetch| JSON[JSONPlaceholder]
    HIST --> |tiles| OSM[OpenStreetMap]
    NET --> CAP[@capacitor/network]
    GEO --> GPSNAV[navigator.geolocation]
    CONN --> BLENAV[navigator.bluetooth]
    MEDIA --> AUDWEB[Web Audio API]
    MEDIA --> FILER[FileReader API]
```

---

## 8. Tecnologías

### Verificadas en el código fuente

| Tecnología | Versión | Uso en el proyecto |
|------------|--------:|--------------------|
| Angular | 20.3.25 | Componentes standalone, router, DI, formularios |
| Ionic | 8.0.0 | Componentes UI en todos los módulos |
| Capacitor | 8.4.1 | Bridge nativo; `@capacitor/network` con uso comprobado |
| TypeScript | ~5.9.0 | Modo estricto activo (`strict: true`, `strictTemplates: true`) |
| RxJS | ~7.8.0 | `BehaviorSubject`, `async` pipe, `distinctUntilChanged` |
| Leaflet | ^1.9.4 | Mapa interactivo con marcadores y tiles OSM |
| Zone.js | ~0.15.0 | Change detection de Angular |
| Jasmine / Karma | ~5.1.0 / ~6.4.0 | 84 pruebas unitarias con Chrome Headless |
| JSONPlaceholder | (API pública) | Noticias y feedback (GET y POST simulados) |
| OpenStreetMap | (tiles públicos) | Mapa base en el módulo Mapa |

### Dependencias declaradas sin uso comprobado en código fuente

| Plugin | Versión declarada | Observación |
|--------|------------------:|-------------|
| `@capacitor/app` | 8.1.0 | Instalado; sin referencia en `src/app/` |
| `@capacitor/haptics` | 8.0.2 | Instalado; sin referencia en `src/app/` |
| `@capacitor/keyboard` | 8.0.5 | Instalado; sin referencia en `src/app/` |
| `@capacitor/status-bar` | 8.0.2 | Instalado; sin referencia en `src/app/` |

---

## 9. Requisitos previos

| Herramienta | Versión mínima sugerida | Nota |
|-------------|------------------------|------|
| Node.js | 20.x LTS o superior | Compatible con Angular 20 |
| npm | 10.x o superior | Incluido con Node.js |
| Git | Cualquier versión reciente | Para clonar el repositorio |
| JDK | 21 (recomendado) | El script `android:run` usa Java 21; `android:run:17` usa Java 17 |
| Android Studio | Ladybug o superior | Para compilar y ejecutar en Android |
| Android SDK | API 36 (compileSdk) / API 24 (minSdk) | Configurado en `variables.gradle` |
| Chrome o Edge | Versión reciente | Requerido para Web Bluetooth API |

**Verificar el entorno instalado:**

```bash
node --version
npm --version
git --version
java --version
adb --version
```

---

## 10. Instalación desde cero

```bash
git clone https://github.com/100066613/OcupaBus-AP4.git
cd OcupaBus-AP4
npm install
```

> **`npm install` vs `npm ci`:** Se recomienda `npm install` para la instalación inicial, ya que el `package-lock.json` puede requerir resolución de dependencias. Usa `npm ci` únicamente si el lockfile está sincronizado con `package.json` y deseas una instalación reproducible exacta.

**Errores frecuentes:**

| Error | Causa probable | Acción recomendada |
|-------|---------------|-------------------|
| `Cannot find module '@angular/core'` | Dependencias no instaladas | Ejecutar `npm install` |
| `www/ not found` | Build no generado | Ejecutar `npm run build` antes de sincronizar |
| `SDK location not found` | `android/local.properties` ausente | Crear el archivo con `sdk.dir=/ruta/a/Android/Sdk` |
| `Port 4200 is already in use` | Servidor previo activo | Detener el proceso con `Ctrl+C` o cambiar puerto con `--port` |
| `JAVA_HOME not set` | JDK no configurado | Ver [docs/ANDROID_BUILD.md](docs/ANDROID_BUILD.md) |

---

## 11. Ejecución en navegador

```bash
npm start
```

Abre `http://localhost:4200` en el navegador. La recarga automática está activa.

**Limitaciones en navegador:**

- **Web Bluetooth:** Funciona únicamente en Chrome y Edge de escritorio con hardware Bluetooth disponible. En Firefox, Safari y la mayoría de navegadores móviles no está disponible.
- **Geolocalización:** Requiere permiso del navegador. En entornos HTTP (sin HTTPS) puede estar bloqueada por política del navegador.
- **NFC:** Completamente simulado; no usa ninguna API del navegador ni del sistema.
- **Cámara:** Disponible a través de `<input type="file" capture="environment">`. El comportamiento varía según el navegador y el sistema operativo.

---

## 12. Compilación web

```bash
npm run build
```

Salida en `www/` (configurado en `capacitor.config.ts` y `angular.json`).

```bash
ls -lah www/
```

Esta carpeta es la que Capacitor copia al WebView de Android durante la sincronización.

---

## 13. Ejecución en Android

El directorio `android/` ya existe en el repositorio. No es necesario ejecutar `npx cap add android`.

```bash
npm run build
npm run android:sync
```

Luego abrir Android Studio:

```bash
npx cap open android
```

Desde Android Studio: seleccionar dispositivo o emulador y pulsar **Run**.

Para verificar dispositivos conectados por USB:

```bash
adb devices
```

Ver guía completa: [docs/ANDROID_BUILD.md](docs/ANDROID_BUILD.md)

---

## 14. Generación del APK

```bash
cd android
./gradlew assembleDebug
```

APK generado en: `android/app/build/outputs/apk/debug/OcupaBus-AP4-debug.apk`

> Solo se genera APK debug. No existe configuración de firma para APK release ni Android App Bundle en este proyecto.

Ver guía completa: [docs/ANDROID_BUILD.md](docs/ANDROID_BUILD.md)

---

## 15. Pruebas

```bash
npm test
```

Ejecuta Jasmine con Karma y Chrome Headless. **84 pruebas** distribuidas en 7 archivos `.spec.ts`.

| Archivo spec | Pruebas |
|---|---:|
| `api.service.spec.ts` | 15 |
| `local-store.service.spec.ts` | 17 |
| `geolocation.service.spec.ts` | 16 |
| `connectivity-lab.service.spec.ts` | 20 |
| `offline-report.service.spec.ts` | 14 |
| `app.component.spec.ts` | 1 |
| `home.page.spec.ts` | 1 |

> `media.service.ts` no tiene archivo spec; sus flujos están cubiertos por pruebas de integración manual.

Ver detalles: [docs/TESTING.md](docs/TESTING.md)

---

## 16. Estructura del proyecto

```text
src/
├── app/
│   ├── home/               Módulo: noticias, feedback, estadísticas
│   ├── transfers/          Módulo: CRUD de tareas con almacenamiento local
│   ├── devices/            Módulo: conectividad, reportes offline, BT/NFC demo
│   ├── history/            Módulo: mapa Leaflet y geolocalización GPS
│   ├── profile/            Módulo: audio WAV, captura de fotos, perfil
│   ├── tabs/               Contenedor de navegación por pestañas
│   ├── components/
│   │   └── network-banner/ Banner reactivo de estado de red
│   ├── services/           Servicios singleton con estado reactivo
│   └── models/             Interfaces TypeScript compartidas
├── assets/
├── environments/
└── theme/
android/                    Proyecto Android nativo (Capacitor)
docs/                       Documentación técnica, guía de estilo, documento técnico, diagrama de flujo
```

---

## 17. Datos locales y almacenamiento

Toda la persistencia usa `localStorage` del navegador. Los datos sobreviven entre sesiones pero **no están cifrados** y son accesibles a cualquier script del mismo origen.

| Clave | Contenido |
|-------|-----------|
| `ocupabus_tasks` | Lista de tareas del usuario (`AppTask[]`) |
| `ocupabus_captures` | Imágenes capturadas como DataURL Base64 (`CaptureItem[]`) |
| `ocupabus_settings` | Configuración del perfil (`ProfileSettings`) |
| `ocupabus_reportes_pendientes` | Reportes sin sincronizar (`BusReport[]`) |
| `ocupabus_reportes_enviados` | Reportes procesados (`BusReport[]`) |

**Limpiar todos los datos locales desde DevTools del navegador:**

```javascript
localStorage.clear();
```

> Este comando elimina permanentemente todos los datos del sitio en el navegador actual.

---

## 18. Integraciones y permisos

| Integración | Implementación | Entorno | Permiso / Requisito | Estado |
|-------------|---------------|---------|---------------------|--------|
| Estado de red | `@capacitor/network` (plugin nativo) | Navegador + Android | `ACCESS_NETWORK_STATE` en `AndroidManifest.xml` | Comprobado |
| Geolocalización GPS | `navigator.geolocation` (Web API) | Navegador / WebView Android | Permiso en tiempo de ejecución | Dependiente del dispositivo |
| Mapa | Leaflet 1.9.4 + tiles OSM | Navegador / WebView Android | Acceso a internet | Comprobado |
| Bluetooth | `navigator.bluetooth.requestDevice()` (Web Bluetooth API) | Solo Chrome / Edge escritorio | Bluetooth habilitado en el sistema | Parcial |
| NFC | Sin API real (simulado en memoria) | Todos | Ninguno | Simulado |
| Cámara / galería | `<input type="file" capture="environment">` (Web API) | Navegador / WebView Android | Permiso de cámara en tiempo de ejecución | Dependiente del dispositivo |
| Audio | `AudioContext` + síntesis sinusoidal (Web API) | Navegador / WebView Android | Ninguno | Comprobado |
| API REST | `fetch()` a JSONPlaceholder | Navegador / WebView Android | `INTERNET` en `AndroidManifest.xml` | Comprobado |

---

## 19. Limitaciones conocidas

- `localStorage` no cifra datos y tiene un límite aproximado de 5–10 MB.
- No existe backend propio; JSONPlaceholder no almacena datos reales.
- `enviarReporte()` simula el envío con un delay de 200 ms sin petición HTTP real.
- Bluetooth requiere Chrome o Edge de escritorio; en la mayoría de navegadores móviles no está disponible.
- NFC no interactúa con ningún hardware real.
- Las imágenes capturadas se almacenan como Base64 en `localStorage`, lo que limita la cantidad práctica almacenable.
- Los permisos de GPS y cámara en Android los gestiona el WebView; su comportamiento puede variar por fabricante.
- `@capacitor/app`, `@capacitor/haptics`, `@capacitor/keyboard` y `@capacitor/status-bar` están instalados pero sin uso comprobado en el código de la aplicación.

Ver detalle completo: [docs/LIMITATIONS.md](docs/LIMITATIONS.md)

---

## 20. Documentación y evidencias

> El README presenta una visión práctica del repositorio. La documentación técnica completa, los anexos, las pruebas y las evidencias audiovisuales se encuentran en el repositorio institucional de evidencias.

| Recurso | Ubicación |
|---------|-----------|
| Documentación técnica (PDF / Word) | [Google Drive — Repositorio de evidencias](https://drive.google.com/drive/folders/10WL5UBNh8GSHjXJN0AkIKcnipiaj3Lo3?usp=sharing) |
| Video general del proyecto | [Google Drive — Repositorio de evidencias](https://drive.google.com/drive/folders/10WL5UBNh8GSHjXJN0AkIKcnipiaj3Lo3?usp=sharing) |
| Videos individuales por módulo | [Google Drive — Repositorio de evidencias](https://drive.google.com/drive/folders/10WL5UBNh8GSHjXJN0AkIKcnipiaj3Lo3?usp=sharing) |
| Documento técnico en repositorio | [`docs/documentacion_tecnica_AP4.md`](docs/documentacion_tecnica_AP4.md) |
| Diagrama de flujo | [`docs/diagrama_flujo.txt`](docs/diagrama_flujo.txt) |
| Capturas de pantalla | No versionadas en el repositorio; ver Google Drive — Repositorio de evidencias |
| Guía de instalación detallada | [docs/INSTALLATION.md](docs/INSTALLATION.md) |
| Arquitectura técnica | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| Descripción de módulos | [docs/MODULES.md](docs/MODULES.md) |
| Pruebas automatizadas | [docs/TESTING.md](docs/TESTING.md) |
| Compilación Android | [docs/ANDROID_BUILD.md](docs/ANDROID_BUILD.md) |
| Evidencia académica | [docs/ACADEMIC_EVIDENCE.md](docs/ACADEMIC_EVIDENCE.md) |
| Limitaciones técnicas | [docs/LIMITATIONS.md](docs/LIMITATIONS.md) |
| Guía de estilo e identidad visual | [docs/Guia_Estilo_Identidad_Visual_OcupaBus.md](docs/Guia_Estilo_Identidad_Visual_OcupaBus.md) |

---

## 21. Equipo de desarrollo

| Integrante | Matrícula | Módulo principal |
|------------|:---------:|-----------------|
| Franklin Alberto Beltré Fernández | 100066613 | Home + Servicios Web |
| Smailyn Ceballo Viva | 100064094 | Tareas + Almacenamiento |
| Angeleen Antonio Bello Hernández | 100065707 | Conectividad + Reportes Offline First |
| Francisco Ferreira | 100052613 | Geolocalización + Mapa |
| Emmanuel Espinal | 100063182 | Multimedia + Cámara + Perfil |

---

## 22. Contexto académico

| Campo | Detalle |
|-------|---------|
| Universidad | Universidad Abierta para Adultos (UAPA) |
| Escuela | Escuela de Ingeniería y Tecnología |
| Carrera | Ingeniería de Software |
| Asignatura | Programación de Dispositivos Móviles — ISW-307 |
| Facilitador | Joan Manuel Gregorio Pérez |
| Grupo | Z |
| Periodo | Julio 2026 |

El proyecto integra los contenidos prácticos trabajados durante la asignatura y debe evaluarse junto con las evidencias externas enlazadas en la sección anterior.

---

## 23. Licencia

Este proyecto está disponible bajo la licencia **MIT**. Ver el archivo [`LICENSE`](LICENSE) para los términos completos.

---

## 24. Contribución

Este repositorio corresponde a un proyecto académico cerrado. Ver [`CONTRIBUTING.md`](CONTRIBUTING.md) para la política de contribuciones del equipo.

---

## 25. Repositorio de evidencias

- **Código fuente:** [https://github.com/100066613/OcupaBus-AP4](https://github.com/100066613/OcupaBus-AP4)
- **Documentación y evidencias:** [Google Drive](https://drive.google.com/drive/folders/10WL5UBNh8GSHjXJN0AkIKcnipiaj3Lo3?usp=sharing)

---

## 26. Nota final

OcupaBus es una implementación académica que demuestra competencias de desarrollo móvil con Ionic, Angular y Capacitor. Para un uso en producción requeriría: un backend real con autenticación, una base de datos persistente y segura, integración con APIs de transporte público reales, cobertura de pruebas más amplia (componentes, integración y E2E), y revisión de seguridad de los datos almacenados localmente.

# Descripción de módulos — OcupaBus AP4

Cada módulo corresponde a una pestaña de la barra de navegación inferior y tiene un responsable académico asignado.

---

## Módulo 1 — Home y Servicios Web

**Responsable:** Franklin Alberto Beltré Fernández (100066613)

### Propósito

Tablero principal de la aplicación. Muestra noticias obtenidas de una API REST pública, permite enviar retroalimentación y presenta un resumen del estado de tareas y capturas del usuario.

### Archivos principales

| Elemento | Ruta |
|---|---|
| Página | `src/app/home/home.page.ts` |
| Template | `src/app/home/home.page.html` |
| Servicio de API | `src/app/services/api.service.ts` |
| Servicio de almacenamiento | `src/app/services/local-store.service.ts` |
| Modelos | `src/app/models/app.models.ts` → `NewsItem` |

### Métodos principales verificados

| Método | Descripción |
|---|---|
| `ngOnInit()` | Carga noticias al inicializar la vista |
| `ApiService.loadNews()` | `GET /posts?_limit=5` a JSONPlaceholder; fallback a `seedNews()` |
| `ApiService.sendFeedback(message)` | `POST /posts` a JSONPlaceholder (responde con ID ficticio) |
| `ApiService.setDraft(text)` | Actualiza el borrador del formulario |

### Almacenamiento

Accede a `LocalStoreService` solo para lectura del resumen (tareas y capturas). No escribe datos propios en `localStorage`.

### Estado de implementación

| Función | Estado |
|---|---|
| Feed de noticias desde API REST | Comprobado |
| Fallback a noticias semilla sin red | Comprobado |
| Envío de feedback (POST simulado) | Comprobado |
| Resumen de tareas y capturas | Comprobado |

### Probar manualmente

1. Abrir `http://localhost:4200/tabs/home`.
2. Desconectar la red del equipo.
3. Recargar la página; deben aparecer las noticias semilla.
4. Reconectar la red y recargar; deben cargarse noticias desde JSONPlaceholder.
5. Escribir un mensaje en el formulario y pulsar Enviar; debe aparecer confirmación.

### Limitaciones

- JSONPlaceholder no almacena datos reales; el POST devuelve un ID ficticio.
- Las noticias no corresponden a transporte público real.

---

## Módulo 2 — Tareas y Almacenamiento

**Responsable:** Smailyn Ceballo Viva (100064094)

### Propósito

Gestión completa de tareas del usuario con persistencia local. Implementa creación, lectura, actualización, eliminación, reordenamiento por arrastre y eliminación por deslizamiento.

### Archivos principales

| Elemento | Ruta |
|---|---|
| Página | `src/app/transfers/transfers.page.ts` |
| Template | `src/app/transfers/transfers.page.html` |
| Servicio | `src/app/services/local-store.service.ts` |
| Modelos | `src/app/models/app.models.ts` → `AppTask`, `TaskPriority` |

### Métodos principales verificados

| Método | Descripción |
|---|---|
| `addTask()` | Valida título no vacío; llama a `LocalStoreService.addTask()` |
| `toggleTask(task)` | Alterna estado completado/pendiente |
| `removeTask(task)` | Elimina la tarea por ID |
| `reorder(event)` | Reordena el array con `splice(from, to)` y confirma con `detail.complete()` |
| `LocalStoreService.addTask()` | Genera ID con `makeId('tsk')`, asigna `createdAt`, persiste en `localStorage` |
| `LocalStoreService.refreshSnapshot()` | Vuelve a leer `localStorage`; usado en pull-to-refresh |

### Almacenamiento

- Clave: `ocupabus_tasks` → `AppTask[]`
- Escribe en cada operación (add, toggle, remove, reorder).
- Fallback: 2 tareas de ejemplo al iniciar sin datos.

### Campos de `AppTask`

```typescript
interface AppTask {
  id: string;         // generado con makeId('tsk')
  title: string;
  notes: string;
  priority: 'Baja' | 'Media' | 'Alta';
  completed: boolean;
  createdAt: string;  // ISO 8601
}
```

### Estado de implementación

| Función | Estado |
|---|---|
| Crear tarea con título, notas y prioridad | Comprobado |
| Marcar/desmarcar como completada | Comprobado |
| Eliminar por deslizamiento (swipe) | Comprobado |
| Reordenar por arrastre | Comprobado |
| Persistencia entre sesiones | Comprobado |
| Pull-to-refresh | Comprobado |

### Probar manualmente

1. Ir a `/tabs/tasks`.
2. Crear una tarea con título y prioridad Alta.
3. Marcar la tarea como completada (checkbox).
4. Deslizar la tarea hacia la izquierda para eliminarla.
5. Crear varias tareas y reordenarlas arrastrando el ícono de reorden.
6. Recargar la página; las tareas deben persistir.

---

## Módulo 3 — Conectividad y Reportes Offline First

**Responsable:** Angeleen Antonio Bello Hernández (100065707)

### Propósito

Detecta el estado de la red en tiempo real, permite registrar reportes de ocupación de autobús con soporte Offline First, y ofrece demostraciones de Bluetooth y NFC.

### Archivos principales

| Elemento | Ruta |
|---|---|
| Página | `src/app/devices/devices.page.ts` |
| Template | `src/app/devices/devices.page.html` |
| Servicio de red | `src/app/services/network.service.ts` |
| Servicio de reportes | `src/app/services/offline-report.service.ts` |
| Servicio BT/NFC | `src/app/services/connectivity-lab.service.ts` |
| Componente banner | `src/app/components/network-banner/network-banner.component.ts` |
| Modelos | `src/app/models/report.model.ts` → `BusReport`, `OcupacionBus` |

### Métodos principales verificados

| Método | Descripción |
|---|---|
| `NetworkService.getCurrentStatus()` | `Network.getStatus()` de `@capacitor/network` |
| `NetworkService.isOnline$` | Observable reactivo del estado de conexión |
| `OfflineReportService.guardarReporte(r)` | Verifica estado de red antes de enviar o encolar |
| `OfflineReportService.sincronizarPendientes()` | Se dispara automáticamente al recuperar la red (`distinctUntilChanged`) |
| `ConnectivityLabService.discoverBluetooth()` | Llama a `navigator.bluetooth.requestDevice()` si está disponible |
| `ConnectivityLabService.pairBluetooth(device)` | Actualiza estado en memoria (sin llamada nativa real) |
| `ConnectivityLabService.readNfc()` | Actualiza `nfcMessageSubject` en memoria (sin `NDEFReader`) |
| `ConnectivityLabService.writeNfc(msg)` | Actualiza `nfcMessageSubject` en memoria (sin `NDEFReader`) |

### Almacenamiento

| Clave | Contenido |
|---|---|
| `ocupabus_reportes_pendientes` | `BusReport[]` sin sincronizar |
| `ocupabus_reportes_enviados` | `BusReport[]` procesados |

### Estado de implementación

| Función | Estado | Detalle |
|---|---|---|
| Detección de red en tiempo real | Comprobado | Vía `@capacitor/network` |
| Banner online/offline reactivo | Comprobado | `NetworkBannerComponent` |
| Cola offline de reportes | Comprobado | `OfflineReportService` |
| Sincronización al reconectar | Comprobado (sin HTTP real) | `enviarReporte()` = 200ms + `console.log` |
| Descubrimiento Bluetooth | Parcial | Real solo en Chrome/Edge con hardware BT |
| Emparejamiento Bluetooth | Simulado | Solo actualiza estado en memoria |
| Lectura NFC | Simulado | Sin `NDEFReader` ni plugin nativo |
| Escritura NFC | Simulado | Sin `NDEFReader` ni plugin nativo |

### Probar manualmente

1. Ir a `/tabs/connectivity`.
2. Registrar un reporte de ocupación (vacío/medio/lleno) con conexión activa.
3. Desconectar la red.
4. Registrar otro reporte; debe aparecer en la cola de pendientes.
5. Reconectar la red; la sincronización debe ejecutarse automáticamente.
6. Pulsar "Escanear Bluetooth" en Chrome o Edge con Bluetooth habilitado.

---

## Módulo 4 — Geolocalización y Mapa

**Responsable:** Francisco Ferreira (100052613)

### Propósito

Muestra un mapa interactivo con la posición actual del usuario y puntos de referencia del campus UAPA Santo Domingo Oriental, usando Leaflet y tiles de OpenStreetMap.

### Archivos principales

| Elemento | Ruta |
|---|---|
| Página | `src/app/history/history.page.ts` |
| Template | `src/app/history/history.page.html` |
| Servicio | `src/app/services/geolocation.service.ts` |
| Modelos | `src/app/models/app.models.ts` → `CampusPoint`, `GeoPosition` |

### Puntos de referencia del campus (coordenadas reales verificadas)

| Punto | Latitud | Longitud |
|-------|--------:|--------:|
| Entrada principal | 18.5156226 | -69.8469540 |
| Edificio académico | 18.5158000 | -69.8474000 |
| Administración | 18.5155000 | -69.8472000 |
| Área de estudio | 18.5152000 | -69.8475000 |
| Estacionamiento | 18.5149000 | -69.8470000 |

Posición semilla (fallback): lat 18.5156165, lng -69.8471000 — UAPA Santo Domingo Oriental.

### Métodos principales verificados

| Método | Descripción |
|---|---|
| `GeolocationService.refreshPosition()` | Llama a `navigator.geolocation.getCurrentPosition()` con timeout 8s |
| `GeolocationService.focusCampus()` | Centra el mapa en la entrada principal del campus |
| `GeolocationService.selectPoint(point)` | Centra el mapa en el punto seleccionado |
| `HistoryPage.initMap()` | `L.map()` + `L.tileLayer()` + marcadores; se llama desde `ngAfterViewInit()` |
| `setTimeout(() => map.invalidateSize(), 300)` | Corrige el tamaño del canvas tras la animación de Ionic |

### Estado de implementación

| Función | Estado |
|---|---|
| Mapa interactivo con OpenStreetMap | Comprobado |
| 5 puntos de referencia del campus | Comprobado |
| Posición semilla del campus UAPA | Comprobado |
| Geolocalización GPS real del usuario | Dependiente del dispositivo |
| Actualización reactiva del marcador | Comprobado |
| Fallback cuando GPS no está disponible | Comprobado |

### Probar manualmente

1. Ir a `/tabs/map`.
2. El mapa debe aparecer centrado en el campus UAPA SDO.
3. Pulsar "Actualizar posición"; si el navegador tiene permiso de GPS, el marcador azul se mueve.
4. Pulsar "Centrar campus" para volver a la entrada principal.
5. Seleccionar un punto de referencia de la lista.

### Limitaciones

- La geolocalización requiere permiso del navegador o del sistema Android.
- En entornos sin HTTPS, algunos navegadores bloquean `navigator.geolocation`.
- En Android, el WebView gestiona el permiso de ubicación en tiempo de ejecución; su comportamiento varía por dispositivo.

---

## Módulo 5 — Multimedia, Cámara y Perfil

**Responsable:** Emmanuel Espinal (100063182)

### Propósito

Reproduce audio WAV generado proceduralmente mediante Web Audio API, permite capturar y almacenar imágenes, y gestiona la configuración del perfil del usuario.

### Archivos principales

| Elemento | Ruta |
|---|---|
| Página | `src/app/profile/profile.page.ts` |
| Template | `src/app/profile/profile.page.html` |
| Servicio | `src/app/services/media.service.ts` |
| Servicio de almacenamiento | `src/app/services/local-store.service.ts` |
| Modelos | `src/app/models/app.models.ts` → `AudioTrack`, `CaptureItem`, `ProfileSettings` |

### Generación de audio WAV

`MediaService.buildToneUrl()` genera audio proceduralmente:

1. Crea un `AudioContext`.
2. Calcula `frameCount = sampleRate(44100) × duration(s)`.
3. Genera onda sinusoidal: `Math.sin(2π × frequency × time) × 0.25`.
4. Serializa como WAV con header RIFF.
5. Crea un `Blob URL` y lo asigna a un `HTMLAudioElement`.

No se incluyen archivos de audio en el repositorio.

### Métodos principales verificados

| Método | Descripción |
|---|---|
| `MediaService.selectTrack(track)` | Prepara el audio a partir de la frecuencia (`toneHz`) |
| `MediaService.play()` | Llama a `audioEl.play()` y activa el timer de progreso |
| `MediaService.pause()` | Llama a `audioEl.pause()` |
| `MediaService.stop()` | Llama a `audioEl.pause()` y restablece `currentTime = 0` |
| `MediaService.attachMedia(file)` | `FileReader.readAsDataURL(file)` → retorna `Promise<string>` |
| `MediaService.capturePhoto(dataUrl, title)` | Delega en `LocalStoreService.addCapture()` |
| `ProfilePage.openFilePicker()` | Activa `<input type="file" accept="image/*" capture="environment">` |
| `LocalStoreService.updateSettings(patch)` | Merge parcial de `ProfileSettings` |

### Almacenamiento

| Clave | Contenido |
|---|---|
| `ocupabus_captures` | `CaptureItem[]` — imágenes como DataURL Base64 |
| `ocupabus_settings` | `ProfileSettings` — nombre, programa, email, preferencias |

### Estado de implementación

| Función | Estado |
|---|---|
| Generación de audio WAV procedural | Comprobado |
| Reproductor con play/pause/stop/seek | Comprobado |
| Barra de progreso reactiva | Comprobado |
| Captura de imagen con `input file` | Comprobado |
| Almacenamiento de imagen como Base64 | Comprobado |
| Grilla de fotos capturadas | Comprobado |
| Perfil de usuario con persistencia | Comprobado |

### Probar manualmente

1. Ir a `/tabs/media`.
2. Seleccionar una pista de la lista; debe prepararse el audio.
3. Pulsar Play; debe reproducirse el tono.
4. Pulsar Pause y luego Play de nuevo; debe continuar desde donde estaba.
5. Pulsar "Tomar o subir foto"; seleccionar una imagen desde el equipo.
6. La imagen debe aparecer en la grilla.
7. Recargar la página; la imagen debe persistir.

### Limitaciones

- Las imágenes en Base64 son más grandes que los archivos originales, lo que limita la cantidad práctica almacenable en `localStorage`.
- La reproducción de audio WAV en el WebView de Android no ha sido verificada formalmente en esta sesión.
- `media.service.ts` no tiene archivo `.spec.ts`; sus flujos no tienen cobertura de pruebas automatizadas.

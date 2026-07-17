# Pruebas automatizadas — OcupaBus AP4

---

## 1. Estrategia de pruebas

El proyecto implementa pruebas unitarias para los servicios con la siguiente estrategia:

- Aislamiento completo: cada servicio se prueba de forma independiente con mocks de sus dependencias.
- Estado inicial verificado en cada `beforeEach`.
- Cobertura de flujos principales, casos de error y comportamiento con y sin conexión.
- Las páginas tienen únicamente smoke tests (verificación de creación del componente).
- No existen pruebas de componentes con interacción de usuario, pruebas de integración entre páginas y servicios, ni pruebas E2E.

---

## 2. Framework y configuración

| Herramienta | Versión | Rol |
|---|---|---|
| Jasmine | ~5.1.0 | Framework de pruebas (suites, specs, matchers) |
| Karma | ~6.4.0 | Ejecutor de pruebas en navegador |
| karma-chrome-launcher | ~3.2.0 | Lanza Chrome Headless para ejecutar las pruebas |
| karma-coverage | ~2.2.0 | Reporte de cobertura (configurado, no verificado en detalle) |

Configuración del ejecutor: `karma.conf.js` en la raíz del proyecto.
Configuración TypeScript para pruebas: `tsconfig.spec.json`.

---

## 3. Ejecutar las pruebas

```bash
npm test
```

Este comando ejecuta `ng test`, que lanza Karma con Chrome Headless. Los resultados se muestran en la terminal y se abre una ventana del navegador con el reporte interactivo de Jasmine.

Para ejecutar sin abrir la ventana del navegador (modo headless puro):

```bash
npm test -- --no-progress --browsers=ChromeHeadless
```

> Karma ejecuta las pruebas en modo watch por defecto. Para salir: `Ctrl+C`.

---

## 4. Distribución de pruebas

| Archivo spec | Suite | Pruebas |
|---|---|---:|
| `api.service.spec.ts` | `ApiService` | 15 |
| `local-store.service.spec.ts` | `LocalStoreService` | 17 |
| `geolocation.service.spec.ts` | `GeolocationService` | 16 |
| `connectivity-lab.service.spec.ts` | `ConnectivityLabService` | 20 |
| `offline-report.service.spec.ts` | `OfflineReportService` | 14 |
| `app.component.spec.ts` | `AppComponent` | 1 |
| `home.page.spec.ts` | `HomePage` | 1 |
| **Total** | | **84** |

> `src/app/services/media.service.ts` no tiene archivo spec asociado.

---

## 5. Qué cubre cada suite

### `ApiService` (15 pruebas)

- Instanciación del servicio.
- 3 noticias semilla al inicializar sin red.
- `setDraft()` actualiza el observable y notifica.
- `sendFeedback()` rechaza cadenas vacías o con solo espacios.
- `sendFeedback()` llama a `fetch()` con mensaje válido.
- Error de red en `sendFeedback()` manejado correctamente.
- `loadNews()` transiciona el estado durante la carga.
- `loadNews()` transforma posts en `NewsItem[]`.
- Fallback a `seedNews()` cuando `fetch()` falla.
- Estructura de `NewsItem` (campos `id`, `title`, `category`, `publishedAt`).

### `LocalStoreService` (17 pruebas)

- Instanciación y lectura de datos semilla desde `localStorage`.
- `addTask()` agrega al frente del array, asigna ID y `completed: false`, persiste.
- `toggleTask()` invierte el estado completado.
- `removeTask()` elimina solo la tarea indicada.
- `clearCompleted()` elimina únicamente las completadas.
- `reorderTasks()` reordena correctamente con `splice`.
- `addCapture()` persiste imagen Base64.
- `updateSettings()` hace merge parcial y persiste.
- `refreshSnapshot()` vuelve a leer desde `localStorage`.

### `GeolocationService` (16 pruebas)

- 5 puntos de campus con estructura completa.
- Todos los puntos dentro del bounding box de UAPA SDO (lat 18.514–18.517, lng -69.849–-69.846).
- El primer punto es `campus-entrada`.
- Posición semilla coincide con coordenadas de UAPA SDO.
- `selectPoint()` actualiza `selectedPoint$` y `status$`.
- `focusCampus()` selecciona el primer punto.
- `refreshPosition()` usa posición semilla cuando GPS no está disponible.
- `refreshPosition()` actualiza `position$` cuando GPS resuelve correctamente.
- Manejo de rechazo del permiso GPS.

### `ConnectivityLabService` (20 pruebas)

- Dispositivos Bluetooth y NFC semilla con estructura válida (`DemoDevice`).
- Logs semilla iniciales.
- `discoverBluetooth()` completa sin lanzar errores cuando BT no está disponible.
- `pairBluetooth()` marca el dispositivo como `Emparejado` y registra en logs.
- `readNfc()` actualiza `nfcMessage$` y registra en logs.
- `writeNfc()` actualiza `nfcMessage$` con el prefijo correcto.
- `clearLogs()` vacía la lista y notifica el observable.
- El log se limita a 16 entradas (las más recientes se conservan).

### `OfflineReportService` (14 pruebas)

- Listas vacías en inicio con `localStorage` limpio.
- Con conexión activa: el reporte va a `sentReports`, `pendingReports` queda vacío, mensaje correcto.
- Sin conexión: el reporte va a `pendingReports`, se persiste en `localStorage`, mensaje correcto, nada en `sentReports`.
- `sincronizarPendientes()` sin pendientes: mensaje de "no había reportes".
- Con pendientes: mueve todos a enviados, `pendingReports` queda vacío, mensaje con conteo correcto.
- El reporte preserva `ocupacion`, `lat` y `lng` originales tras la sincronización.

---

## 6. Pruebas manuales por módulo

### Home

| Escenario | Pasos | Resultado esperado |
|---|---|---|
| Carga de noticias | Abrir `/tabs/home` con red activa | Noticias de JSONPlaceholder |
| Fallback sin red | Desconectar red y recargar | 3 noticias semilla |
| Envío de feedback | Escribir mensaje y pulsar Enviar | Mensaje de confirmación |
| Feedback vacío | Pulsar Enviar sin texto | Mensaje de error |

### Tareas

| Escenario | Pasos | Resultado esperado |
|---|---|---|
| Crear tarea | Completar formulario y pulsar Agregar | Tarea aparece al inicio de la lista |
| Persistencia | Recargar la página | Las tareas siguen presentes |
| Eliminar por swipe | Deslizar tarea a la izquierda | Botón eliminar visible; tarea removida |
| Reordenar | Arrastrar ícono de reorden | El orden cambia y persiste |

### Conectividad

| Escenario | Pasos | Resultado esperado |
|---|---|---|
| Banner de estado | Desconectar / reconectar red | Banner cambia entre online y offline |
| Reporte offline | Sin red, registrar reporte | Aparece en "Pendientes" |
| Sincronización | Reconectar red | Los pendientes pasan a "Enviados" |
| Bluetooth (Chrome) | Pulsar escanear con BT habilitado | Diálogo de selección de dispositivo |

### Mapa

| Escenario | Pasos | Resultado esperado |
|---|---|---|
| Carga del mapa | Ir a `/tabs/map` | Mapa de OpenStreetMap visible |
| Puntos de referencia | Ver mapa | 5 marcadores teal del campus |
| GPS | Dar permiso y pulsar Actualizar | Marcador azul en posición real |
| Centrar | Pulsar "Centrar campus" | Mapa centra en entrada UAPA |

### Media

| Escenario | Pasos | Resultado esperado |
|---|---|---|
| Reproducir audio | Seleccionar pista → Play | Tono reproducido |
| Capturar imagen | Pulsar "Tomar o subir foto" | Imagen aparece en grilla |
| Persistencia de imágenes | Recargar página | Las imágenes permanecen |

---

## 7. Pruebas en modo avión (Offline First)

1. Ejecutar la app en navegador o emulador.
2. Ir a `/tabs/connectivity`.
3. Desconectar la red del sistema (o activar modo avión en Android).
4. Registrar un reporte de ocupación.
5. Verificar que el reporte aparece en la tabla de pendientes.
6. Reconectar la red.
7. Verificar que el reporte pasa automáticamente a la tabla de enviados.

---

## 8. Limitaciones de las pruebas

- `MediaService` no tiene archivo `.spec.ts`; sus flujos no tienen cobertura automatizada.
- Las pruebas de páginas son únicamente smoke tests (verifican que el componente se crea).
- No existen pruebas E2E (Cypress, Playwright) ni pruebas de integración entre página y servicio real.
- Web Bluetooth y NFC no pueden probarse de forma automatizada en Chrome Headless.
- La reproducción de audio y la captura de imagen tampoco tienen cobertura automatizada.
- La cobertura de código (`karma-coverage`) está configurada pero no se validó el umbral mínimo en esta sesión.

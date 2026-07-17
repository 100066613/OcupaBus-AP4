# OcupaBus

## Documento técnico del proyecto final

### 1. Presentación del equipo

El proyecto se desarrolló en equipo para cubrir los temas vistos en la asignatura y distribuir responsabilidades por módulo.

| Integrante | Matrícula | Rol | Responsabilidad |
| --- | ---: | --- | --- |
| Franklin Alberto Beltré Fernández | 100066613 | Líder técnico | Coordinación general, revisión de avances y estructura del repositorio. |
| Smailyn Ceballo Viva | 100064094 | Diseñador de interfaz | Diseño visual, jerarquía de pantallas y consistencia de estilo. |
| Angeleen Antonio Bello Hernández | 100065707 | Programador funcional | Módulo de conectividad, almacenamiento offline y lógica de interacción. |
| Francisco Ferreira | 100052613 | Documentador / tester | Pruebas, capturas y redacción de la documentación técnica. |
| Emmanuel Espinal | 100063182 | Investigador de datos / community manager | Apoyo en el módulo de contenido, datos de demostración y validación de flujo. |

### 2. Introducción y objetivos

#### 2.1 Planteamiento del problema

Los estudiantes necesitan una aplicación móvil que sirva como demostración integral de los temas del curso y que, al mismo tiempo, permita organizar tareas, ver noticias, revisar conectividad, usar geolocalización, probar multimedia y capturar evidencia desde el móvil.

#### 2.2 Objetivo general

Desarrollar una aplicación móvil en Ionic, Angular y Capacitor que integre las 10 unidades del curso en una experiencia funcional para navegador y dispositivo móvil.

#### 2.3 Objetivos específicos

- Implementar navegación por pestañas con carga diferida de pantallas.
- Desarrollar un módulo de tareas con persistencia local y gestos de interfaz.
- Integrar detección de red, almacenamiento offline y sincronización de reportes.
- Incorporar geolocalización con una vista de mapa de referencia.
- Implementar multimedia, captura de imagen y perfil local.
- Consumir un servicio web para mostrar contenido y enviar retroalimentación.

#### 2.4 Alcance

Incluye:

- navegación principal por tabs;
- CRUD local de tareas;
- conectividad online/offline;
- demo de Bluetooth y NFC;
- geolocalización;
- reproductor de audio;
- captura de foto o imagen;
- almacenamiento local;
- consumo de API REST.

No incluye:

- autenticación real contra un servidor;
- base de datos en la nube;
- mapas con proveedor externo en tiempo real;
- escaneo BLE o NFC de producción.

#### 2.5 Público objetivo

Estudiantes de la asignatura ISW-307 y docentes que evalúan el proyecto práctico final.

### 3. Modelo de negocio Canvas

| Bloque | Descripción |
| --- | --- |
| Segmento de clientes | Estudiantes y docentes del curso ISW-307. |
| Propuesta de valor | Reúne en una sola app los temas obligatorios del curso con una interfaz clara para defender por módulos. |
| Canales | Navegador web, Android y distribución del repositorio GitHub. |
| Relación con el cliente | Uso directo por el estudiante, demostración en defensa y retroalimentación visual inmediata. |
| Fuentes de ingreso | Proyecto académico sin monetización. |
| Recursos clave | Equipo de desarrollo, Angular, Ionic, Capacitor, navegador y dispositivo Android. |
| Actividades clave | Diseño, desarrollo, pruebas, documentación y presentación. |
| Socios clave | UAPA, documentación oficial de Ionic, Angular, Capacitor y APIs del navegador. |
| Estructura de costos | Tiempo de desarrollo, pruebas en dispositivo, documentación e instalación de dependencias. |

### 4. Arquitectura técnica

#### 4.1 Stack tecnológico

- Ionic 8
- Angular 20
- Capacitor 8
- TypeScript 5
- RxJS
- APIs del navegador: `fetch`, `localStorage`, `navigator.geolocation`, `Audio`, carga de archivos

#### 4.2 Estructura del proyecto

- `src/app/app.routes.ts`: define la navegación principal.
- `src/app/tabs/`: contenedor de pestañas.
- `src/app/home/`: tablero de inicio y consumo de servicios web.
- `src/app/transfers/`: tareas y almacenamiento local.
- `src/app/devices/`: conectividad, reportes offline y demo BLE/NFC.
- `src/app/history/`: geolocalización y mapa visual.
- `src/app/profile/`: multimedia, captura de imagen y perfil.
- `src/app/services/`: lógica compartida.
- `src/app/models/`: modelos de datos.

#### 4.3 Flujo de datos

La navegación carga cada módulo bajo demanda. Los servicios exponen `BehaviorSubject` para que la interfaz reaccione en tiempo real. Las tareas, capturas y ajustes se guardan en `localStorage`. Las noticias se cargan mediante `fetch`. La red se consulta con `@capacitor/network`. La geolocalización usa `navigator.geolocation` cuando está disponible.

#### 4.4 Diagrama de arquitectura

```text
Vista Ionic
  -> Componente de pantalla
  -> Servicio compartido
  -> API del navegador / localStorage / fetch
```

### 5. Diseño de interfaces

#### 5.1 Paleta de colores

- Primario: `#14532d`
- Secundario: `#0f766e`
- Acento: `#1d4ed8`
- Fondo: `#f4fbf6`
- Texto: `#0f172a`

#### 5.2 Estilo visual

- Bordes redondeados grandes.
- Tarjetas con sombras suaves.
- Encabezados con gradientes verdes y azules.
- Tipografía sans serif limpia y legible.

#### 5.3 Componentes reutilizables

- `ion-card`
- `ion-button`
- `ion-list`
- `ion-badge`
- `ion-chip`
- `ion-refresher`

#### 5.4 Mapa de navegación

```text
Inicio -> Tareas
Inicio -> Conectividad
Inicio -> Mapa
Inicio -> Media
Tareas -> Inicio
Conectividad -> Mapa
Conectividad -> Media
```

### 6. Desarrollo por módulos

#### 6.1 Módulo de inicio y servicios web

**Responsable:** Franklin Alberto Beltré Fernández

**Problema:** Mostrar una entrada general del proyecto con contenido útil y un enlace directo a la defensa.

**Solución:** Se implementó un tablero con noticias, resumen de tareas, capturas y perfil activo. El servicio `ApiService` consulta una API REST pública con `fetch` y también permite enviar feedback por `POST`.

**Código relevante:**

```ts
await this.api.loadNews();
await this.api.sendFeedback(this.feedback);
```

**Capturas sugeridas:** pantalla inicial, lista de noticias, formulario de feedback.

**Decisiones técnicas:** se usó `fetch` por simplicidad y por compatibilidad con navegador.

**Problemas y soluciones:** la carga de red puede fallar sin internet; por eso se muestran noticias de respaldo.

#### 6.2 Módulo de tareas y almacenamiento

**Responsable:** Smailyn Ceballo Viva

**Problema:** El estudiante necesita registrar pendientes de forma rápida y reorganizarlos sin salir de la app.

**Solución:** Se desarrolló CRUD local con `LocalStoreService`, usando `localStorage` para persistencia. La pantalla incorpora `ion-item-sliding`, `ion-reorder-group`, `ion-checkbox` y refresco manual.

**Código relevante:**

```ts
this.store.addTask({ title, notes, priority });
this.store.toggleTask(task.id);
this.store.reorderTasks(detail.from, detail.to);
```

**Capturas sugeridas:** formulario de nueva tarea, swipe para eliminar, lista reordenada.

**Decisiones técnicas:** `localStorage` es suficiente para la entrega y evita dependencias adicionales.

**Problemas y soluciones:** el reordenamiento requiere actualizar el arreglo y persistirlo en el mismo paso.

#### 6.3 Módulo de conectividad y reportes offline

**Responsable:** Angeleen Antonio Bello Hernández

**Problema:** La app debe seguir funcionando cuando se pierde internet y mostrar claramente el estado de red.

**Solución:** `NetworkService` detecta si la conexión está activa. `OfflineReportService` guarda reportes en local y los sincroniza al volver la red. `ConnectivityLabService` agrega demo de Bluetooth y NFC para la defensa.

**Código relevante:**

```ts
const status = await this.networkService.getCurrentStatus();
if (status.connected) {
  await this.enviarReporte(reporte);
}
```

**Capturas sugeridas:** banner online, banner offline, reportes pendientes, historial de conectividad.

**Decisiones técnicas:** se separó la lógica de red de la lógica de reportes para mantener el código limpio.

**Problemas y soluciones:** el navegador no siempre expone BLE o NFC reales; por eso se usa una simulación presentable para la defensa.

#### 6.4 Módulo de geolocalización y mapa

**Responsable:** Francisco Ferreira

**Problema:** Ubicar la posición del usuario y ofrecer una referencia visual del campus.

**Solución:** `GeolocationService` consulta la ubicación del navegador y expone puntos del campus en una vista de mapa visual construida con HTML y CSS.

**Código relevante:**

```ts
navigator.geolocation.getCurrentPosition(...)
```

**Capturas sugeridas:** mapa, marcador seleccionado, posición actual.

**Decisiones técnicas:** se priorizó una solución ejecutable en navegador sin depender de una librería externa pesada.

**Problemas y soluciones:** si el GPS no está disponible, se usa una posición de referencia para no romper la demo.

#### 6.5 Módulo multimedia, cámara y perfil

**Responsable:** Emmanuel Espinal

**Problema:** Mostrar reproducción de audio, captura de foto y gestión básica de perfil.

**Solución:** `MediaService` administra tracks de audio, crea audio de demostración, procesa imágenes seleccionadas y guarda capturas en el almacenamiento local. El perfil usa `LocalStoreService` para persistencia.

**Código relevante:**

```ts
this.media.play();
this.media.capturePhoto(dataUrl, this.photoTitle);
this.store.updateSettings({ name: this.qrCode });
```

**Capturas sugeridas:** lista de audios, reproducción activa, captura agregada, perfil editable.

**Decisiones técnicas:** se usó la API nativa del navegador para mantener la app liviana y portable.

**Problemas y soluciones:** en navegador la cámara real puede no estar disponible; se admite carga de archivo como alternativa.

### 7. Pruebas y despliegue

#### 7.1 Tabla de pruebas

| Prueba | Resultado |
| --- | --- |
| Navegación por tabs | Correcto |
| Carga de noticias | Correcto |
| Envío de feedback | Correcto |
| Crear tarea | Correcto |
| Eliminar tarea con swipe | Correcto |
| Reordenar tareas | Correcto |
| Detección de red | Correcto |
| Guardado offline | Correcto |
| Sincronización al volver la red | Correcto |
| Selección de punto en mapa | Correcto |
| Reproducción de audio | Correcto |
| Captura de imagen por archivo | Correcto |

#### 7.2 Instrucciones de instalación

```bash
npm install
npm start
```

Para compilar:

```bash
npm run build
```

#### 7.3 Evidencias

- Navegador con conexión.
- Navegador sin conexión.
- Emulador Android.
- Captura de tareas.
- Captura de mapa.
- Captura de multimedia.

### 8. Conclusiones

El proyecto permite demostrar de forma integrada las unidades principales de la asignatura. Se logró una app funcional, navegable y presentable para defensa individual por módulo. La principal dificultad estuvo en unificar varios temas en una sola interfaz coherente sin perder claridad. Como mejora futura, se puede reemplazar la demo de Bluetooth y NFC por integración nativa real y conectar el módulo de noticias a una API propia.

### 9. Referencias APA

- Angular. (2026). Angular documentation. https://angular.dev
- Ionic Framework. (2026). Ionic documentation. https://ionicframework.com/docs
- Capacitor. (2026). Capacitor documentation. https://capacitorjs.com/docs
- MDN Web Docs. (2026). Fetch API. https://developer.mozilla.org/docs/Web/API/Fetch_API
- MDN Web Docs. (2026). Window.localStorage. https://developer.mozilla.org/docs/Web/API/Window/localStorage
- MDN Web Docs. (2026). Geolocation API. https://developer.mozilla.org/docs/Web/API/Geolocation_API
- MDN Web Docs. (2026). Web Audio API. https://developer.mozilla.org/docs/Web/API/Web_Audio_API
- JSONPlaceholder. (2026). JSONPlaceholder. https://jsonplaceholder.typicode.com
- RxJS. (2026). RxJS documentation. https://rxjs.dev
- TypeScript. (2026). TypeScript handbook. https://www.typescriptlang.org/docs/

### 10. Anexos

#### Anexo A. Estructura del repositorio

- `src/app/home/`
- `src/app/transfers/`
- `src/app/devices/`
- `src/app/history/`
- `src/app/profile/`
- `src/app/services/`
- `src/app/models/`

#### Anexo B. Capturas de pantalla

- `documentacion/01_navegador_conectado.png`
- `documentacion/02_navegador_offline.png`
- `documentacion/03_emulador_conectado.png`
- `documentacion/04_emulador_conectado_reporte_enviado.png`
- `documentacion/05_emulador_offline.png`
- `documentacion/06_emulador_offline_reporte_pendiente.png`

#### Anexo C. Flujo general

Ver `documentacion/diagrama_flujo.txt`.

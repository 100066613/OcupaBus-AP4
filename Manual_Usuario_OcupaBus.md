# Manual de Usuario — OcupaBus

**Versión 1.0 · Julio 2026**

---

## Tabla de contenido

1. [Presentación de la aplicación](#1-presentación-de-la-aplicación)
2. [Requisitos mínimos del sistema](#2-requisitos-mínimos-del-sistema)
3. [Instalación de la aplicación](#3-instalación-de-la-aplicación)
4. [Ejecución del proyecto](#4-ejecución-del-proyecto)
5. [Descripción de la interfaz principal](#5-descripción-de-la-interfaz-principal)
6. [Navegación entre los módulos](#6-navegación-entre-los-módulos)
7. [Gestión de tareas](#7-gestión-de-tareas)
8. [Modo Offline First y sincronización automática](#8-modo-offline-first-y-sincronización-automática)
9. [Consulta del mapa y geolocalización](#9-consulta-del-mapa-y-geolocalización)
10. [Reproducción de audio](#10-reproducción-de-audio)
11. [Captura y gestión de imágenes](#11-captura-y-gestión-de-imágenes)
12. [Configuración y administración del perfil](#12-configuración-y-administración-del-perfil)
13. [Solución de problemas frecuentes](#13-solución-de-problemas-frecuentes)
14. [Recomendaciones de uso](#14-recomendaciones-de-uso)
15. [Créditos del proyecto](#15-créditos-del-proyecto)

---

## 1. Presentación de la aplicación

OcupaBus es una aplicación móvil que permite a los usuarios reportar el nivel de ocupación de los autobuses del campus universitario y consultar el estado del servicio en tiempo real. Desde la misma pantalla es posible gestionar tareas personales, ver puntos de referencia en el mapa, reproducir audio y capturar imágenes.

La aplicación funciona tanto con conexión a internet como sin ella. Cuando no hay red disponible, los reportes se guardan localmente y se envían de forma automática al reconectarse.

**Características principales:**

- Reporte de ocupación con tres niveles: Vacío, Medio y Lleno.
- Lista de tareas con prioridades y reordenamiento táctil.
- Mapa interactivo con puntos del campus y localización GPS.
- Reproductor de audio con tres pistas integradas.
- Captura y almacenamiento de fotografías.
- Perfil de usuario configurable.
- Soporte completo para uso sin conexión (Offline First).

---

## 2. Requisitos mínimos del sistema

### Para ejecutar en navegador

| Requisito | Valor mínimo |
|-----------|-------------|
| Navegador | Google Chrome 112 o superior |
| Sistema operativo | Windows 10, macOS 12, Linux (Ubuntu 20.04+) |
| RAM | 2 GB disponibles |
| Conexión a internet | Opcional (requerida solo para carga de noticias y envío de reportes) |

> El reproductor de audio y la captura de imágenes requieren Chrome o Edge. En Firefox algunas funciones pueden no estar disponibles.

### Para ejecutar en Android

| Requisito | Valor mínimo |
|-----------|-------------|
| Versión de Android | 7.0 (API 24) |
| RAM | 2 GB |
| Almacenamiento | 50 MB libres |
| Conexión | Opcional |

---

## 3. Instalación de la aplicación

### Opción A — Instalar el APK en Android

1. Descargue el archivo `OcupaBus-AP4-debug.apk` desde el enlace de distribución o compílelo siguiendo la sección 4.
2. En el dispositivo Android, vaya a **Ajustes → Seguridad** y active **Fuentes desconocidas** (o **Instalar aplicaciones desconocidas** en Android 8+).
3. Abra el archivo APK desde el administrador de archivos o desde la notificación de descarga.
4. Toque **Instalar** y espere a que finalice el proceso.
5. Toque **Abrir** para iniciar la aplicación.

### Opción B — Ejecutar en navegador (modo desarrollo)

Requiere Node.js 18 o superior y npm instalados en el equipo.

```bash
git clone https://github.com/100066613/OcupaBus-AP4.git
cd OcupaBus-AP4
npm install
npm start
```

Abra `http://localhost:8100` en Google Chrome.

---

## 4. Ejecución del proyecto

### Modo desarrollo (navegador)

```bash
npm start
```

La aplicación se abre automáticamente en `http://localhost:8100`. Cualquier cambio en el código se refleja en tiempo real sin necesidad de recargar manualmente.

### Generar APK para Android

```bash
# Paso 1 — Compilar la aplicación web
npm run build

# Paso 2 — Sincronizar con Android
npm run android:sync

# Paso 3 — Compilar el APK
cd android
./gradlew assembleDebug
```

El APK se genera en:
```
android/app/build/outputs/apk/debug/OcupaBus-AP4-debug.apk
```

### Instalar el APK en un dispositivo conectado

```bash
adb install android/app/build/outputs/apk/debug/OcupaBus-AP4-debug.apk
```

Para reinstalar sobre una versión anterior:

```bash
adb install -r android/app/build/outputs/apk/debug/OcupaBus-AP4-debug.apk
```

---

## 5. Descripción de la interfaz principal

Al abrir OcupaBus, la pantalla inicial es el módulo **Home**. Desde aquí puede ver un resumen del estado de la aplicación y acceder a las noticias del servicio.

### Elementos de la pantalla Home

**Encabezado (barra superior)**
- Muestra el nombre de la aplicación: *OcupaBus*.
- Icono de refresco: deslice hacia abajo para actualizar las noticias.

**Sección de estado**
- Chip verde con el texto *Dashboard*: indica que la app está activa.
- Chip que muestra el estado de carga de noticias: *Cargando...* mientras se obtienen datos, o *Listo* cuando terminan de cargar.

**Banner de conectividad**
- Aparece en color rojo con el texto *Sin conexión* cuando no hay acceso a internet.
- Desaparece automáticamente al recuperar la conexión.

**Tarjetas de resumen**
- *Tareas guardadas*: muestra cuántas tareas tiene en la lista.
- *Capturas y fotos*: muestra cuántas imágenes ha guardado.
- *Perfil activo*: muestra el nombre configurado en su perfil.

**Sección de noticias**
- Lista de noticias del servicio de transporte cargadas desde internet.
- Cuando no hay conexión, se muestran tres noticias de ejemplo almacenadas localmente.
- Cada noticia muestra título, resumen, fuente y fecha de publicación.

**Formulario de feedback**
- Campo de texto para escribir un comentario o sugerencia.
- Botón *Enviar mensaje* que envía el texto al servicio web.
- Si el campo está vacío, aparece un mensaje de error en lugar de enviar.

---

## 6. Navegación entre los módulos

La navegación principal está en la barra de pestañas en la parte inferior de la pantalla. Hay cinco módulos disponibles:

| Icono | Nombre | Función |
|-------|--------|---------|
| Casa | Home | Noticias, resumen y feedback |
| Lista | Tareas | Gestión de tareas personales |
| Wifi | Conectividad | Reportes de ocupación y estado de red |
| Mapa | Mapa | Ubicación GPS y puntos del campus |
| Persona | Media y perfil | Audio, fotos y datos del perfil |

Toque cualquier icono para cambiar de módulo. La aplicación recuerda el estado de cada pantalla mientras permanece abierta.

---

## 7. Gestión de tareas

El módulo **Tareas** (segundo icono de la barra) permite crear, organizar y eliminar tareas personales. Todas las tareas se guardan en el dispositivo y permanecen disponibles aunque cierre y vuelva a abrir la aplicación.

### Crear una tarea

1. En la parte superior de la pantalla encontrará el formulario de nueva tarea.
2. Complete los campos:
   - **Título**: nombre de la tarea (campo obligatorio).
   - **Notas**: descripción o detalle adicional (opcional).
   - **Prioridad**: seleccione entre *Baja*, *Media* o *Alta* usando los chips de color.
3. Toque el botón **Agregar tarea**.
4. La tarea aparecerá al inicio de la lista, marcada con el color de su prioridad.

### Marcar una tarea como completada

- Toque el círculo o la casilla de verificación a la izquierda del nombre de la tarea.
- Las tareas completadas aparecen con una línea tachada sobre el texto.
- Tóquelas de nuevo para desmarcarlas.

### Reordenar tareas

- Mantenga presionado el icono de las tres líneas (≡) que aparece a la derecha de cada tarea.
- Sin soltar, arrastre la tarea hacia arriba o hacia abajo.
- Suelte cuando la tarea esté en la posición deseada.
- El nuevo orden se guarda automáticamente.

### Eliminar una tarea

- Deslice la tarea hacia la izquierda.
- Aparecerá un botón rojo con el icono de papelera.
- Toque el botón para confirmar la eliminación.

### Eliminar tareas completadas

- Desplácese hasta el final de la lista.
- Toque el botón **Limpiar completadas**.
- Se eliminarán todas las tareas marcadas como completadas. Las pendientes permanecen.

---

## 8. Modo Offline First y sincronización automática

El módulo **Conectividad** (tercer icono) permite registrar el nivel de ocupación del autobús y ver el estado de la red. OcupaBus está diseñada para funcionar sin internet: los reportes se almacenan en el dispositivo y se envían automáticamente cuando se recupera la conexión.

### Registrar un reporte de ocupación

1. Vaya al módulo *Conectividad*.
2. En la sección de reporte verá tres botones:
   - **Vacío** — el autobús tiene asientos libres.
   - **Medio** — hay ocupación parcial.
   - **Lleno** — el autobús está a capacidad.
3. Toque el botón que corresponde al estado actual del autobús.
4. La aplicación registra su ubicación GPS en ese momento junto con el nivel de ocupación.

### Con conexión activa

- El reporte se envía de inmediato al servidor.
- Aparece en la tabla **Reportes enviados** con la hora y coordenadas.
- El mensaje de confirmación indica que el envío fue exitoso.

### Sin conexión (modo offline)

- El reporte se guarda localmente en la cola de **Pendientes**.
- Aparece en la tabla **Reportes pendientes** con su nivel de ocupación y coordenadas.
- El banner rojo en la parte superior confirma que no hay conexión.

### Sincronización automática

- Cuando recupera la conexión a internet, la aplicación detecta el cambio automáticamente.
- Todos los reportes pendientes se envían en ese momento.
- La tabla *Pendientes* se vacía y los reportes pasan a *Enviados*.
- No es necesario hacer nada: el proceso ocurre en segundo plano.

### Sección de dispositivos (Bluetooth y NFC)

La pantalla de conectividad también incluye controles para dispositivos inalámbricos:

- **Buscar BLE**: inicia la búsqueda de dispositivos Bluetooth cercanos. Solo funciona en Chrome/Edge con Bluetooth habilitado en el dispositivo.
- **Leer NFC**: simula la lectura de una etiqueta NFC (funcionalidad de demostración).
- **Escribir NFC**: simula la escritura en una etiqueta NFC con el texto ingresado en el campo.

El registro de actividad al final de la pantalla muestra un historial de las últimas 16 acciones realizadas. Toque **Limpiar registro** para borrarlo.

---

## 9. Consulta del mapa y geolocalización

El módulo **Mapa** (cuarto icono) muestra un mapa interactivo con la ubicación actual y los puntos de referencia del campus universitario.

### Ver el mapa

- Al entrar al módulo, el mapa se carga centrado en el campus de UAPA (Santiago de los Caballeros, República Dominicana).
- Se muestran cinco marcadores de color teal con los puntos de referencia del campus.
- Puede pellizcar para hacer zoom y arrastrar para mover el mapa.

### Puntos de referencia del campus

Los cinco puntos marcados en el mapa son:

1. Entrada principal del campus
2. Biblioteca
3. Cancha deportiva
4. Edificio de aulas
5. Área de estacionamiento

Al tocar un marcador, la tarjeta de información al pie de la pantalla muestra el nombre del punto y su descripción.

### Obtener su ubicación actual

1. Toque el botón flotante con el icono de localización (esquina inferior derecha).
2. Si es la primera vez, el navegador o Android solicitará permiso para acceder a la ubicación. Toque **Permitir**.
3. Aparecerá un marcador azul en el mapa indicando su posición actual.
4. La tarjeta de estado GPS muestra las coordenadas de latitud y longitud.

> Si el GPS no está disponible o tarda más de 8 segundos, la aplicación usa como posición de respaldo las coordenadas del campus de UAPA.

### Centrar el mapa en el campus

- Toque el botón **Centrar campus** en la parte inferior de la pantalla.
- El mapa se desplaza automáticamente al punto de entrada principal del campus.
- El punto queda seleccionado y su información aparece en la tarjeta inferior.

### Seleccionar un punto de referencia

- Desplácese hacia abajo hasta la sección **Puntos de referencia**.
- Toque cualquier punto de la lista para seleccionarlo.
- El mapa se centra en ese punto y el marcador queda destacado.

---

## 10. Reproducción de audio

El módulo **Media y perfil** (quinto icono) incluye un reproductor de audio con tres pistas integradas. El audio se genera directamente en el dispositivo mediante síntesis de tonos, por lo que no requiere descargar archivos.

### Pistas disponibles

| Pista | Duración | Descripción |
|-------|----------|-------------|
| Bienvenida a OcupaBus | 01:40 | Introducción al sistema de reporte de ocupación |
| Conectividad y offline | 01:55 | Cómo funciona el modo sin conexión y la sincronización |
| Guia de uso rapido | 02:05 | Pasos para registrar un reporte y consultar el mapa |

### Seleccionar y reproducir una pista

1. En la sección **Reproductor de audio**, verá la lista de las tres pistas disponibles.
2. Toque el nombre de una pista para seleccionarla. El nombre aparecerá resaltado en la barra del reproductor.
3. Toque el botón **Play** para iniciar la reproducción.
4. El estado del reproductor cambia a *playing* mientras el audio está activo.

### Controles del reproductor

| Botón | Función |
|-------|---------|
| Play | Inicia o reanuda la reproducción |
| Pausa | Pausa el audio sin perder la posición |
| Stop | Detiene el audio y regresa al inicio de la pista |

### Barra de progreso

- La barra deslizante debajo de los controles muestra el avance de la reproducción.
- Puede tocar o arrastrar el control de la barra para saltar a cualquier momento de la pista.
- La escala va de 0 a 12 segundos (el reproductor genera tonos de demostración de duración corta).

---

## 11. Captura y gestión de imágenes

En el mismo módulo **Media y perfil** encontrará las herramientas para capturar y almacenar imágenes desde la cámara o la galería del dispositivo.

### Capturar o subir una imagen

1. Escriba un título descriptivo en el campo **Titulo de la captura**.
2. Toque el botón **Tomar o subir foto** (icono de cámara).
3. Se abrirá el selector de archivos del dispositivo:
   - En Android: puede elegir entre la cámara o la galería.
   - En navegador de escritorio: se abre el explorador de archivos.
4. Seleccione o tome la foto.
5. La imagen aparece en la cuadrícula de **Fotos guardadas** con su título y fecha de captura.

### Ver las imágenes guardadas

- La sección **Fotos guardadas** muestra todas las imágenes en una cuadrícula.
- Cada imagen tiene el título y la fecha en que fue capturada.
- Las imágenes se guardan en el dispositivo y permanecen disponibles al cerrar y volver a abrir la aplicación.

> Las imágenes se almacenan como datos en formato Base64 dentro del almacenamiento local del dispositivo. No se envían a ningún servidor externo.

---

## 12. Configuración y administración del perfil

La sección **Perfil activo** en el módulo *Media y perfil* muestra los datos del usuario y permite configurar preferencias básicas de la aplicación.

### Ver los datos del perfil

En la tarjeta superior del módulo encontrará:

- **Nombre**: nombre del usuario configurado.
- **Programa**: carrera o programa académico.
- **Correo electrónico**: dirección de contacto.
- **Notificaciones**: badge que indica si las notificaciones están activas o apagadas.
- **Modo offline**: badge que indica si el modo sin conexión está listo.

### Registro rápido de datos

La sección **Registro rapido** al final del módulo permite guardar un código o nombre asociado al perfil:

1. Escriba un código o nombre en el campo **Codigo o nombre**.
2. Toque el botón **Guardar dato del perfil** (icono de QR).
3. El dato queda guardado en el perfil del usuario.

Este campo es útil para asociar un identificador de usuario, número de carné o cualquier dato de referencia rápida al perfil activo.

---

## 13. Solución de problemas frecuentes

### Las noticias no cargan

**Causa**: no hay conexión a internet o el servicio externo no está disponible.

**Solución**: verifique su conexión. Si hay conexión pero las noticias siguen sin aparecer, deslice hacia abajo para refrescar la pantalla. Si el problema persiste, se mostrarán automáticamente tres noticias de ejemplo almacenadas localmente.

---

### El mapa no aparece o se ve en blanco

**Causa**: sin conexión a internet los tiles del mapa no pueden descargarse.

**Solución**: conecte el dispositivo a internet y vuelva a entrar al módulo de mapa. Los puntos de referencia del campus están disponibles sin conexión, pero la imagen del mapa requiere internet.

---

### No se puede obtener la ubicación GPS

**Causa 1**: no se otorgó permiso de ubicación.
**Solución**: vaya a los ajustes del navegador o del sistema y habilite el permiso de ubicación para la aplicación.

**Causa 2**: el GPS tarda en obtener señal.
**Solución**: espere unos segundos y toque de nuevo el botón de localización. Si sigue sin funcionar, la aplicación usará las coordenadas del campus como posición de respaldo.

---

### El audio no se reproduce

**Causa 1**: el navegador bloqueó la reproducción automática.
**Solución**: asegúrese de tocar **Play** después de seleccionar una pista. Los navegadores modernos requieren una interacción del usuario antes de reproducir audio.

**Causa 2**: navegador incompatible.
**Solución**: use Google Chrome 112 o superior. Firefox no soporta completamente la Web Audio API usada por la aplicación.

---

### Bluetooth no funciona al tocar "Buscar BLE"

**Causa 1**: el navegador no soporta Web Bluetooth.
**Solución**: use Google Chrome o Microsoft Edge. Firefox y Safari no implementan la Web Bluetooth API.

**Causa 2**: Bluetooth desactivado en el dispositivo.
**Solución**: active el Bluetooth en los ajustes del sistema antes de usar esta función.

**Causa 3**: contexto inseguro (HTTP en lugar de HTTPS).
**Solución**: en producción la aplicación debe servirse por HTTPS. En desarrollo local (`localhost`) la restricción no aplica.

---

### Los reportes no se sincronizan al reconectarse

**Solución**: revise que el banner de conexión haya desaparecido (esto confirma que la app detectó la reconexión). Si los reportes siguen pendientes, salga y vuelva a entrar al módulo de conectividad. La sincronización ocurre automáticamente al detectar el cambio de estado de red.

---

### La aplicación no recuerda mis datos después de cerrarla

**Causa**: el almacenamiento local del navegador fue borrado (al limpiar caché o datos del sitio).

**Solución**: no borre los datos del sitio en el navegador si desea conservar sus tareas, imágenes y perfil. En Android, no desinstale la aplicación sin hacer respaldo de sus datos primero.

---

### La cámara no abre al tocar "Tomar o subir foto"

**Causa**: el navegador no tiene permiso para acceder a la cámara o al sistema de archivos.

**Solución**: permita el acceso a la cámara cuando el navegador lo solicite. En Android, verifique los permisos de la aplicación en *Ajustes → Aplicaciones → OcupaBus → Permisos*.

---

## 14. Recomendaciones de uso

- **Use Chrome o Edge** para la mejor experiencia en navegador. Algunas funciones como Bluetooth y el reproductor de audio tienen mejor soporte en estos navegadores.

- **Conceda los permisos necesarios** la primera vez que los solicite la aplicación (ubicación, cámara). Sin ellos, las funciones correspondientes no estarán disponibles.

- **No borre los datos del sitio** en el navegador si quiere conservar sus tareas, imágenes y configuración de perfil. Toda la información se almacena localmente.

- **Para pruebas offline**, desactive el Wi-Fi o los datos móviles del dispositivo, registre un reporte, y luego vuelva a conectarse para ver cómo se sincroniza automáticamente.

- **En Android**, habilite la depuración USB solo si necesita instalar el APK desde el computador. No es necesario para el uso normal de la aplicación.

- **Actualice con deslizamiento hacia abajo** en la pantalla Home para obtener las noticias más recientes del servicio.

- **Use el modo offline** cuando viaje en zonas con mala señal. Los reportes de ocupación se guardarán y enviarán al recuperar la conexión, sin necesidad de repetir el proceso.

- **El campo de registro rápido** en el perfil puede usarse para guardar su número de carné u otro identificador. Es un campo de texto libre, no tiene formato obligatorio.

---

## 15. Créditos del proyecto

OcupaBus fue desarrollado como proyecto práctico final de la asignatura **Programación de Dispositivos Móviles (ISW-307)** en la **Universidad Abierta para Adultos (UAPA)**, Escuela de Ingeniería y Tecnología.

**Periodo:** Julio 2026  
**Grupo:** Z  
**Facilitador:** Joan Manuel Gregorio Pérez

### Equipo de desarrollo

| Integrante | Matrícula | Módulo |
|-----------|:---------:|--------|
| Franklin Alberto Beltré Fernández | 100066613 | Home + Servicios Web |
| Smailyn Ceballo Viva | 100064094 | Tareas + Almacenamiento |
| Angeleen Antonio Bello Hernández | 100065707 | Conectividad + Reportes Offline First |
| Francisco Ferreira | 100052613 | Geolocalización + Mapa |
| Emmanuel Espinal | 100063182 | Multimedia + Cámara + Perfil |

### Tecnologías utilizadas

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Angular | 20 | Framework principal |
| Ionic | 8 | Componentes de interfaz móvil |
| Capacitor | 8.4 | Acceso a hardware nativo en Android |
| TypeScript | 5.9 | Lenguaje de programación |
| Leaflet | 1.9.4 | Mapa interactivo |
| RxJS | 7.x | Estado reactivo |

### Repositorio

[https://github.com/100066613/OcupaBus-AP4](https://github.com/100066613/OcupaBus-AP4)

---

*Manual redactado por el equipo de desarrollo — OcupaBus AP4 · ISW-307 Grupo Z · UAPA · Julio 2026*

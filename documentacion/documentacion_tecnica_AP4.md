# Documentación técnica AP4 - OcupaBus AP4

## 1. Presentación del equipo

El desarrollo de esta práctica se organizó por funciones para que cada integrante aportara una parte concreta del proyecto. El resultado final refleja trabajo coordinado en la aplicación, la documentación y la verificación del funcionamiento.

| Integrante                        | Matrícula | Rol asignado                              | Responsabilidad concreta                                                                                                          |
| --------------------------------- | ---------:| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Franklin Alberto Beltré Fernández | 100066613 | Líder técnico                             | Coordina reuniones, revisa plazos, mantiene el repositorio de GitHub y apoya dudas de Ionic.                                      |
| Smailyn Ceballo Viva              | 100064094 | Diseñador de interfaz                     | Crea bocetos, lleva el diseño a digital, selecciona colores y asegura que la app sea fácil de usar.                               |
| Angeleen Antonio Bello Hernández  | 100065707 | Programador funcional                     | Escribe el código de geolocalización, Firebase, mapas y el sistema de reportes colaborativos.                                     |
| Francisco Ferreira                | 100052613 | Documentador / tester                     | Toma notas de las reuniones, prueba la app en varios teléfonos y revisa formato APA y referencias.                                |
| Emmanuel Espinal                  | 100063182 | Investigador de datos / community manager | Analiza redes sociales y noticias del corredor, diseña el sistema de reputación por estrellas y valida estadísticas de ocupación. |

## 2. Descripción general

La aplicación fue desarrollada en **Ionic + Angular + Capacitor** y resuelve el requisito de conectividad de la práctica. El sistema detecta el estado de red en tiempo real, muestra un indicador visual al usuario y conserva los reportes cuando el dispositivo no tiene internet. Al recuperar la conexión, la información pendiente se sincroniza automáticamente.

## 3. Objetivo del módulo

El objetivo del módulo es mantener la operatividad básica de la aplicación aunque el usuario pierda la conexión. Para eso se trabajaron dos partes:

- un detector de red con actualización inmediata en la interfaz;
- un flujo offline que guarda reportes localmente y los envía cuando vuelve la conexión.

## 4. Estructura del proyecto

La solución está organizada de manera simple para que pueda revisarse sin dificultad:

- `src/app/services/network.service.ts`: consulta el estado de la red y escucha cambios.
- `src/app/components/network-banner/network-banner.component.ts`: muestra el banner visual de conectividad.
- `src/app/services/offline-report.service.ts`: guarda reportes localmente y sincroniza pendientes.
- `src/app/home/home.page.*`: concentra la pantalla principal de prueba.
- `android/app/src/main/AndroidManifest.xml`: incluye el permiso de red requerido por Android.
- `documentacion/diagrama_flujo.txt`: resume el proceso de conectividad en formato de flujo.

## 5. Detector de red

`NetworkService` usa `@capacitor/network` para consultar la conectividad del dispositivo y reaccionar cuando el estado cambia.

### Funciones principales

- Obtiene el estado inicial con `Network.getStatus()`.
- Escucha cambios en tiempo real con `Network.addListener('networkStatusChange', ...)`.
- Publica el estado `isOnline$` para que la interfaz se actualice sola.
- Publica `connectionType$` para mostrar si la conexión es `wifi`, `cellular`, `none` u `unknown`.
- Libera el listener cuando el servicio deja de usarse.

### Resultado visual

El componente `NetworkBannerComponent` presenta un banner superior con tres datos visibles:

- estado online u offline;
- mensaje breve para el usuario;
- tipo de conexión detectada.

## 6. Modo offline funcional

`OfflineReportService` administra la lógica de almacenamiento local y sincronización.

### Comportamiento implementado

- Si hay conexión, registra el reporte como enviado dentro de la app.
- Si no hay conexión, guarda el reporte en `localStorage`.
- Al recuperar la red, sincroniza automáticamente los reportes pendientes.
- Muestra mensajes breves sobre el estado del proceso.

### Claves de almacenamiento

- `ocupabus_reportes_pendientes`
- `ocupabus_reportes_enviados`

### Estructura del reporte

```ts
{
  id: string,
  tipo: 'ocupacion_bus',
  ocupacion: 'vacío' | 'medio' | 'lleno',
  lat: number,
  lng: number,
  fecha: string,
  sincronizado: boolean
}
```

## 7. Pantalla principal

La pantalla principal permite probar la solución sin depender de otros módulos.

Incluye:

- un encabezado con el nombre del proyecto;
- un banner de red en tiempo real;
- botones para crear reportes de prueba;
- listas de reportes pendientes y enviados;
- un mensaje de estado del sistema.

Esto facilita demostrar la funcionalidad ante el profesor durante la revisión.

## 8. Flujo de funcionamiento

1. La aplicación inicia y consulta el estado actual de la red.
2. El banner muestra si la app está conectada o en modo offline.
3. El usuario crea un reporte de ocupación.
4. Si existe conexión, el reporte se registra como enviado dentro de la app.
5. Si no existe conexión, el reporte se guarda localmente.
6. Cuando la conexión vuelve, los reportes pendientes se sincronizan.
7. El almacenamiento local se actualiza y la interfaz refleja el cambio.

## 9. Decisiones de diseño

- Se eligió `@capacitor/network` porque es la solución correcta para detectar conectividad en Ionic con Capacitor.
- Se usó `BehaviorSubject` para mantener el último estado visible sin recargar la pantalla.
- Se utilizó `localStorage` por simplicidad y por facilidad de revisión en una entrega académica.
- Se separó la lógica de red de la lógica de reportes para mantener el código limpio.
- Se hizo una interfaz clara y directa para que el profesor pueda probarla rápido.

## 10. Permisos y configuración

En Android se añadió el permiso:

```xml
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

Además, el proyecto se sincronizó con Capacitor para que el plugin quede disponible en la plataforma Android.

## 11. Pruebas realizadas

### Conexión activa

- Se abrió la aplicación con WiFi encendido.
- El banner mostró el estado conectado.
- Los reportes pasaron a la sección de enviados.

### Sin conexión

- Se activó el modo avión.
- El banner cambió a estado offline.
- Los reportes quedaron en pendientes.

### Recuperación de conexión

- Se desactivó el modo avión.
- El listener detectó el cambio de red.
- Los reportes pendientes se sincronizaron automáticamente.

## 12. Capturas de pantalla

  Las evidencias gráficas del proyecto se encuentran en Google Drive:

- Grupo Z

- [Carpeta de capturas](https://drive.google.com/drive/folders/18d64VEmZtwBsAhtVcURjgRpleJEs3eOD)
  
  Capturas incluidas en esta entrega:

- `01_navegador_conectado.png`
  
  ![01_navegador_conectado.png](/home/heroe/Desarrollo/desarrollo%20movil/AP4_GrupoZ/ocupabus-app/documentacion/01_navegador_conectado.png)
  
  

- 02_navegador_offline.png`

![02_navegador_offline.png](/home/heroe/Desarrollo/desarrollo%20movil/AP4_GrupoZ/ocupabus-app/documentacion/02_navegador_offline.png)



- `03_emulador_conectado.png`



![03_emulador_conectado.png](/home/heroe/Desarrollo/desarrollo%20movil/AP4_GrupoZ/ocupabus-app/documentacion/03_emulador_conectado.png)



- `04_emulador_conectado_reporte_enviado.png`



![04_emulador_conectado_reporte_enviado.png](/home/heroe/Desarrollo/desarrollo%20movil/AP4_GrupoZ/ocupabus-app/documentacion/04_emulador_conectado_reporte_enviado.png)



- `05_emulador_offline.png`



![05_emulador_offline.png](/home/heroe/Desarrollo/desarrollo%20movil/AP4_GrupoZ/ocupabus-app/documentacion/05_emulador_offline.png)



- `06_emulador_offline_reporte_pendiente.png`



![06_emulador_offline_reporte_pendiente.png](/home/heroe/Desarrollo/desarrollo%20movil/AP4_GrupoZ/ocupabus-app/documentacion/06_emulador_offline_reporte_pendiente.png)

# 

# 13. Instalación y ejecución#

### Ejecutar en VS Code

```bash
cd ocupabus-app
npm install
ionic serve
```

### Sincronizar Capacitor

```bash
npx cap sync
```

### Ejecutar en Android

```bash
ionic cap run android -l --external
```

## 14. Observación final

La solución deja lista la base del proyecto en Ionic para que el módulo de conectividad pueda evaluarse en navegador y en Android. La estructura del código separa claramente la detección de red, el modo offline y la interfaz principal.  mv 'Screenshot from 2026-06-26 10-05-17.png' '01_navegador_conectado.png'
  mv 'Screenshot from 2026-06-26 10-12-15.png' '02_navegador_offline.png'
  mv 'Screenshot from 2026-06-26 11-53-52.png' '03_emulador_conectado.png'
  mv 'Screenshot from 2026-06-26 11-54-06.png' '04_emulador_conectado_reporte_enviado.png'
  mv 'Screenshot from 2026-06-26 12-02-39.png' '05_emulador_offline.png'
  mv 'Screenshot from 2026-06-26 12-02-51.png' '06_emulador_offline_reporte_pendiente.png'  mv 'Screenshot from 2026-06-26 10-05-17.png' '01_navegador_conectado.png'
  mv 'Screenshot from 2026-06-26 10-12-15.png' '02_navegador_offline.png'
  mv 'Screenshot from 2026-06-26 11-53-52.png' '03_emulador_conectado.png'
  mv 'Screenshot from 2026-06-26 11-54-06.png' '04_emulador_conectado_reporte_enviado.png'
  mv 'Screenshot from 2026-06-26 12-02-39.png' '05_emulador_offline.png'
  mv 'Screenshot from 2026-06-26 12-02-51.png' '06_emulador_offline_reporte_pendiente.png'

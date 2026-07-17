# Limitaciones y consideraciones técnicas — OcupaBus AP4

Este documento describe con precisión las limitaciones funcionales, técnicas y de entorno del proyecto. Las limitaciones listadas son propias del alcance académico y no representan defectos de implementación dentro del contexto educativo para el que fue desarrollado.

---

## 1. Almacenamiento

- **`localStorage` como único mecanismo de persistencia.** No cifra datos. Cualquier script que se ejecute en el mismo origen puede leer y modificar los datos almacenados.
- **Límite de capacidad aproximado de 5–10 MB** según el navegador. El almacenamiento de imágenes como DataURL Base64 ocupa significativamente más espacio que los archivos originales, lo que reduce la cantidad práctica de fotos almacenables.
- **Sin versionado de esquema.** Un cambio en la estructura de una interfaz (por ejemplo, `AppTask`) puede dejar datos persistidos incompatibles con la nueva versión del código, causando errores de parsing.
- **Operaciones síncronas.** `localStorage.setItem` y `localStorage.getItem` bloquean el hilo principal. En escrituras de arrays grandes esto puede causar micro-bloqueos perceptibles.
- **Sin soporte de transacciones, índices ni consultas.** No es adecuado para datos relacionales ni para volúmenes de datos crecientes.

---

## 2. Backend y API

- **Sin backend propio.** No existe servidor, base de datos remota ni infraestructura de producción.
- **JSONPlaceholder no almacena datos reales.** Los `POST` de feedback devuelven un ID ficticio; los datos no se guardan en ningún servidor.
- **`enviarReporte()` es una simulación.** La función espera 200 ms y hace `console.log`. No realiza ninguna petición HTTP real. La sincronización Offline First es demostrativa.
- **Sin autenticación ni control de acceso.** No existe ningún mecanismo de identificación de usuarios.

---

## 3. Bluetooth

- **Parcialmente real, condicionado por navegador.** `navigator.bluetooth.requestDevice()` se llama cuando `'bluetooth' in navigator` es verdadero. Esto solo ocurre en Chrome y Edge de escritorio en su versión actual.
- **No funciona en Firefox, Safari ni en la mayoría de navegadores móviles.** En estos entornos, `'bluetooth' in navigator` es `false` y el flujo cae al comportamiento simulado.
- **El emparejamiento (`pairBluetooth`) no realiza ninguna operación nativa.** Solo actualiza el estado del dispositivo en memoria (`DemoDevice.status = 'Emparejado'`).
- **No existe comunicación GATT ni lectura/escritura de características.** La demostración se limita a la selección del dispositivo en el diálogo del sistema (cuando el navegador lo permite).

---

## 4. NFC

- **Completamente simulado.** Las funciones `readNfc()` y `writeNfc()` no llaman a `NDEFReader`, `NDEFMessage` ni a ningún plugin de Capacitor. Operan exclusivamente sobre `BehaviorSubject` en memoria.
- **No interactúa con ningún hardware NFC.** Los dispositivos NFC listados son datos semilla estáticos.

---

## 5. Geolocalización

- **Dependiente del permiso del usuario.** Si el permiso de geolocalización es denegado, la aplicación usa la posición semilla del campus UAPA SDO (lat 18.5156165, lng -69.8471000).
- **En entornos HTTP sin HTTPS, algunos navegadores bloquean `navigator.geolocation`.** La aplicación en `localhost` generalmente está exenta, pero en despliegues sin certificado puede fallar.
- **En Android, el WebView gestiona el permiso de ubicación en tiempo de ejecución.** El comportamiento puede variar según el fabricante, la versión de Android y la versión del WebView instalado. `ACCESS_FINE_LOCATION` no está declarado en `AndroidManifest.xml`.

---

## 6. Cámara e imágenes

- **Usa `<input type="file" accept="image/*" capture="environment">`, no un plugin de Capacitor.** El atributo `capture="environment"` solicita la cámara trasera, pero el comportamiento real (abrir la cámara directamente vs. mostrar selector de apps) varía por dispositivo y fabricante de Android.
- **En navegador de escritorio**, solo muestra el explorador de archivos del sistema operativo.
- **No existe acceso a la galería de manera controlada.** El usuario ve las opciones que el sistema le presente en el selector de archivos.

---

## 7. Audio

- **La reproducción de audio WAV generado proceduralmente en el WebView de Android no ha sido verificada formalmente en esta sesión.** Funciona correctamente en Chrome y Edge de escritorio.
- **El audio se genera en tiempo real** en cada reproducción; no se guarda en disco.

---

## 8. Compatibilidad de navegador

| Función | Chrome/Edge | Firefox | Safari | Chrome Android | Samsung Internet |
|---|:---:|:---:|:---:|:---:|:---:|
| Aplicación general | ✅ | ✅ | ✅ | ✅ | ✅ |
| Web Bluetooth | ✅ | ❌ | ❌ | ❌ (sin HTTPS) | ❌ |
| Geolocalización | ✅ | ✅ | ✅ | ✅ | ✅ |
| Web Audio API | ✅ | ✅ | ✅ | ✅ | ✅ |
| FileReader | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 9. Dependencias instaladas sin uso comprobado

Los siguientes plugins de Capacitor están declarados en `package.json` pero no tienen referencias verificadas en el código de la aplicación (`src/app/`). Incrementan el tamaño del APK sin aportar funcionalidad comprobada:

| Plugin | Versión |
|---|---|
| `@capacitor/app` | 8.1.0 |
| `@capacitor/haptics` | 8.0.2 |
| `@capacitor/keyboard` | 8.0.5 |
| `@capacitor/status-bar` | 8.0.2 |

---

## 10. Cobertura de pruebas

- `media.service.ts` no tiene archivo `.spec.ts`.
- Las pruebas de páginas son únicamente smoke tests (verifican que el componente se instancia).
- No existen pruebas de componentes con interacción de usuario.
- No existen pruebas de integración entre páginas y servicios.
- No existen pruebas E2E.

---

## 11. Seguridad

- Datos en `localStorage` en texto plano, sin cifrado.
- Sin validación de entrada en el servidor (no existe servidor).
- Sin políticas de Content Security Policy (CSP) configuradas explícitamente.
- No se manejan tokens, credenciales ni datos sensibles de usuarios reales (contexto académico sin usuarios reales).

---

## 12. Escalabilidad

Esta arquitectura es adecuada para el alcance académico del proyecto. Para una evolución hacia producción se requeriría:

- Reemplazar `localStorage` por `@capacitor/preferences`, IndexedDB o una base de datos real.
- Implementar un backend con autenticación y almacenamiento persistente.
- Separar la lógica de acceso a datos en una capa de repositorio independiente de los servicios.
- Implementar un plugin de Capacitor para acceso real a Bluetooth y NFC.
- Ampliar la cobertura de pruebas con tests de componentes, integración y E2E.
- Configurar firma de APK y proceso de publicación en Google Play.

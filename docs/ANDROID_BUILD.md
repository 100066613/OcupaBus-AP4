# Compilación para Android — OcupaBus AP4

---

## 1. Requisitos

| Herramienta                | Versión requerida          | Nota                                               |
| -------------------------- | -------------------------- | -------------------------------------------------- |
| JDK                        | 21 (recomendado)           | El script `android:run` usa Java 21 explícitamente |
| Android Studio             | Ladybug o superior         | Incluye SDK Manager y emulador                     |
| Android SDK                | API 36 (compileSdk)        | Instalar desde Android Studio SDK Manager          |
| Android SDK Platform-Tools | Cualquier versión reciente | Para `adb`                                         |
| Emulador Android           | API 24 o superior          | minSdk = 24 (Android 7.0)                          |

### Verificar JDK instalado

```bash
java --version
```

### Verificar adb disponible

```bash
adb --version
```

---

## 2. Configuración del SDK de Android

El archivo `android/local.properties` debe existir con la ruta al SDK:

**Linux / macOS:**

```properties
sdk.dir=/home/tu_usuario/Android/Sdk
```

**Windows:**

```properties
sdk.dir=C\:\\Users\\tu_usuario\\AppData\\Local\\Android\\Sdk
```

Si el archivo no existe, Gradle no encontrará el SDK y fallará. Créalo manualmente o deja que Android Studio lo genere al abrir el proyecto.

---

## 3. Flujo completo de compilación

El directorio `android/` ya existe en el repositorio; no es necesario ejecutar `npx cap add android`.

### Paso 1 — Compilar la aplicación web

```bash
npm run build
```

Genera la carpeta `www/` con el bundle de la aplicación.

### Paso 2 — Sincronizar Capacitor

```bash
npm run android:sync
```

Este script hace dos cosas:

1. Ejecuta `scripts/fix-capacitor-java.sh`, que ajusta `VERSION_21` a `VERSION_17` en los archivos Gradle (si aplica para tu entorno Java).
2. Ejecuta `npx cap sync android`, que copia `www/` a `android/app/src/main/assets/public/`.

> Si tu entorno tiene Java 21 disponible y no necesitas el ajuste, también puedes ejecutar directamente:
> 
> ```bash
> npm run build && npx cap sync android
> ```

### Paso 3 — Abrir en Android Studio

```bash
npx cap open android
```

Desde Android Studio: seleccionar el dispositivo o emulador en la barra superior y pulsar **Run** (triángulo verde).

---

## 4. Generar el APK desde la terminal

El proyecto incluye el Gradle Wrapper. Úsalo en lugar de una instalación global de Gradle.

**Linux / macOS:**

```bash
cd android
./gradlew assembleDebug
```

**Windows:**

```powershell
cd android
.\gradlew.bat assembleDebug
```

### Ruta del APK generado

```
android/app/build/outputs/apk/debug/OcupaBus-AP4-debug.apk
```

El nombre `OcupaBus-AP4` está configurado en `android/app/build.gradle` con `base.archivesName = "OcupaBus-AP4"`.

---

## 5. Instalar el APK en un dispositivo conectado

```bash
adb devices                     # verificar dispositivo conectado
adb install android/app/build/outputs/apk/debug/OcupaBus-AP4-debug.apk
```

Para reinstalar sobre una versión anterior:

```bash
adb install -r android/app/build/outputs/apk/debug/OcupaBus-AP4-debug.apk
```

---

## 6. Ejecutar en emulador con los scripts del proyecto

```bash
npm run android:run
```

Este script usa `JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64` y ejecuta Capacitor en el emulador `emulator-5554`.

Si prefieres Java 17:

```bash
npm run android:run:17
```

Este script usa `JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64` y ejecuta `./gradlew installDebug`.

> Estos scripts están configurados para rutas de JDK en Linux. En macOS o Windows ajusta las rutas de `JAVA_HOME` según tu instalación.

---

## 7. Configuración verificada del proyecto Android

| Parámetro           | Valor                    |
| ------------------- | ------------------------ |
| `applicationId`     | `com.ocupabus.ap4`       |
| `minSdkVersion`     | 24 (Android 7.0)         |
| `targetSdkVersion`  | 36                       |
| `compileSdkVersion` | 36                       |
| `versionCode`       | 1                        |
| `versionName`       | 1.0                      |
| Nombre del APK      | `OcupaBus-AP4-debug.apk` |

### Permisos declarados en `AndroidManifest.xml`

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

> GPS, cámara y Bluetooth son gestionados por el WebView en tiempo de ejecución. No están declarados en `AndroidManifest.xml`.

---

## 8. APK debug vs. APK release

| Tipo       | Comando                     | Firmado                            | Uso                                             |
| ---------- | --------------------------- | ---------------------------------- | ----------------------------------------------- |
| Debug      | `./gradlew assembleDebug`   | Con clave de depuración de Android | Instalación de prueba; no apto para Google Play |
| Release    | `./gradlew assembleRelease` | Requiere keystore configurado      | Distribución; no configurado en este proyecto   |
| App Bundle | `./gradlew bundleRelease`   | Requiere keystore configurado      | Google Play; no configurado en este proyecto    |

> Este proyecto solo tiene configurado el APK debug. No existe keystore de firma ni configuración de release en `build.gradle`.

---

## 9. Limpieza del build

Si Gradle falla con errores de caché o archivos desactualizados:

**Linux / macOS:**

```bash
cd android
./gradlew clean
cd ..
npm run build
npm run android:sync
```

**Windows:**

```powershell
cd android
.\gradlew.bat clean
cd ..
npm run build
npm run android:sync
```

---

## 10. Errores frecuentes

| Error                                                     | Causa probable                                   | Solución                                                                      |
| --------------------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------- |
| `SDK location not found`                                  | `local.properties` ausente o con ruta incorrecta | Crear/editar `android/local.properties` con la ruta correcta del SDK          |
| `Unsupported Java version` / `invalid source release: 21` | JDK incorrecto para la versión de Gradle         | Usar el script `npm run android:run` que configura `JAVA_HOME` explícitamente |
| `JAVA_HOME not set`                                       | Variable de entorno sin configurar               | `export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64` (Linux)                 |
| `www/ not found`                                          | Build web no ejecutado                           | Ejecutar `npm run build` antes de sincronizar                                 |
| `Gradle build failed` (sin mensaje claro)                 | Caché de Gradle corrupta                         | Ejecutar `./gradlew clean` y recompilar                                       |
| `adb: device not found`                                   | Depuración USB no habilitada o cable             | Habilitar opciones de desarrollador y depuración USB en el dispositivo        |
| `INSTALL_FAILED_UPDATE_INCOMPATIBLE`                      | APK previo incompatible                          | Desinstalar la versión anterior: `adb uninstall com.ocupabus.ap4`             |

---

## 11. Diferencias por sistema operativo

| Aspecto               | Linux                   | macOS                         | Windows                        |
| --------------------- | ----------------------- | ----------------------------- | ------------------------------ |
| Wrapper Gradle        | `./gradlew`             | `./gradlew`                   | `.\gradlew.bat`                |
| Ruta JDK              | `/usr/lib/jvm/...`      | `/Library/Java/...`           | `C:\Program Files\Java\...`    |
| Ruta SDK              | `~/Android/Sdk`         | `~/Library/Android/sdk`       | `%LOCALAPPDATA%\Android\Sdk`   |
| Scripts `android:run` | Configurados para Linux | Requieren ajustar `JAVA_HOME` | Requieren scripts alternativos |

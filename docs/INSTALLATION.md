# Guía de instalación — OcupaBus AP4

---

## 1. Requisitos del sistema

### Node.js y npm

Descarga e instala Node.js 20 LTS o superior desde [nodejs.org](https://nodejs.org/).
npm se instala automáticamente junto con Node.js.

```bash
node --version   # debe mostrar v20.x o superior
npm --version    # debe mostrar 10.x o superior
```

### Git

**Linux (Debian/Ubuntu):**
```bash
sudo apt update && sudo apt install git
```

**macOS:**
```bash
brew install git
```

**Windows:** Descargar desde [git-scm.com](https://git-scm.com/download/win).

```bash
git --version
```

### JDK (solo para compilación Android)

El proyecto usa Java 21 en el script `android:run` y Java 17 en `android:run:17`. Se recomienda instalar JDK 21.

**Linux:**
```bash
sudo apt install openjdk-21-jdk
java --version
```

**macOS / Windows:** Descargar desde [adoptium.net](https://adoptium.net/).

### Android Studio (solo para compilación Android)

Descargar desde [developer.android.com/studio](https://developer.android.com/studio).
Incluye el SDK de Android, el emulador y las herramientas de plataforma.

Ver guía específica: [ANDROID_BUILD.md](ANDROID_BUILD.md)

---

## 2. Clonar el repositorio

```bash
git clone https://github.com/100066613/OcupaBus-AP4.git
cd OcupaBus-AP4
```

---

## 3. Instalar dependencias

```bash
npm install
```

> **`npm install` vs `npm ci`**
>
> - `npm install`: resuelve y descarga dependencias según `package.json`. Puede actualizar `package-lock.json`. Recomendado para la instalación inicial.
> - `npm ci`: instalación reproducible exacta desde `package-lock.json`, sin modificarlo. Útil en entornos de CI o cuando el lockfile está sincronizado.

Para una instalación limpia reproducible:

```bash
npm ci
```

---

## 4. Verificar la instalación

```bash
node --version
npm --version
ls node_modules/@angular/core   # debe existir
ls node_modules/@ionic/angular  # debe existir
```

---

## 5. Ejecutar en navegador

```bash
npm start
```

Abre `http://localhost:4200` en el navegador. La recarga automática se activa al guardar cualquier archivo del proyecto.

Para usar un puerto distinto:

```bash
npm start -- --port 4201
```

Detener el servidor:

```
Ctrl + C
```

---

## 6. Compilar para producción / Android

```bash
npm run build
```

Los archivos generados se colocan en `www/`. Esta carpeta es la que Capacitor copia al WebView de Android.

Verificar que la compilación fue exitosa:

```bash
ls -lah www/
```

Debe contener `index.html` y los chunks JavaScript.

---

## 7. Sincronizar con Android

```bash
npm run android:sync
```

Este script ejecuta `scripts/fix-capacitor-java.sh` (que ajusta la versión de Java en los archivos Gradle) y luego `npx cap sync android`, que copia `www/` al proyecto Android.

---

## 8. Limpieza de caché

Si el proyecto presenta comportamientos inesperados en el navegador:

```bash
# Eliminar caché de Angular
rm -rf .angular/cache

# Reinstalar dependencias
rm -rf node_modules
npm install
```

Limpiar los datos locales de la aplicación desde las DevTools del navegador:

```javascript
// Consola del navegador
localStorage.clear();
```

> Este comando elimina permanentemente todos los datos almacenados por la aplicación en el navegador actual, incluyendo tareas, fotos e imágenes.

---

## 9. Reinstalación limpia

Para partir desde cero:

```bash
rm -rf node_modules package-lock.json .angular/cache www
npm install
npm run build
```

---

## 10. Solución de errores frecuentes

| Síntoma | Causa probable | Solución |
|---------|---------------|----------|
| `Cannot find module '@angular/core'` | `node_modules` ausente o incompleto | Ejecutar `npm install` |
| `www/ not found` al sincronizar Android | Build no ejecutado | Ejecutar `npm run build` primero |
| `SDK location not found` en Gradle | `android/local.properties` ausente | Crear el archivo con `sdk.dir=/ruta/Android/Sdk` |
| `Port 4200 is already in use` | Otro proceso usa el puerto | Usar `--port 4201` o detener el proceso anterior |
| `JAVA_HOME not set` | JDK no configurado | Exportar `JAVA_HOME` o usar los scripts del proyecto |
| `Package lock file is out of date` | `package.json` y `package-lock.json` desincronizados | Ejecutar `npm install` para regenerar el lockfile |
| Cambios en el código no reflejan en Android | `cap sync` no ejecutado | Ejecutar `npm run build && npm run android:sync` |
| Mapa no aparece en Android | `www/` desactualizado | Recompilar y resincronizar |

---

## 11. Actualizar dependencias

> Actualizar dependencias en un proyecto Ionic/Angular puede introducir incompatibilidades. Hazlo con precaución y solo si es necesario.

```bash
# Ver dependencias desactualizadas
npm outdated

# Actualizar una dependencia específica (ejemplo)
npm install @ionic/angular@latest
```

No usar `npm update` sin revisar primero los changelogs de las dependencias principales.

---

## 12. Verificar versiones del proyecto

```bash
# Angular CLI
npx ng version

# Capacitor
npx cap --version

# Ionic CLI (si está instalado globalmente)
ionic --version
```

> El proyecto no requiere Ionic CLI global. Todos los comandos necesarios están definidos en los scripts de `package.json`.

---

## 13. Limpiar localStorage desde DevTools

1. Abrir el navegador en `http://localhost:4200`.
2. Abrir DevTools (`F12` o `Ctrl+Shift+I`).
3. Ir a la pestaña **Application** (Chrome/Edge) o **Storage** (Firefox).
4. En el panel izquierdo, expandir **Local Storage** → seleccionar `http://localhost:4200`.
5. Borrar entradas individuales o ejecutar en la consola:

```javascript
localStorage.clear();
```

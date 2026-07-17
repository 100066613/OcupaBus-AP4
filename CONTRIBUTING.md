# Guía de contribución — OcupaBus AP4

---

## Propósito académico

Este repositorio corresponde al **Proyecto Práctico Final** de la asignatura ISW-307 de la Universidad Abierta para Adultos (UAPA). Es un proyecto cerrado desarrollado por el equipo del Grupo Z durante el periodo julio de 2026.

**No se aceptan contribuciones externas al equipo durante el periodo de evaluación académica.** El historial de commits y autoría es parte de la evidencia de evaluación.

---

## Integrantes del equipo

| Integrante                        | Matrícula | Módulo                                |
| --------------------------------- |:---------:| ------------------------------------- |
| Franklin Alberto Beltré Fernández | 100066613 | Home + Servicios Web                  |
| Smailyn Ceballo Viva              | 100064094 | Tareas + Almacenamiento               |
| Angeleen Antonio Bello Hernández  | 100065707 | Conectividad + Reportes Offline First |
| Francisco Ferreira                | 100052613 | Geolocalización + Mapa                |
| Emmanuel Espinal                  | 100063182 | Multimedia + Cámara + Perfil          |

---

## Flujo de trabajo para miembros del equipo

### 1. Antes de comenzar

```bash
git pull origin main
npm install
npm start
```

Verifica que la aplicación inicia correctamente antes de hacer cambios.

### 2. Crear una rama de trabajo

Usa el módulo que tienes asignado como referencia para el nombre de la rama:

```bash
git checkout -b feature/nombre-descriptivo
# Ejemplos:
# feature/mejora-filtro-tareas
# fix/mapa-centrado-campus
# docs/actualizar-readme
```

Prefijos recomendados:

| Prefijo     | Uso                                          |
| ----------- | -------------------------------------------- |
| `feature/`  | Nueva funcionalidad                          |
| `fix/`      | Corrección de un error                       |
| `docs/`     | Cambios solo en documentación                |
| `refactor/` | Cambios de código sin alterar comportamiento |

### 3. Hacer commits

Un commit por cambio lógico. El mensaje debe describir qué y por qué, no solo qué archivos se modificaron:

```bash
git add src/app/transfers/transfers.page.ts
git commit -m "fix: corregir reordenamiento cuando la lista tiene una sola tarea"
```

Formato de mensaje recomendado:

```
tipo: descripción corta en español (máximo 72 caracteres)

Descripción opcional más extensa si el cambio es complejo.
```

Tipos: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.

### 4. Antes de subir cambios

```bash
npm test          # todas las pruebas deben pasar
npm run lint      # sin errores de linting
npm start         # verificar que la app carga correctamente
```

Si modificaste código que afecta Android:

```bash
npm run build
npm run android:sync
```

### 5. Abrir un Pull Request

```bash
git push origin feature/nombre-descriptivo
```

Luego abrir el PR en GitHub hacia `main`. Incluir en la descripción del PR:

- Qué módulo o servicio se modificó.
- Qué problema resuelve o qué funcionalidad agrega.
- Cómo probarlo manualmente.
- Si las pruebas automatizadas pasaron.

---

## Reglas generales

### Lo que no debes subir

- **Credenciales, tokens, contraseñas o claves de API.** Aunque el proyecto no usa credenciales reales, esto aplica siempre.
- **Archivos de configuración local** como `android/local.properties` (ya en `.gitignore`).
- **Carpetas generadas** como `node_modules/`, `www/`, `.angular/cache` (ya en `.gitignore`).
- **Código de otras personas sin atribución.**

### Lo que sí debes hacer

- Mantener el tono de la UI en español (es-DO).
- No renombrar servicios ni métodos públicos existentes sin consenso del equipo; los nombres son parte de la defensa individual.
- Actualizar la documentación si cambias el comportamiento de un módulo.
- Ejecutar las pruebas antes de cada commit que modifique servicios.

---

## Manejo de Issues

Si encuentras un problema o una tarea pendiente:

1. Abrir un Issue en GitHub con una descripción clara.
2. Asignarlo al integrante responsable del módulo afectado.
3. Referenciar el Issue en el commit: `fix: corregir banner offline (#12)`.

---

## Actualizar documentación

Si modificas el comportamiento de un módulo, actualiza el archivo correspondiente en `docs/`:

| Módulo afectado            | Documento a actualizar  |
| -------------------------- | ----------------------- |
| Instalación o dependencias | `docs/INSTALLATION.md`  |
| Arquitectura o servicios   | `docs/ARCHITECTURE.md`  |
| Cualquier módulo funcional | `docs/MODULES.md`       |
| Pruebas                    | `docs/TESTING.md`       |
| Build Android              | `docs/ANDROID_BUILD.md` |
| Limitaciones conocidas     | `docs/LIMITATIONS.md`   |

---

## Nota de cierre

Este proyecto finalizó su periodo de desarrollo activo con la entrega académica de julio de 2026. Las contribuciones posteriores, si las hubiera, serían de carácter personal de los integrantes del equipo y no forman parte de la evaluación de la asignatura.

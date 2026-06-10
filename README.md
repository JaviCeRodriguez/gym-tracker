# Gym Tracker 💪

Aplicación base de **React Native** para registrar entrenamientos.

## Requisitos

- Node.js >= 22.11
- JDK 17
- Android SDK (para compilación local de Android)

## Desarrollo local

```bash
npm install
npm start
```

En otra terminal:

```bash
npm run android
```

## CI/CD de APK en GitHub Actions

El repositorio incluye el workflow:

- `/home/runner/work/gym-tracker/gym-tracker/JaviCeRodriguez/gym-tracker/.github/workflows/android-release.yml`

Comportamiento:

- Se ejecuta en cada `push`/merge a `main`.
- Compila `android/app/build/outputs/apk/release/app-release.apk`.
- Crea una **GitHub Release** automática con tag `v<package.json.version>-<run_number>`.
- Publica el APK como asset descargable de la Release.

## Descargar e instalar APK

1. Ir a la pestaña **Releases** del repositorio.
2. Descargar `app-release.apk` del release más reciente.
3. Instalarlo en Android (habilitando instalación de orígenes desconocidos si aplica).

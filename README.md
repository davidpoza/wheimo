# Wheimo

**Where Is My Money** — aplicación web de seguimiento de gastos e ingresos personales.

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Angular + Nginx |
| API | Spring Boot 3 (Java 21) |
| Fetcher | Spring Boot 3 (Java 21) — sincronización con bancos |
| Base de datos | PostgreSQL 16 |
| Caché / mensajería | Redis 7 |
| Contenedores | Docker + Docker Compose |

## Puesta en marcha

### 1. Requisitos previos

- Docker y Docker Compose instalados
- Acceso a las imágenes publicadas en GHCR (ver sección de imágenes)

### 2. Configuración del entorno

Copia el fichero de ejemplo y edita los valores:

```bash
cp .env.example .env
```

#### Variables requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `POSTGRES_USER` | Usuario de PostgreSQL | `wheimo` |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL | `s3cr3t` |
| `JWT_SECRET` | Clave secreta para firmar JWT (mínimo 32 caracteres) | `openssl rand -hex 64` |
| `AES_PASSPHRASE` | Passphrase AES para cifrar credenciales bancarias (debe ser igual en api y fetcher) | `my-aes-passphrase` |
| `AUTH_USERNAME` | Email del usuario administrador inicial | `admin@wheimo.com` |
| `AUTH_PASSWORD` | Contraseña del usuario administrador inicial | `changeme` |

#### Variables opcionales

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `JWT_EXPIRATION_MS` | Duración del access token en ms | `900000` (15 min) |
| `JWT_REFRESH_EXPIRATION_MS` | Duración del refresh token en ms | `2592000000` (30 días) |
| `API_URL` | URL de la API para el contenedor frontend | `http://wheimo-api:8080` |

### 3. Arrancar la aplicación

```bash
docker compose pull
docker compose up -d
```

La aplicación estará disponible en `http://localhost:4200`.

### 4. Usuario inicial

Al arrancar por primera vez, el backend crea automáticamente un usuario administrador con las credenciales definidas en `AUTH_USERNAME` y `AUTH_PASSWORD`. Si el usuario ya existe y la contraseña ha cambiado, se actualiza.

**Credenciales por defecto** (cambiar en `.env` antes de arrancar):

```
Email:     admin@wheimo.com
Password:  changeme
```

## Imágenes Docker

Las imágenes se publican automáticamente en GitHub Container Registry al hacer push a `master`:

```
ghcr.io/davidpoza/wheimo-api:latest
ghcr.io/davidpoza/wheimo-fetcher:latest
ghcr.io/davidpoza/wheimo-frontend:latest
```

Para que Docker pueda descargar las imágenes (si el paquete es privado):

```bash
echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin
```

## Desarrollo local (con build local)

Si quieres construir las imágenes localmente en lugar de usar las de GHCR:

```bash
docker compose build
docker compose up -d
```

> Para construir localmente sustituye `image:` por `build:` en `docker-compose.yml` o usa las directivas de build comentadas.

## CI/CD

El workflow `.github/workflows/docker-publish.yml` se ejecuta en cada push a `master` y:

1. Construye las imágenes de `wheimo-api`, `wheimo-fetcher` y `wheimo-frontend`
2. Las publica en GHCR con las etiquetas `latest` y el SHA corto del commit
3. Usa caché de GitHub Actions para acelerar los builds sucesivos

No se necesitan secretos adicionales: usa el `GITHUB_TOKEN` integrado en el repositorio.
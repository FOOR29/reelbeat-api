# reelbeat-api

API en Node.js y TypeScript que consume Last.fm, Trakt y Deezer y entrega los datos ya limpios (campos renombrados, números como número, imágenes con URL completa) para un front en React. Muestra qué estoy escuchando, mis tops de música, las horas escuchadas y las últimas películas que vi.

URL pública: https://reelbeat-api.onrender.com

## Stack

Node.js, TypeScript, Express 5 y pnpm.

## Endpoints

Todos son `GET`. URL base: `https://reelbeat-api.onrender.com`

### Estado

**Health check.** Comprueba que la API está viva.

```text
https://reelbeat-api.onrender.com/health
```

### Música (Last.fm)

**Reproduciendo ahora.** La canción que suena o, si no suena nada, la última escuchada.

```text
https://reelbeat-api.onrender.com/api/music/now-playing
```

**Top de artistas.** Parámetros opcionales: `period` y `limit`.

```text
https://reelbeat-api.onrender.com/api/music/top-artists?period=1month&limit=3
```

**Top de canciones.** Parámetros opcionales: `period` y `limit`.

```text
https://reelbeat-api.onrender.com/api/music/top-tracks
```

**Tiempo escuchado.** Minutos y horas estimados en el periodo.

```text
https://reelbeat-api.onrender.com/api/music/listening-time?period=7day
```

**Resumen.** Tiempo escuchado, top 5 de artistas y top 5 de canciones en una sola respuesta.

```text
https://reelbeat-api.onrender.com/api/music/summary
```

### Películas (Trakt)

**Películas recientes.** Las últimas vistas, de la más nueva a la más vieja. Parámetro opcional: `limit`.

```text
https://reelbeat-api.onrender.com/api/movies/recent
```

```text
https://reelbeat-api.onrender.com/api/movies/recent?limit=50
```

## Parámetros

| Parámetro | Aplica a | Valores | Por defecto |
|---|---|---|---|
| `period` | top-artists, top-tracks, listening-time, summary | `7day`, `1month`, `3month`, `6month`, `12month`, `overall` | `7day` |
| `limit` | top-artists, top-tracks | entero de 1 a 20 | 5 |
| `limit` | movies/recent | entero de 1 a 100 | 30 |

## Ejemplos de respuesta

`/api/music/now-playing`

```json
{
  "isPlaying": true,
  "name": "I Hate You I Love You",
  "artist": "DVRST",
  "artistImage": "https://cdn-images.dzcdn.net/images/artist/.../500x500-000000-80-0-0.jpg",
  "album": "I Hate You I Love You",
  "image": "https://lastfm-img.freetls.fastly.net/i/u/300x300/....jpg",
  "url": "https://www.last.fm/music/DVRST/_/I+Hate+You+I+Love+You",
  "playedAt": null
}
```

`/api/movies/recent` (un elemento de la lista)

```json
{
  "title": "Resident Evil",
  "year": 2026,
  "rating": 7.8,
  "watchedAt": "2026-09-22T10:18:00.000Z",
  "poster": "https://media.trakt.tv/images/movies/.../403bce2645.jpg.webp"
}
```

## Errores

| Código | Cuándo |
|---|---|
| 400 | `period` o `limit` inválidos |
| 404 | La ruta no existe |
| 502 | Falló una API externa (Last.fm o Trakt) |
| 500 | Error inesperado del servidor |

## Notas

- `listening-time` es una estimación: suma duración por reproducciones usando la duración de catálogo de Last.fm. Las canciones sin duración no se suman y se cuentan aparte en `tracksWithoutDuration`.
- Last.fm ya no entrega fotos de artistas, así que se piden a Deezer buscando por nombre (coincidencia exacta). Se guardan en caché en memoria. Si Deezer falla o no encuentra al artista, el campo queda en `null` y la respuesta sale igual.
- `image` (portada) viene de Last.fm y es `null` cuando no hay portada.
- `playedAt` es `null` mientras la canción está sonando.

## Correrlo en local

Requisitos: Node.js 22.9 o superior y pnpm.

```bash
git clone https://github.com/FOOR29/reelbeat-api.git
```

```bash
cd reelbeat-api
```

```bash
pnpm install
```

Crea un archivo `.env` en la raíz con estas variables:

```text
PORT=3000
LASTFM_API_KEY=tu_api_key
LASTFM_USER=tu_usuario_de_lastfm
TRAKT_CLIENT_ID=tu_client_id
TRAKT_USER=tu_usuario_de_trakt
```

- La API key de Last.fm se crea en https://www.last.fm/api/account/create
- El Client ID de Trakt se obtiene creando una aplicación en https://trakt.tv/oauth/applications
- El perfil de Trakt debe ser público.

Si falta alguna variable, el servidor no arranca y avisa cuál es.

```bash
pnpm dev
```

| Script | Qué hace |
|---|---|
| `pnpm dev` | Servidor en desarrollo, se reinicia al guardar |
| `pnpm build` | Compila a `dist/` |
| `pnpm start` | Corre la versión compilada |

## Despliegue (Render)

Servicio web en el plan gratis de Render, conectado a este repositorio. Cada push a `main` redespliega.

| Campo | Valor |
|---|---|
| Build Command | `pnpm install && pnpm build` |
| Start Command | `pnpm start` |
| Health Check Path | `/health` |
| Variables | `LASTFM_API_KEY`, `LASTFM_USER`, `TRAKT_CLIENT_ID`, `TRAKT_USER` |

No se define `PORT`: Render la asigna sola.

El plan gratis duerme el servicio tras 15 minutos sin tráfico y la primera petición después tarda cerca de un minuto. Para evitarlo hay un monitor en UptimeRobot que consulta `/health` cada 5 minutos. Si se pausa el monitor, el servicio vuelve a dormirse sin que se rompa nada.

## Estructura

```text
src/
  index.ts            arranca el servidor
  app.ts              Express, CORS, rutas y errores
  config/env.ts       lee y valida las variables de entorno
  routes/             rutas bajo /api
  controllers/        leen la petición y responden
  services/           llaman a Last.fm, Trakt y Deezer y limpian los datos
  types/              tipos crudos (API externa) y limpios (los que entrega esta API)
  middlewares/        manejo central de errores
  errors/             errores propios (400 y 502)
  utils/              validación de period y limit
```

## Créditos de datos

Last.fm (música escuchada), Trakt (películas vistas y portadas) y Deezer (fotos de artistas).
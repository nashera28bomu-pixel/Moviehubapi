# Cymor Movie API

> Production-ready Node.js backend wrapping the MovieBox API
> **by Legendary Smiley Cymor — Cymor Tech Services**

---

## Overview

Cymor Movie API is a clean, caching, signed, Express 5 backend that wraps the MovieBox API (`h5-api.aoneroom.com`). Frontends never talk to MovieBox directly — all authentication, request signing, retries, caching, and response normalisation happen here.

---

## Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20+ (ES Modules) |
| Framework | Express 5 |
| HTTP client | Axios + axios-retry |
| Cache | lru-cache (Redis-ready) |
| Security | Helmet, CORS |
| Logging | Morgan |
| Deployment | Render / Docker |

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/your-username/cymor-movie-api.git
cd cymor-movie-api

# 2. Install
npm install

# 3. Configure
cp .env.example .env

# 4. Run (development)
npm run dev

# 5. Run (production)
npm start
```

Server starts at `http://localhost:5000`.

---

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### Health
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Root info + cache stats |
| GET | `/api/v1/health` | Service health check |

### Discovery
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/home` | Homepage content |
| GET | `/api/v1/trending` | Trending content |
| GET | `/api/v1/search?q=avatar` | Search |

### Details
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/details/:id` | Generic content details |
| GET | `/api/v1/movie/:id` | Movie details |
| GET | `/api/v1/series/:id` | Series details |
| GET | `/api/v1/anime/:id` | Anime details |

### Streaming & Downloads
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/stream/:id` | Stream URLs |
| GET | `/api/v1/downloads/:id` | Download links |

### Latest
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/latest/movies` | Latest movies |
| GET | `/api/v1/latest/series` | Latest series |
| GET | `/api/v1/latest/anime` | Latest anime |

### Regional
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/hollywood` | Hollywood |
| GET | `/api/v1/nollywood` | Nollywood |
| GET | `/api/v1/kdrama` | K-Drama |
| GET | `/api/v1/chinese-drama` | Chinese Drama |
| GET | `/api/v1/japanese-drama` | Japanese Drama |
| GET | `/api/v1/indian-movies` | Indian Movies |

### Genres
`/api/v1/genre/{name}` — available genres:

`action` · `adventure` · `comedy` · `drama` · `fantasy` · `family` · `animation` · `documentary` · `mystery` · `thriller` · `crime` · `sci-fi` · `horror` · `romance` · `war` · `history` · `music` · `western`

### Curated
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/top-rated` | Top rated |
| GET | `/api/v1/popular` | Popular |
| GET | `/api/v1/recommended` | Recommended |

### Metadata
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/subtitles/:id` | Subtitles |
| GET | `/api/v1/cast/:id` | Cast & crew |
| GET | `/api/v1/trailers/:id` | Trailers |
| GET | `/api/v1/recommendations/:id` | Similar content |
| GET | `/api/v1/episodes/:id?season=1` | Episodes for season |
| GET | `/api/v1/seasons/:id` | All seasons |

### User (Future-ready)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/continue-watching` | Continue watching |
| GET | `/api/v1/favorites` | Favourites |

### Power-user
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/endpoint?path=/your-path` | Call any MovieBox endpoint |

---

## Query Parameters

Most list endpoints support:

| Param | Default | Description |
|---|---|---|
| `page` | `1` | Page number |
| `limit` | `20` | Items per page (max 100) |
| `type` | | Filter by content type |

---

## Response Shape

**Success**
```json
{
  "success": true,
  "data": { }
}
```

**Error**
```json
{
  "success": false,
  "status": 404,
  "error": "NotFound",
  "message": "Route GET /api/v1/unknown not found"
}
```

---

## Environment Variables

See `.env.example` for all available variables.

---

## Deployment

### Render (recommended for free tier)

Push to GitHub, then connect the repo on [render.com](https://render.com). The `render.yaml` is pre-configured.

### Docker

```bash
docker build -t cymor-movie-api .
docker run -p 5000:5000 --env-file .env cymor-movie-api
```

---

## Architecture

```
Client
  ↓
Express Route  (routes/movie.routes.js)
  ↓
Controller     (controllers/movie.controller.js)
  ↓
Service        (services/moviebox.service.js)  ← cache layer
  ↓
Axios Client   (config/axios.js)               ← signing, retries
  ↓
MovieBox API   (h5-api.aoneroom.com)
```

---

## Credits

Built with ❤️ by **Legendary Smiley Cymor** — Cymor Tech Services, Kenya.

Disclaimer: This is an unofficial wrapper. All video content belongs to its original creators.

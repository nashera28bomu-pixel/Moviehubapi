🎬 Cymor Movie API

«A fast, modern, production-ready REST API built with Node.js that wraps the MovieBox API into a clean, developer-friendly interface.»

Created by Legendary Smiley Cymor.

---

✨ Features

- 🚀 High-performance REST API
- 🎬 Trending Movies
- 📺 TV Series
- 🍿 Anime
- 🔍 Powerful Search
- 📖 Movie & Series Details
- ▶️ Streaming Information
- ⬇️ Download Links
- ⚡ In-memory caching for improved performance
- 🔒 Automatic request signing
- 🔄 Runtime token management
- 📱 Mobile client emulation
- 🛡️ Centralized error handling
- 🐳 Docker support
- ☁️ One-click Render deployment

---

Technology Stack

- Node.js
- Express.js
- Axios
- NodeCache
- Dotenv

---

Project Structure

src/
├── config/
├── controllers/
├── middlewares/
├── routes/
├── services/
├── utils/
├── app.js
└── server.js

---

Installation

Clone the repository.

git clone https://github.com/YOUR_USERNAME/cymor-movie-api.git

Move into the project.

cd cymor-movie-api

Install dependencies.

npm install

Create your environment file.

cp .env.example .env

Start the development server.

npm run dev

Start production.

npm start

---

Environment Variables

Create a ".env" file.

PORT=3000

NODE_ENV=development

API_BASE_URL=https://your-moviebox-endpoint.com

AUTH_TOKEN=

CLIENT_INFO=android/17.5.0

USER_AGENT=okhttp/4.12.0

CACHE_TTL=300

REQUEST_TIMEOUT=30000

«Leave "AUTH_TOKEN" empty if your runtime authentication flow generates one automatically.»

---

API Endpoints

Health

GET /

---

Home

GET /api/home

---

Trending

GET /api/trending

---

Search

GET /api/search?keyword=avengers

Optional parameters

page
perPage
subjectType

---

Movie Details

GET /api/details/:subjectId

---

Stream

GET /api/stream/:subjectId

Optional query

season
episode

---

Downloads

GET /api/downloads/:subjectId

Optional query

season
episode

---

Categories

GET /api/movies

GET /api/series

GET /api/anime

GET /api/hollywood

GET /api/nollywood

GET /api/kdrama

GET /api/action

GET /api/comedy

GET /api/horror

GET /api/romance

GET /api/scifi

GET /api/documentary

GET /api/family

---

Authentication

This project uses a runtime authentication mechanism.

Requests are automatically signed before being sent to the upstream MovieBox service.

Session tokens are updated automatically whenever the upstream service returns a new runtime token.

No additional authentication is required to consume this API unless you add your own security layer.

---

Caching

Responses are cached automatically to reduce latency and minimize upstream requests.

Default cache durations:

- Home — 5 minutes
- Trending — 3 minutes
- Search — 2 minutes
- Details — 10 minutes
- Stream — 5 minutes
- Downloads — 5 minutes

---

Error Handling

All API errors return a consistent JSON structure.

{
  "success": false,
  "message": "Something went wrong."
}

---

Deployment

Docker

docker build -t cymor-movie-api .

docker run -p 3000:3000 cymor-movie-api

---

Render

Deploy directly using the included:

- Dockerfile
- render.yaml

No additional configuration is required beyond your environment variables.

---

Scripts

npm run dev

Development mode.

npm start

Production mode.

---

Performance

- Lightweight architecture
- Automatic request signing
- Runtime token management
- Smart response caching
- Minimal dependencies
- Optimized Axios instance
- Clean service architecture

---

Disclaimer

This project is an unofficial API wrapper built for educational and development purposes. It is not affiliated with, endorsed by, or sponsored by MovieBox or its owners. Ensure that your use of this project complies with all applicable laws and the terms of service of any upstream services you access.

---

Contributing

Pull requests, issue reports, feature suggestions, and improvements are welcome.

If you find a bug, please open an issue describing the problem and how to reproduce it.

---

License

MIT License

Copyright (c) 2026 Legendary Smiley Cymor

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files to deal in the Software without restriction, including the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.

---

Created with ❤️ by Legendary Smiley Cymor

Building fast, scalable APIs for developers around the world.

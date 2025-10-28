# Pixel-Battle-FE 🎨

[![Project Status](https://img.shields.io/badge/Status-Development-yellow)]()
[![Node](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-000000?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react&logoColor=000)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker)](https://www.docker.com/)

A blazing-fast Next.js frontend for the Pixel Battle experience. Draw on a shared pixel canvas in real time with zoom, pan, grid, and instant updates via WebSockets.

> ⚠️ The project is under active development.

---

## ✨ Core Features

- Real-time pixel sync
  - STOMP over SockJS WebSocket updates (topic: `/topic/pixels`)
  - Instant rendering without page reloads
- Interactive Canvas
  - Smooth zooming (mouse wheel) and panning (right mouse drag)
  - Optional grid overlay for precise placement
- Color Palette
  - Handy color picker with quick selection
- Auth-ready API client
  - Login/Register/Logout flows, token refresh handling
- Production-ready tooling
  - Next.js 15, React 19, TypeScript, Tailwind CSS 4
  - Dockerfile and docker-compose with Nginx reverse proxy

---

## 🧰 Tech Stack

- Framework: Next.js 15 (React 19)
- Language: TypeScript
- Styles: Tailwind CSS 4
- Realtime: STOMP + SockJS
- Containerization: Docker, docker-compose, Nginx proxy

---

## ⚙️ Requirements

- Node.js 20+ (matches the Docker image)
- npm 10+

---

## 🔧 Configuration

This app talks to a backend API and WebSocket gateway. Configure via environment variables (create `.env.local` for local dev):

- NEXT_PUBLIC_API_URL: Base HTTP API URL (default: `https://pixel-battle.zebaro.dev/api/v1`)
- NEXT_PUBLIC_WS_URL: WebSocket endpoint (default: `https://pixel-battle.zebaro.dev/ws`)

Docker proxy config expects a backend reachable as `pixel-battle-be:8080` for both `/api` and `/ws` routes (see `proxy/nginx.conf`). Adjust if your backend differs.

---

## 🚀 Getting Started (Local)

1. Install dependencies
   ```bash
   npm ci
   ```

2. Run the dev server
   ```bash
   npm run dev
   ```

3. Open the app at
   - http://localhost:3000

Useful scripts
- Build: `npm run build`
- Start (prod): `npm start`
- Lint: `npm run lint`

---

## 🐳 Run with Docker

Using docker-compose with an Nginx reverse proxy.

1. Optional: set the external port in a `.env` file (used by `docker-compose.yml`)
   ```env
   SERVER_PORT=8080
   ```

2. Build and start
   ```bash
   docker compose up -d --build
   ```

3. Open the app at
   - http://localhost:${SERVER_PORT:-80}

Notes
- The FE container exposes port 3000 internally; Nginx publishes `${SERVER_PORT}`.
- The proxy forwards `/api` and `/ws` to `pixel-battle-be:8080`. Ensure your backend is available at that host:port (e.g., by running it on the same Docker network with that service name).

---

## 🧱 Project Structure (high level)

- `src/`
  - `components/` — UI components (Canvas, Color Picker, User Status, etc.)
  - `context/` — API client provider
  - `services/` — `ApiClient`, `WebSocket` (STOMP + SockJS), `PixelCanvas`, etc.
- `proxy/` — Nginx config used in docker-compose
- `Dockerfile`, `docker-compose.yml` — containerization setup

---

## 🧪 Development Notes

- API client defaults can be overridden via env vars; see Configuration.
- WebSocket topic used by the app: `/topic/pixels`.
- Canvas controls
  - Zoom: mouse wheel
  - Pan: hold right mouse button and drag
  - Place pixel: left click

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or pull requests.
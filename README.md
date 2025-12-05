# DevOps Skribbl

A DevOps-themed multiplayer drawing and guessing game.

## Tech Stack
- Frontend: Next.js (App Router), React, Tailwind CSS
- Backend: Custom Node.js Server with Socket.io
- Database: PostgreSQL
- Deployment: Helm Charts (OpenShift/K8s)
- Local Dev: Docker Compose

## Quick Start

### Local Development

1. **Start the stack**
   ```bash
   docker-compose up -d
   ```
   This will start the Postgres database and the Next.js app.

2. **Access the Application**
   Open [http://localhost:3000](http://localhost:3000)

3. **Development Mode**
   The `app` service is mounted comfortably for development. Changes in `app/src` will hot-reload.
   Note: Modifications to `server.js` (backend logic) require restarting the container:
   ```bash
   docker-compose restart app
   ```

### Project Structure
- `app/`: Next.js Application source code
  - `src/app`: Pages and Layouts
  - `src/components`: UI Components (Canvas, Chat, Scoreboard)
  - `src/lib`: Utilities (Socket.io client)
  - `server.js`: Custom server entry point (Socket.io + Next.js)
- `charts/`: Helm Charts for Kubernetes deployment
- `docs/`: Design assets and documentation

## Deployment

To deploy to Kubernetes/OpenShift:

```bash
helm upgrade --install devops-skribbl ./charts/devops-skribbl
```

Ensure you have a PostgreSQL instance available or enabled in values.yaml.

## Features
- **Real-time Drawing**: Collaborative canvas using Socket.io
- **Chat**: Real-time guessing system
- **DevOps Theme**: Terminal-inspired UI

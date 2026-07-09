# CodePark Standalone Marketing Demo (`codepark-demo`)

⚠️ **IMPORTANT: DO NOT DELETE, MERGE, OR DESTROY THIS DIRECTORY.** 
This folder is managed as a completely independent codebase and is pushed to its own separate repository on GitHub (**`codepark-demo`**). It must never be merged back into the main `frontend/` directory of the production application.

---

## Purpose
This repository serves as a **standalone, zero-dependency client-side marketing preview** of CodePark. It is used for:
*   Investor presentations and pitches
*   Public live demonstrations and website previews
*   Recording product walkthroughs, screenshots, and videos

By running completely in the browser, it requires **zero backend servers**, docker containers, or databases, allowing it to load instantly and run offline on services like Vercel.

---

## Architectural Isolation
This codebase contains mock configurations that completely stub out all cloud and backend services:
1.  **Fake Database (`src/demo/fakeDatabase.ts`)**: In-memory data store containing template projects (e.g. `ai-dashboard`, `rest-api-server`), active files, and users.
2.  **Fake Sockets (`src/demo/fakeSocket.ts`)**: Simulates a live WebSocket server.
    *   Echoes terminal keystrokes and runs terminal shell commands offline.
    *   Fires Yjs client awareness updates to render active cursor flags (`Alice` & `Bob`) typing and editing code in real-time.
3.  **Fake APIs (`src/demo/fakeApi.ts`, `fakeAuth.ts`)**: Simulates user authentication (supports any username sign-in) and social endpoints (friends lists, logs, and activity graphs).

---

## Deployment & Verification
To test changes locally:
```bash
npm run dev
```

To build production client assets:
```bash
npm run build
```

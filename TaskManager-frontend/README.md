# Task Manager frontend

React and Vite client for the Task Manager API. The Projects and Contact routes use
`React.lazy()` and `Suspense`, so Vite creates separate chunks that download only when
the corresponding navigation item is opened.

## Run

Start the API first in `../TaskManagerAPI`, then run:

```bash
npm install
npm run dev
```

Open the local Vite address shown in the terminal (normally `http://localhost:5173`). The client connects to the API at `http://localhost:3000/tasks`.

## Performance evidence

Before optimization, the existing Vite build had one JavaScript bundle:
`index-BfeLHoQV.js` (195.65 kB uncompressed). The verified optimized build produces
`ProjectsPage-Cyno2hX6.js` (0.93 kB) and `ContactPage-B3Kcm37E.js` (0.96 kB) as separate
chunks; the initial bundle is `index-D_zugUFr.js` (235.71 kB, including React Router).

In browser DevTools, reload the Tasks route, then open Projects and Contact with Network
throttled to Slow 3G: each route chunk appears only on navigation and the "Loading page…"
fallback is displayed while it loads.

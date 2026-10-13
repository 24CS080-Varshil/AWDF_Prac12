# Task Manager API

Express and MongoDB API for the Task Manager application.

## Run

```bash
npm install
Copy-Item .env.example .env
npm start
```

Start a local MongoDB server before running the API. By default, the application connects to `mongodb://127.0.0.1:27017/taskmanager`; change `MONGODB_URI` in `.env` if needed.

Set `JWT_SECRET` in `.env` to a long, random value. The API will not start without it.

The API starts at `http://localhost:3000` after MongoDB connects.

## Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/tasks` | List tasks |
| `POST` | `/tasks` | Create a task |
| `PUT` | `/tasks/:id` | Update one or more task fields |
| `DELETE` | `/tasks/:id` | Delete a task |
| `GET` | `/tasks/:id` | Get one task |
| `GET` | `/tasks/debug/cache` | Inspect cache hit/miss metrics |

## Authentication

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/auth/register` | Register with an email and password of at least 8 characters |
| `POST` | `/auth/login` | Receive a JWT valid for one hour |
| `GET` | `/auth/me` | Return the user represented by the JWT |

All `/tasks` endpoints require `Authorization: Bearer <token>`. Tasks belong to their creator and are only accessible by that user.

Task data is stored in the local `taskmanager` MongoDB database and persists after an API restart.

## In-memory cache

`node-cache` caches task responses for 60 seconds. Cache keys include the authenticated user's ID, so cached data cannot cross account boundaries:

- `GET /tasks` caches that user's task list.
- `GET /tasks/:id` caches that user's individual task.
- A successful `POST /tasks` invalidates the list cache.
- A successful `PUT` or `DELETE` invalidates both the relevant task and the user's list cache.

The cache is process-local and is cleared whenever the server restarts. It is therefore appropriate for this single-server lab but not for a multi-instance deployment, where a shared cache such as Redis would be needed.

### Response-time lab readings

Use the same authenticated request and database state for every sample. Start with an empty cache (restart the API, or wait for its 60-second TTL), record the first `GET /tasks` as uncached, then immediately repeat the request for cached readings. Fill this table from Postman or Thunder Client's **Time** field; real timings depend on the local machine and dataset.

| Condition | Sample 1 | Sample 2 | Sample 3 |
| --- | ---: | ---: | ---: |
| Uncached (`GET /tasks` after cache expiry) | _recorded in client_ | _recorded in client_ | _recorded in client_ |
| Cached (repeat `GET /tasks` within 60 seconds) | _recorded in client_ | _recorded in client_ | _recorded in client_ |

Call `GET /tasks/debug/cache` with the same bearer token to confirm hits and misses while measuring.

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

## Authentication

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/auth/register` | Register with an email and password of at least 8 characters |
| `POST` | `/auth/login` | Receive a JWT valid for one hour |
| `GET` | `/auth/me` | Return the user represented by the JWT |

All `/tasks` endpoints require `Authorization: Bearer <token>`. Tasks belong to their creator and are only accessible by that user.

Task data is stored in the local `taskmanager` MongoDB database and persists after an API restart.

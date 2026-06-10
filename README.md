# Full stack React/FastAPI basic todo app

No user accounts yet.

## Requirements

### Front

- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)


### Back

- [Python](https://www.python.org/downloads/)
- [uv](https://docs.astral.sh/uv/getting-started/installation/) (package manager)
- [PostgreSQL](https://www.postgresql.org/download/)

## Setup

For both parts, create `.env` files according to the given `.env.dev`.

### Front

From `./frontend/`, install the dependencies with:

```console
% npm install
```

### Back

From `./backend/`:

- install the dependencies:

```console
% uv sync
```

- run the migrations:

```console
% uv run alembic upgrade head
```

## How to run

Both parts have to be launched separately

### Front

From `./frontend/`:

```console
% npm run dev
```

To access: `http://localhost:5173`.

### Back

From `./backend/`:

```console
% uv run fastapi dev app/main.py
```

To access: `http://localhost:5173`.

## Development

In the backend, if you add or modify models (in `./backend/models/`):

- add it to `./backend/models/__init__.py`
- generate a revision

```console
% uv run alembic revision --autogenerate -m "Migration message"
```

- run the migration

```console
% uv run alembic upgrade head
```

Note: the commands above have to be run from `./backend/`
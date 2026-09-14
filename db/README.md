# Database migrations

MariaDB is required for auth and general operation. Server-only env vars: `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`, `DATABASE_PREFIX`. Copy them from `example.env` into `.env`.

1. If not already installed, Install MariaDB
2. Make sure the database named in `.env` under `DATABASE_NAME` exists. Create it if not.
3. If you are using an existing database that is used for other websites you should enter a `DATABASE_PREFIX` in `.env`
4. `npm run migrate:up` — applies pending `db/migrations/*.up.sql` files and records versions in `schema_migrations`.
5. `npm run migrate:down` — rolls back **one** version using the matching `*.down.sql`.

Same steps on the web server. Backup before `up` in production. The first migration is a dummy health check table so you can run up → down → up before any auth schema exists.

# Setup

Be sure to set up your database prior to running migrations. The migrations process assumes that your database already has a user and a database waiting and the environment variables are pre configured.

## Environment

The following environment variables must be established in your `.env` file:

```shell
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=next_gallery
DATABASE_PASSWORD=choose-a-password
DATABASE_NAME=next_gallery
DATABASE_PREFIX=NEXT_GALLERY_ #optional
```

## Initialisation

Before running any migrations you need to set up a user for the app and a database. See the following MySQL:

```sql
  CREATE DATABASE next_gallery CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

  CREATE USER 'next_gallery'@'localhost' IDENTIFIED BY 'choose-a-password';

  GRANT ALL PRIVILEGES ON next_gallery.* TO 'next_gallery'@'localhost';
  FLUSH PRIVILEGES;
```

## Convention

Convention:

- one change per migration
- reversible SQL (or Knex up/down)
- Comment any `down` that destroys data
- Migration files in /migrations and use the following name format
  - 001_description.up.sql
  - 001_description.down.sql

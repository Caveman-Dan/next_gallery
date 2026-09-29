# Database

MariaDB holds auth, sessions, and album grants. Image files stay on `next_gallery_api`.

Server-only env vars (copy from `.env.example` into `.env`, never commit `.env`):

```shell
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=next_gallery
DATABASE_PASSWORD=choose-a-password
DATABASE_NAME=next_gallery
DATABASE_PREFIX=NEXT_GALLERY_   # optional — see below
```

`mysqldump` and `mysql` must be on the PATH for backup and restore.

---

## Dedicated database vs shared database

**Dedicated (this app owns the schema)**  
Leave `DATABASE_PREFIX` empty. Migrations, backups, and restores use every table in `DATABASE_NAME`.

**Shared (same MariaDB as other sites)**  
Set `DATABASE_PREFIX` (letters, numbers, underscore only), e.g. `NEXT_GALLERY_`.  
All Gallery tables are prefixed (`NEXT_GALLERY_users`, `NEXT_GALLERY_schema_migrations`, …). Backups dump only those names. Other sites are not touched.

This app never runs `CREATE DATABASE`. Create the database (and user) yourself.

---

## First-time setup

1. Install MariaDB if needed.
2. Create the database and user. Dedicated example:

```sql
CREATE DATABASE next_gallery CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'next_gallery'@'localhost' IDENTIFIED BY 'choose-a-password';
GRANT ALL PRIVILEGES ON next_gallery.* TO 'next_gallery'@'localhost';
FLUSH PRIVILEGES;
```

On a shared host, use the database you already have and set `DATABASE_PREFIX` instead of creating a new schema.

3. Fill in `.env`.
4. `npm run migrate:up`
5. `npm run db:seed-admin` — only when no admin exists. Email and password are typed at the prompt (not stored in `.env`).
6. Guest/Public access profile is created by migration `002`.

Same steps on the web server. Serve the app over HTTPS so `Secure` session cookies work.

---

## Migrations

```bash
npm run migrate:up      # apply all pending *.up.sql
npm run migrate:down    # roll back one version with the matching *.down.sql
```

Versions are recorded in `{DATABASE_PREFIX}schema_migrations`.

Before **every** `up` and `down`, migrate writes a snapshot to `db/backups/` (gitignored). If there are no Gallery tables yet, it logs that and continues.

Convention:

- one change per version
- matching `001_description.up.sql` and `001_description.down.sql`
- comment any `down` that destroys data
- SQL uses `__PREFIX__` so the runner can apply `DATABASE_PREFIX`

`down` runs the SQL file. It does **not** restore a dump. Use restore when you want the exact snapshot.

---

## Backup and restore

```bash
npm run db:backup
npm run db:restore -- db/backups/YYYY-MM-DDTHH-mm-ss-sssZ_manual.sql
```

- Prefix set: only `{PREFIX}*` tables are dumped or replaced.
- Prefix empty: the whole `DATABASE_NAME` schema is dumped or replaced.
- Dumps include `DROP TABLE` so a restore can recreate those tables. Nothing is dropped until you run restore.
- `db:restore` writes a `*_before-restore.sql` snapshot first, then applies the file you passed. If there are no Gallery tables yet, it logs that and continues.
- Dumps contain password hashes and session ids. Keep `db/backups/` off git and off shared disks.

---

## Production checklist

1. Backup (automatic on migrate, or `npm run db:backup`).
2. `npm run migrate:up`
3. If this is a new environment and no admin exists: `npm run db:seed-admin`
4. Confirm HTTPS on the public URL.
5. If a migrate must be undone: `npm run migrate:down` (one version). If the schema and data must match a snapshot: `npm run db:restore -- <file>` (a `before-restore` dump is written first).

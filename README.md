# Next Gallery

Photo gallery interface by Dan Marston. It is a working example of the Next.js App Router, and the site he uses to keep that example current.

Live site: [https://www.waxworlds.org/dan/next_gallery](https://www.waxworlds.org/dan/next_gallery)

Work in progress. Album browsing, sign-in, and admin access control are in. Upload, album creation, and a gallery landing page are not.

## What it is

Two repositories:

| Repo | Role |
| --- | --- |
| [next_gallery](https://github.com/Caveman-Dan/next_gallery) | This app. Interface, sessions, and album grants. |
| [next_gallery_api](https://github.com/Caveman-Dan/next_gallery_api) | Image server and content delivery network (CDN). Lists folders, serves bytes, resizes with sharp. |

The image API is a stable contract. This app does not store photos and does not reimplement listing or resizing. Auth does not live on the API.

A visitor with no session is a guest. Guests never log in. They see whatever the reserved Public access profile allows. Signup creates a pending user. Pending users can sign in, but album reads still use that Public profile until an admin activates them. An active user sees one access profile. An admin sees every album.

## Stack

- Next.js App Router, React 19, TypeScript (`strict`)
- SCSS modules, shared theme colours, `next-themes`
- `@react-spring/web` for the homemade motion
- SVGR (Scalable Vector Graphics React) for icons
- MariaDB via `mysql2`, Argon2id passwords, versioned SQL migrations
- Session cookie: `httpOnly`, `Secure` in production, `SameSite=Lax`, path set to `BASE_PATH`

No NextAuth / Auth.js. No object mapper.

## Features

- Mobile-first layout, light and dark themes
- Spring-driven sidebar, accordion, select, text inputs, ripple buttons, and a sticky home bar
- Accordion built from the album folder tree, any depth
- Album grid and image view. Image URLs are short-lived signed links. The API rejects a bad or expired signature
- Login, logout, signup
- User profile: name, email, phone, password. Anonymous visitors are sent to login
- Admin: approve or disable users, assign one profile, grant or revoke admin. The last admin cannot be removed
- Admin: create, rename, and delete access profiles, and tick albums onto a profile. The Public profile is reserved. Editing a profile updates everyone on it, including guests

Not in this pass: creating albums, uploading photos, a configurable recent-uploads page, per-user grants on top of a profile, and CSRF (Cross-Site Request Forgery) tokens. Cookie-authenticated JSON APIs are not exposed yet, so those tokens are not required.

## Requirements

- Node.js current enough for Next.js 16
- MariaDB
- The image API running and reachable at `API` (default `http://localhost:8983`)
- `mysqldump` and `mysql` on `PATH` if you want backup and restore

## Setup

1. Clone this repo and install.

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env`. Do not commit `.env`.

   Server-only values this app needs:

   - `BASE_PATH` — public path prefix. Production is `/dan/next_gallery`. Empty for a local root deploy.
   - `API`, `API_GET_ALBUMS`, `API_GET_IMAGES`, `API_GET_IMAGE` — image server. Not exposed to the browser.
   - `NEXT_PUBLIC_API_GET_IMAGE` — same image path, used by the browser. Requests are rewritten to the API.
   - `IMAGE_SIGNING_SECRET` — 32 or more random bytes. Must match the API.
   - `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`
   - `DATABASE_PREFIX` — leave empty if this app owns the database. Set it (for example `NEXT_GALLERY_`) on a shared database so Gallery tables do not collide with anything else.

3. Create the database and user yourself. This app never runs `CREATE DATABASE`. Example and prefix rules are in [db/README.md](db/README.md).

4. Apply migrations, then seed the first admin. Seed only runs when no admin exists. Email and password are typed at the prompt, not stored in `.env`.

   ```bash
   npm run migrate:up
   npm run db:seed-admin
   ```

   Migration `002` creates the reserved Public access profile.

5. Start the image API, then this app.

   ```bash
   npm run dev
   ```

Serve production over HTTPS (Hypertext Transfer Protocol Secure) so the `Secure` session cookie is sent.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Next dev server, `.env` loaded |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` / `npm run typecheck` | ESLint and `tsc --noEmit` |
| `npm test` / `npm run test:watch` | Vitest once, or watch mode |
| `npm run test:e2e` | Playwright against the local app. Loads `.env` |
| `npm run migrate:up` | Apply pending `db/migrations/*.up.sql` |
| `npm run migrate:down` | Roll back one version with the matching `*.down.sql` |
| `npm run db:seed-admin` | Create the first admin, if none exists |
| `npm run db:backup` / `npm run db:restore` | Dump or restore Gallery tables |

`migrate:up` and `migrate:down` write a snapshot to `db/backups/` first (gitignored). `down` runs the down SQL. It does not restore that snapshot. Use restore for an exact copy. Back up before either command in production.

## Layout

```text
src/app
  gallery/          routes: album, image, admin, user profile
  ui/               interface. Shared kit under ui/components
  lib/              server actions, sessions, grants, API fetch
  style/            theme colours, breakpoints, global SCSS imports
db/migrations       one up/down pair per version
e2e/                Playwright browser specs
```

`@/*` maps to `src/app/*`.

## Testing

Unit tests sit next to the file they cover (`*.test.ts`, and `*.test.tsx` for a component). They use Vitest. Database, Argon2id, and Next.js navigation are mocked, so `npm test` does not need MariaDB or the image API. The pre-push hook runs lint, the typecheck, Vitest, and the browser suite.

Browser tests live in `e2e/` and use Playwright. They drive the real app, so they need `.env`, MariaDB, and the image API. `npm run test:e2e` loads `.env` and reuses a dev server already on `PORT`. If that port is not serving the login page, it starts one on port 3000. Next.js 16 will not run two `next dev` processes in this repo, so do not expect a second dev server beside the one on `8984`.

Playwright uses the installed Google Chrome (`channel: "chrome"`). Its bundled Chromium does not run on macOS 12. A path in `page.goto` must not start with `/`, or it drops `BASE_PATH`.

Sign-up specs insert a pending user at `e2e-…@example.com`. `e2e/global-teardown.ts` deletes those rows after the suite. Sessions cascade. It does not touch any other user.

`E2E_ADMIN_EMAIL` and `E2E_ADMIN_PASSWORD` in `.env` enable the admin browser spec. Leave them empty and that spec is skipped. The last-admin rule is already covered by the mocked server-action test.

## Access model

- No cookie: guest. Public profile only.
- Pending: may log in. Album reads still use the Public profile.
- Active user: their one access profile.
- Admin: every album, `/admin`, and the right to grant or revoke admin.

Listings from `getGalleryData` are filtered to the allowed paths. `getImages` returns 403 outside that set. Gallery cache tags are per principal, so a guest list and an admin list do not share an entry. Image bytes stay on the API. This app only signs a URL when the path is allowed.

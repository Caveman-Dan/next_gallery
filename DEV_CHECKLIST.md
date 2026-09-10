# Next Gallery — auth & access checklist

Working document for users, sessions, guest/public albums, and admin grants.  
Repo: **frontend** (`next_gallery`). Image bytes stay on `next_gallery_api` except a later `get_image` gate.

Update this file as items land. Tick boxes in the same commit as the work when practical.

Last updated: 10 Sep 2026.

---

## Decisions (locked unless we change them)

- Identity, sessions, and album grants live in **this Next repo** with **MariaDB**.
- `next_gallery_api` stays the file/CDN server. Do not move listings or image serving into Next route handlers.
- Guest **never logs in**. No session cookie → guest/public grants.
- Signup creates a **pending** user. An admin must activate them and assign an access profile.
- Pending users **may log in**. Album reads still use the **guest** profile until `status = active`, so they do not see less than an anonymous visitor.
- Roles: `admin` | `user`.
  - **Admin** sees every album, uses `/admin`, approves users, assigns access profiles, and may grant or revoke `admin`.
  - There must **always be at least one admin**. Cannot demote, disable, or delete the last admin.
- Seed the first account as **admin**.
- Non-admins get **one access profile** (named set of album paths). Guest/public is a reserved profile the admin edits like any other.
- No NextAuth / Auth.js. No extra CSRF tokens until we add cookie-authenticated JSON APIs.
- Session cookie: httpOnly, Secure, SameSite=Lax. Server session row in MariaDB.
- Operator UI is `/admin` (rename Settings). Visible to admin. `/UserProfile` is the signed-in user editing themselves.
- DB changes go through **versioned migrations with up and down**.
- `/gallery` landing content is later.
- No separate `owner` role.

---

## 0. Database deploy system (start here)

- [ ] Add MariaDB env vars in this repo (`DATABASE_URL` or host / user / password / name). Server-only; do not expose to the browser.
- [ ] Add a `schema_migrations` table (version, applied_at).
- [ ] Add `migrate up` and `migrate down` npm scripts wrapping a small runner.
- [ ] Convention: one change per version, reversible SQL (or Knex up/down). Comment any `down` that destroys data.
- [ ] Document: install MariaDB → create empty database → `migrate up` → seed. Same steps on the web server.
- [ ] Smoke-test on a throwaway database: up, down, up again.

## 1. Baseline schema + seed

- [ ] Migration: `users`, `sessions`, `access_profiles`, `access_profile_albums`.
- [ ] `users`: unique email, password_hash, names, phone, `role` (`admin` | `user`), `status` (`pending` | `active` | `disabled`), `access_profile_id`, timestamps.
- [ ] Seed a reserved `guest` access profile (not a login account).
- [ ] Seed the first **admin** from env (`ADMIN_EMAIL`, `ADMIN_PASSWORD`) only when no admin exists.
- [ ] Guard: cannot demote, disable, or delete the last admin.
- [ ] Confirm `down` drops these tables in FK-safe order.

## 2. Session + password helpers (this repo, server-only)

- [ ] Hash and verify passwords (Argon2 or bcrypt). Never store plaintext.
- [ ] Create / read / delete sessions in MariaDB.
- [ ] Set and clear the session cookie (httpOnly, Secure, SameSite=Lax, Path=/).
- [ ] Resolve current principal: admin / active user / pending user / guest.
- [ ] Resolve allowed album paths for that principal:
  - admin → all albums
  - pending or anonymous → guest profile
  - active user → their access profile

## 3. Login / logout / signup

- [ ] Wire existing `/login` server action: verify credentials, reject `disabled`, start session.
- [ ] Pending users can log in; gallery listing still uses the guest profile.
- [ ] Logout deletes the session row and cookie.
- [ ] Signup creates `status = pending`, `role = user`, no profile. Do not auto-activate.
- [ ] Generic auth error messages (do not reveal whether an email exists on login).

## 4. Enforce grants on listings

- [ ] Filter `getGalleryData` tree by allowed album paths.
- [ ] Reject `getImages` when the album is outside the grant set.
- [ ] Per-user (or uncached) Next cache tags so guest and admin lists do not share one cache entry.
- [ ] Accordion / sidebar only renders what the server action returned.

## 5. `/UserProfile`

- [ ] Show details for the session user. Pending banner if not yet approved.
- [ ] Edit name / email / phone with the existing form components.
- [ ] Change password (current + new).
- [ ] Anonymous visitors redirect to `/login`.

## 6. Rename Settings → `/admin`

- [ ] Add `/admin`. Redirect `/Settings` if we want a clean break.
- [ ] Sidebar label **Admin**, visible when `role` is `admin`.
- [ ] Non-admins hitting `/admin` get 404 or home, not a half-rendered page.

## 7. Admin: users

- [ ] List pending signups. Approve (`active` + assign profile) or deny / disable.
- [ ] List active users. Assign one access profile. Grant or revoke admin (last-admin guard).
- [ ] Never display password hashes.

## 8. Admin: access profiles

- [ ] CRUD named profiles. `guest` / public profile is reserved.
- [ ] Tick albums from the gallery tree onto a profile.
- [ ] Assigning a profile is the v1 fast path. No per-user extra grants yet.
- [ ] Editing a profile updates every user on it (including guest/public).

## 9. Image bytes (API repo, minimal)

Call this out as an API change before writing it. Keep it small.

- [ ] Next issues a short-lived signed URL (or token) only for allowed paths.
- [ ] `next_gallery_api` `get_image` rejects unsigned, expired, or wrong-path requests.
- [ ] Guest-allowed albums work with no login.

## 10. Deploy + harden

- [ ] Production: empty MariaDB → `migrate up` → seed admin + guest profile.
- [ ] Backup the database before `up` in production. Know how to `down` one version.
- [ ] HTTPS so `Secure` cookies work.
- [ ] Do not commit `.env` or seed passwords.

---

## Later (not this pass)

- [ ] `/gallery` landing content
- [ ] Per-user extra album overrides on top of a profile
- [ ] CSRF tokens if we add cookie-authenticated JSON APIs
- [ ] NextAuth / OAuth
- [ ] AWS / S3 / CloudFront signed URLs

---

## Suggested first commit after this file

Item **0** only: migration folder layout, `schema_migrations`, npm up/down scripts, and a dummy migration that applies and rolls back against MariaDB. No auth tables until that runner works.

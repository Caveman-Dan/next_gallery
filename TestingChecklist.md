# Next Gallery testing checklist

Frontend repo only: [next_gallery](https://github.com/Caveman-Dan/next_gallery).
Do not add tests that belong in Next Gallery API. Treat the image API as a stable contract and mock it.

There is no test runner today. `src/app/lib/formValidation/validatorTests.ts` is the validator implementations, not a test file.

Work top to bottom. Do not start Playwright until the pure-logic suites are green.

Legend: `[ ]` not started, `[~]` in progress, `[x]` done.

---

## 0. Decisions (lock these before writing tests)

- [x] Runner for unit and component tests: Vitest (not Jest). Native ECMAScript modules (ESM), works with the `@/*` path alias (`src/app/*`).
- [ ] Component tests: Vitest + React Testing Library + jsdom.
- [ ] Browser integration: Playwright, separate script, local app only. Never against production (`https://www.waxworlds.org/dan/next_gallery/gallery`).
- [ ] Colocate tests as `*.test.ts` / `*.test.tsx` next to the source file.
- [ ] Mock at the boundary (database, `fetch`, `next/headers`). Do not spin up MySQL for unit tests.
- [ ] Out of scope for unit tests: App Router `page.tsx` composition, SCSS modules, react-spring animation timing, the image API process.

---

## 1. Harness (frontend repo)

- [ ] Add dev dependencies: `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`.
- [ ] Create `vitest.config.ts`.
  - [ ] `environment: "jsdom"` for component tests; pure lib tests can stay on `node` via a docblock or project split.
  - [ ] Resolve `@` to `src/app` (same as `tsconfig.json` paths).
  - [ ] Exclude `node_modules`, `.next`, `db`.
- [ ] Add `src/test/setup.ts` that imports `@testing-library/jest-dom/vitest`.
- [ ] Add scripts to `package.json`: `"test": "vitest run"`, `"test:watch": "vitest"`.
- [ ] Confirm `npm test` exits 0 with no test files, or with a single smoke test.
- [ ] Add `*.test.ts` / `*.test.tsx` to ESLint if the current config ignores them. Do not weaken rules for tests.
- [ ] Optional later: Husky hook runs `npm test` on commit. Do not add this until the suite is fast.

---

## 2. Unit — album grant paths (do this first)

File: `src/app/lib/profileAlbumPaths.ts`
New file: `src/app/lib/profileAlbumPaths.test.ts`

Build one small fake `DirectoryTree` (the `directory-tree` node shape) and reuse it. Suggested tree:

```
root
  travel
    italy
      rome
      venice
    france
  home
    kitchen
```

- [ ] `relativeAlbumPath`
  - [ ] Node path equal to root returns `""`.
  - [ ] Strips a root prefix, with and without a trailing slash on the root.
  - [ ] Returns the node path unchanged when it is not under the root.
- [ ] `pathIsCovered`
  - [ ] Exact grant covers that path.
  - [ ] Parent grant covers a child (`travel` covers `travel/italy/rome`).
  - [ ] Child grant does not cover the parent.
  - [ ] Sibling grant does not cover (`travel/france` does not cover `travel/italy`).
  - [ ] Empty grants cover nothing.
- [ ] `collectDescendantPaths`
  - [ ] Returns every relative descendant, not the node itself.
  - [ ] Empty children returns `[]`.
- [ ] `nextAlbumPaths` — check (`nextChecked: true`)
  - [ ] Checking a leaf adds that path.
  - [ ] Checking a folder drops stored descendants of that folder and stores the folder.
  - [ ] Checking the last uncovered sibling promotes the parent (ancestor promotion).
  - [ ] Checking until the whole tree is covered promotes to the highest fully covered folder.
  - [ ] Checking a path already covered by an ancestor does not duplicate it (stored grant is the ancestor, or the path, but not both).
- [ ] `nextAlbumPaths` — uncheck (`nextChecked: false`)
  - [ ] Unchecking a stored path removes it and its stored descendants.
  - [ ] Unchecking a path under a stored ancestor expands the ancestor into sibling subtrees and keeps those (the indeterminate / partial case).
  - [ ] Unchecking the only child of a stored parent removes that parent and does not leave an empty grant.
  - [ ] Unchecking a path that is not stored and has no stored ancestor is a no-op.
  - [ ] Result is minimal: no path is stored if an ancestor is already stored (`minimalCover`).
- [ ] These cases match the admin checkbox rules: blue tick = row in the database, inherited children = full tick, partial descendants = indeterminate dash.

---

## 3. Unit — album visibility

File: `src/app/lib/albumAccess.ts`
New file: `src/app/lib/albumAccess.test.ts`

Use the same fake tree shape. `AlbumAccess` is `{ all: boolean; paths: string[] }`.

- [ ] `albumPathAllowed`
  - [ ] `access.all` allows every path, including empty and unknown.
  - [ ] Exact grant allows that album.
  - [ ] Grant allows descendants (`travel` allows `travel/italy/rome`).
  - [ ] Grant does not allow the parent or a sibling.
  - [ ] Leading and trailing slashes are normalised.
  - [ ] Empty `paths` denies everything when `all` is false.
- [ ] `filterAlbumTree`
  - [ ] `access.all` returns the tree unchanged.
  - [ ] A granted leaf keeps ancestor folders so the leaf can be reached.
  - [ ] Ungranted branches are removed.
  - [ ] A granted folder keeps its descendants.
  - [ ] Ancestor-only visibility does not imply the ancestor album itself is allowed (`albumPathAllowed` on the parent is still false). Call that out in a comment so the two functions are not confused.
  - [ ] Empty tree / missing `children` does not throw.

---

## 4. Unit — form validators (pure only)

Files:

- `src/app/lib/formValidation/validatorHelpers.ts`
- `src/app/lib/formValidation/validatorTests.ts` (implementations)
- `src/app/lib/formValidation/formValidation.ts`
- `src/app/lib/formValidation/formHelpers.ts`

Do not hit the database in this pass. Async validators that call `getUserByEmail` or `getPrincipal` are in section 8.

- [ ] `checkValidEmail`
  - [ ] Valid address returns true.
  - [ ] Empty string returns true (missing email is a different validator).
  - [ ] Non-string returns false.
  - [ ] Missing `@`, missing domain, spaces, returns false.
  - [ ] Trims before testing.
- [ ] `isFieldEmpty` — empty string is an error; non-empty is not; message comes from options.
- [ ] `isValidEmail` — delegates to `checkValidEmail`; empty is allowed here (same rule as the helper).
- [ ] `isMatchingPassword` — matches `formValues.newPassword`; mismatch returns the options message.
- [ ] `validateForm`
  - [ ] Unknown field calls `handleServerError` (mock it; it throws).
  - [ ] Stops at the first error on a field.
  - [ ] Writes `value`, `errors`, and pushed `messages` onto a copy of `initialState` (does not mutate the config object).
  - [ ] A passing test does not set `errors`.

---

## 5. Unit — privilege list sync

File: `src/app/ui/gallery/admin/privilegesList.ts`
New file: `src/app/ui/gallery/admin/privilegesList.test.ts`

- [ ] `syncKnownProfiles`
  - [ ] No change returns `null`.
  - [ ] A removed profile is appended to `leaving` and `knownProfiles` becomes the new list.
  - [ ] A profile already in `leaving` is not duplicated.
  - [ ] A length change that is not a removal (a profile added) updates `knownProfiles` and leaves `leaving` alone.
- [ ] `visiblePrivilegeProfiles`
  - [ ] Returns current profiles plus leaving profiles that are no longer in the list.
  - [ ] Does not duplicate a profile that is both current and leaving.

---

## 6. Unit — image URL signing

File: `src/app/lib/imageToken.ts`
New file: `src/app/lib/imageToken.test.ts`

- [ ] `signImagePath` throws if `IMAGE_SIGNING_SECRET` is unset.
- [ ] Same path and same clock produce the same HMAC (Hash-based Message Authentication Code).
- [ ] A different path or a different secret produces a different signature.
- [ ] `expires` is about 10 minutes ahead of the mocked clock (`TTL_SECONDS = 600`).
- [ ] `signedImageSrc` uses `NEXT_PUBLIC_API_GET_IMAGE`, then `API_GET_IMAGE`, then `/api/get_image`.
- [ ] Path segments are `encodeURIComponent`-encoded, including spaces and `#`.
- [ ] Query string is `exp` and `sig`.

---

## 7. Unit — small helpers

- [ ] `src/app/lib/helpers.tsx`
  - [ ] `apiError` shape: `{ error: true, status, message }`.
  - [ ] `isApiErrorResponse` true only for a non-array object with `error === true`.
  - [ ] `isGalleryCacheTag` matches exact tags and prefix tags that end with `:`.
  - [ ] `capitalise` uppercases the first character only.
  - [ ] `cropPath` decodes URI components and keeps `depth` segments.
  - [ ] `joinPath` strips slashes and drops empty parts.
  - [ ] `randomInt` stays inside the inclusive range (stub `Math.random`).
- [ ] `src/app/lib/password.ts`
  - [ ] `hashPassword` then `verifyPassword` accepts the same password and rejects a different one.
  - [ ] `verifyPassword` returns false on a garbage hash (does not throw).
  - [ ] `passwordNeedsRehash` is false for a hash just produced with the current options.
- [ ] `src/app/lib/errorHandling.ts` — `handleServerError` throws; `handleClientError` does not throw (assert current behaviour, do not redesign it here).
- [ ] `src/app/lib/fetchApiJson.ts` (mock `fetch`)
  - [ ] Missing `process.env.API` calls `handleServerError`.
  - [ ] Non-OK response returns `apiError` with the payload message, or `Request failed (status)`.
  - [ ] Non-JSON body returns status 502.
  - [ ] Timeout (`TimeoutError`) returns 504 and "The gallery API timed out".
  - [ ] Other fetch failure returns 503.
  - [ ] OK JSON is returned as `T`.
- [ ] `src/app/lib/sessionCookie.ts` — skip until `cookieOptions` is exported or extracted. Then assert `httpOnly`, `sameSite: "lax"`, `secure` only when `NODE_ENV === "production"`, `path` from `BASE_PATH` or `/`, and clear sets an expired cookie. Cookie name is `next_gallery_session` (`src/app/lib/authConfig.ts`).

---

## 8. Integration — database boundary (mocked MySQL, or a throwaway database)

Prefer a mocked `mysql2` pool first. A real database test is optional and must not use production credentials.

Auth roles in this repo: `guest | pending | user | admin`. Guest is not a login. Sessions are httpOnly, Secure in production, SameSite=Lax, Path=`BASE_PATH`.

- [ ] Mock `getUserByEmail`, `getPrincipal`, `verifyPassword` and cover:
  - [ ] `isValidLogin` — unknown email, bad password, `disabled` user, success.
  - [ ] `isEmailUnique` — taken vs free.
  - [ ] `isEmailUnusedByOthers` — own email allowed, someone else's email rejected, no principal rejected.
  - [ ] `isCurrentPassword` — no principal, wrong password, right password.
- [ ] `src/app/lib/serverActions.ts` with mocked db and mocked `fetch`:
  - [ ] `authenticateSignIn` sets the session cookie on success and returns field errors on failure.
  - [ ] `authenticateSignup` creates a pending user and does not log them in as admin.
  - [ ] `logout` clears the cookie.
  - [ ] `updateProfile` and `changePassword` refuse a guest / missing principal.
  - [ ] `adminDeleteUser`, `adminSetUserRole`, `adminToggleUserActive`, `adminSetUserProfile` refuse a non-admin.
  - [ ] `adminReplaceProfileAlbums` persists the path list from `nextAlbumPaths` and rejects a non-admin.
  - [ ] `adminSetProfilePublic` is the Public access profile path that controls guest albums.
  - [ ] `getGalleryData` / `getImages` return `ApiErrorResponse` when the API errors, and the tree / image list when it does not.
- [ ] `src/app/lib/db/dbAccess.ts` — `getPrincipal` maps no cookie to guest, a live session to user or admin, an expired session to guest.
- [ ] Do not test Argon2 cost parameters beyond the round-trip in section 7. Seed admin stays in `db/seed-admin.ts` (Argon2id), not `.env`.

---

## 9. Component tests (only where there is behaviour)

Render with React Testing Library. Mock server actions. Do not assert spring pixel values.

- [ ] `src/app/ui/gallery/admin/ProfileAlbumGrant.tsx` — stored grant shows selected; inherited child shows selected; partial descendants show indeterminate (`aria-checked="mixed"` or the dash state this component actually uses).
- [ ] `src/app/ui/gallery/admin/ProfileAlbumsPanel.tsx` — toggling a row calls the replace-albums action with the array `nextAlbumPaths` would produce.
- [ ] `src/app/ui/login/LoginForm.tsx` — empty submit shows the configured messages; no network on failed client validation.
- [ ] `src/app/ui/sign-up/SignupForm.tsx` — password mismatch shows the matching-password message.
- [ ] `src/app/ui/gallery/UserProfile/PasswordForm.tsx` — current password and confirm fields surface validator messages.
- [ ] Skip burgers, spinners, skeletons, and theme toggle unless a bug fix needs a regression test.

---

## 10. Browser integration (Playwright, after sections 2–4 are green)

- [ ] Add Playwright as a dev dependency and `playwright.config.ts`. Base URL from an env var, default `http://127.0.0.1:3000`. Respect `BASE_PATH` if the app is not mounted at `/`.
- [ ] Script: `"test:e2e": "playwright test"`. Do not run this inside `npm test`.
- [ ] One spec: guest can open the gallery index and only sees albums allowed by the Public access profile.
- [ ] One spec: login with a seeded user, session cookie is httpOnly, album list matches that user's grants.
- [ ] One spec: admin opens Privileges, toggles an album grant, reload shows the same tick state (stored / inherited / partial).
- [ ] One spec: logout clears the session and the next request is guest.
- [ ] Fixture uses a local database or a fully mocked API. No calls to production.

---

## 11. Done when

- [ ] `npm test` is green on a clean checkout.
- [ ] `npm run typecheck` and `npm run lint` still pass.
- [ ] New tests live next to the module they cover.
- [ ] No production URL, no production database, no image-API server required for `npm test`.

# Next Gallery

## [Click here](http://www.waxworlds.org/dan/next_gallery) to see project

## !! This project is a work in progress !!

### Welcome to Next gallery.

This project has been created solely by Dan Marston for the purpose of providing an up to date example of his code and as a means to enhance his knowledge of the [Next.js](https://nextjs.org/docs#what-is-nextjs) framework.

## Features

- Infrastructure

  - Mobile first responsive design

  - Built with Next.js and React

  - Styling uses Next.js Modules implemented with SCSS

  - Switchable themes

- All home made components

  - Spring Physics
  - Animated select box (see [/gallery](www.waxworlds.org:8984/dan/next_gallery/gallery))
  - Animated side bar (see [/gallery](www.waxworlds.org:8984/dan/next_gallery/gallery))
  - Animated accordion menu (see sidebar at [/gallery](www.waxworlds.org:8984/dan/next_gallery/gallery))
    - Recursively generated from folder structure
    - Can handle unlimited depth
  - Animated text Input boxes (see [/login](www.waxworlds.org:8984/dan/next_gallery/login))
  - Animated rippling Buttons
  - Animated sticky sliding menu on scroll down (see [home](www.waxworlds.org:8984/dan/next_gallery))

## Database migrations

MariaDB is required for auth and album grants (coming next). Server-only env vars: `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`. Copy them from `example.env` into `.env`.

1. Install MariaDB and create an empty database named in `DATABASE_NAME`.
2. `npm install`
3. `npm run migrate:up` — applies pending `db/migrations/*.up.sql` files and records versions in `schema_migrations`.
4. `npm run migrate:down` — rolls back **one** version using the matching `*.down.sql`.

Same steps on the web server. Backup before `up` in production. The first migration is a dummy healthcheck table so you can run up → down → up before any auth schema exists.

## Coming soon

- Session management
  - Next Auth token exchange login system
  - Session token exchange
  - Cserf token exchange
- Admin utilities
  - Create new albums/categories
  - Upload photos
  - Access control
    - Manageable user access to galleries
    - Manageable guest access
- User profile page
- Photo galleries
  - Image download system
- Configurable Recent uploads overview page

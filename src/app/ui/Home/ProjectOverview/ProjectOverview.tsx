import Link from "next/link";

import Architecture from "./diagrams/Architecture.svg";
import Caching from "./diagrams/Caching.svg";
import Database from "./diagrams/Database.svg";
import ImageToken from "./diagrams/ImageToken.svg";
import SpringSection from "./SpringSection";

import styles from "./ProjectOverview.module.scss";

const ProjectOverview = () => (
  <article className={styles.root}>
    <SpringSection index={0} className={styles.hero}>
      <p className={styles.kicker}>Personal project · Next.js 16</p>
      <h1>Next Gallery</h1>
      <p className={styles.lede}>
        A private photography gallery with real accounts, per-album grants, and a separate image CDN. Built to show how
        I structure a full-stack app: auth in the UI repo, bytes on a Node API, MariaDB for identity, short-lived HMAC
        URLs for files.
      </p>
      <p className={styles.byline}>Dan Marston</p>
      <ul className={styles.links}>
        <li>
          <Link href="/gallery">Open the gallery</Link>
        </li>
        <li>
          <a href="https://github.com/Caveman-Dan/next_gallery" rel="noreferrer" target="_blank">
            Frontend repo
          </a>
        </li>
        <li>
          <a href="https://github.com/Caveman-Dan/next_gallery_api" rel="noreferrer" target="_blank">
            Image API repo
          </a>
        </li>
      </ul>
    </SpringSection>

    <SpringSection index={1}>
      <h2>What it does</h2>
      <ul className={styles.bullets}>
        <li>Justified album thumbs and a full-image view, with a custom accordion sidebar.</li>
        <li>Guests see only albums on the reserved Public profile. No guest login.</li>
        <li>Signup creates a pending user. An admin activates them and assigns an access profile.</li>
        <li>Admins manage users and named album-grant profiles. The last admin cannot be removed.</li>
        <li>Image bytes are signed by Next and checked by the API. Listings stay grant-filtered in Next.</li>
      </ul>
    </SpringSection>

    <SpringSection index={2}>
      <h2>Stack</h2>
      <ul className={styles.chips}>
        <li>Next.js App Router</li>
        <li>React 19</li>
        <li>TypeScript</li>
        <li>SCSS modules</li>
        <li>MariaDB</li>
        <li>Argon2id</li>
        <li>httpOnly sessions</li>
        <li>Node + Express API</li>
        <li>sharp</li>
        <li>react-spring</li>
      </ul>
      <p>
        Components are hand-rolled (accordion, select, forms, ripples, mount fades) rather than pulled from a kit. Auth
        lives in this repo. The API is only list / resize / serve.
      </p>
    </SpringSection>

    <SpringSection index={3}>
      <h2>Two processes</h2>
      <p>
        Next owns people and grants. The API owns files. Apache can terminate TLS and reverse-proxy both. Next never
        streams originals through a Route Handler.
      </p>
      <Architecture className={styles.figure} />
    </SpringSection>

    <SpringSection index={4}>
      <h2>Who can see what</h2>
      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Principal</th>
              <th>Login</th>
              <th>Albums</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Guest</td>
              <td>None (no cookie)</td>
              <td>Public profile only</td>
            </tr>
            <tr>
              <td>Pending user</td>
              <td>Yes</td>
              <td>Still the Public profile until an admin activates them</td>
            </tr>
            <tr>
              <td>Active user</td>
              <td>Yes</td>
              <td>The access profile an admin assigned</td>
            </tr>
            <tr>
              <td>Admin</td>
              <td>Yes</td>
              <td>Every album, plus /gallery/admin</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Session cookie: httpOnly, Secure in production, SameSite=Lax, path includes <code>BASE_PATH</code>. Passwords
        are Argon2id. The first admin is created by an interactive seed script, not values in <code>.env</code>.
      </p>
    </SpringSection>

    <SpringSection index={5}>
      <h2>Database</h2>
      <p>
        Tables can live in their own schema or share a host database via <code>DATABASE_PREFIX</code>. Migrations are
        versioned <code>.up.sql</code> / <code>.down.sql</code>. Each migrate writes a mysqldump of Gallery tables only.
      </p>
      <Database className={styles.figure} />
      <p>
        Stored album paths are a cover set: a parent grant implies every descendant. The admin accordion explodes a
        parent into sibling paths when a child is unchecked.
      </p>
    </SpringSection>

    <SpringSection index={6}>
      <h2>Image tokens</h2>
      <p>
        <code>{"<img>"}</code> cannot send the session cookie to another origin. Next therefore signs a path after the
        grant check. The API only verifies the slip.
      </p>
      <ImageToken className={styles.figure} />
    </SpringSection>

    <SpringSection index={7}>
      <h2>Caching</h2>
      <Caching className={styles.figure} />
      <p>
        Admin edits call <code>revalidatePath</code> / tag updates so a changed grant does not sit in a shared list.
      </p>
    </SpringSection>

    <SpringSection index={8}>
      <h2>UI</h2>
      <p>
        The gallery chrome, homepage, and admin screens share theme tokens from SCSS colour profiles (light / dark via
        next-themes). Height changes use the same react-spring config. These sections use that accordion spring:
        translate plus a small overshoot, staggered down the page.
      </p>
    </SpringSection>

    <SpringSection index={9}>
      <h2>Operations</h2>
      <ul className={styles.bullets}>
        <li>
          <code>npm run migrate:up</code> / <code>down</code> — snapshot first, then SQL.
        </li>
        <li>
          <code>npm run db:backup</code> / <code>db:restore</code> — restore takes a <code>before-restore</code> dump.
        </li>
        <li>
          <code>npm run db:seed-admin</code> — prompt for email and password; refuses if an admin already exists.
        </li>
        <li>
          Production sits behind HTTPS (Apache). <code>src/proxy.ts</code> is a fallback 308 when{" "}
          <code>x-forwarded-proto</code> is not https.
        </li>
      </ul>
    </SpringSection>
  </article>
);

export default ProjectOverview;

import Link from "next/link";

import Architecture from "./diagrams/Architecture.svg";
import Caching from "./diagrams/Caching.svg";
import Database from "./diagrams/Database.svg";
import ImageToken from "./diagrams/ImageToken.svg";
import SpringSection from "./SpringSection";

import styles from "./ProjectOverview.module.scss";

const ProjectOverview = () => (
  <article className={styles.root}>
    <SpringSection className={styles.hero}>
      <p className={styles.kicker}>Personal project · Next.js 16</p>
      <h1>Next Gallery</h1>
      <p className={styles.lede}>
        A private photography gallery with real accounts, per-album grants, and a separate image CDN (Content Delivery
        Network). Built to show how I structure a full-stack app: auth in the UI repo, bytes on a Node API, MariaDB for
        identity, short-lived HMAC (Hash-based Message Authentication Code) URLs for files.
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

    <SpringSection>
      <h2>What it does</h2>
      <ul className={styles.bullets}>
        <li>Album pages lay thumbnails out in even rows, then open a full image. The sidebar is a custom accordion.</li>
        <li>Guests see only albums on the reserved Public profile without logging in.</li>
        <li>Signup creates a pending user. An admin activates them and assigns an access profile.</li>
        <li>Admins activate or remove users, set them as user or admin, and choose which album profiles they get.</li>
        <li>Admins can add, rename, update, and delete those profiles, then assign them to people.</li>
        <li>
          The gallery list is filtered in Next before it is shown. Each image URL is signed here and checked by the API,
          so a copied link expires.
        </li>
      </ul>
    </SpringSection>

    <SpringSection>
      <h2>Stack</h2>
      <ul className={styles.chips}>
        <li>Apache2</li>
        <li>Next.js App Router</li>
        <li>Node + Express API</li>
        <li>React 19</li>
        <li>MariaDB</li>
        <li>TypeScript</li>
        <li>SCSS modules</li>
        <li>Argon2id</li>
        <li>httpOnly sessions</li>
        <li>sharp</li>
        <li>react-spring</li>
      </ul>
      <p>Components are hand-written rather than pulled from a kit:</p>
      <ul className={styles.bullets}>
        <li>An accordion sidebar</li>
        <li>A select menu with a little bounce</li>
        <li>Buttons that ripple on click</li>
        <li>Short animations when panels open</li>
        <li>An image layout that unevenly aligns thumbnails for better aesthetics</li>
      </ul>
      <p>Accounts and permissions live in this Next.js app. The API only stores and serves the pictures.</p>
    </SpringSection>

    <SpringSection>
      <h2>Two processes</h2>
      <p>
        This app knows who you are and which albums you may open. The API holds the files and sends them straight to the
        browser. Apache handles HTTPS and forwards traffic to both. Originals are never piped through a Next route.
      </p>
      <Architecture className={styles.figure} />
    </SpringSection>

    <SpringSection>
      <h2>Who can see what</h2>
      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Who</th>
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
              <td>Only the Public profile, and their User Profile page, until an admin activates them</td>
            </tr>
            <tr>
              <td>Active user</td>
              <td>Yes</td>
              <td>All access profiles assigned by admin and their User Profile page</td>
            </tr>
            <tr>
              <td>Admin</td>
              <td>Yes</td>
              <td>Every album, the User Profile page plus /gallery/admin</td>
            </tr>
          </tbody>
        </table>
      </div>
    </SpringSection>

    <SpringSection>
      <h2>Essential Security</h2>
      <p>
        <strong>Session cookie:</strong> httpOnly, Secure in production, SameSite=Lax, path includes{" "}
        <code>BASE_PATH</code>. Passwords are hashed with Argon2id. The first admin is created by an interactive seed
        script, not by values in <code>.env</code>.
      </p>
      <p>
        SameSite=Lax means the browser sends your login cookie when you click a link here, including from another site,
        but not when some other page quietly loads an image, a form post, or a fetch against this app. That is the CSRF
        (Cross-Site Request Forgery) guard. The table is the short version.
      </p>

      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Request type</th>
              <th>Cookie sent?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Same-site navigation / AJAX</td>
              <td>✅</td>
            </tr>
            <tr>
              <td>Cross-site top-level GET (link click)</td>
              <td>✅</td>
            </tr>
            <tr>
              <td>Cross-site top-level POST (form submit)</td>
              <td>❌</td>
            </tr>
            <tr>
              <td>
                Cross-site <code>{"<iframe>"}</code> / <code>{"<img>"}</code> / <code>{"<script>"}</code>
              </td>
              <td>❌</td>
            </tr>
            <tr>
              <td>Cross-site AJAX / fetch</td>
              <td>❌</td>
            </tr>
          </tbody>
        </table>
      </div>
    </SpringSection>

    <SpringSection>
      <h2>Database</h2>
      <p>
        Tables can live in their own schema or share a host database using a <code>DATABASE_PREFIX</code>. Migrations
        are versioned <code>.up.sql</code> / <code>.down.sql</code>. Each migrate writes a mysqldump backup of Next
        Gallery tables only, to avoid deployment mishaps.
      </p>
      <Database />
      <p>
        Adding a parent album to a profile will also grant access to every album inside it, so the database stores that
        one path instead of every child. If a child is unchecked, that parent is exploded into the remaining siblings.
        Tick them all again and they collapse back to the parent.
      </p>
    </SpringSection>

    <SpringSection>
      <h2>Image tokens</h2>
      <p>
        The pictures are served from a different host, and an <code>{"<img>"}</code> tag cannot attach the login cookie
        there. After Next has checked you are allowed to see the album, it signs the path. The API only checks that
        signature.
      </p>
      <ImageToken className={styles.figure} />
    </SpringSection>

    <SpringSection>
      <h2>Caching</h2>
      <Caching className={styles.figure} />
      <p>
        Admin edits call <code>revalidatePath</code> / tag updates so a changed grant does not sit in a shared list.
      </p>
    </SpringSection>

    <SpringSection>
      <h2>Styling</h2>
      <p>
        SCSS Modules injects styling at build-time and declares colour profile variables that allow in-app theme
        switching. The gallery, homepage, and admin screens share a theme token from SCSS colour profiles.
      </p>
      <p>Height changes, menus and animated components are animated using react-spring for a subtle bouncy feel.</p>
    </SpringSection>

    <SpringSection>
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
          Production sits behind HTTPS. Apache forces https, then reverse-proxies the app. There is no Next proxy file.
        </li>
      </ul>
    </SpringSection>
  </article>
);

export default ProjectOverview;

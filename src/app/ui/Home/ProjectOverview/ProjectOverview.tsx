import Link from "next/link";

import Architecture from "./diagrams/Architecture.svg";
import Caching from "./diagrams/Caching.svg";
import Database from "./diagrams/Database.svg";
import DatabaseNarrow from "./diagrams/DatabaseNarrow.svg";
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
        <li>Justified album thumbs and a full-image view, with a custom accordion sidebar.</li>
        <li>Guests see only albums on the reserved Public profile without logging in.</li>
        <li>Signup creates a pending user. An admin activates them and assigns an access profile.</li>
        <li>
          Admins manage users, (delete, authorise), assign their role (user or admin) and allocate album access
          profiles.
        </li>
        <li>Admins can add, delete, rename and update access profiles and assign them to users</li>
        <li>Image bytes are signed by Next and checked by the API. Listings stay grant-filtered in Next.</li>
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
        <li>A bespoke accordion</li>
        <li>A select box with bounce physics</li>
        <li>Buttons that ripple when clicked</li>
        <li>Component mount animations</li>
        <li>A bespoke image justification sequencer</li>
      </ul>
      <p>Auth lives in Next js and the image API/CDN is for the images.</p>
    </SpringSection>

    <SpringSection>
      <h2>Two processes</h2>
      <p>
        Next owns people and grants. The API/CDN owns files. Apache can terminate TLS and reverse-proxy both. Next never
        streams originals through a Route Handler.
      </p>
      <Architecture className={styles.figure} />
    </SpringSection>

    <SpringSection>
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
        <code>BASE_PATH</code>. Passwords are encrypted using Argon2id. The first admin is created by an interactive
        seed script, not values in <code>.env</code>.
      </p>
      <p>
        <strong>
          <code>SameSite=Lax</code>
        </strong>{" "}
        tells the browser to send the cookie on same-site requests and on cross-site top-level navigations using safe
        (read-only) HTTP methods — primarily GET requests initiated by the user, like clicking a link.
      </p>
      <p>
        <strong>What it blocks:</strong> the cookie is not attached to cross-site sub-resource requests,{" "}
        <code>{"<img>"}</code>,<code>{"<iframe>"}</code>, <code>{"<script>"}</code>, AJAX/fetch calls, or cross-site
        form POST submissions. This is the key CSRF protection: a malicious page can't silently fire a POST to your site
        and have the session cookie ride along.
      </p>
      <p>
        <strong>What it allows:</strong> if a user clicks a link to your site from a search engine, social media post,
        or any other external page, the browser follows that as a top-level GET navigation and does include the session
        cookie. So the user arrives still logged in.
      </p>

      <div className={styles.tableWrap}>
        <table>
          <tr>
            <th>Request type</th>
            <th>Cookie sent?</th>
          </tr>
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
        Stored album paths are a cover set: In the user profiles, a grant for a parent album implies every descendant.
        In the admin settings, a parent album is exploded into sibling paths when a child is unchecked, and likewise
        when all children are checked the siblings are replaced by the parent album.
      </p>
    </SpringSection>

    <SpringSection>
      <h2>Image tokens</h2>
      <p>
        <code>{"<img>"}</code> cannot send the session cookie to another origin. Next therefore signs a path after the
        grant check. The API only verifies the auth code in the query parameters.
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
          Production sits behind HTTPS (Apache). <code>src/proxy.ts</code> is a fallback 308 when{" "}
          <code>x-forwarded-proto</code> is not https.
        </li>
      </ul>
    </SpringSection>
  </article>
);

export default ProjectOverview;

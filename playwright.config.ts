import { defineConfig } from "@playwright/test";

const port = "3000";
const basePath = process.env.BASE_PATH ?? "";
const baseURL = `${(process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}${basePath}`).replace(/\/$/, "")}/`;

export default defineConfig({
  testDir: "e2e",
  use: {
    baseURL,
    channel: "chrome",
  },
  webServer: {
    command: `npm run dev -- -p ${port}`,
    url: new URL("login", baseURL).href,
    timeout: 180_000,
    reuseExistingServer: true,
    stdout: "pipe",
    stderr: "pipe",
  },
});

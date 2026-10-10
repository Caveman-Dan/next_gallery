import { execSync } from "node:child_process";
import { defineConfig } from "@playwright/test";

const existingPort = process.env.PORT ?? "8984";
const fallbackPort = "3000";
const basePath = process.env.BASE_PATH ?? "";

const origin = (port: string) =>
  `${(process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}${basePath}`).replace(/\/$/, "")}/`;

const loginUrl = (port: string) => new URL("login", origin(port)).href;

const existingServerUp = () => {
  if (process.env.PLAYWRIGHT_BASE_URL) return true;
  try {
    execSync(`curl -sf -o /dev/null --max-time 1 "${loginUrl(existingPort)}"`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
};

const reuse = existingServerUp();
const port = reuse ? existingPort : fallbackPort;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? origin(port);

export default defineConfig({
  testDir: "e2e",
  use: {
    baseURL,
    channel: "chrome",
  },
  webServer: reuse
    ? undefined
    : {
        command: `npm run dev -- -p ${fallbackPort}`,
        url: loginUrl(fallbackPort),
        timeout: 180_000,
        stdout: "pipe",
        stderr: "pipe",
      },
});

import type { NextConfig } from "next";
import path from "path";
import fs from "fs";
import breakpoints from "@/style/breakpoints.json";

const isDev = process.env.NODE_ENV === "development";
const getImageApiEndpoint = new URL(`${process.env.API}${process.env.API_GET_IMAGE}`);
const breakpointsScssPath = path.join(__dirname, "src/app/style/_breakpoints.scss");
const breakpointsScss =
  "// Generated from breakpoints.json — do not edit\n" +
  Object.entries(breakpoints)
    .map(([name, px]) => `$${name}: ${px};`)
    .join("\n") +
  "\n";
fs.writeFileSync(breakpointsScssPath, breakpointsScss);

const sassConfig: NextConfig = {
  sassOptions: {
    modules: true,
    loadPaths: [path.join(__dirname, "src/app/style")],
    additionalData: `@use ${JSON.stringify(
      path.join(__dirname, "src/app/style/global_imports.scss").replaceAll("\\", "/")
    )} as *; @use "sass:color";`,
    silenceDeprecations: ["legacy-js-api"],
  },
};

const turboPackConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

const contentSecurityPolicy = [
  "default-src 'self'", // only this origin unless a directive below says otherwise
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`, // own JS + next-themes inline anti-flash script, eval is Turbopack/React replay in `next dev` only
  "style-src 'self' 'unsafe-inline'", // CSS modules + inline styles (springs / Next)
  "img-src 'self' data: blob:", // same-origin images + data: blur URLs
  "font-src 'self'", // local Exo2, no Google Fonts
  "connect-src 'self'", // fetch/XHR only to this origin (API is server-side)
  "object-src 'none'", // no <object> / Flash
  "base-uri 'self'", // block <base href> hijacking
  "form-action 'self'", // forms may only POST here
  "frame-ancestors 'none'", // do not allow this app in an iframe (clickjacking)
].join("; ");

const nextConfig: NextConfig = {
  basePath: process.env.BASE_PATH,
  allowedDevOrigins: ["192.168.1.10"],
  outputFileTracingRoot: path.join(__dirname),
  images: {
    localPatterns: [
      {
        pathname: `${getImageApiEndpoint.pathname}/**`,
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: `${getImageApiEndpoint.pathname}/:path*`,
        destination: `${getImageApiEndpoint.href}/:path*`,
        basePath: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Do not MIME-sniff; trust the Content-Type we send
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Other sites only see our origin in Referer, not album/image paths
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Legacy clickjacking defence (CSP frame-ancestors is the modern one)
          { key: "X-Frame-Options", value: "DENY" },
          // We do not use these APIs; deny them even if a script asks
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
        ],
      },
    ];
  },
  ...sassConfig,
  ...turboPackConfig,
};

module.exports = nextConfig;

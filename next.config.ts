import type { NextConfig } from "next";
import path from "path";
import fs from "fs";
import breakpoints from "@/style/breakpoints.json";

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
}

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
    // Same-origin /api/get_image/* is proxied to next_gallery_api so
    // next/image can treat it as a local pattern (Next 16 blocks private IPs).
    async rewrites() {
      return [
        {
          source: `${getImageApiEndpoint.pathname}/:path*`,
          destination: `${getImageApiEndpoint.href}/:path*`,
          basePath: false,
        },
      ];
    },
  // ...webpackConfig,
  ...sassConfig,
  ...turboPackConfig,
};

// console.log("NEXT-CONFIG: ", JSON.stringify(nextConfig));

module.exports = nextConfig;

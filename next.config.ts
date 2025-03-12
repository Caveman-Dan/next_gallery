import type { NextConfig } from "next";
import jsonImporter from "node-sass-json-importer";

const getImageApiEndpoint = new URL(`${process.env.NEXT_PUBLIC_API}${process.env.NEXT_PUBLIC_API_GET_IMAGE}`);

interface Rule {
  test: RegExp;
  issuer: Rule[];
  resourceQuery: { not: RegExp[] };
  use: string[];
}

const webpackConfig: NextConfig = {
  webpack: (config) => {
    // Convert SVGs directly in to React components
    // See SVGR https://react-svgr.com/docs/next/
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule: Rule) => rule.test?.test?.(".svg"));

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      }
    );

    // Modify the file loader rule to ignore *.svg, since we already handled it.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

const nextConfig: NextConfig = {
  basePath: process.env.BASE_PATH,
  sassOptions: {
    importer: jsonImporter(),
    modules: true,
    includePaths: ["./src/app/style"],
    prependData: '@use "global_imports.scss" as *; @use "sass:color";',
    silenceDeprecations: ["legacy-js-api"],
  },
  images: {
    remotePatterns: [
      // This is the get_image endpoint at the remote API
      {
        protocol: getImageApiEndpoint.protocol.replace(":", "") as "http" | "https",
        hostname: getImageApiEndpoint.hostname,
        port: getImageApiEndpoint.port,
        pathname: `${getImageApiEndpoint.pathname}/**`,
        search: getImageApiEndpoint.search,
      },
    ],
  },
  ...webpackConfig,
};

// console.log("NEXT-CONFIG: ", JSON.stringify(nextConfig));

module.exports = nextConfig;

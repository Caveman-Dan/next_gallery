import type { NextConfig } from "next";
import jsonImporter from "node-sass-json-importer";

const nextConfig: NextConfig = {
  webpack(config) {
    // Convert SVGs directly in to React components
    // See SVGR https://react-svgr.com/docs/next/
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.(".svg"));

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

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  sassOptions: {
    importer: jsonImporter(),
    modules: true,
    // hoistUseStatements: true,
    includePaths: ["./src/app/style"],
    prependData: '@use "global_imports.scss" as *; @use "sass:color";',
    silenceDeprecations: ["legacy-js-api"],
  },
};

module.exports = nextConfig;

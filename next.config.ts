import type { NextConfig } from "next";
import jsonImporter from "node-sass-json-importer";

const nextConfig: NextConfig = {
  sassOptions: {
    importer: jsonImporter(),
    modules: true,
    // hoistUseStatements: true,
    includePaths: ["./src/app/style"],
    prependData: '@use "global_imports.scss" as *; @use "sass:color";',
  },
};

export default nextConfig;

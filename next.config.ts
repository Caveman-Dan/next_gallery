import type { NextConfig } from "next";
import jsonImporter from "node-sass-json-importer";

const nextConfig: NextConfig = {
  sassOptions: {
    importer: jsonImporter(),
    includePaths: ["./src/app/style"],
    prependData: `@import "global_imports";`,
  },
};

export default nextConfig;

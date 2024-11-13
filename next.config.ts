import type { NextConfig } from "next";
import jsonImporter from "node-sass-json-importer";

const nextConfig: NextConfig = {
  sassOptions: {
    importer: jsonImporter(),
  },
};

export default nextConfig;

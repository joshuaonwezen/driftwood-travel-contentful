import type { NextConfig } from "next";
import { createClient } from "contentful";

const LOCALE_PREFIXES = ["en", "nl"];

/**
 * Redirects are managed by editors as `redirect` entries in Contentful.
 * They are read once at build time; a publish webhook triggers a new build.
 */
async function contentfulRedirects() {
  const { CONTENTFUL_SPACE_ID, CONTENTFUL_DELIVERY_TOKEN, CONTENTFUL_ENVIRONMENT } = process.env;
  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_DELIVERY_TOKEN) return [];

  const client = createClient({
    space: CONTENTFUL_SPACE_ID,
    accessToken: CONTENTFUL_DELIVERY_TOKEN,
    environment: CONTENTFUL_ENVIRONMENT || "master",
  });
  const { items } = await client.getEntries({ content_type: "redirect", limit: 1000 });

  return items.flatMap((item) => {
    const { fromPath, toPath, permanent } = item.fields as {
      fromPath: string;
      toPath: string;
      permanent?: boolean;
    };
    const isExternal = /^https?:\/\//.test(toPath);
    return [
      {
        source: fromPath,
        destination: isExternal ? toPath : `/en${toPath}`,
        permanent: permanent ?? true,
      },
      ...LOCALE_PREFIXES.map((prefix) => ({
        source: `/${prefix}${fromPath}`,
        destination: isExternal ? toPath : `/${prefix}${toPath}`,
        permanent: permanent ?? true,
      })),
    ];
  });
}

const nextConfig: NextConfig = {
  experimental: {
    // The root layout is app/[locale]/layout.tsx, so unmatched URLs need app/global-not-found.tsx.
    globalNotFound: true,
  },
  images: {
    loader: "custom",
    loaderFile: "./src/lib/contentful-image-loader.ts",
  },
  async redirects() {
    return contentfulRedirects();
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

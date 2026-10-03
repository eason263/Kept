import type { Metadata } from "next";

/**
 * Title + description for the page and its link previews. Page-level `openGraph`
 * replaces the layout's (it isn't deep-merged), so the shared fields live here.
 * The preview image itself comes from the nearest `opengraph-image.tsx`.
 */
export function socialMeta(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: { title, description, siteName: "kept.", type: "website", locale: "en" },
    twitter: { card: "summary_large_image", title, description },
  };
}

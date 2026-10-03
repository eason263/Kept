import { ImageResponse } from "next/og";
import { HomeCard, OG_SIZE, ogFonts } from "@/lib/og";

export const alt = "kept. — some gifts get opened, some get kept. Custom birthday gifts made from your photos.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(<HomeCard />, { ...size, fonts: await ogFonts() });
}

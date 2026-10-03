import { ImageResponse } from "next/og";
import { GIFT_ORDER, GIFTS, type GiftId } from "@/lib/gifts";
import { GiftCard, OG_SIZE, ogFonts } from "@/lib/og";

export const alt = "A custom birthday gift from kept.";
export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
  return GIFT_ORDER.map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const id = (GIFTS[slug as GiftId] ? slug : GIFT_ORDER[0]) as GiftId;
  return new ImageResponse(<GiftCard id={id} mode="product" />, { ...size, fonts: await ogFonts() });
}

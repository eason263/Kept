import { ImageResponse } from "next/og";
import { cleanName, OG_SIZE, ogFonts, ProfileCard } from "@/lib/og";
import { PROFILES, type ProfileId } from "@/lib/quiz";

export const alt = "A kept. gift profile card";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ profile: string; name: string }> }) {
  const { profile: pid, name } = await params;
  const profile = PROFILES[pid as ProfileId] ?? PROFILES["memory-collector"];
  return new ImageResponse(<ProfileCard profile={profile} name={cleanName(name)} />, { ...size, fonts: await ogFonts() });
}

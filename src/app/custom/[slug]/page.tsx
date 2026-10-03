import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Customizer } from "@/components/custom/Customizer";
import { GIFT_ORDER, GIFTS, type GiftId } from "@/lib/gifts";

export const dynamicParams = false;

export function generateStaticParams() {
  return GIFT_ORDER.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/custom/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const gift = GIFTS[slug as GiftId];
  if (!gift) return {};
  return {
    title: `Make a ${gift.name.toLowerCase()} — the workbench · kept.`,
    description: `Upload a photo, pick the details and see your ${gift.name.toLowerCase()} live before you order.`,
  };
}

export default async function CustomPage({ params }: PageProps<"/custom/[slug]">) {
  const { slug } = await params;
  const gift = GIFTS[slug as GiftId];
  if (!gift) notFound();
  return (
    <main>
      <Customizer key={gift.id} id={gift.id} />
    </main>
  );
}

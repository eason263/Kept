import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BuyBar } from "@/components/gift/BuyBar";
import { MakeItTheirs } from "@/components/gift/MakeItTheirs";
import { MakingProcess } from "@/components/gift/MakingProcess";
import { PairsWith } from "@/components/gift/PairsWith";
import { ProductCompare } from "@/components/gift/ProductCompare";
import { ProductDetails } from "@/components/gift/ProductDetails";
import { ProductFaq } from "@/components/gift/ProductFaq";
import { ProductHero } from "@/components/gift/ProductHero";
import { Footer } from "@/components/layout/Footer";
import { GIFT_ORDER, GIFTS, type GiftId } from "@/lib/gifts";
import { socialMeta } from "@/lib/meta";

export const dynamicParams = false;

export function generateStaticParams() {
  return GIFT_ORDER.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/gift/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const gift = GIFTS[slug as GiftId];
  if (!gift) return {};
  return socialMeta(`${gift.name} — ${gift.headline.join(" ").toLowerCase()} · kept.`, gift.story);
}

export default async function GiftPage({ params }: PageProps<"/gift/[slug]">) {
  const { slug } = await params;
  const gift = GIFTS[slug as GiftId];
  if (!gift) notFound();
  const id = gift.id;

  return (
    <>
      <main>
        <ProductHero id={id} />
        <MakingProcess id={id} />
        <ProductCompare id={id} />
        <ProductDetails id={id} />
        <MakeItTheirs id={id} />
        <ProductFaq id={id} />
        <PairsWith id={id} />
      </main>
      <Footer />
      <BuyBar id={id} />
    </>
  );
}

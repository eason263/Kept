import { BeforeAfter } from "@/components/home/BeforeAfter";
import { GiftFor } from "@/components/home/GiftFor";
import { GiftQuiz } from "@/components/home/GiftQuiz";
import { GiftStories } from "@/components/home/GiftStories";
import { GiftUniverse } from "@/components/home/GiftUniverse";
import { Hero } from "@/components/home/Hero";
import { KeepWall } from "@/components/home/KeepWall";
import { Manifesto } from "@/components/home/Manifesto";
import { UniverseLoader } from "@/components/home/UniverseLoader";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <GiftUniverse />
        <Manifesto />
        <GiftStories />
        <BeforeAfter />
        <GiftFor />
        <GiftQuiz />
        <KeepWall />
      </main>
      <Footer />
      <UniverseLoader />
    </>
  );
}

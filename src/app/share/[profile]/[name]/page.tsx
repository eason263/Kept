import Link from "next/link";
import { notFound } from "next/navigation";
import { GiftThumb } from "@/components/home/GiftScenes";
import { Footer } from "@/components/layout/Footer";
import { Arrow } from "@/components/ui/Arrow";
import { ACCENTS } from "@/lib/accents";
import { GIFTS } from "@/lib/gifts";
import { socialMeta } from "@/lib/meta";
import { cleanName } from "@/lib/og";
import { PROFILES, type ProfileId } from "@/lib/quiz";

export async function generateMetadata({ params }: PageProps<"/share/[profile]/[name]">) {
  const { profile: pid, name: raw } = await params;
  const profile = PROFILES[pid as ProfileId];
  if (!profile) return {};
  const name = cleanName(raw);
  return socialMeta(
    `${name ? `${name} is` : "They’re"} ${profile.name} · kept.`,
    `${profile.line} Take the 30-second gift quiz for someone you love.`,
  );
}

/**
 * Where a shared quiz result lands: the profile card someone sent, with their
 * three gifts, and an invitation to take the quiz for someone else.
 */
export default async function SharePage({ params }: PageProps<"/share/[profile]/[name]">) {
  const { profile: pid, name: raw } = await params;
  const profile = PROFILES[pid as ProfileId];
  if (!profile) notFound();
  const name = cleanName(raw);
  const accent = ACCENTS[profile.accent];
  const first = GIFTS[profile.gifts[0]];

  return (
    <>
      <main data-accent={profile.accent} className="bg-frosting px-4 pb-24 pt-28 md:px-10">
        <div className="mx-auto max-w-[1040px]">
          <p className="label text-smudge">Someone took the kept. gift quiz{name ? ` for ${name}` : ""}</p>

          <div className="relative mt-6 -rotate-[1.2deg] overflow-hidden rounded-[34px] bg-ink p-7 text-paper shadow-lift md:p-12">
            <span aria-hidden className="absolute left-1/2 top-5 h-3 w-16 -translate-x-1/2 rounded-full" style={{ background: accent.color }} />
            <div className="label flex justify-between gap-4 text-paper/55">
              <span>Gift profile{name ? ` — for ${name}` : ""}</span>
              <span>kept. quiz</span>
            </div>
            <p className="label mt-12" style={{ color: accent.color }}>
              {name ? `${name} is` : "They’re"}
            </p>
            <h1 className="display mt-3 max-w-[12ch] text-[clamp(3.2rem,8vw,8.4rem)]" style={{ color: accent.color }}>
              {profile.name}
            </h1>
            <p className="mt-6 max-w-[34rem] text-[1.2rem] leading-relaxed text-paper/80">{profile.line}</p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {profile.gifts.map((id, i) => (
                <Link
                  key={id}
                  href={`/gift/${id}`}
                  data-cursor="view"
                  className="group flex flex-col items-center rounded-[22px] bg-paper p-5 text-center text-ink transition-transform hover:-translate-y-1"
                >
                  <span className="grid h-36 place-items-center">
                    <GiftThumb id={id} />
                  </span>
                  <span className="label mt-3 text-smudge">{i === 0 ? "Best match" : "Also great"}</span>
                  <span className="mt-1 text-[1.15rem] font-semibold">{GIFTS[id].name}</span>
                  <span className="mt-1 font-mono text-[0.75rem]">from ${GIFTS[id].from}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
            <Link href="/#quiz" data-cursor="cta" className="display inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-[1.45rem] text-paper">
              Take the quiz for someone <Arrow />
            </Link>
            <Link
              href={`/custom/${first.id}`}
              className="inline-flex items-center gap-2 underline decoration-ink/30 decoration-2 underline-offset-[6px] hover:decoration-accent"
            >
              Make the {first.name.toLowerCase()}
              {name ? ` for ${name}` : ""} <Arrow />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

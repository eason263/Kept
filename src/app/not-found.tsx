import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";

export default function NotFound() {
  return (
    <main data-accent="cherry" className="flex min-h-[100svh] flex-col items-start justify-center px-4 py-32 md:px-10">
      <p className="label text-smudge">Error 404</p>
      <h1 className="display mt-5 text-[clamp(4rem,13vw,13rem)]">
        Lost in
        <br />
        <span className="text-cherry">the post.</span>
      </h1>
      <p className="mt-8 max-w-[30rem] text-[1.15rem] leading-relaxed text-ink/75">
        This page doesn’t exist — or it does, and someone hid it with the receipt. Either way, the gifts are this way.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-6">
        <Link href="/" className="display inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-[1.5rem] text-paper">
          Back to the desk <Arrow />
        </Link>
        <Link href="/#quiz" className="underline decoration-ink/30 decoration-2 underline-offset-[6px] hover:decoration-cherry">
          Or take the quiz
        </Link>
      </div>
    </main>
  );
}

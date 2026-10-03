import { RevealLines } from "@/components/ui/RevealLines";
import { COMMON_FAQ, DETAILS } from "@/lib/giftDetails";
import { GIFTS, type GiftId } from "@/lib/gifts";

/** Native <details> for each question — accessible and works without JS. */
export function ProductFaq({ id }: { id: GiftId }) {
  const d = DETAILS[id];
  const faq = [...d.faq, ...COMMON_FAQ(d.days)];
  return (
    <section data-accent={GIFTS[id].accent} className="grid gap-12 px-4 py-[14vh] md:px-10 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <p className="label text-smudge">Questions</p>
        <h2 className="mt-5">
          <RevealLines
            className="display block text-[clamp(3rem,5.6vw,6rem)]"
            lines={["Asked before", "pressing the", <span key="3" className="text-accent">button.</span>]}
          />
        </h2>
      </div>
      <div className="border-t border-ink/15">
        {faq.map((item) => (
          <details key={item.q} className="group border-b border-ink/15">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[clamp(1.2rem,1.8vw,1.6rem)] font-semibold [&::-webkit-details-marker]:hidden">
              {item.q}
              <span
                aria-hidden
                className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-ink text-[1.4rem] leading-none transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="max-w-[40rem] pb-7 text-[1.08rem] leading-relaxed text-ink/75">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

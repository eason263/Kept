import { nextBirthday } from "./birthday";

const DAY = 86_400_000;

function addDays(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

/** "Thu 8 Oct" */
export function fmtDay(d: Date) {
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

export interface DeliveryEstimate {
  ships: Date;
  early: Date;
  late: Date;
  birthday: Date;
  tone: "fine" | "tight" | "late";
  line: string;
}

/**
 * Studio time + 2–4 days of post, compared with the next birthday.
 * Call on the client only — it depends on today's date.
 */
export function estimateDelivery(makeDays: number, day: number, month: number, possessive: string, now = new Date()): DeliveryEstimate {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const ships = addDays(today, makeDays);
  const early = addDays(ships, 2);
  const late = addDays(ships, 4);
  const birthday = nextBirthday(day, month, now);
  const spare = Math.round((birthday.getTime() - late.getTime()) / DAY);

  if (spare >= 1) {
    return {
      ships,
      early,
      late,
      birthday,
      tone: "fine",
      line: `Arrives by ${fmtDay(late)} — ${spare} day${spare === 1 ? "" : "s"} before ${possessive} birthday.${spare > 45 ? " Plenty of time." : ""}`,
    };
  }
  if (early.getTime() <= birthday.getTime()) {
    return {
      ships,
      early,
      late,
      birthday,
      tone: "tight",
      line: `Arrives ${fmtDay(early)}–${fmtDay(late)}. Tight for ${possessive} birthday on ${fmtDay(birthday)} — choose express at checkout.`,
    };
  }
  return {
    ships,
    early,
    late,
    birthday,
    tone: "late",
    line: `Arrives ${fmtDay(early)}, after ${possessive} birthday on ${fmtDay(birthday)}. Order anyway — we’ll email a proof card you can give on the day.`,
  };
}

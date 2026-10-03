"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { BagProvider } from "@/lib/bag";
import { BirthdayProvider } from "@/lib/birthday";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <BirthdayProvider>
        <BagProvider>{children}</BagProvider>
      </BirthdayProvider>
    </MotionConfig>
  );
}

import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Fredoka, Martian_Mono, Reenie_Beanie } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { AccentObserver } from "@/components/layout/AccentObserver";
import { Cursor } from "@/components/layout/Cursor";
import { Intro } from "@/components/layout/Intro";
import { Navbar } from "@/components/layout/Navbar";
import { PageCurtain } from "@/components/layout/PageCurtain";
import { Providers } from "@/components/layout/Providers";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { socialMeta } from "@/lib/meta";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  axes: ["opsz", "wdth"],
  display: "swap",
});

const martian = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-martian",
  axes: ["wdth"],
  display: "swap",
});

const reenie = Reenie_Beanie({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-reenie",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  axes: ["wdth"],
  display: "swap",
});

export const metadata: Metadata = socialMeta(
  "kept. — birthday gifts they’ll actually keep",
  "Laser portraits, fridge magnets, photo keychains and cake toppers made from your photos and inside jokes. Tell us whose birthday it is.",
);

export const viewport: Viewport = {
  themeColor: "#f1e8da",
};

/** Runs before paint: skip the intro if it's been seen this session or motion is reduced. */
const introScript = `try{var d=document.documentElement;if(sessionStorage.getItem('kept:intro')||matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('intro-seen')}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bricolage.variable} ${martian.variable} ${reenie.variable} ${fredoka.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <Providers>
          <Intro />
          <Navbar />
          {children}
          <PageCurtain />
          <Cursor />
        </Providers>
        <SmoothScroll />
        <AccentObserver />
      </body>
    </html>
  );
}

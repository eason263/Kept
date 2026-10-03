"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

type SmartLinkProps = Omit<ComponentProps<"a">, "href"> & { href: string };

/**
 * Same-page hash links stay plain anchors (Lenis smooth-scrolls them);
 * everything else is a client-side <Link>.
 */
export function SmartLink({ href, children, ...rest }: SmartLinkProps) {
  const pathname = usePathname();
  const hashAt = href.indexOf("#");
  const path = hashAt === -1 ? href : href.slice(0, hashAt);
  if (hashAt !== -1 && (path === "" || path === pathname)) {
    return (
      <a href={href.slice(hashAt)} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}

import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "Interaction Lab",
    template: "%s | Interaction Lab",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function InteractionLabLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}

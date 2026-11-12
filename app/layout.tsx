import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://otthonodpiaca.hu"),
  title: "Otthonod Piaca | Ingatlaneladás Debrecenben",
  description:
    "Az otthonod érték. Hozzuk ki belőle a legtöbbet. Személyes figyelem és átgondolt ingatlanértékesítés Debrecenben és környékén.",
  openGraph: {
    title: "Otthonod Piaca",
    description: "Az otthonod érték. Hozzuk ki belőle a legtöbbet.",
    locale: "hu_HU",
    type: "website",
    images: ["/otthon-nappali.webp"],
  },
  robots: { index: true, follow: true },
};
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hu">
      <body>{children}</body>
    </html>
  );
}

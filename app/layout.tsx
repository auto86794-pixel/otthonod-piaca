import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "./ChatWidget";
import ExitModal from "./ExitModal";

export const metadata: Metadata = {
  metadataBase: new URL("https://otthonodpiaca.hu"),
  title: {
    default: "Otthonod Piaca – Ingyenes ingatlan értékbecslés Debrecenben",
    template: "%s | Otthonod Piaca",
  },
  description:
    "Eladnád a lakásod Debrecenben? Kérj ingyenes, személyes értékbecslést és segítséget az árazáshoz, a hirdetéshez és az értékesítéshez, a kulcsátadásig.",
  keywords: [
    "ingatlan értékbecslés Debrecen",
    "lakás eladás Debrecen",
    "ingatlanos Debrecen",
    "ingatlan értékesítés Debrecen",
    "mennyit ér a lakásom Debrecen",
  ],
  openGraph: {
    title: "Otthonod Piaca – Ingatlan értékesítés Debrecenben",
    description:
      "Ingyenes, személyes értékbecslés és átgondolt ingatlanértékesítés Debrecenben és környékén, az első egyeztetéstől a kulcsátadásig.",
    url: "https://otthonodpiaca.hu/",
    siteName: "Otthonod Piaca",
    locale: "hu_HU",
    type: "website",
    images: [{ url: "/otthon-nappali.webp", alt: "Otthonod Piaca – otthonos nappali kertkapcsolattal" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Otthonod Piaca – Ingatlan értékesítés Debrecenben",
    description: "Kérj ingyenes, személyes értékbecslést Debrecenben és környékén!",
    images: ["/otthon-nappali.webp"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu">
      <body>
        <a href="#tartalom" className="skip">
          Ugrás a tartalomra
        </a>
        {children}
        <ChatWidget />
        <ExitModal />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "./ChatWidget";
import ExitModal from "./ExitModal";

export const metadata: Metadata = {
  metadataBase: new URL("https://otthonodpiaca.hu"),
  title: "Otthonod Piaca – Ingatlan értékesítés Debrecenben",
  description:
    "Gyors, diszkrét és megbízható ingatlaneladás Debrecenben és környékén. Kérj ingyenes értékbecslést még ma!",
  openGraph: {
    title: "Otthonod Piaca – Ingatlan értékesítés Debrecenben",
    description:
      "Gyors, diszkrét és megbízható ingatlaneladás Debrecenben és környékén.",
    type: "website",
    locale: "hu_HU",
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

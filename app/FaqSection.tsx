"use client";

import { useId, useState } from "react";

const FAQS = [
  {
    q: "Mennyibe kerül az értékbecslés?",
    a: "Az ingyenes, személyes értékbecslés kötelezettségmentes. Az egyeztetés után eldöntheted, szeretnél-e együtt dolgozni velem az ingatlanod eladásán. Az online kalkulátor ettől különálló, mintaáras tájékozódási lehetőség.",
  },
  {
    q: "Kell előre fizetnem valamit?",
    a: "Nincs előleg vagy előzetes hozzájárulás a fotózáshoz és a hirdetéshez. A közvetítői jutalék sikeres eladás esetén jár; összegét és pontos feltételeit előre egyeztetjük, és a megbízási szerződésben rögzítjük.",
  },
  {
    q: "Mennyi idő alatt kel el egy lakás?",
    a: "Az értékesítési időt az ár, az elhelyezkedés, az állapot és az aktuális kereslet egyaránt befolyásolja. A személyes egyeztetésen átbeszéljük a várható időkeretet és az árazást. Konkrét eladási határidőt nem lehet garantálni.",
  },
  {
    q: "Ki intézi a jogi ügyeket?",
    a: "Az adásvételi szerződést ügyvéd készíti és ellenjegyzi. Segítek az egyeztetések és az átadási teendők összehangolásában; az ügyvédi megbízásról, képviseletről és díjazásról külön szükséges megállapodni.",
  },
  {
    q: "Miért érdemes ingatlanközvetítővel dolgozni?",
    a: "Saját magad is eladhatod az ingatlanod. A közvetítő piaci összehasonlítással, a bemutatás és hirdetés megtervezésével, az érdeklődők kezelésével és a megtekintések szervezésével segíthet. Az együttműködés feltételeit az igényeidhez igazítva beszéljük át.",
  },
  {
    q: "Mit érdemes rendbe tenni a lakás eladása előtt?",
    a: "Közösen átnézzük, milyen előkészítés lehet hasznos. A takarítás, a rendrakás és az apró javítások segíthetik a bemutatást. Nagyobb felújítás előtt érdemes mérlegelni a költségeket és a várható megtérülést.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
  return (
    <section className="section faq-section" id="gyik" aria-labelledby={`${id}-title`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="section-inner wrap">
        <p className="eyebrow">KÉRDÉSEK ÉS VÁLASZOK</p>
        <h2 className="section-title" id={`${id}-title`}>Gyakori kérdések</h2>
        <p className="section-lead">Ami a legtöbb eladót érdekli – érthetően, őszintén, egy helyen.</p>
        <div className="faq-list">
          {FAQS.map(({ q, a }, i) => (
            <div className={`faq-item${open === i ? " open" : ""}`} key={q}>
              <h3 className="faq-heading">
                <button type="button" className="faq-q" id={`${id}-q-${i}`} aria-expanded={open === i} aria-controls={`${id}-a-${i}`} onClick={() => setOpen(current => current === i ? null : i)}>
                  <span>{q}</span><span className="faq-icon" aria-hidden="true">{open === i ? "−" : "+"}</span>
                </button>
              </h3>
              <div className="faq-a" id={`${id}-a-${i}`} role="region" aria-labelledby={`${id}-q-${i}`} hidden={open !== i}><p>{a}</p></div>
            </div>
          ))}
        </div>
        <p className="faq-more">Más kérdésed van? <a href="#kapcsolat">Kérj visszahívást</a>, vagy kérdezz a chatben!</p>
      </div>
    </section>
  );
}

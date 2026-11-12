import Image from "next/image";
import Brand from "./Brand";
import LeadForm from "./LeadForm";
import ValueCalculator from "./ValueCalculator";
import ProcessSection from "./ProcessSection";
const icons = [
  <svg key="chart" viewBox="0 0 64 64">
    <path d="M9 53V36h10v17zm18 0V23h10v30zm18 0V9h10v44z" />
  </svg>,
  <svg key="camera" viewBox="0 0 64 64">
    <path d="M9 19h12l5-9h14l5 9h10a5 5 0 0 1 5 5v28a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V24a5 5 0 0 1 5-5Z" />
    <circle cx="32" cy="36" r="13" />
  </svg>,
  <svg key="hands" viewBox="0 0 64 64">
    <path d="m4 26 12-17 10 7-12 18zm56 0L48 9l-10 7 12 18zM23 20l8-5 12 8M16 31l18 17q4 3 7-1l10-14M25 26l6-5 12 8q1 5-4 5l-8-4M21 37l-5 5q-3 5 2 7l5-5m0 0q-2 6 3 7l4-4m0 0q0 6 5 5l4-4" />
  </svg>,
];
export default function Home() {
  return (
    <>
      <header>
        <div className="header-inner">
          <Brand />
          <nav aria-label="Fő navigáció">
            <a href="#miert">Miért velünk?</a>
            <a href="#folyamat">Így dolgozunk</a>
            <a href="#kapcsolat">Kapcsolat</a>
          </nav>
          <a className="button primary header-cta" href="#kapcsolat">
            Értékbecslést kérek
          </a>
        </div>
      </header>
      <main id="tartalom">
        <section className="hero wrap">
          <div className="hero-copy">
            <p className="eyebrow">
              INGATLANELADÁS DEBRECENBEN
              <br />
              ÉS KÖRNYÉKÉN
            </p>
            <div className="rule" />
            <h1>
              Az otthonod érték.
              <br />
              Hozzuk ki belőle
              <br />a legtöbbet.
            </h1>
            <p className="hero-description">
              Személyes figyelem, átgondolt értékesítés és helyismeret az első
              beszélgetéstől az átadásig.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#kapcsolat">
                Kérem az értékbecslést <span aria-hidden="true">→</span>
              </a>
              <a className="button secondary" href="#folyamat">
                Megismerem a folyamatot
              </a>
            </div>
          </div>
          <div className="hero-image">
            <Image
              src="/otthon-nappali.webp"
              alt="Világos, otthonos nappali zsályazöld párnákkal és kertre néző ablakokkal"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 55vw"
            />
          </div>
        </section>
        <section
          id="miert"
          className="benefits wrap"
          aria-label="Amiben segítünk"
        >
          {[
            {
              title: "Reális piaci ár",
              text: "Naprakész helyismeretünk és piaci rálátásunk alapján reális, versenyképes árat határozunk meg.",
            },
            {
              title: "Átgondolt megjelenés",
              text: "Gondoskodunk a vonzó bemutatásról, hogy az ingatlanod a legjobb oldalát mutassa a vevők számára.",
            },
            {
              title: "Személyes támogatás",
              text: "Végig melletted vagyunk – az első egyeztetéstől a sikeres átadásig, átláthatóan és érthetően.",
            },
          ].map((item, i) => (
            <article key={item.title}>
              <div className="line-icon">{icons[i]}</div>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </article>
          ))}
        </section>
        <section
          className="section calculator-section"
          id="ertekbecsles"
          aria-labelledby="calc-title"
        >
          <div className="section-inner wrap">
            <p className="eyebrow">ELSŐ LÉPÉS AZ ELADÁS FELÉ</p>
            <h2 className="section-title" id="calc-title">
              Mennyit érhet a lakásod?
            </h2>
            <p className="section-lead">
              Próbáld ki az árkalkulátort, majd kérj személyes egyeztetést a
              valós piaci érték meghatározásához.
            </p>
            <ValueCalculator />
          </div>
        </section>
        <ProcessSection />
        <section id="kapcsolat" className="contact-section">
          <div className="contact-inner wrap">
            <div className="contact-copy">
              <h2>
                Mennyit ér most
                <br />
                az ingatlanod?
              </h2>
              <div className="rule" />
              <p>
                Tudd meg, mennyit ér jelenleg az ingatlanod a debreceni és
                környékbeli piacon!
                <br />
                Kérj visszahívást, és röviden egyeztetjük a legfontosabb
                tudnivalókat egy értékbecsléshez.
              </p>
            </div>
            <LeadForm />
          </div>
        </section>
      </main>
      <footer className="wrap">
        <div>
          <Brand />
          <p>Az otthonod érték. Hozzuk ki belőle a legtöbbet.</p>
        </div>
        <div className="footer-contact">
          {process.env.NEXT_PUBLIC_CONTACT_NAME && (
            <span>{process.env.NEXT_PUBLIC_CONTACT_NAME}</span>
          )}
          {process.env.NEXT_PUBLIC_CONTACT_PHONE && (
            <a
              href={
                "tel:" +
                process.env.NEXT_PUBLIC_CONTACT_PHONE.replace(/[^+0-9]/g, "")
              }
            >
              {process.env.NEXT_PUBLIC_CONTACT_PHONE}
            </a>
          )}
          {process.env.NEXT_PUBLIC_CONTACT_EMAIL && (
            <a href={"mailto:" + process.env.NEXT_PUBLIC_CONTACT_EMAIL}>
              {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
            </a>
          )}
          <a href="/adatkezeles">Adatkezelési tájékoztató</a>
          <small>© {new Date().getFullYear()} Otthonod Piaca</small>
        </div>
      </footer>
    </>
  );
}

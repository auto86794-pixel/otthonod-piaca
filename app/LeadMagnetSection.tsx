"use client";

import { useRef, useState } from "react";

const PDF_URL = "/otthonod-piaca-5-hiba.pdf";

export default function LeadMagnetSection() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [contact, setContact] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const sending = useRef(false);
  const successRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current || sent || !consent) return;
    const website = new FormData(event.currentTarget).get("website");
    sending.current = true;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), consent: "yes", contact: contact ? "yes" : "no", website, source: "pdf-lead-magnet" }),
        signal: AbortSignal.timeout(20_000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error(result.error || "Nem érkezett sikeres visszaigazolás. Próbáld újra később.");
      setSent(true);
      window.requestAnimationFrame(() => successRef.current?.focus());
    } catch (err) {
      setError(err instanceof Error && err.name !== "TimeoutError" && err.name !== "SyntaxError" && err.name !== "TypeError" ? err.message : "A küldést nem sikerült visszaigazolni. Lehetséges, hogy már megérkezett; kérjük, ne küldd el azonnal újra.");
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }

  return (
    <section className="section lead-magnet-section" id="letoltes" aria-labelledby="guide-title">
      <div className="section-inner wrap lead-magnet-inner">
        <div className="guide-preview" aria-hidden="true"><span>OTTHONOD PIACA</span><strong>5</strong><p>elkerülhető hiba<br />lakáseladás előtt</p><small>INGYENES PDF ÚTMUTATÓ</small></div>
        <div className="guide-copy">
          <p className="eyebrow">ELADÁS ELŐTT ÉRDEMES ELOLVASNI</p>
          <h2 className="section-title" id="guide-title">5 hiba, ami ronthat a lakásod eladási esélyein</h2>
          <p className="section-lead">Árazás, fotók, felkészítés és megtekintések: rövid, gyakorlati útmutató debreceni eladóknak, ellenőrzőlistával. Ingyenesen letölthető PDF.</p>
          {sent ? (
            <div className="lead-magnet-success" role="status" ref={successRef} tabIndex={-1}>
              <h3>Köszönjük! Az útmutató letölthető.</h3>
              <p>Kattints a gombra a PDF mentéséhez. {contact ? "Az egyszeri e-mailes megkeresést is kérted; ez nem automatikus hírlevél-feliratkozás." : "Nem kértél e-mailes megkeresést."}</p>
              <a className="button primary" href={PDF_URL} download>Letöltöm az útmutatót</a>
              <p className="lead-magnet-cross">Most már tudod, mire érdemes figyelni – <a href="#kapcsolat">kérj visszahívást</a>, és személyesen is átnézzük a te esetedet.</p>
            </div>
          ) : (
            <form className="lead-magnet-form" onSubmit={handleSubmit} aria-busy={busy}>
              <label htmlFor="guide-email">E-mail-címed</label>
              <div className="lead-magnet-fields">
                <input id="guide-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="pelda@email.hu" value={email} onChange={event => setEmail(event.target.value)} />
                <button type="submit" className="button primary" disabled={busy || !consent}>{busy ? "Küldés folyamatban…" : "Elkérem ingyen"}</button>
              </div>
              <div className="trap" aria-hidden="true"><label htmlFor="guide-website">Weboldal</label><input id="guide-website" name="website" tabIndex={-1} autoComplete="off" /></div>
              <label className="lead-magnet-consent"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} required /><span>Elolvastam az <a href="/adatkezeles" target="_blank" rel="noreferrer">adatkezelési tájékoztatót</a>, és hozzájárulok az e-mail-címem kezeléséhez az útmutató igénylésének rögzítéséhez.</span></label>
              <label className="lead-magnet-consent"><input type="checkbox" checked={contact} onChange={event => setContact(event.target.checked)} /><span>Kérek egy egyszeri e-mailes megkeresést is a lakásom eladásával kapcsolatban. (Nem kötelező.)</span></label>
              <p className="lead-magnet-note">A PDF itt, az oldalon válik letölthetővé. Nem küldünk automatikus e-mailt vagy hírlevelet.</p>
              {error && <p className="form-error" role="alert">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

"use client";
import { useRef, useState } from "react";
export default function LeadForm() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const sending = useRef(false);
  const successRef = useRef<HTMLDivElement>(null);
  return (
    <form
      className="lead-form"
      aria-busy={busy}
      onSubmit={async (e) => {
        e.preventDefault();
        if (sending.current || success) return;
        sending.current = true;
        const form = e.currentTarget;
        const data = new FormData(form);
        setBusy(true);
        setStatus("");
        try {
          const r = await fetch("/api/interest", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(Object.fromEntries(data)),
            signal: AbortSignal.timeout(20000),
          });
          const result = await r.json().catch(() => null);
          if (!r.ok)
            throw new Error(
              result?.error || "A küldés nem sikerült. Kérjük, próbáld újra.",
            );
          if (result?.ok !== true) throw new Error("Nem érkezett sikeres visszaigazolás. Kérjük, próbáld újra később.");
          setSuccess(true);
          setStatus(
            "Köszönjük a megkeresésed! A megadott telefonszámon jelentkezünk.",
          );
          form.reset();
          window.requestAnimationFrame(() => successRef.current?.focus());
        } catch (error) {
          setStatus(
            error instanceof Error && !["TimeoutError", "AbortError", "TypeError"].includes(error.name)
              ? error.message
              : "A küldést nem sikerült visszaigazolni. Lehetséges, hogy a kérés már megérkezett. Kérjük, ne küldd el azonnal újra.",
          );
        } finally {
          setBusy(false);
          sending.current = false;
        }
      }}
    >
      {success ? (
        <div className="success" role="status" ref={successRef} tabIndex={-1}>
          <span aria-hidden="true">✓</span>
          <h3>Köszönjük a bizalmad!</h3>
          <p>{status}</p>
          <a className="text-link" href="#letoltes">Addig is nézd meg az ingyenes útmutatót</a>
        </div>
      ) : (
        <>
          <label htmlFor="name">
            Név <span>*</span>
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Add meg a neved"
            required
            minLength={2}
            maxLength={80}
          />
          <label htmlFor="phone">
            Telefonszám <span>*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Pl. +36 30 123 4567"
            required
            minLength={7}
            maxLength={40}
          />
          <label htmlFor="location">
            Ingatlan helye <span>*</span>
          </label>
          <input
            id="location"
            name="location"
            autoComplete="address-level2"
            placeholder="Pl. Debrecen, Hatvan utca"
            required
            minLength={2}
            maxLength={120}
          />
          <div className="trap" aria-hidden="true">
            <label htmlFor="website">Weboldal</label>
            <input
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <label className="consent">
            <input type="checkbox" name="consent" value="yes" required />
            <span>
              Elolvastam az{" "}
              <a href="/adatkezeles" target="_blank" rel="noreferrer">
                adatkezelési tájékoztatót
              </a>
              , és hozzájárulok a kapcsolatfelvételhez.
            </span>
          </label>
          <button
            className="button primary"
            type="submit"
            disabled={busy}
          >
            {busy ? "Küldés folyamatban…" : "Visszahívást kérek"}
            <span aria-hidden="true">→</span>
          </button>
          {status && (
            <p className="form-error" role="alert">
              {status}
            </p>
          )}
        </>
      )}
    </form>
  );
}

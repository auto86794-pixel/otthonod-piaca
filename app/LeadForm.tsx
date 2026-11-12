"use client";
import { useRef, useState } from "react";
export default function LeadForm({ ready }: { ready: boolean }) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const key = useRef("");
  return (
    <form
      className="lead-form"
      onSubmit={async (e) => {
        e.preventDefault();
        if (busy || success) return;
        const form = e.currentTarget;
        const data = new FormData(form);
        setBusy(true);
        setStatus("");
        key.current ||= crypto.randomUUID();
        try {
          const r = await fetch("/api/interest", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Idempotency-Key": key.current,
            },
            body: JSON.stringify(Object.fromEntries(data)),
          });
          const result = await r.json();
          if (!r.ok)
            throw new Error(
              result.error || "A küldés nem sikerült. Kérjük, próbáld újra.",
            );
          setSuccess(true);
          setStatus(
            "Köszönjük a megkeresésed! A megadott telefonszámon jelentkezünk.",
          );
          form.reset();
        } catch (error) {
          setStatus(
            error instanceof Error
              ? error.message
              : "Kapcsolódási hiba. Kérjük, próbáld újra.",
          );
        } finally {
          setBusy(false);
        }
      }}
    >
      {success ? (
        <div className="success" role="status">
          <span>✓</span>
          <h3>Köszönjük a bizalmad!</h3>
          <p>{status}</p>
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
            maxLength={100}
          />
          <label htmlFor="phone">
            Telefonszám <span>*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Pl. +36 30 123 4567"
            required
            pattern="[+0-9() /–-]{7,25}"
            maxLength={25}
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
            maxLength={180}
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
            disabled={busy || !ready}
          >
            {busy ? "Küldés folyamatban…" : "Visszahívást kérek"}
            <span aria-hidden="true">→</span>
          </button>
          {!ready && (
            <p className="form-note">
              Az online visszahíváskérés hamarosan elérhető.
            </p>
          )}
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

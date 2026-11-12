"use client";

import { useEffect, useRef, useState } from "react";
import {
  calculateValue,
  CONDITIONS,
  DISTRICTS,
  type CalculatorInputs,
  type CalculatorResult,
} from "./lib/valuation";

const fmt = new Intl.NumberFormat("hu-HU", { maximumFractionDigits: 0 });
const EMPTY: CalculatorInputs = {
  district: "",
  area: "",
  rooms: "",
  condition: "",
};

export default function ValueCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(EMPTY);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const ready = calculateValue(inputs) !== null;

  useEffect(() => {
    if (result) resultRef.current?.focus();
  }, [result]);

  function update(field: keyof CalculatorInputs, value: string) {
    setInputs((previous) => ({ ...previous, [field]: value }));
    setResult(null);
  }

  return (
    <div className="calc-card">
      <div className="calc-heading">
        <div>
          <h3>Lakásár-kalkulátor</h3>
          <p className="calc-sub">
            Néhány adat megadásával kipróbálhatod az előzetes ársáv számítását.
          </p>
        </div>
        <span className="calc-badge">Mintaáras változat</span>
      </div>
      <p className="calc-disclosure" id="calc-disclosure">
        A kalkulátor jelenleg bemutató árszintekkel számol, nem ellenőrzött
        piaci adatokkal. A kapott összeg nem az ingatlanod megállapított piaci
        értéke. Személyes értékelést a kapcsolatfelvételi űrlapon kérhetsz.
      </p>

      <form
        aria-describedby="calc-disclosure"
        onSubmit={(event) => {
          event.preventDefault();
          const next = calculateValue(inputs);
          if (next) setResult(next);
        }}
      >
        <label htmlFor="calc-district">
          Hol található a lakás?
          <select
            id="calc-district"
            value={inputs.district}
            onChange={(event) => update("district", event.target.value)}
            required
          >
            <option value="">Válassz városrészt vagy környéket…</option>
            {DISTRICTS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <div className="calc-row">
          <label htmlFor="calc-area">
            Alapterület (m²)
            <input
              id="calc-area"
              type="number"
              inputMode="decimal"
              min={15}
              max={500}
              step="0.1"
              value={inputs.area}
              onChange={(event) => update("area", event.target.value)}
              placeholder="Pl. 62"
              required
              aria-describedby="calc-area-help"
            />
            <span className="calc-field-help" id="calc-area-help">
              15–500 m² között
            </span>
          </label>
          <label htmlFor="calc-rooms">
            Szobák száma <span className="calc-optional">(opcionális)</span>
            <input
              id="calc-rooms"
              type="number"
              inputMode="decimal"
              min={1}
              max={10}
              step="0.5"
              value={inputs.rooms}
              onChange={(event) => update("rooms", event.target.value)}
              placeholder="Pl. 2"
            />
          </label>
        </div>
        <label htmlFor="calc-condition">
          Milyen állapotú a lakás?
          <select
            id="calc-condition"
            value={inputs.condition}
            onChange={(event) => update("condition", event.target.value)}
            required
          >
            <option value="">Válassz állapotot…</option>
            {CONDITIONS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <button className="button primary" type="submit" disabled={!ready}>
          Ársáv kiszámítása <span aria-hidden="true">→</span>
        </button>
      </form>

      {result && (
        <div
          className="calc-result"
          ref={resultRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
        >
          <p className="calc-result-label">
            Számított ársáv · mintaadatok alapján
          </p>
          <p className="calc-range">
            <strong>
              {fmt.format(result.min)} – {fmt.format(result.max)} Ft
            </strong>
          </p>
          <p className="calc-details">
            {result.districtLabel} · {result.area.toLocaleString("hu-HU")} m² ·{" "}
            {result.conditionLabel}
          </p>
          <p className="calc-note">
            A számítás alapja {fmt.format(result.pricePerSqm)} Ft/m² mintaár,
            állapot- és szobaszám-korrekcióval. A sáv a számított alapérték
            ±8%-a, nem a becslés pontosságát jelöli. Az emeletet, épülettípust,
            energetikát és további egyedi adottságokat ez a modell nem veszi
            figyelembe.
          </p>
          <a href="#kapcsolat" className="button primary">
            Személyes értékelést kérek <span aria-hidden="true">→</span>
          </a>
        </div>
      )}
      <p className="calc-footnote">
        A számítás a böngésződben történik, nem küldi el az adatokat. Családi
        ház vagy telek esetén kérj személyes egyeztetést.
      </p>
    </div>
  );
}

/** Demonstration data supplied with the feature request. These are NOT verified market prices.
 * Units are explicitly Ft/m²: 750 in the draft meant 750,000 Ft/m².
 * Do not remove the sample labels until local rates and assumptions have been reviewed.
 */
export const DISTRICTS = [
  { id: "belvaros", label: "Belváros", pricePerSqm: 750_000 },
  { id: "venkert", label: "Vénkert", pricePerSqm: 600_000 },
  { id: "kertvaros", label: "Kertváros", pricePerSqm: 600_000 },
  {
    id: "debrecen-egyeb",
    label: "Debrecen egyéb városrésze",
    pricePerSqm: 550_000,
  },
  { id: "halap", label: "Haláp", pricePerSqm: 480_000 },
  { id: "jozsa", label: "Józsa", pricePerSqm: 420_000 },
  { id: "kornyek", label: "Debrecen környéki település", pricePerSqm: 380_000 },
] as const;

export const CONDITIONS = [
  { id: "uj", label: "Új építésű", multiplier: 1.25 },
  { id: "felujitott", label: "Felújított, újszerű állapotú", multiplier: 1.15 },
  { id: "jo", label: "Jó / közepes állapotú", multiplier: 1 },
  { id: "felujitando", label: "Felújítandó", multiplier: 0.78 },
] as const;

export type CalculatorInputs = {
  district: string;
  area: string;
  rooms: string;
  condition: string;
};
export type CalculatorResult = {
  min: number;
  max: number;
  total: number;
  pricePerSqm: number;
  districtLabel: string;
  conditionLabel: string;
  area: number;
};

export function calculateValue(
  inputs: CalculatorInputs,
): CalculatorResult | null {
  const district = DISTRICTS.find((item) => item.id === inputs.district);
  const condition = CONDITIONS.find((item) => item.id === inputs.condition);
  const area = Number(inputs.area.trim().replace(",", "."));
  const rooms =
    inputs.rooms.trim() === ""
      ? null
      : Number(inputs.rooms.trim().replace(",", "."));
  if (
    !district ||
    !condition ||
    !Number.isFinite(area) ||
    area < 15 ||
    area > 500
  )
    return null;
  if (
    rooms !== null &&
    (!Number.isFinite(rooms) ||
      rooms < 1 ||
      rooms > 10 ||
      !Number.isInteger(rooms * 2))
  )
    return null;
  const roomAdjustment =
    rooms === 1 ? 1.04 : rooms !== null && rooms >= 4 ? 0.97 : 1;
  const total =
    district.pricePerSqm * area * condition.multiplier * roomAdjustment;
  const round = (value: number) => Math.round(value / 100_000) * 100_000;
  return {
    min: round(total * 0.92),
    max: round(total * 1.08),
    total,
    pricePerSqm: district.pricePerSqm,
    districtLabel: district.label,
    conditionLabel: condition.label,
    area,
  };
}

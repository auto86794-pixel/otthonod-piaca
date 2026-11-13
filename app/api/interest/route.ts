import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const reply = (error: string, status: number) =>
  NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });

// Tisztítás levágás nélkül; a túl hosszú vagy tiltott adat hibát eredményez.
const cleanText = (value: unknown): string =>
  typeof value === "string" && !/[\r\n<>]/.test(value)
    ? value.trim().replace(/\s+/g, " ") : "";
const cleanPhone = (value: unknown): string => {
  if (typeof value !== "string" || value.length > 40 || /[\r\n]/.test(value)) return "";
  let phone = value.trim().replace(/[ \t()\.\-–]/g, "");
  if (phone.startsWith("0036")) phone = "+36" + phone.slice(4);
  else if (phone.startsWith("06")) phone = "+36" + phone.slice(2);
  // Magyar formátum; vezetékes és mobil számhosszt is kezel. Nem előfizető-ellenőrzés.
  return /^\+36[1-9]\d{7,8}$/.test(phone) ? phone : "";
};
const isValidName = (name: string): boolean =>
  name.length >= 2 && name.length <= 80 && /\p{L}/u.test(name) && /^[\p{L}\p{M} '.’\-]+$/u.test(name);
const isValidLocation = (location: string): boolean =>
  location.length >= 2 && location.length <= 120 && /[\p{L}\d]/u.test(location) && /^[\p{L}\p{M}\d ,.'’\/():#\-]+$/u.test(location);

export async function POST(req: NextRequest) {
  const configuredEndpoint = process.env.FORMSPREE_CALLBACK_ENDPOINT?.trim() ?? "";
  let endpoint: URL;
  try {
    endpoint = new URL(configuredEndpoint);
    if (endpoint.protocol !== "https:" || endpoint.hostname !== "formspree.io" || endpoint.port || endpoint.username || endpoint.password || endpoint.search || endpoint.hash || !/^\/f\/[a-zA-Z0-9]+$/.test(endpoint.pathname)) throw new Error("invalid endpoint");
  } catch {
    console.error("Missing or invalid FORMSPREE_CALLBACK_ENDPOINT env variable");
    return reply("A küldés jelenleg nem elérhető. Kérjük, próbáld újra később.", 503);
  }
  const origin = req.headers.get("origin");
  const expectedOrigin = `${req.nextUrl.protocol}//${req.headers.get("host") || req.nextUrl.host}`;
  if (origin && origin !== expectedOrigin) return reply("Nem engedélyezett kérés.", 403);
  if (!req.headers.get("content-type")?.includes("application/json")) return reply("Érvénytelen kérés.", 415);
  if (Number(req.headers.get("content-length")) > 4096) return reply("Túl hosszú kérés.", 413);

  let raw = "";
  try {
    const reader = req.body?.getReader();
    if (!reader) return reply("Érvénytelen adatok.", 400);
    const decoder = new TextDecoder();
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) { await reader.cancel(); return reply("Túl hosszú kérés.", 413); }
      raw += decoder.decode(value, { stream: true });
    }
    raw += decoder.decode();
  } catch { return reply("Érvénytelen kérés.", 400); }

  let data: unknown;
  try { data = JSON.parse(raw); } catch { return reply("Érvénytelen adatok.", 400); }
  if (!data || typeof data !== "object" || Array.isArray(data)) return reply("Érvénytelen adatok.", 400);
  const fields = data as Record<string, unknown>;
  if (fields.website) return reply("A kérés nem küldhető el.", 400);
  const name = cleanText(fields.name);
  const phone = cleanPhone(fields.phone);
  const location = cleanText(fields.location);
  if (!isValidName(name)) return reply("Kérjük, add meg a neved (2–80 karakter).", 400);
  if (!phone) return reply("Kérjük, add meg a magyar telefonszámod (pl. +36 30 123 4567).", 400);
  if (!isValidLocation(location)) return reply("Kérjük, add meg az ingatlan helyét (2–120 karakter, pl. Debrecen, Hatvan utca).", 400);
  if (fields.consent !== "yes") return reply("Kérjük, fogadd el az adatkezelési tájékoztatót és a kapcsolatfelvételt.", 400);
  const requestedAt = new Date().toISOString();

  try {
    const response = await fetch(endpoint.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", Referer: `${expectedOrigin}/` },
      body: JSON.stringify({
        name,
        phone,
        location,
        source: "callback-form",
        consent: "Hozzájárulok a megadott adataim kezeléséhez a visszahívás céljából.",
        consent_version: "callback-v1",
        requested_at: requestedAt,
        _subject: "Új visszahíváskérés – Otthonod Piaca",
        message: `Név: ${name}\nTelefonszám: ${phone}\nIngatlan helye: ${location}\nForrás: callback-form\nAdatkezelési hozzájárulás: igen\nIdőpont (UTC): ${requestedAt}`,
      }),
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
      redirect: "error",
    });
    if (response.status === 429) return reply("Most túl sok kérés érkezett. Kérjük, próbáld újra egy perc múlva.", 429);
    if (!response.ok) {
      console.error("Formspree submission rejected", response.status);
      return reply("A küldés most nem sikerült. Kérjük, próbáld újra később.", 502);
    }
    // Formspree AJAX replies must be JSON; a challenge/HTML page is not a successful submission.
    const result: unknown = await response.json();
    if (!result || typeof result !== "object" || Array.isArray(result)) return reply("A fogadó szolgáltatás válasza nem ellenőrizhető. Kérjük, próbáld újra később.", 502);
    const accepted = result as Record<string, unknown>;
    if ((Array.isArray(accepted.errors) ? accepted.errors.length > 0 : !!accepted.errors) || accepted.error || accepted.ok === false || accepted.success === false) return reply("A fogadó szolgáltatás nem fogadta el a kérést. Kérjük, próbáld újra később.", 502);
    if (accepted.ok !== true && typeof accepted.next !== "string") return reply("Nem érkezett egyértelmű fogadási visszaigazolás. Kérjük, próbáld újra később.", 502);
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return reply("Nem sikerült visszaigazolni a küldést. Lehetséges, hogy a kérés már megérkezett. Kérjük, ne küldd el azonnal újra.", 502);
  }
}

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;
const FORMSPREE_ENDPOINT = "https://formspree.io/f/myewzjjg";
const reply = (error: string, status: number) =>
  NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: NextRequest) {
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
  const name = typeof fields.name === "string" ? fields.name.trim() : "";
  const phone = typeof fields.phone === "string" ? fields.phone.trim() : "";
  const location = typeof fields.location === "string" ? fields.location.trim() : "";
  const digits = phone.replace(/\D/g, "");
  if (name.length < 2 || name.length > 100 || location.length < 2 || location.length > 180 || phone.length > 25 || !/^\+?[0-9() /–-]+$/.test(phone) || digits.length < 7 || digits.length > 15 || fields.consent !== "yes") {
    return reply("Kérjük, ellenőrizd az adatokat és az adatkezelési hozzájárulást.", 400);
  }

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", Referer: `${expectedOrigin}/` },
      body: JSON.stringify({
        name,
        phone,
        location,
        consent: "Hozzájárulok a kapcsolatfelvételhez.",
        _subject: "Új visszahíváskérés – Otthonod Piaca",
        message: `Név: ${name}\nTelefonszám: ${phone}\nIngatlan helye: ${location}\nAdatkezelési hozzájárulás: igen`,
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
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return reply("Nem sikerült visszaigazolni a küldést. Lehetséges, hogy a kérés már megérkezett. Kérjük, ne küldd el azonnal újra.", 502);
  }
}

import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
const reply = (error: string, status: number) =>
  NextResponse.json({ error }, { status });
export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (origin && origin !== req.nextUrl.origin)
    return reply("Nem engedélyezett kérés.", 403);
  if (!req.headers.get("content-type")?.includes("application/json"))
    return reply("Érvénytelen kérés.", 415);
  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return reply("Érvénytelen kérés.", 400);
  }
  if (raw.length > 4096) return reply("Túl hosszú kérés.", 413);
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return reply("Érvénytelen adatok.", 400);
  }
  if (!data || typeof data !== "object")
    return reply("Érvénytelen adatok.", 400);
  if (data.website) return reply("A kérés nem küldhető el.", 400);
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const phone = typeof data.phone === "string" ? data.phone.trim() : "";
  const location =
    typeof data.location === "string" ? data.location.trim() : "";
  if (
    name.length < 2 ||
    name.length > 100 ||
    location.length < 2 ||
    location.length > 180 ||
    phone.length > 25 ||
    !/^\+?[0-9() /–-]+$/.test(phone) ||
    phone.replace(/\D/g, "").length < 7 ||
    phone.replace(/\D/g, "").length > 15 ||
    data.consent !== "yes"
  )
    return reply(
      "Kérjük, ellenőrizd az adatokat és az adatkezelési hozzájárulást.",
      400,
    );
  const key = req.headers.get("idempotency-key");
  if (!key || !/^[0-9a-f-]{36}$/i.test(key))
    return reply("Érvénytelen kérésazonosító.", 400);
  const api = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_FROM_EMAIL;
  const to = process.env.LEAD_TO_EMAIL;
  if (
    !api ||
    !from ||
    !to ||
    !process.env.NEXT_PUBLIC_CONTACT_NAME ||
    !process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
    !process.env.NEXT_PUBLIC_CONTROLLER_ADDRESS
  )
    return reply("Az online visszahíváskérés még nem aktív.", 503);
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${api}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `otthonodpiaca-${key}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: "Új visszahíváskérés – Otthonod Piaca",
        text: `Név: ${name}\nTelefonszám: ${phone}\nIngatlan helye: ${location}\n\nKapcsolatfelvételi hozzájárulás: igen`,
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!r.ok)
      return reply(
        "A küldés most nem sikerült. Kérjük, próbáld újra később.",
        502,
      );
    return NextResponse.json({ ok: true });
  } catch {
    return reply("Átmeneti kapcsolódási hiba. Kérjük, próbáld újra.", 502);
  }
}

# Otthonod Piaca – 1.1 / chat

Next.js webapp az elfogadott világos, zsályazöld–bézs látványterv alapján.

## Indítás Windows PowerShellben

Csomagold ki a ZIP-et például az `F:\otthonod-piaca` könyvtárba. A package.json közvetlenül ebben a könyvtárban legyen.

```powershell
cd F:\otthonod-piaca
npm ci
npm run build
npm run dev
```

Helyi cím: http://localhost:3000

## Tartalom

- Reszponzív magyar landing, saját optimalizált WebP nappalifotóval.
- Saját SVG logó és favicon, keresőbarát metaadatok, sitemap és robots.
- Működő oldalon belüli navigáció, értékesítési folyamat és lábléc.
- Név, telefonszám, ingatlan helye, adatkezelési hozzájárulás.
- Szerveroldali adatellenőrzés, honeypot, azonos eredet ellenőrzése.
- Resend e-mail-küldés, küldési állapot, hibajelzés és sikerüzenet.
- Szolgáltatói idempotenciakulcs a véletlen ismételt küldések ellen.

## E-mail és kapcsolati adatok

Másold a `.env.example` fájlt `.env.local` néven, majd töltsd ki. A Vercel Project → Settings → Environment Variables alatt is add meg ugyanezeket, majd indíts új deploymentet.

| Változó                        | Érték                                             |
| ------------------------------ | ------------------------------------------------- |
| RESEND_API_KEY                 | Saját Resend API-kulcs, csak szerveroldalon       |
| LEAD_FROM_EMAIL                | A Resendben hitelesített domainhez tartozó feladó |
| LEAD_TO_EMAIL                  | Az érdeklődéseket fogadó saját e-mail-cím         |
| NEXT_PUBLIC_CONTACT_NAME       | Az adatkezelő / szolgáltató teljes neve           |
| NEXT_PUBLIC_CONTACT_PHONE      | Megjelenő telefonszám, ajánlott +36 formátumban   |
| NEXT_PUBLIC_CONTACT_EMAIL      | Nyilvános kapcsolati e-mail-cím                   |
| NEXT_PUBLIC_CONTROLLER_ADDRESS | Az adatkezelő címe / székhelye                    |

A beállítások nélkül a látvány és a navigáció használható, de az űrlap nem küld és nem jelez megtévesztő sikert. Az adatok kitöltése után a build újrafuttatásával aktiválódik. A publikus változók a buildbe kerülnek, ezért ezeket kizárólag nyilvános kapcsolati adatokhoz használd.

Az adatkezelési oldal kiinduló szöveg: a tényleges működésnek, adatfeldolgozóknak és megőrzésnek megfelelően véglegesítsd publikálás előtt. Az e-mailben érkező megkeresések törléséről az adatkezelő gondoskodik. Nincs adatbázis vagy automatikus levelezési értesítőn túli CRM-mentés.

## Git → Vercel

Új, üres GitHub-repositoryhoz:

```powershell
cd F:\otthonod-piaca
git init
git add .
git commit -m "Otthonod Piaca – elso verzio"
git branch -M main
git remote add origin SAJAT_GITHUB_REPOSITORY_URL
git push -u origin main
```

A SAJAT_GITHUB_REPOSITORY_URL helyére a GitHubon létrehozott repository HTTPS-címe kerüljön.

Vercel: Add New → Project → repository importálása → Next.js automatikus felismerése → környezeti változók → Deploy. Root Directory a package.json mappája, Build Command: npm run build. Output Directory maradjon alapértelmezett.

A domaint csak a sikeres első deploy után kapcsold hozzá a Vercel Domains résznél. A DNS-rekordokat mindig az ott aktuálisan megadott értékekre állítsd. Ez a ZIP nem regisztrálja a domaint.

## Ellenőrzés

A csomag átadásakor a production build és a TypeScript ellenőrzés sikeres volt. A főoldalt, a képet és az űrlaphoz görgető gombot böngészőben is ellenőriztük. A beállítás nélküli végpont hibát ad, nem veszít el sikeresnek jelzett megkeresést.

Éles e-mail-kézbesítés csak a saját API-kulcs, hitelesített feladó és fogadó megadása után tesztelhető. Publikáláskor küldj egy próbaérdeklődést és ellenőrizd a célpostafiókot, valamint a Resend küldési naplóját.

Node.js: legalább 20.9; ajánlott aktuális LTS. A node_modules, .next és a titkos .env.local nem része a ZIP-nek.


## Chat – új ebben a csomagban

Beépítve: app/ChatWidget.tsx, app/api/chat/route.ts, a layout bekötése és az átadott zsályazöld chatstílusok. A sérült bemásolás javítva, a skip-link nem duplikálódik.

A chat Groqon az openai/gpt-oss-20b modellt használja. A beküldött llama-3.1-8b-instant modellt a szolgáltató a Free/Developer csomagokban kivezette (https://console.groq.com/docs/deprecations).

Az AI_API_KEY értéke továbbra is a Groq konzolból származó kulcs, nem OpenAI-kulcs. Helyben a meglévő .env.local fájlba kerüljön, Vercelen az Environment Variables beállításokba. Új függőség nem szükséges a chathez.

Az üzenetek az alkalmazásban csak az aktuális oldal memóriájában élnek; nincs chat-adatbázis. A chat szolgáltatói feldolgozásáról az adatkezelési szöveg és a panel alján látható tájékoztatás is frissült. Személyes adatot a Kapcsolat űrlapra irányítunk. A chat nem rögzít visszahíváskérést.

A 20 kérés/perc korlát IP-címenként, az adott szerverpéldány memóriájában működik, ezért több Vercel-példány között nem közös. Kiegészítő védelem, nem garantált globális kvóta. Nagyobb publikus forgalomhoz később megosztott korlátozó szükséges.

A hibás kérés, a hiányzó kulcs, a szimulált Groq-válasz, a szolgáltatói hiba, az időtúllépés és a kéréskorlátozás ellenőrzése: npm run test:chat. Ez nem használ éles kulcsot és nem küld Groq-kérést.

# Otthonod Piaca – 1.0

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

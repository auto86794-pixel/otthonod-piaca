# Otthonod Piaca – 1.4 / Kilépés előtti ajánlat

Teljes Next.js-projekt, az elfogadott világos zsályazöld–bézs landinggel, működő chatkóddal és Formspree-re átállított visszahíváskérő űrlappal.

## Helyi indítás

```cmd
cd /d F:\otthonod-piaca
npm ci
npm run build
npm run dev
```

Helyi cím: http://localhost:3000

## Visszahíváskérő űrlap

A cím már be van építve az app/api/interest/route.ts fájlba:

https://formspree.io/f/myewzjjg

A böngésző a saját /api/interest végpontunkat hívja. A szerver ellenőrzi az adatokat, a hozzájárulást és a honeypot mezőt, majd JSON-kéréssel továbbítja a megadott Formspree-űrlapnak. Nem kér és nem használ Resend-kulcsot, feladói címet vagy további e-mail-küldési környezeti változót.

Az űrlap gombja aktív, küldéskor átmenetileg letiltódik, a gyors dupla kattintást külön ref-zár is megakadályozza. Hiba esetén a kitöltött mezők megmaradnak. A sikerüzenet csak a fogadó szolgáltatás sikeres HTTP- és értelmezhető JSON-válasza után jelenik meg. Ez a szolgáltatói átvételt jelzi; a postafiókba történő tényleges kézbesítést külön kell ellenőrizni.

Hálózati időtúllépés után lehetséges, hogy a kérés már megérkezett. Nincs garantált, szolgáltatók közötti idempotencia vagy automatikus ismétlés. Ne nyomd meg sorozatosan újra a gombot.

A célpostafiók és az értesítések a saját Formspree-fiókban állíthatók. A szolgáltató fiókállapota, kvótája, értesítési beállításai, domainkorlátozása és spamvédelme a fogadást befolyásolhatja. Ha a szolgáltatás elutasít, a látogató hibát kap, nem téves sikerüzenetet.

## Környezeti változók

A meglévő .env.local fájlodat tartsd meg. Az AI_API_KEY továbbra is a chat Groq-kulcsa, kizárólag szerveroldali változó. Vercelen külön add meg, és új deployment után lesz használható. Ne tedd Gitbe, képernyőképre vagy üzenetbe a valódi kulcsot.

A nyilvános kapcsolati és adatkezelői adatok az alábbi változókkal tölthetők ki:

- NEXT_PUBLIC_CONTACT_NAME
- NEXT_PUBLIC_CONTACT_PHONE
- NEXT_PUBLIC_CONTACT_EMAIL
- NEXT_PUBLIC_CONTROLLER_ADDRESS

Ezek megjelenítéshez és az adatkezelési tájékoztató személyre szabásához kellenek; az űrlapot nem tiltják le. Mivel publikus változók, titkot ne tárolj bennük. Az adatkezelési tájékoztató az aktuális működést tükröző kiinduló szöveg; az adatkezelői adatokat és a tényleges megőrzési gyakorlatot véglegesíteni kell.

A régi RESEND_API_KEY, LEAD_FROM_EMAIL és LEAD_TO_EMAIL változókat az űrlap már nem használja. Ha a saját .env.local vagy Vercel-beállításaidban szerepelnek, nem szükségesek ehhez a projekthez.

## Chat

A korábbi csomag chatkomponense és Groq API-kapcsolata változatlanul megmaradt. A modell openai/gpt-oss-20b, a kulcs AI_API_KEY néven konfigurálható. A chat nem rögzít visszahíváskérést, arra az űrlap szolgál.

## Ellenőrzések

```cmd
npm run test:calculator
npm run test:interest
npm run test:chat
npm run build
```

A tesztek minden szolgáltatói kérést szimulálnak, ezért nem küldenek valódi Formspree-bejegyzést, e-mailt vagy Groq-kérést. A Formspree-teszt ellenőrzi az adatvalidációt, a fix célcímet, a mezőket, a Resend-függőség megszűnését, a sikert, a 429-es korlátot, a szolgáltatói elutasítást, a nem JSON választ és a hálózati hibát.

Böngészőben ellenőrizve: aktív gomb, beviteli mezők, hozzájárulás, hibás telefonszám elutasítása és az adatok megtartása. Éles Formspree-próbaküldés és a célpostafiók kézbesítési ellenőrzése nem történt a csomag készítésekor; ezt az élesítés után a saját fiókban kell ellenőrizni.

## Technikai adatok

Next.js 16.4.6, React 19.3.1, TypeScript. Node.js legalább 20.9, ajánlott aktuális LTS. A node_modules, .next, .git és a titkos .env.local nem része a csomagnak.

## Lakásár-kalkulátor

A benefit szekció után jelenik meg. Az app/ValueCalculator.tsx a felület, az app/lib/valuation.ts tartalmazza a számítást és a módosítható árakat. Minden ár Ft/m²-ben szerepel: a küldött 750-es érték 750 000 Ft/m² mintaárként került be. A mintaárak nem ellenőrzött, aktuális piaci adatok. Ez a változat bemutató; valós értékbecsléshez az árakat és a korrekciókat helyi szakmai adatokkal kell beállítani. A felület ezt a számítás előtt és az eredménynél is jelzi.

A bizonytalan vagy kevert helymegnevezések helyett külön Belváros, Vénkert, Kertváros, egyéb debreceni városrész, Haláp, Józsa és környéki település opciók szerepelnek. Újszentmargita, Hatvan és a bizonytalan „Nagyerő” megnevezés nem kapott önkényes helyi árat.

A modell az alapterületet, állapotot és opcionális szobaszámot kezeli. A ±8%-os ársáv nem statisztikai pontosságot jelent. Nem veszi figyelembe például az épülettípust, emeletet vagy energetikát. Ház és telek esetén személyes egyeztetés javasolt. A számítás helyben történik, nem küld adatot külső szolgáltatásnak.

Ellenőrizve: helyes Ft-egység, állapot- és szobaszám-szorzók, szélsőértékek, érvénytelen mezők. Böngészőben a 62 m²-es belvárosi mintapélda 42,8–50,2 millió Ft sávot ad; módosításkor az eredmény eltűnik, 14 m² esetén a számítás nem indítható. A kalkulátor-, chat- és űrlaptesztek, valamint a production build sikeresek.

## Kilépés előtti ajánlat

Az app/ExitModal.tsx a főoldalon jelenít meg ajánlatot. Asztali gépen az egér felső kilépésekor, érintős készüléken legalább 300 px olvasás után a tetejére történő gyors visszagörgetéskor. Csak a megnyitást követő első 15 másodpercben aktív; ezután nem jelenik meg. Munkamenetenként legfeljebb egyszer, sessionStorage alapján. Tiltott tárhely esetén a komponens élettartama alatt egyszeri. Űrlap vagy chat aktív kitöltése közben nem nyílik meg.

A natív dialog kezeli a modális fókuszt; Esc, bezárógomb, háttérkattintás és a „Most nem kérem” gomb zárja. A fő gomb a #kapcsolat űrlaphoz visz, nem a mintaáras kalkulátorhoz. Nincs automatikus kapcsolatfelvétel, küldés vagy el nem fogadott válaszidő-ígéret. Csökkentett mozgás beállítást támogat.

Ellenőrzés: npm run test:exit. A szimulált teszt ellenőrzi az egyszeri megjelenést, 15 másodperces korlátot, útvonalat, aktív bevitelt, mobil görgetési feltételt és eseménykezelők takarítását. Production build és a korábbi három teszt sikeres. A modál kézi böngészős megjelenési tesztje a csomag készítésekor nem történt meg.

# Otthonod Piaca – 1.9 / Űrlapfinomítás

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

A visszahíváskérés címét a FORMSPREE_CALLBACK_ENDPOINT szerveroldali környezeti változó adja meg; a PDF-igényléshez a FORMSPREE_ENDPOINT kell. Nincs kódba épített tartalék cím.

A böngésző a saját /api/interest végpontunkat hívja. A szerver ellenőrzi az adatokat, a hozzájárulást és a honeypot mezőt, majd JSON-kéréssel továbbítja a megadott Formspree-űrlapnak. Nem kér és nem használ Resend-kulcsot, feladói címet ; a két Formspree-cél megadása viszont kötelező.

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

A tesztek minden szolgáltatói kérést szimulálnak, ezért nem küldenek valódi Formspree-bejegyzést, e-mailt vagy Groq-kérést. A Formspree-teszt ellenőrzi az adatvalidációt, az env-ből olvasott célcímet, a mezőket, a Resend-függőség megszűnését, a sikert, a 429-es korlátot, a szolgáltatói elutasítást, a nem JSON választ és a hálózati hibát.

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

## Ötlépéses eladási folyamat

Az app/ProcessSection.tsx önálló szerverkomponens. A korábbi háromlépéses szakaszt váltja; a kalkulátor után és a kapcsolati űrlap előtt jelenik meg. A #folyamat hivatkozások az új idővonalra visznek, a szakasz gombja a #kapcsolat űrlapra vezet. A sérült szövegek javítva, az ügyvédi jogi munka külön megnevezve. A mobilos CSS kisebb köröket és térközöket használ, 16 px-es szöveggel.

## SEO-előkészítés

Magyar SEO-cím és címsablon, személyes értékbecsléshez igazított leírás, kulcsszavak, Open Graph és Twitter-kártya a meglévő nappalifotóval. A főoldal canonical címe az otthonodpiaca.hu. A sitemap és robots ugyanezt a domaint használja. Az adatkezelési oldal noindex marad, de a robotok olvashatják ezt az utasítást.

A generált production HTML-ben ellenőrizve: cím, canonical, OG-siteName, Twitter-kártya, adatkezelési címsablon és noindex. Build hibamentes. A domain csatlakoztatása, HTTPS és Search Console-beküldés későbbi lépés.

## GYIK és Analytics

A hatkérdéses GYIK az eladási folyamat után, az űrlap előtt található. Egyszerre egy válasz nyitott, újabb kattintással az is bezárható. Natív gombok, aria-expanded és aria-controls, rejtett válaszpanelek, hosszkorlát nélküli válaszok. A FAQPage JSON-LD ugyanazokat a kérdéseket és válaszokat tartalmazza; nem ígér keresőbeli kiemelt találatot. A végleges jutalék- és költségfeltételeknek egyezniük kell a közzétett válaszokkal.

Az @vercel/analytics csomag és az Analytics komponens bekerült a layoutba, a widgetek után. A Vercel projekt Analytics / Web Analytics részében külön engedélyezni kell a mérést, majd szükség esetén új deployment. A szolgáltatói adatgyűjtés és a dashboard megjelenése nem volt élőben ellenőrizhető. Nem adtunk hozzá saját eseményeket, űrlap- vagy chattartalmat. Az adatkezelési oldal kiegészült a mérés megnevezésével.

Ellenőrizve: production build, GYIK állapotváltás és bezárás, ARIA-kapcsolatok, látható válaszokkal egyező JSON-LD, valamint a korábbi négy funkcionális teszt. npm run test:faq. Kézi mobilos és böngészős megjelenési teszt még szükséges.

## PDF útmutató és e-mailes igénylés

Sorrend: hero (a meglévő előnyökkel), kalkulátor, ötlépéses folyamat, GYIK, PDF-igénylés, kapcsolati űrlap. A chat megmaradt, WhatsApp és új telefonszámos elem nem került be.

A négylapos public/otthonod-piaca-5-hiba.pdf saját szerkesztésű eladói útmutató: árazás, fotók, előkészítés, hirdetési adatok, érdeklődők és alku. Az 1-2 milliós hatás nem általánosított állítás: a PDF csak egy 60 millió Ft × 2% = 1,2 millió Ft szemléltető számolást tartalmaz. Az oldal címe nem ígér konkrét árnyereséget. A PDF végén ellenőrzőlista és a kapcsolati szekcióra mutató link van. Újragenerálás: scripts/create-guide.py, Python reportlab és a scriptben megadott DejaVu fontok szükségesek.

A LeadMagnetSection külön osztályokat használ, így a korábbi .lead-form stílusait nem írja felül. A /api/lead a meglévő Formspree-címre küldi az e-mailt, forrást, időpontot és két külön hozzájárulás állapotát. Az adatkezelési hozzájárulás kötelező; az egyszeri e-mailes egyeztetés önkéntes és alapból nincs bejelölve. Ha a contact_consent mezőben „Nem kérek megkeresést.” szerepel, az igénylőt ne keresd meg értékesítési céllal. Nem indul automatikus hírlevél, levélküldés vagy visszahívás.

A PDF-link szolgáltatói sikeres átvétel után válik láthatóvá. Külön kattintás menti a fájlt; a felület nem állítja, hogy már elindult a letöltés. A public mappából a PDF közvetlen URL-en is hozzáférhető, ez nem hozzáférés-védett dokumentumtár.

Az új API kezeli a hibás adatokat, hozzájárulás hiányát, honeypot mezőt, túlméretes törzset, szolgáltatói elutasítást, 429-et, nem JSON választ és időtúllépést. Az eredeti űrlaphoz hasonlóan a szolgáltató spamvédelmére és kvótájára támaszkodik; nincs garantált szolgáltatóközi idempotencia. Időtúllépésnél ne küldj újra azonnal. Egyedi mezőkövetelmények a Formspree-fiókban megakadályozhatják az e-mail-only igénylést; ezt éles saját próbaküldéssel ellenőrizni kell.

Ellenőrzések: npm run test:lead, npm run test:lead-ui, a korábbi öt teszt és production build. Minden külső küldés szimulált volt, tényleges Formspree-bejegyzést nem hoztunk létre. A PDF mind a négy oldalát renderelve ellenőriztük. Az Analytics dashboardon beérkező adatot és a Vercel preview-t a csomag készítésekor nem ellenőriztük élőben.

## Űrlapfinomítás - kötelező új konfiguráció

A .env.local fájlhoz add hozzá, meglévő kulcsaid megőrzésével:

```env
FORMSPREE_ENDPOINT=https://formspree.io/f/myewzjjg
FORMSPREE_CALLBACK_ENDPOINT=https://formspree.io/f/myewzjjg
```

Ugyanezek külön szükségesek a Vercel projekt környezeti változói között is. A .env.local nem kerül Gitbe; önmagában nem állítja be az éles környezetet. A Vercel értékek mentése után új deployment szükséges. Mindkét cél jelenleg azonos, később külön Formspree-űrlap is megadható.

A szerver mindkét címet futásidőben ellenőrzi: kizárólag https://formspree.io/f/azonosito fogadható el, hitelesítési adatok, query és fragment nélkül. Hiányzó vagy hibás cél 503-at ad, és nem indul továbbítás. Nincs titok vagy teljes URL a naplózott hibaüzenetben.

A meglévő LeadForm és /api/interest maradt használatban, nem keletkezett párhuzamos CallbackForm vagy /api/callback. A név 2-80, a hely 2-120 karakter, levágás nélkül; a név és cím szóközei normalizálódnak. Magyar mobil és vezetékes számok +36 formára alakulnak (06, 0036 és +36 bemenetből). Ez formátumellenőrzés, nem az előfizetés vagy a hívhatóság igazolása. A CR/LF, HTML-jelölés, nem támogatott formátum és hiányzó hozzájárulás hibát ad. A helymező támogatja például az 1/B házszámot is.

A visszahíváskérés tartalmazza a callback-form forrást, callback-v1 hozzájárulás-verziót és UTC időpontot. Mindkét API egyértelmű szolgáltatói visszaigazolást vár. A UI zárolja a dupla küldést, hiba esetén megőrzi a mezőket, siker esetén a visszajelzésre helyezi a fókuszt. A mobiltelefon-billentyűzet inputMode=tel alapján nyílik. A PDF sikeres igénylése után megjelenik a kapcsolati szekcióra mutató szöveges link.

Ellenőrizve: konfiguráció hiánya/hibája, két külön cél, telefonszám-normalizálás, mezőhatárok, hozzájárulás, szolgáltatói hibák, dupla küldés és UI-visszajelzés szimulált tesztekkel. Production build sikeres. Éles Formspree-küldés, Vercel-konfigurálás és böngészős megjelenési próba nem történt ebben a csomagban.

```cmd
npm run test:interest
npm run test:callback-ui
npm run test:lead
npm run test:lead-ui
```

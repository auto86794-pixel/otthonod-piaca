# Frissítés – 1.8 / PDF útmutató

Másold a ZIP tartalmát az F:\otthonod-piaca mappába felülírással. A saját .env.local és .git maradjon meg.

```cmd
cd /d F:\otthonod-piaca
npm ci
npm run test:lead
npm run test:lead-ui
npm run build
```

A PDF a public mappában van, nem kell külön feltölteni. Új környezeti változó nem kell, a meglévő Formspree-cím fogadja a PDF-igényléseket is.

Vercel zöld után Ctrl+F5, majd saját e-mail-címmel próbáld ki az igénylést. A kötelező adatkezelési jelölő után küldhető, a megkeresés kérése külön, önkéntes. Siker után a letöltés gombbal nyitható/menthető a PDF. Ellenőrizd a Formspree-bejegyzést és az értesítő e-mailt; automatikus levelet az igénylőnek nem állítottunk be.

Ellenőrizd mobilon a két űrlapot, a chatet, a PDF olvashatóságát, a /robots.txt és /sitemap.xml útvonalakat. A mintaáras kalkulátor változatlanul bemutató számítás.

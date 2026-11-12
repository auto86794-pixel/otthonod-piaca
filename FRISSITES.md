# Frissítés a meglévő projektre

1. Állítsd le a futó fejlesztői szervert (Ctrl+C).
2. A ZIP tartalmát másold az F:\otthonod-piaca mappába, és engedélyezd az azonos nevű projektfájlok felülírását.
3. A saját .env.local fájlodat és a .git könyvtárat tartsd meg. A ZIP ezeket nem tartalmazza. A .env.example csak minta, nem helyettesíti a .env.local fájlt.
4. CMD:

```cmd
cd /d F:\otthonod-piaca
npm ci
npm run build
npm run test:chat
npm run dev
```

A helyi .env.local fájlban szerepeljen:

```env
AI_API_KEY=sajat_groq_kulcs
```

A kulcs után ne maradjon szóköz. Valódi kulcsot ne tegyél Gitbe vagy chatüzenetbe.

5. Nyisd meg a http://localhost:3000 oldalt, kattints a chat ikonra és kérdezd: Hogyan indul az ingatlaneladás?
6. Ha a build és a helyi próba rendben van:

```cmd
git add .
git commit -m "Otthonod Piaca - AI chat beepitese"
git push
```

7. Vercel → projekt → Settings → Environment Variables: AI_API_KEY, a saját Groq-kulcsoddal. Állítsd be Production környezetre (Previewra is, ha ott is használni szeretnéd). Ezután indíts Redeploy-t. A helyi .env.local nem kerül át automatikusan a Vercelre.

Ha a Vercelen megjelenik a chat, de még nem válaszol, ellenőrizd az AI_API_KEY meglétét, az új deploymentet és a Groq projekt hozzáférését / kvótáját. A kulcsot továbbra se tedd képernyőképre.

## Ellenőrzés a csomag készítésekor

- Production build és TypeScript: sikeres.
- API-szerződés és hibakezelés: automatikus, szimulált szolgáltatói válaszokkal ellenőrizve.
- Böngészőben: nyitás, szövegbevitel, küldés, hiányzó kulcs jelzése, beírt kérdés megőrzése, Escape és újranyitás ellenőrizve.
- Valódi Groq-válasz: a saját, helyben tárolt kulcsoddal kell ellenőrizni. A csomag készítésekor nem állt rendelkezésre éles kulcs.

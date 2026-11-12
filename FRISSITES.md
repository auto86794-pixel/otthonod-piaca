# Frissítés Formspree-re

1. Állítsd le a futó helyi szervert (Ctrl+C).
2. A ZIP tartalmát másold az F:\otthonod-piaca mappába, és írd felül az azonos nevű projektfájlokat.
3. A saját .env.local és .git fájlokat / mappát tartsd meg. A csomag ezeket nem tartalmazza.
4. CMD:

```cmd
cd /d F:\otthonod-piaca
npm ci
npm run build
```

Ha a build hibamentes:

```cmd
git add .
git commit -m "Visszahivaskeres atallitasa Formspree-re"
git push
```

A Formspree-cím már a kódban szerepel: https://formspree.io/f/myewzjjg

Az űrlaphoz új Vercel környezeti változó nem szükséges. Az AI_API_KEY maradjon meg, azt továbbra is a chat használja.

A Vercel zöld állapota után töltsd újra az éles oldalt (Ctrl+F5), és küldj egy saját próbaérdeklődést. A gomb már aktív lesz, de a mezők és a hozzájárulás kitöltése kötelező. Ellenőrizd a Formspree-fiók beérkezett bejegyzéseit és a célpostafiókot, szükség esetén a levélszemét mappát is.

Ha a gomb még szürkén, „hamarosan elérhető” szöveggel jelenik meg, a korábbi verziót látod: ellenőrizd, hogy ez a csomag került-e Gitbe és az új Vercel-deploymentbe.

A teljes helyi ellenőrzés opcionálisan:

```cmd
npm run test:interest
npm run test:chat
```

Ezek szimulált tesztek, nem küldenek valódi megkeresést.

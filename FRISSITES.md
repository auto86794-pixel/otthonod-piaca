# Frissítés – 1.3 / Kalkulátor

1. Állítsd le a helyi szervert (Ctrl+C).
2. A ZIP tartalmával írd felül az F:\otthonod-piaca projekt azonos nevű fájljait.
3. A saját .env.local fájlodat és .git mappádat tartsd meg.
4. CMD-ben:

```cmd
cd /d F:\otthonod-piaca
npm ci
npm run test:calculator
npm run build
npm run dev
```

A kalkulátor a három előnykártya után jelenik meg. Jelenleg egyértelműen jelölt mintaárakkal működik. Saját piaci árakat az app/lib/valuation.ts fájlban, Ft/m² egységben állíthatsz be; az eredményt addig ne kezeld hiteles piaci értékbecslésként.

A Formspree-űrlap és a Groq-chat meglévő kódja megmaradt. Új környezeti változó nem kell.

Helyi ellenőrzés után:

```cmd
git add .
git commit -m "Lakasar kalkulator beepitese"
git push
```

Vercel zöld után Ctrl+F5. A teljes szimulált ellenőrzéshez npm run test:interest és npm run test:chat is futtatható; ezek nem küldenek valódi üzenetet.

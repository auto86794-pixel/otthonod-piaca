# Frissítés – 1.7 / GYIK és Analytics

Másold a ZIP tartalmát az F:\otthonod-piaca mappába felülírással. A saját .env.local fájlt és .git mappát tartsd meg.

```cmd
cd /d F:\otthonod-piaca
npm ci
npm run test:faq
npm run build
```

Git és Vercel zöld után Ctrl+F5. Ellenőrizd a GYIK hat kérdését, kattintással és billentyűzettel a nyitást/bezárást, mobilon a teljes válaszszöveget.

Vercel projekt → Analytics / Web Analytics → Enable. Ezután szükség esetén új deployment, majd valódi oldalmegnyitás után a dashboardon ellenőrizhető a mérés. A bekötött kód önmagában nem igazolja a beérkező statisztikát.

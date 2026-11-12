# Frissítés – 1.4 / Kilépés előtti ajánlat

A ZIP tartalmát másold az F:\otthonod-piaca mappába felülírással. A .env.local fájlodat és a .git mappát tartsd meg.

```cmd
cd /d F:\otthonod-piaca
npm ci
npm run test:exit
npm run build
```

Hibamentes build után Git és Vercel a szokásos módon.

Teszt: frissen megnyitott böngészőfülön az első 15 másodpercben vidd az egeret az oldal tetején túlra. A modál egyszer jelenjen meg. Esc-pel zárható, és ugyanabban a munkamenetben nem nyílik újra. A fő gomb a kapcsolati űrlapra visz. A sessionStorage megmarad újratöltéskor, így újabb megjelenési próbához új munkamenet kell.

Mobilon görgess le legalább 300 px-t, majd gyorsan vissza az oldal tetejére, szintén az első 15 másodpercen belül. Az adatkezelési oldalon nem jelenik meg.

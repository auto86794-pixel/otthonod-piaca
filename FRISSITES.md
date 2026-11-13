# Frissítés - 1.9 / Űrlapfinomítás

1. Másold a ZIP tartalmát az F:\otthonod-piaca mappába felülírással; a .env.local és .git maradjon meg.
2. A meglévő .env.local végére add hozzá (az AI_API_KEY és egyéb adatok megőrzésével):

```env
FORMSPREE_ENDPOINT=https://formspree.io/f/myewzjjg
FORMSPREE_CALLBACK_ENDPOINT=https://formspree.io/f/myewzjjg
```

3. Ugyanezt a két változót a Vercel projekt Settings / Environment Variables részében is add meg a használt környezetekhez. Ez szükséges az éles küldéshez! A .env.local nem kerül a Vercelbe Gitből.
4. CMD:

```cmd
cd /d F:\otthonod-piaca
npm ci
npm run test:interest
npm run test:callback-ui
npm run test:lead
npm run test:lead-ui
npm run build
```

5. Hibamentes build után Git, majd új Vercel deployment (az env mentése után).
6. Éles saját próba mindkét űrlappal: visszahívásnál próbáld a 06 30 123 4567 alakot a saját számoddal; ellenőrizd a +36 alakot a Formspree-bejegyzésben. A teszteléshez saját, hívható számodat használd. PDF-igénylés után megjelenik a visszahíváslink.

Hiányzó vagy hibás env-nél a szerver 503-as választ ad. Ez szándékos: hibás beállításnál nem küld másik célra.

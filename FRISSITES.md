# Frissítés – 1.6 / SEO

Másold a ZIP tartalmát az F:\otthonod-piaca projektbe felülírással. A saját .env.local és .git maradjon meg.

```cmd
cd /d F:\otthonod-piaca
npm ci
npm run build
```

Hibamentes build után Git, majd Vercel. A látvány változatlan; a SEO-adatok az oldal forrásában jelennek meg. A végleges domain csatlakoztatása után ellenőrizhető a HTTPS, a /robots.txt és a /sitemap.xml, majd beküldhető a sitemap a Search Console-ba.

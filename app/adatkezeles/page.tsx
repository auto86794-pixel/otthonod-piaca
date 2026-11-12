import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Adatkezelési tájékoztató",
  robots: { index: false, follow: true },
};
export default function Privacy() {
  const name = process.env.NEXT_PUBLIC_CONTACT_NAME;
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const address = process.env.NEXT_PUBLIC_CONTROLLER_ADDRESS;
  return (
    <main className="legal" id="tartalom">
      <a className="back" href="/">
        ← Vissza a főoldalra
      </a>
      <h1>Adatkezelési tájékoztató</h1>
      {!name || !email || !address ? (
        <p>
          Az adatkezelő adatai és a végleges tájékoztató feltöltés alatt állnak.
        </p>
      ) : (
        <>
          <h2>Adatkezelő</h2>
          <p>
            {name}
            <br />
            {address}
            <br />
            <a href={"mailto:" + email}>{email}</a>
          </p>
          <h2>A kapcsolatfelvétel célja és adatai</h2>
          <p>
            A visszahíváskérő űrlapon megadott nevet, telefonszámot és az
            ingatlan helyét az érdeklődés megválaszolására és az ingatlannal
            kapcsolatos személyes egyeztetésre használjuk. A kapcsolatfelvétel
            hozzájáruláson alapul, nem jelent hírlevél-feliratkozást.
          </p>
          <h2>Továbbítás és megőrzés</h2>
          <p>
            A megkeresés e-mailben jut el az adatkezelőhöz. A tárhelyet a
            Vercel, az űrlapadatok fogadását és az e-mail-értesítést a Formspree biztosítja. Az adatokat az
            egyeztetés lezárását követő legfeljebb 90 napig őrizzük meg, kivéve,
            ha az érintettel külön megbízás jön létre vagy más megőrzési
            kötelezettség merül fel.
          </p>
          <h2>Kérések és jogok</h2>
          <p>
            A fenti e-mail-címen kérhetsz tájékoztatást, hozzáférést,
            helyesbítést, törlést vagy az adatkezelés korlátozását, és
            visszavonhatod hozzájárulásodat. A visszavonás a korábbi adatkezelés
            jogszerűségét nem érinti. Panasszal a Nemzeti Adatvédelmi és
            Információszabadság Hatósághoz fordulhatsz:{" "}
            <a href="https://naih.hu">naih.hu</a>.
          </p>
          <h2>Sütik és mérés</h2>
          <p>
            Az oldal nem használ marketing- vagy analitikai sütiket. Az űrlap
            adatait nem tároljuk a böngészőben.
          </p>
        </>
      )}
      <h2>Az űrlapadatok továbbítása</h2>
      <p>
        A visszahíváskérő űrlapon megadott nevet, telefonszámot, az ingatlan helyét
        és a hozzájárulást a Formspree szolgáltatásának továbbítjuk. A beküldés a
        szolgáltatás felületén tárolódik, és a beállított kapcsolattartónak
        e-mail-értesítés küldhető róla. Az adatokat a kapcsolatfelvétel és az
        ingatlannal kapcsolatos egyeztetés céljára használjuk; ez nem
        hírlevél-feliratkozás. Az alkalmazás nem menti az adatokat a böngésző
        tartós tárhelyére.
      </p>
      <h2>PDF útmutató igénylése</h2>
      <p>
        Az útmutató igénylésekor az e-mail-címet, az adatkezelési hozzájárulást,
        az esetlegesen kért egyszeri e-mailes megkeresés jelzését, a forrást
        és az igénylés időpontját a Formspree szolgáltatásnak továbbítjuk.
        A PDF az oldalon tölthető le; automatikus hírlevél vagy e-mail nem indul.
        Az egyszeri értékesítési egyeztetés külön, önkéntes hozzájáruláshoz kötött,
        és nem feltétele a letöltési link megjelenítésének.
      </p>
      <p>
        Az igénylési adatokat a kérés kezeléséhez használjuk, legfeljebb 90 napig
        őrizzük meg, kivéve, ha külön megbízás jön létre vagy más megőrzési
        kötelezettség merül fel. Törlést és a hozzájárulás visszavonását a fenti
        kapcsolati címen kérheted. A tényleges adatkezelést az adatkezelő végleges
        adataival és megőrzési gyakorlatával összhangban kell végezni.
      </p>
      <h2>Látogatottsági statisztika</h2>
      <p>
        Az oldal a Vercel Web Analytics szolgáltatását használja az
        oldalmegtekintések és a látogatottság összesített mérésére.
        Az űrlapmezők és a chatüzenetek tartalmát nem adjuk át analitikai
        eseményként. A szolgáltatás működéséről és adatkezeléséről a
        {" "}<a href="https://vercel.com/docs/analytics/privacy-policy">Vercel tájékoztatója</a> ad részletes információt.
      </p>
      <h2>AI chat asszisztens</h2>
      <p>
        A chatbe beírt üzeneteket válaszadás céljából a Groq szolgáltatásának
        továbbítjuk. A beszélgetés az oldal megnyitott példányának memóriájában
        marad, újratöltéskor törlődik; az alkalmazás nem menti adatbázisba vagy
        böngészőtárba. A szolgáltatói adatkezelésről a Groq saját tájékoztatója
        rendelkezik. A chatben ne adj meg telefonszámot, e-mail-címet vagy más
        bizalmas adatot; visszahívást a Kapcsolat űrlapján kérhetsz.
      </p>
      <p>
        Az asszisztens tájékoztató válaszokat ad, nem készít személyre szabott
        értékbecslést és nem rögzít megbízást. A túl gyakori kérések
        korlátozásához a szerverpéldány rövid ideig memóriában tartja a kérések
        IP-címét és időpontját.
      </p>
    </main>
  );
}

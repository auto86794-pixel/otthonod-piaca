const STEPS = [
  {
    emoji: "⚡",
    title: "1. Ingyenes értékbecslés",
    text: "Helyismeret és összehasonlítható ingatlanok alapján átbeszéljük, milyen ársávban érdemes piacra lépned Debrecenben és környékén.",
  },
  {
    emoji: "🧹",
    title: "2. Felkészítés eladásra",
    text: "Közösen átnézzük, mit érdemes rendbe tenni az eladás előtt, és mely kiadások kerülhetők el. Átgondolt felkészítéssel mutatjuk meg az otthonod értékeit.",
  },
  {
    emoji: "📸",
    title: "3. Marketing indul",
    text: "Igényes fotókkal, átgondolt hirdetésszöveggel és egyeztetett hirdetési csatornákon mutatjuk be az ingatlanod a lehetséges vevőknek.",
  },
  {
    emoji: "🗝️",
    title: "4. Megtekintések",
    text: "Egyeztetem az érdeklődők igényeit, megszervezem veled a megtekintések időpontját, és visszajelzést adok a vevői tapasztalatokról.",
  },
  {
    emoji: "🤝",
    title: "5. Szerződés és átadás",
    text: "Segítek az egyeztetésekben és az átadás előkészítésében, az ügyvédi szerződéskötéshez szükséges lépések összehangolásától a kulcsátadásig. A jogi feladatokat ügyvéd végzi.",
  },
];

export default function ProcessSection() {
  return (
    <section className="section process-section" id="folyamat" aria-labelledby="process-title">
      <div className="section-inner wrap">
        <p className="eyebrow">EGYÜTT, LÉPÉSRŐL LÉPÉSRE</p>
        <h2 className="section-title" id="process-title">Így adom el a lakásod – 5 lépésben</h2>
        <p className="section-lead">Átlátható folyamat az első egyeztetéstől a kulcsátadásig. Minden lépésnél tudod, hol tartunk, és mi következik.</p>
        <ol className="process-timeline">
          {STEPS.map((step) => (
            <li className="process-step" key={step.title}>
              <span className="process-emoji" aria-hidden="true">{step.emoji}</span>
              <div><h3>{step.title}</h3><p>{step.text}</p></div>
            </li>
          ))}
        </ol>
        <div className="process-cta">
          <a href="#kapcsolat" className="button primary">Kezdjünk az ingyenes értékbecsléssel</a>
        </div>
      </div>
    </section>
  );
}

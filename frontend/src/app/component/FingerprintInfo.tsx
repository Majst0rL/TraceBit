//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\component\FingerprintInfo.tsx

export default function FingerprintInfo() {
  const items = [
    {
      title: "Kaj je prstni odtis brskalnika?",
      desc: "Prstni odtis brskalnika je edinstven profil, zbran o tvoji napravi in brskalniku, ki se uporablja za sledenje tvoji spletni aktivnosti na različnih spletnih straneh."
    },
    {
      title: "Kako deluje",
      desc: "Združuje podatke iz nastavitev brskalnika, vtičnikov, ločljivosti zaslona, pisav in drugih konfiguracij za ustvarjanje edinstvene identifikacijske oznake."
    },
    {
      title: "Zakaj je to pomembno",
      desc: "Prstni odtis se lahko uporablja za ciljno oglaševanje, varnostne namene ali za povezovanje tvoje aktivnosti tudi, če izbrišeš piškotke."
    },
  ];

  return (
    <section className="py-16 px-6 text-center">
      <h2 className="text-2xl font-bold mb-12">Razumevanje prstnega odtisa brskalnika</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {items.map(({ title, desc }, idx) => (
          <div key={idx} className="bg-white p-6 shadow rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-gray-600">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

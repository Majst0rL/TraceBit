//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\component\intro.tsx

import Link from "next/link";

export default function IntroSekcija() {
  return (
    <section className="text-center py-20" style={{ backgroundColor: '#ededed' }}>
      <h1 className="text-4xl font-bold mb-4 text-black">Razkrij svojo digitalno sled</h1>
      <p className="text-gray-600 mb-6 max-w-xl mx-auto">
        Odkrij edinstven prstni odtis, ki ga pušča tvoj brskalnik, in razumi njegov vpliv na tvojo spletno zasebnost.
      </p>
      <Link href="/podatki">
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg">Analiziraj svoj prstni odtis</button>
      </Link>
      
    </section>
  );
  /*href="/podatki?fromButton=true"*/
}

//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\component\intro.tsx

import Link from "next/link";

export default function IntroSekcija() {
  return (
    <section className="text-center py-20" style={{ backgroundColor: '#ededed' }}>
      <h1 className="text-4xl font-bold mb-4 text-black">Reveal your digital footprint</h1>
      <p className="text-gray-600 mb-6 max-w-xl mx-auto">
        Discover the unique fingerprint your browser leaves behind and understand its impact on your online privacy.
      </p>
      <Link href="/podatki">
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg">Analyze your fingerprint</button>
      </Link>
      
    </section>
  );
  /*href="/podatki?fromButton=true"*/
}

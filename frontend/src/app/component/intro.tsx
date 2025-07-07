//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\component\intro.tsx

type IntroSekcijaProps = {
  onAnalyzeClick?: () => void; // Lahko tudi obvezen, če želiš
};

export default function IntroSekcija({ onAnalyzeClick }: IntroSekcijaProps) {
  return (
    <section className="text-center py-5" style={{ backgroundColor: '#ededed' }}>
      <h1 className="text-4xl font-bold mb-4 text-black">Reveal your digital footprint</h1>
      <p className="text-gray-600 mb-6 max-w-xl mx-auto">
        Discover the unique fingerprint your browser leaves behind and understand its impact on your online privacy.
      </p>
      <button
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg"
        onClick={onAnalyzeClick}
      >
        Analyze your fingerprint
      </button>
    </section>
  );
}

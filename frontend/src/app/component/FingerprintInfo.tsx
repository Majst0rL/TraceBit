//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\component\FingerprintInfo.tsx

export default function FingerprintInfo() {
  const items = [
    {
      title: "What is a browser fingerprint?",
      desc: "A browser fingerprint is a unique profile collected about your device and browser that is used to track your online activity across different websites."
    },
    {
      title: "How it works",
      desc: "It combines data from your browser settings, plugins, screen resolution, fonts, and other configurations to create a unique identification tag."
    },
    {
      title: "Why it matters",
      desc: "A fingerprint can be used for targeted advertising, security purposes, or to link your activity even if you delete cookies."
    },
  ];

  return (
    <section className="py-16 px-6 text-center">
      <h2 className="text-2xl font-bold mb-12">Understanding browser fingerprinting</h2>
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

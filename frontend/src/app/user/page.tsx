'use client';

import { useRouter } from 'next/navigation';

export default function UserHome() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center text-center mt-8">
      <h1 className="text-4xl font-bold mb-4 text-black">Welcome maj1</h1>
      <h2 className="text-2xl font-bold mb-4">Reveal your digital footprint</h2>
      <p className="mb-6 max-w-xl">
        Discover the unique fingerprint your browser leaves behind and understand its impact on your online privacy.
      </p>
      <button
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg"
        onClick={() => router.push('/podatki')}
      >
        Analyze your fingerprint
      </button>
      <h3 className="mt-12 text-xl font-bold">Understanding browser fingerprinting</h3>
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        <div className="bg-white rounded p-6 shadow-sm w-96">
          <strong>What is a browser fingerprint?</strong>
          <p>A browser fingerprint is a unique profile collected about your device and browser that is used to track your online activity across different websites.</p>
        </div>
        <div className="bg-white rounded p-6 shadow-sm w-96">
          <strong>How it works</strong>
          <p>It combines data from your browser settings, plugins, screen resolution, fonts, and other configurations to create a unique identification tag.</p>
        </div>
        <div className="bg-white rounded p-6 shadow-sm w-96">
          <strong>Why it matters</strong>
          <p>A fingerprint can be used for targeted advertising, security purposes, or to link your activity even if you delete cookies.</p>
        </div>
      </div>
    </div>
  );
}

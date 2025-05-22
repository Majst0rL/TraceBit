//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\podatki\page.tsx

'use client'

import { useState } from 'react';
import { collectFingerprintData, FingerprintData } from '../utils/fingerprintCollector';
import RenderJsonAsForm from '../component/JSONkotForma';

interface FingerprintResponse {
  status: string;
  message: string;
  data: FingerprintData;
}

export default function UserData() {
  const [isProfilingStarted, setIsProfilingStarted] = useState(false);
  const [response, setResponse] = useState<FingerprintResponse | null>(null);
  const [fingerprintData, setFingerprintData] = useState<FingerprintData | null>(null);

  const handleProfiling = async () => {
    const data = collectFingerprintData();
    setFingerprintData(data);

    try {
      const res = await fetch('http://localhost:8000/api/fingerprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result: FingerprintResponse = await res.json();
      setResponse(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleProfilingStart = () => {
    setIsProfilingStarted(true);
  };

  return (
    <div>
      <section className="text-center py-20 px-4">
        <h2 className="text-2xl font-bold mb-6">Browser Fingerprint Data</h2>

        <button 
          onClick={handleProfilingStart}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg mb-6">
          Start Profiling
        </button>

        <div className="bg-gray-100 p-6 rounded-lg max-w-2xl mx-auto text-gray-700">
          {isProfilingStarted ? (
            <div>
              <p className="mb-4">Collected data:</p>

              {/* LOCAL fingerprintData display */}
              {fingerprintData && (
                <>
                  {fingerprintData.parsedUserAgent.fullUserAgent && (
                    <pre className="bg-white p-3 rounded overflow-auto text-sm break-words whitespace-pre-wrap mb-4">
                      {fingerprintData.parsedUserAgent.fullUserAgent}
                    </pre>
                  )}
                  <RenderJsonAsForm data={fingerprintData} />
                </>
              )}

              <button
                onClick={handleProfiling}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg mt-6"
              >
                Send Data to Server
              </button>

              {/* SERVER response */}
              {response && (
                <div className="mt-6 p-4 bg-gray-200 rounded-lg">
                  <h3 className="font-semibold">Server Response:</h3>
                  {response.status === 'received' ? (
                    <div>
                      <p>Status: {response.status}</p>
                      <p>Message: {response.message}</p>

                      {/* SERVER full userAgent preview */}
                      {response.data.parsedUserAgent.fullUserAgent && (
                        <pre className="bg-white p-3 rounded overflow-auto text-sm break-words whitespace-pre-wrap mb-4">
                          {response.data.parsedUserAgent.fullUserAgent}
                        </pre>
                      )}

                      <h3>Data Returned:</h3>
                      <RenderJsonAsForm data={response.data} />
                    </div>
                  ) : (
                    'Error: Something went wrong.'
                  )}
                </div>
              )}
            </div>
          ) : (
            <p>Fingerprint data is currently unavailable. Click “Start Profiling” to begin.</p>
          )}
        </div>
      </section>
    </div>
  );
}

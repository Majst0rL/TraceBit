'use client';

import { useState } from 'react';
import { collectFingerprintData } from '../utils/fingerprintCollector';
import RenderJsonAsForm from '../component/JSONkotForma';

interface ParsedUserAgent {
  browser: string;
  os: string;
  device: string;
  engine: string;
  fullUserAgent: string;
}

interface FingerprintData {
  parsedUserAgent: ParsedUserAgent;
  language: string;
  platform: string;
  timezone: string;
  hardwareConcurrency: number;
  deviceMemory: number | null;
  screen: {
    width: number;
    height: number;
    colorDepth: number;
  };
  webGL: {
    supported: boolean;
    renderer: string;
    vendor: string;
  };
  capabilities: {
    cookiesEnabled: boolean;
    localStorage: boolean;
    sessionStorage: boolean;
    indexedDB: boolean;
    serviceWorker: boolean;
    webRTC: boolean;
    touchSupport: boolean;
    online: boolean;
  };
  orientation: string;
}


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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fingerprint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
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
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg mb-6"
        >
          Start Profiling
        </button>

        <div className="bg-gray-100 p-6 rounded-lg max-w-2xl mx-auto text-gray-700">
          {isProfilingStarted ? (
            <div>
              <p className="mb-4">Collected data:</p>

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

              {response && (
                <div className="mt-6 p-4 bg-gray-200 rounded-lg">
                  <h3 className="font-semibold">Server Response:</h3>
                  {response.status === 'received' ? (
                    <div>
                      <p>Status: {response.status}</p>
                      <p>Message: {response.message}</p>

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

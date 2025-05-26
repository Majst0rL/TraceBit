//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\podatki\page.tsx

'use client'

import { useState } from 'react';
import { collectFingerprintData, FingerprintData } from '../utils/fingerprintCollector';
import RenderJsonAsForm from '../component/JSONkotForma';
import Link from 'next/link';

interface FingerprintResponse {
  status: string;
  message: string;
  data: FingerprintData;
}

export default function UserData() {
  const [isProfilingStarted, setIsProfilingStarted] = useState(false);
  const [response, setResponse] = useState<FingerprintResponse | null>(null);
  const [fingerprintData, setFingerprintData] = useState<FingerprintData | null>(null);
  const [showModal, setShowModal] = useState(false);


  const sendData = async () => {
    const data=fingerprintData;
    try {
      const res = await fetch("https://tracebit-back.onrender.com/api/fingerprint", {
        //https://tracebit-back.onrender.com/api/fingerprint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result: FingerprintResponse = await res.json();
      setResponse(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setShowModal(false)
    }
  }
  const handleProfiling = () => {
    setIsProfilingStarted(true);
    const data = collectFingerprintData();
    setFingerprintData(data);
  };
  const handleSendClick = () => {
  setShowModal(true);   //shows the modal/popup for confirmation
  }


  return (
    <div>
      <section className="text-center py-20 px-4">
        <h2 className="text-2xl font-bold mb-6">Browser Fingerprint Data</h2>

        <button 
          onClick={handleProfiling}
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
                onClick={handleSendClick}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg mt-6"
              >
                Send Data to Server
              </button>

              {/* Modal */}
              {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-left">
                    <h3 className="text-lg font-semibold mb-4">Confirm Submission</h3>
                    <p className="mb-4">
                      By sending this data, you agree to our{' '}
                      <Link href="/terms_and_conditions" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">terms and conditions</Link>
                      <a
                        href="/terms-and-conditions"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        
                      </a>.
                    </p>
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 bg-gray-300 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={sendData}
                        className="px-4 py-2 bg-indigo-600 text-white rounded"
                      >
                        Confirm & Send
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SERVER response */}
              {response && (
                <div className="mt-6 p-4 bg-gray-200 rounded-lg">
                  <h3 className="font-semibold">Server Response:</h3>
                  {response.status === 'ok' ? (
                    /*<div>
                      <p>Status: {response.status}</p>
                      <p>Message: {response.message}</p>

                      {/* SERVER full userAgent preview *///}
                      /*{//response.data.parsedUserAgent.fullUserAgent && (
                        <pre className="bg-white p-3 rounded overflow-auto text-sm break-words whitespace-pre-wrap mb-4">
                          {//response.data.parsedUserAgent.fullUserAgent}
                        </pre>
                      )}

                      <h3>Data Returned:</h3>
                      <RenderJsonAsForm data={//response.data} />
                    </div>*/
                    "Data succesfully sent"
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

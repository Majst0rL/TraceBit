//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\podatki\page.tsx

'use client'

import { useEffect, useState } from 'react';
import { collectFingerprintData, FingerprintData } from '../utils/fingerprintCollector';
import RenderJsonAsForm from '../component/JSONkotForma';
import { BACKEND_URL } from '../../lib/api';
import Link from 'next/link';

interface FingerprintResponse {
  status: string;
  unique?: boolean;
  hash?: string;
  suspicious?: boolean;
  suspicious_reason?: string;
}

//BASIC SUSPICIOUS CHECK
function isFingerprintSuspiciousLocal(data: FingerprintData): { suspicious: boolean, reason: string } {
  const os = data?.parsedUserAgent?.os || "";
  const browser = data?.parsedUserAgent?.browser || "";
  if ((os.startsWith("Windows") && browser.includes("Safari")) ||
      (os.startsWith("Linux") && browser.includes("Edge"))) {
    return { suspicious: true, reason: "Unusual OS/Browser combination" };
  }
  const ua = (data?.parsedUserAgent?.fullUserAgent || "").toLowerCase();
  if (["headless", "phantomjs", "selenium", "puppeteer"].some(w => ua.includes(w))) {
    return { suspicious: true, reason: "Automation tool detected in user agent" };
  }
  const res = `${data?.screen?.width}x${data?.screen?.height}`;
  if (["0x0", "1x1", "10000x10000"].includes(res)) {
    return { suspicious: true, reason: "Unusual screen resolution" };
  }
  const renderer = (data?.webGL?.renderer || "").toLowerCase();
  if (["llvmpipe", "swiftshader", "software"].some(w => renderer.includes(w))) {
    return { suspicious: true, reason: "Suspicious GPU renderer" };
  }
  return { suspicious: false, reason: "" };
}

export default function UserData() {
  const [isProfilingStarted, setIsProfilingStarted] = useState(false);
  const [response, setResponse] = useState<FingerprintResponse | null>(null);
  const [fingerprintData, setFingerprintData] = useState<FingerprintData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [autoSendEnabled, setAutoSendEnabled] = useState(false);

  useEffect(() => {
    const localToken = localStorage.getItem("tracebit_token");

    // If the user is logged in, fetch their ID and auto-send preference
    async function getUser() {
      try {
        const response = await fetch(`${BACKEND_URL}/api/getuser`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setId(data.id || null);
          setAutoSendEnabled(data.autosend || false);
        }
      } catch {
        // ignore
      }
    }
    if(localToken){
      getUser();
    }
  }, []);

  // Send collected fingerprint data to backend
  const sendData = async (dataToSend?: typeof fingerprintData) => {
    const data = {
      ...(dataToSend || fingerprintData),
      user_id: id || null,
    };

    try {
      const res = await fetch(`${BACKEND_URL}/api/fingerprint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result: FingerprintResponse = await res.json();
      setResponse(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setShowModal(false);
    }
  };

  // Handle "Start Profiling" click
  const handleProfiling = () => {
    setIsProfilingStarted(true);
    const data = collectFingerprintData();
    setFingerprintData(data);
    if(!autoSendEnabled){
      return
    }
    sendData(data);
  };

  // Show confirmation modal for sending data
  const handleSendClick = () => {
    setShowModal(true);
  };

  return (
    <div>
      <section className="text-center pt-8 pb-20 px-4">
        <h2 className="text-2xl font-bold mb-6">Browser Fingerprint Data</h2>

        {/* Notice for unauthenticated users */}
        {!id && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
            <b>Notice:</b> Since you are not logged in, the suspicious fingerprint check uses only basic local rules.<br />
            For full advanced analysis, please <Link href="/login" className="underline text-blue-700">log in</Link>.
          </div>
        )}

        <button
          onClick={handleProfiling}
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

                  {/* Suspicious check for unauthenticated users */}
                  {!id && (() => {
                    const { suspicious, reason } = isFingerprintSuspiciousLocal(fingerprintData);
                    return suspicious ? (
                      <div className="mt-6 p-4 bg-red-200 border border-red-500 text-red-800 rounded">
                        <b>Warning:</b> This fingerprint appears <b>suspicious</b>.<br />
                        Reason: {reason}
                      </div>
                    ) : (
                      <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-900 rounded">
                        This fingerprint appears <b>normal</b> (no suspicion detected).
                      </div>
                    );
                  })()}
                </>
              )}

              {/* Send data to server only if auto-send is not enabled */}
              {!autoSendEnabled && (
                <button
                  onClick={handleSendClick}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg mt-6"
                >
                  Send Data to Server
                </button>
              )}

              {/* Modal for confirmation before sending data */}
              {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-left">
                    <h3 className="text-lg font-semibold mb-4">Confirm Submission</h3>
                    <p className="mb-4">
                      By sending this data, you agree to our{' '}
                      <Link
                        href="/pages/terms_and_conditions"
                        className="text-blue-600 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        terms and conditions
                      </Link>.
                    </p>
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 bg-gray-300 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => sendData()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded"
                      >
                        Confirm & Send
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Show server response for authenticated users */}
              {response && (
                <div className="mt-6 p-4 bg-gray-200 rounded-lg">
                  <h3 className="font-semibold">Server Response:</h3>
                  {response.status === 'ok'
                    ? <>
                        Data successfully sent.
                        {response.suspicious && (
                          <div className="mt-4 p-3 bg-red-200 border border-red-500 text-red-800 rounded">
                            <b>Warning:</b> This fingerprint appears <b>suspicious</b>.<br />
                            Reason: {response.suspicious_reason}
                          </div>
                        )}
                      </>
                    : 'Error: Something went wrong.'}
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

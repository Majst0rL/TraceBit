//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\podatki\page.tsx

'use client'

import { useEffect, useState } from 'react';
import { collectFingerprintData, FingerprintData } from '../utils/fingerprintCollector';
import RenderJsonAsForm from '../component/JSONkotForma';
import { BACKEND_URL } from '../../lib/api';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';

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
  const [id, setId] = useState<string | null>(null);;
  const [autoSendEnabled, setAutoSendEnabled] = useState(false);


  useEffect(() => {
      const localToken = localStorage.getItem("tracebit_token");
      
      
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
              setId(data.id||null); // assuming you have setId state setter
              setAutoSendEnabled(data.autosend || false); // assuming autosend is part of the user data
            } else {
              // Optionally handle server errors here
              console.error("Failed to fetch user data", response.status);
            }
          } catch (error) {
            // Network or unexpected error
            console.error("Network error while fetching user data", error);
          }
      }
      if(localToken){
        getUser();
      }
      }, []);



  const sendData = async (dataToSend?: typeof fingerprintData) => {

    const data = {
      ...(dataToSend || fingerprintData),
      user_id:id||null,
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

  const handleProfiling = () => {
    setIsProfilingStarted(true);
    const data = collectFingerprintData();
    setFingerprintData(data);
    if(!autoSendEnabled){
      return
    }
    
    sendData(data);
  };

  const handleSendClick = () => {
    setShowModal(true);
  };

  return (
    <div>
      <section className="text-center py-20 px-4">
        <h2 className="text-2xl font-bold mb-6">Browser Fingerprint Data</h2>

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
                </>
              )}

              {!autoSendEnabled && (<button
                onClick={handleSendClick}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg mt-6"
              >
                Send Data to Server
              </button>)}
              

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

              {response && (
                <div className="mt-6 p-4 bg-gray-200 rounded-lg">
                  <h3 className="font-semibold">Server Response:</h3>
                  {response.status === 'ok'
                    ? 'Data successfully sent.'
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

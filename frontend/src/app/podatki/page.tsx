'use client'

//import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import RenderJsonAsForm from '../component/JSONkotForma';

interface FingerprintResponse {
  status: string;
  message: string;
  data: JSON;
}

export default function UserData() {
  //const searchParams = useSearchParams();
  //const fromButton = searchParams.get('fromButton') === 'true';
  const [isProfilingStarted, setIsProfilingStarted] = useState(false); // Sledenje stanju za gumb
  const [response, setResponse] = useState<FingerprintResponse | null>(null);



  const handleProfiling = async () => {
    console.log("posilja")

    const fingerprintData = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        colorDepth: window.screen.colorDepth,
      },
    };

    try {
      const res = await fetch('http://localhost:8000/fingerprinttest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fingerprintData),
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
        <h2 className="text-2xl font-bold mb-6">Podatki o prstnem odtisu brskalnika</h2>

        <button 
          onClick={handleProfilingStart}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg mb-6">
          Začni profiliranje
        </button>

        <div className="bg-gray-100 p-6 rounded-lg max-w-2xl mx-auto text-gray-700">
          {/*fromButton||*/isProfilingStarted
            ? (
            <div>
              <p>'Še ni implementirano.'</p>
              <form>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700">User Agent</label>
                    <input
                      type="text"
                      value="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Jezik</label>
                    <input
                      type="text"
                      value="en-US"
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Platforma</label>
                    <input
                      type="text"
                      value="Win32"
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Širina zaslona</label>
                    <input
                      type="text"
                      value="1920"
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Višina zaslona</label>
                    <input
                      type="text"
                      value="1080"
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                    />
                  </div>
                </div>
              </form>
              {/* Button to send the collected data to the backend */}
              <button
                onClick={handleProfiling}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg mt-6"
              >
                Pošlji podatke
              </button>

              {/* Display response from the backend */}
              {response && (
                <div className="mt-6 p-4 bg-gray-200 rounded-lg">
                  <h3 className="font-semibold">Server odziv:</h3>
                  <pre>
                    {response.status === 'received'
                      ? (<div>
                        <p>Status: {response.status}</p>
                        <p>Odziv: {response.message}</p>
                        <h3>Podatki:</h3>
                          <RenderJsonAsForm data={response.data} />
                          
                          {/*<pre>
                            {JSON.stringify(response.data,null,2)}
                          </pre>*/}
                        </div>
                        
                      ): ('Error: Nekaj je šlo narobe')}
                  </pre>
                </div>
              )}
            </div>
            ): ('Podatki o prstnem odtisu trenutno niso na voljo. Klikni »Začni profiliranje« za začetek.')}
          {/*Podatki o prstnem odtisu trenutno niso na voljo. Klikni »Začni profiliranje« za začetek.*/}
        </div>
      </section>
    </div>
  );
}

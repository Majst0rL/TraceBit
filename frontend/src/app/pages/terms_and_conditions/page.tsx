import Head from 'next/head';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms and Conditions | TraceBit</title>
        <meta name="description" content="Terms and Conditions for using the TraceBit fingerprinting service." />
      </Head>
      <main className="max-w-3xl mx-auto p-6 pt-24">
        <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
        <p className="mb-4">Effective Date: June 1, 2025</p>

        <p className="mb-4">
          Welcome to TraceBit (we, our, or us). By accessing or using our fingerprinting web service (the Service), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our Service.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">1. About Our Service</h2>
        <p className="mb-4">
          TraceBit is a browser and device fingerprinting service used by developers and organizations to detect fraud, enhance security, and gain insights into client device environments. We provide an SDK and API that collect environmental and technical data to generate probabilistically unique device identifiers.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">2. Data Collected</h2>
        <p className="mb-4">
          When using our Service, we may collect the following data from your browser or device:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Browser: name and version</li>
          <li>Operating System: name and version</li>
          <li>Device model or type (e.g., Desktop, iPhone 14)</li>
          <li>Rendering engine (e.g., Blink, WebKit)</li>
          <li>User agent string</li>
          <li>Language and platform (e.g., en-US, Win32)</li>
          <li>Time zone (e.g., America/New_York)</li>
          <li>Hardware concurrency (e.g., 8 CPU threads)</li>
          <li>Device memory (e.g., 4GB RAM)</li>
          <li>Screen resolution and color depth</li>
          <li>WebGL capabilities</li>
          <li>Support for cookies, storage APIs, service workers, WebRTC, touch, and online status</li>
          <li>Screen orientation (e.g., portrait-primary)</li>
        </ul>

        <p className="mb-4">
          This information is used solely for fingerprinting purposes to distinguish between sessions and devices.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">3. Use of Data</h2>
        <p className="mb-4">TraceBit uses the data to:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Generate a device/browser fingerprint</li>
          <li>Detect suspicious or fraudulent activity</li>
          <li>Support analytics and debugging</li>
          <li>Enhance performance and user experience</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">4. Legal Basis for Data Processing</h2>
        <p className="mb-4">
          If you are located in the European Economic Area (EEA), United Kingdom, or similar jurisdictions, our processing of your technical data is based on legitimate interests, such as preventing fraud and abuse, or providing requested functionality.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">5. Responsibilities of Clients and Developers</h2>
        <p className="mb-4">
          If you are using the TraceBit SDK or API in your own application or website, you are responsible for:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Informing your users that fingerprinting technologies are used</li>
          <li>Obtaining any necessary consents required by law (e.g., GDPR, CCPA)</li>
          <li>Implementing the TraceBit API according to our documentation</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">6. Third-Party Services</h2>
        <p className="mb-4">
          TraceBit may use third-party services for hosting, analytics, or fraud detection. These services process data strictly under our instructions and are bound by confidentiality and security obligations.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">7. Data Retention</h2>
        <p className="mb-4">
          We retain fingerprinting and telemetry data only as long as needed to fulfill the purposes outlined above, unless a longer retention period is legally required or requested by our clients.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">8. Changes to These Terms</h2>
        <p className="mb-4">
          We may revise these Terms at any time. We will update the Effective Date at the top of this page when changes occur. You are encouraged to review the Terms periodically.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">9. Contact Us</h2>
        <p className="mb-4">
          If you have any questions or concerns about these Terms, please contact us at <a href="default@gmail.com" className="text-blue-600 underline">default@gmail.com</a>.
        </p>
      </main>
    </>
  );
}

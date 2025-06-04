import Head from 'next/head';

export default function PrivacyAndCookiePolicy() {
  return (
    <>
      <Head>
        <title>Privacy & Cookie Policy | TraceBit</title>
        <meta
          name="description"
          content="Learn how TraceBit collects, uses, and protects your data including cookies and fingerprinting technologies."
        />
      </Head>
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Privacy & Cookie Policy</h1>
        <p className="mb-4">Effective Date: June 1, 2025</p>

        {/* Privacy Policy Section */}
        <section>
          <p className="mb-4">
            TraceBit ("we", "our", or "us") values your privacy. This policy explains how we collect, use, disclose, and safeguard your information when you use our fingerprinting service at{' '}
            <strong>tracebit.onrender.com</strong> and its related API or SDK offerings (the "Service").
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
          <p className="mb-4">We collect technical information from client devices, which may include:</p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Browser name and version</li>
            <li>Operating system and version</li>
            <li>Device type/model</li>
            <li>User agent string</li>
            <li>Language, platform, time zone, and screen orientation</li>
            <li>CPU concurrency and device memory</li>
            <li>Screen resolution and color depth</li>
            <li>WebGL information (if available)</li>
            <li>Capabilities such as support for cookies, storage APIs, WebRTC, service workers, and touch events</li>
          </ul>
          <p className="mb-4">
            We do not collect names, email addresses, passwords, or any directly identifying personal information.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">2. Purpose of Data Collection</h2>
          <p className="mb-4">We use collected data to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Generate a unique device/browser fingerprint</li>
            <li>Detect and prevent fraud, abuse, and bot activity</li>
            <li>Provide security and performance analytics</li>
            <li>Improve the functionality and accuracy of our Service</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-2">3. Legal Basis for Processing</h2>
          <p className="mb-4">If you are in the European Economic Area (EEA), we process your information based on:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Legitimate interests (fraud prevention, service analytics)</li>
            <li>Compliance with legal obligations</li>
            <li>Your consent, where required (e.g., via cookie consent banners)</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-2">4. Data Sharing</h2>
          <p className="mb-4">
            We may share data with trusted infrastructure or analytics providers (e.g., cloud hosts or logging services). All vendors are contractually bound to keep data confidential and process it only as instructed by TraceBit.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">5. Data Retention</h2>
          <p className="mb-4">
            Fingerprinting data is retained as long as necessary to support the intended purposes, typically for the lifetime of a device or session. In some cases, we may retain data longer to meet regulatory, contractual, or security obligations.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">6. Your Rights</h2>
          <p className="mb-4">Depending on your location, you may have rights to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Access the data we hold about you</li>
            <li>Request deletion of data associated with your device</li>
            <li>Opt out of data processing (where applicable)</li>
            <li>File a complaint with a data protection authority</li>
          </ul>
          <p className="mb-4">
            You can request data access or deletion by emailing us at{' '}
            <a href="mailto:default@gmail.com" className="text-blue-600 underline">
              default@gmail.com
            </a>
            .
          </p>
        </section>

        {/* Cookie Policy Section */}
        <section>
          <h2 className="text-2xl font-semibold mt-6 mb-2">7. Cookies and Tracking Technologies</h2>
          <p className="mb-4">
            TraceBit does not use cookies to identify users by default. However, if our clients choose to combine fingerprinting with cookie identifiers or other tracking technologies, they are responsible for providing appropriate disclosures and obtaining user consent as required by law.
          </p>
          <p className="mb-4">
            We also use and detect the following technologies as part of our fingerprinting process:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Cookies and local storage</li>
            <li>Session storage and IndexedDB</li>
            <li>Service workers</li>
            <li>WebRTC and WebGL features</li>
            <li>Touch event support</li>
          </ul>
          <p className="mb-4">
            These technologies help us gather technical details to create a probabilistically unique fingerprint for security and fraud prevention.
          </p>
          <p className="mb-4">
            You can control or block cookies and similar technologies by adjusting your browser or device settings. Please note that disabling certain features may impact the functionality or accuracy of the Service.
          </p>
          <p className="mb-4">
            For more information on managing cookies, please visit{' '}
            <a href="https://www.aboutcookies.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              aboutcookies.org
            </a>
            .
          </p>
        </section>

        <h2 className="text-2xl font-semibold mt-6 mb-2">8. International Transfers</h2>
        <p className="mb-4">
          TraceBit may process data in jurisdictions outside your own. We implement safeguards to ensure that your information remains protected in accordance with applicable law.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">9. Updates to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy & Cookie Policy from time to time. If we make material changes, we will notify users through our website or other appropriate channels.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">10. Contact Us</h2>
        <p className="mb-4">
          If you have any questions or concerns about this policy, please email us at{' '}
          <a href="mailto:default@gmail.com" className="text-blue-600 underline">
            default@gmail.com
          </a>
          .
        </p>
      </main>
    </>
  );
}

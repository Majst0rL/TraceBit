import Head from 'next/head';

export default function Disclaimer() {
  return (
    <>
      <Head>
        <title>Legal Disclaimer | TraceBit</title>
        <meta name="description" content="Read the legal disclaimer and liability notice for TraceBits fingerprinting service." />
      </Head>
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Legal Disclaimer and Liability Notice</h1>
        <p className="mb-4">Effective Date: June 1, 2025</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">1. No Legal Advice</h2>
        <p className="mb-4">
          The content provided on this website, including all documentation, examples, and support responses, is for informational purposes only and does not constitute legal advice. You are responsible for ensuring that your use of TraceBit is compliant with all applicable laws, including data protection regulations such as GDPR, CCPA, or similar frameworks.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">2. No Warranties</h2>
        <p className="mb-4">
          The TraceBit service is provided on an as is and as available basis. We make no warranties or representations, either express or implied, regarding the operation or availability of the service, or that it will be error-free, uninterrupted, or secure.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">3. Limitation of Liability</h2>
        <p className="mb-4">
          To the fullest extent permitted by law, TraceBit and its officers, employees, contractors, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from or related to your use of the Service, including but not limited to data loss, privacy breaches, or system failures.
        </p>
        <p className="mb-4">
          In no event shall our total aggregate liability exceed the amount you paid (if any) for access to the Service in the six months preceding the event giving rise to the claim.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">4. Client Responsibility</h2>
        <p className="mb-4">
          If you integrate TraceBit into your own application or website, you are solely responsible for:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Disclosing the use of fingerprinting or similar technologies</li>
          <li>Obtaining valid user consent where required</li>
          <li>Ensuring your use complies with local, national, and international laws</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">5. Changes to This Disclaimer</h2>
        <p className="mb-4">
          We reserve the right to update this Legal Disclaimer at any time. All changes will be effective immediately upon posting. Continued use of the Service constitutes acceptance of the updated terms.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">6. Contact Information</h2>
        <p className="mb-4">
          If you have any questions regarding this disclaimer or your responsibilities, please contact us at <a href="mailto:legal@tracebit.io" className="text-blue-600 underline">legal@tracebit.io</a>.
        </p>
      </main>
    </>
  );
}

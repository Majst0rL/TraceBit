import Head from 'next/head';

export default function AcceptableUsePolicy() {
  return (
    <>
      <Head>
        <title>Acceptable Use Policy | TraceBit</title>
        <meta name="description" content="Read TraceBit’s Acceptable Use Policy outlining responsible and ethical usage of our fingerprinting technology." />
      </Head>
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Acceptable Use Policy</h1>
        <p className="mb-4">Effective Date: June 1, 2025</p>

        <p className="mb-4">
          At TraceBit, we are committed to transparency, user education, and responsible use of fingerprinting technology. This Acceptable Use Policy ("Policy") describes the permitted and prohibited uses of our service.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Purpose of TraceBit</h2>
        <p className="mb-4">
          TraceBit is designed as a diagnostic and educational tool to help developers, privacy advocates, and security researchers understand the types of data a browser reveals during normal web use. Our mission is to promote awareness of online tracking techniques—not to enable unethical tracking or surveillance.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Permitted Uses</h2>
        <p className="mb-4">You may use TraceBit to:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Evaluate how browsers, devices, and networks contribute to online fingerprinting</li>
          <li>Educate yourself or others about digital privacy and online tracking</li>
          <li>Test privacy-enhancing tools like anti-tracking extensions, VPNs, or browser configurations</li>
          <li>Build privacy-preserving applications that rely on fingerprinting only with user knowledge and consent</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Prohibited Uses</h2>
        <p className="mb-4">You may <strong>not</strong> use TraceBit to:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Track users across websites or applications without their informed consent</li>
          <li>Create or use device fingerprints to profile, identify, or monitor individuals in a covert or deceptive way</li>
          <li>Integrate TraceBit into spyware, surveillance software, or behavioral analytics tools designed to exploit user data</li>
          <li>Attempt to re-identify users who have taken steps to protect their privacy</li>
          <li>Violate the rights of others or applicable laws, including but not limited to the GDPR, CCPA, and similar regulations</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Your Responsibility</h2>
        <p className="mb-4">
          If you embed or integrate TraceBit’s code or use our data in another system, you are fully responsible for ensuring that its use complies with all applicable laws and ethical standards. This includes clearly disclosing the use of fingerprinting to end-users and obtaining valid consent where required.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Enforcement</h2>
        <p className="mb-4">
          TraceBit reserves the right to suspend or terminate access to our service for anyone found violating this Acceptable Use Policy. We also reserve the right to cooperate with legal authorities in investigations involving abuse or unlawful use of our service.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Reporting Misuse</h2>
        <p className="mb-4">
          If you believe someone is misusing TraceBit or violating this policy, please contact us immediately at <a href="mailto:abuse@tracebit.io" className="text-blue-600 underline">abuse@tracebit.io</a>.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Changes to This Policy</h2>
        <p className="mb-4">
          We may update this Acceptable Use Policy from time to time. Material changes will be posted on this page, and your continued use of the service constitutes acceptance of any updates.
        </p>
      </main>
    </>
  );
}

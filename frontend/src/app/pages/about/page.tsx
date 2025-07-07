import Head from 'next/head';

export default function About() {
  return (
    <>
      <Head>
        <title>About | TraceBit</title>
        <meta name="description" content="Learn about TraceBit, a privacy-focused browser and device fingerprinting service." />
      </Head>
      <main className="max-w-3xl mx-auto p-6 pt-24">
        <h1 className="text-3xl font-bold mb-4">About TraceBit</h1>

        <p className="mb-4">
          TraceBit is a lightweight and privacy-conscious web service designed to provide accurate browser and device fingerprinting for developers and organizations. Our goal is to help detect fraud, enhance security, and improve user experiences while respecting user privacy.
        </p>

        <p className="mb-4">
          We collect only non-personally identifiable technical data such as browser type, device information, and system capabilities to generate unique device fingerprints. We do not collect personal data like names, emails, or passwords.
        </p>

        <p className="mb-4">
          Our service is built with transparency and compliance in mind, aiming to empower developers with powerful tools while respecting users rights and choices.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">Our Mission</h2>
        <p className="mb-4">
          To deliver reliable fingerprinting technology that balances security needs and privacy considerations, helping build safer and more trustworthy online environments.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">Contact Us</h2>
        <p>
          Have questions or feedback? Feel free to reach out at 
          <a href="mailto:default@gmail.com" className="text-blue-600 underline">default@gmail.com</a>.
        </p>
      </main>
    </>
  );
}

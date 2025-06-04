export default function Footer() {
  return (
    <footer className="bg-gray-100 py-10 text-sm text-gray-600" aria-label="Footer">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {/* About & Legal Section */}
        <section aria-labelledby="footer-about-legal">
          <h4 id="footer-about-legal" className="font-bold mb-3 text-gray-800">About & Legal</h4>
          <ul className="space-y-2">
            <li><a href="/pages/about" className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">About Us</a></li>
            <li><a href="/pages/disclaimer" className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">Disclaimer</a></li>
          </ul>
        </section>

        {/* Privacy Section */}
        <section aria-labelledby="footer-privacy">
          <h4 id="footer-privacy" className="font-bold mb-3 text-gray-800">Privacy</h4>
          <ul className="space-y-2">
            <li><a href="/pages/privacy-policy" className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">Privacy and Cookie Policy</a></li>
          </ul>
        </section>

        {/* Terms Section */}
        <section aria-labelledby="footer-terms">
          <h4 id="footer-terms" className="font-bold mb-3 text-gray-800">Terms</h4>
          <ul className="space-y-2">
            <li><a href="/pages/acceptable-use" className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">Acceptable Use Policy</a></li>
            <li><a href="/pages/terms_and_conditions" className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">Terms and Conditions</a></li>
          </ul>
        </section>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-10 border-t border-gray-300 pt-6 text-center text-gray-500">
        <p>© 2025 TraceBit All rights reserved.</p>
      </div>
    </footer>

  );
}

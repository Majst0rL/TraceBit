export default function Footer() {
  return (
    <footer className="bg-gray-100 py-10 text-sm text-gray-600">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-6">
        <div>
          <h4 className="font-bold mb-2 text-gray-800">About Us</h4>
          <ul>
            <li><a href="/about" className="hover:underline">Company Info</a></li>
            <li><a href="/team" className="hover:underline">Our Team</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2 text-gray-800">Privacy</h4>
          <ul>
            <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
            <li><a href="/cookie-policy" className="hover:underline">Cookie Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2 text-gray-800">Terms</h4>
          <ul>
            <li><a href="/terms-of-service" className="hover:underline">Terms of Service</a></li>
            <li><a href="/acceptable-use" className="hover:underline">Acceptable Use Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2 text-gray-800">Disclaimer</h4>
          <ul>
            <li><a href="/disclaimer" className="hover:underline">Legal Disclaimer</a></li>
            <li><a href="/liability" className="hover:underline">Liability Notice</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center mt-10 text-gray-500 border-t pt-6">
        <p>© 2024 BrowserFingerprint Inc. All rights reserved.</p>
        <p className="mt-2">
          <a href="/privacy-policy" className="hover:underline mx-2">Privacy Policy</a>|
          <a href="/terms-of-service" className="hover:underline mx-2">Terms of Service</a>|
          <a href="/contact" className="hover:underline mx-2">Contact Us</a>
        </p>
      </div>
    </footer>
  );
}

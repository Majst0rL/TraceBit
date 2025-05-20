// src/app/components/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow-sm" style={{ backgroundColor: 'rgb(56, 56, 56)' }}>
      <div className="font-bold text-lg text-white"><Link href="/">TraceBit</Link></div>
      <div className="space-x-6">
        <Link href="/podatki" className="text-blue-600">Podatki</Link>
      </div>
    </nav>
  );
}

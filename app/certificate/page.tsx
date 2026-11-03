// app/certificate/page.tsx
import Link from 'next/link';

export default function CertificatePortal() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Certificate Portal</h1>
        <p className="text-gray-600 mb-8">
          This portal is currently being restored. Please check back later to download your certificate.
        </p>
        <Link 
          href="/" 
          className="text-[#8B0000] font-semibold hover:underline"
        >
          &larr; Back to Home
        </Link>
      </div>
    </main>
  );
}
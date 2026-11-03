// app/page.tsx
"use client"; // <-- This line tells Next.js to render this in the browser

import Link from 'next/link';
import { useEffect, useState } from 'react';

// Small component to safely show the year on the client side
function CopyrightYear() {
  const [year, setYear] = useState<number | null>(null);
  
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return <span>{year || 2025}</span>;
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-3xl w-full text-center">
        
        <div className="bg-[#8B0000] p-10 text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">Kilali Tribe</h1>
          <p className="text-[#FFD700] font-medium text-lg">Empowering Women in the Niger Delta</p>
        </div>

        <div className="p-10 md:p-16 flex flex-col items-center">
          <div className="mb-6 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-bold tracking-wide uppercase">
            Site Under Maintenance
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            We are building something new.
          </h2>
          
          <p className="text-gray-600 mb-10 max-w-md mx-auto leading-relaxed">
            The Kilali Tribe website is currently undergoing scheduled maintenance to better serve our community. We will be back online shortly.
          </p>

          <div className="w-full border-t border-gray-200 pt-8 mt-2">
            <p className="text-sm text-gray-500 mb-4">
              Were you a participant at the 2025 Conference?
            </p>
            <Link 
              href="/certificate" 
              className="inline-block bg-[#FFD700] hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Access Certificate Portal
            </Link>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-sm text-gray-400">
        &copy; <CopyrightYear /> Kilali Tribe. All rights reserved.
      </p>
    </main>
  );
}
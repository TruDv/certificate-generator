// app/page.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

function CopyrightYear() {
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => { setYear(new Date().getFullYear()); }, []);
  return <span>{year || 2027}</span>;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans selection:bg-[#FFD700] selection:text-[#8B0000] relative overflow-hidden">
      
      {/* 1. Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero.jpg" 
          alt="Kilali Tribe Background"
          fill
          className="object-cover object-center opacity-40" // Increased opacity from 30 to 40
          priority
        />
        {/* Reduced gradient darkness slightly to show more image */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-[#0a0a0a]"></div>
      </div>

      {/* 2. Glowing Gradient Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#8B0000] rounded-full blur-[120px] opacity-30 pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#FFD700] rounded-full blur-[150px] opacity-10 pointer-events-none z-0"></div>

      {/* Modern Header */}
      <header className="fixed w-full top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#FFD700]/50 group-hover:border-[#FFD700] transition-colors shadow-lg shadow-black/50 bg-black">
              <Image src="/Kilalilogo.jpg" alt="Kilali Tribe Logo" fill className="object-cover" priority />
            </div>
            <div className="hidden sm:block">
              <p className="font-extrabold text-white leading-tight">Kilali Tribe</p>
              <p className="text-[10px] text-[#FFD700] uppercase tracking-widest font-semibold">The Precious Jewel Tribe</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-300">
            <a href="mailto:contact@kilalitribe.com" className="hover:text-white transition-colors">Contact Us</a>
            <Link href="/admin" className="bg-white text-gray-900 px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-all shadow-lg shadow-white/10 transform hover:-translate-y-0.5">
              Admin Login
            </Link>
          </nav>

          <div className="md:hidden flex items-center gap-4">
            <Link href="/admin" className="bg-white text-gray-900 px-4 py-2 rounded-lg text-xs font-bold">Admin</Link>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-screen relative z-10">
        
        <div className="max-w-4xl w-full text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[#FFD700] text-xs font-bold uppercase tracking-widest mb-8">
            <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse"></span>
            Website Under Maintenance
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-4 leading-[1.1] drop-shadow-2xl">
            Her Voice. <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#B8860B]">Her Power.</span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl font-serif italic text-gray-300 mb-8 drop-shadow-lg">
            "5 Years of Impact"
          </p>

          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-gray-300 leading-relaxed mb-12 drop-shadow-md">
            Thank you to everyone who made the 2026 Annual Conference a resounding success. 
            We are currently crafting a new digital home for the Kilali Tribe and preparing for our next chapter. 
            Thank you for your patience.
          </p>

          {/* Standout Certificate Portal CTA */}
          <div className="relative group max-w-2xl mx-auto mb-10">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FFD700] to-[#8B0000] rounded-3xl blur opacity-40 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
            
            <Link 
              href="/certificate" 
              className="relative flex flex-col sm:flex-row items-center justify-between gap-6 bg-black/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 hover:bg-black/90 transition-all overflow-hidden"
            >
              <div className="flex items-center gap-5 text-left w-full">
                <div className="w-14 h-14 bg-[#FFD700] text-black rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#FFD700]/20">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div className="pr-2">
                  <h3 className="text-2xl font-bold text-white mb-1">Download Certificate</h3>
                  <p className="text-sm text-gray-300">Were you at the 2026 Conference? Claim your certificate here.</p>
                </div>
              </div>
              
              <div className="flex-shrink-0 bg-[#FFD700] text-black px-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-yellow-400 transition-colors w-full sm:w-auto shadow-lg shadow-[#FFD700]/10">
                Access Portal 
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </div>
            </Link>
          </div>

          <div className="text-sm text-gray-400">
            Need help or didn't get your certificate?{' '}
            <a href="mailto:contact@kilalitribe.com" className="text-[#FFD700] font-semibold hover:underline">
              Contact Support
            </a>
          </div>

        </div>
      </main>

      <footer className="border-t border-white/10 bg-black/60 backdrop-blur-md py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400 text-center md:text-left">
            &copy; <CopyrightYear /> Kilali Tribe. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
            <a href="mailto:contact@kilalitribe.com" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
// app/page.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

function CopyrightYear() {
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => { setYear(new Date().getFullYear()); }, []);
  return <span>{year || 2026}</span>;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans selection:bg-[#FFD700] selection:text-[#8B0000] relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#8B0000] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#FFD700] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

      {/* Modern Header */}
      <header className="fixed w-full top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Area */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Using the actual logo from the public folder */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#FFD700]/50 group-hover:border-[#FFD700] transition-colors shadow-lg shadow-black/50">
              <Image 
                src="/Kilalilogo.jpg" 
                alt="Kilali Tribe Logo" 
                fill 
                className="object-cover"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <p className="font-extrabold text-white leading-tight">Kilali Tribe</p>
              <p className="text-[10px] text-[#FFD700] uppercase tracking-widest font-semibold">The Precious Jewel Tribe</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-300">
            <a href="mailto:contact@kilalitribe.com" className="hover:text-white transition-colors">Contact Us</a>
            <Link href="/certificate" className="hover:text-white transition-colors">Download Certificate</Link>
            <Link 
              href="/admin" 
              className="bg-white text-gray-900 px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-all shadow-lg shadow-white/10 transform hover:-translate-y-0.5"
            >
              Admin Login
            </Link>
          </nav>

          {/* Mobile Menu Button (Simple) */}
          <div className="md:hidden flex items-center gap-4">
            <Link href="/certificate" className="text-sm font-bold text-[#FFD700]">Certificates</Link>
            <Link href="/admin" className="bg-white text-gray-900 px-4 py-2 rounded-lg text-xs font-bold">Admin</Link>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-screen relative z-10">
        
        <div className="max-w-5xl w-full text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[#FFD700] text-xs font-bold uppercase tracking-widest mb-8">
            <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse"></span>
            Website Under Maintenance
          </div>

          {/* New 2026 Theme Typography */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]">
            Her Voice. <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#B8860B]">Her Power.</span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl font-serif italic text-gray-300 mb-8">
            "5 Years of Impact"
          </p>

          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-gray-400 leading-relaxed mb-12">
            We are currently crafting a new digital home for the Kilali Tribe. 
            Our 2026 Annual Conference is coming, and we are building a better experience for our community. 
            Thank you for your patience.
          </p>

          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-16">
            
            {/* Certificate Card */}
            <Link 
              href="/certificate" 
              className="group relative bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:border-[#FFD700]/50 hover:bg-white/10 transition-all hover:-translate-y-1 overflow-hidden text-left"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFD700]/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <div className="w-12 h-12 bg-[#FFD700]/10 text-[#FFD700] rounded-2xl flex items-center justify-center mb-4 border border-[#FFD700]/20">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Certificate Portal</h3>
              <p className="text-sm text-gray-400 mb-4">Were you a participant at our recent conference? Download your certificate here.</p>
              <span className="text-[#FFD700] font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Access Portal <span>&rarr;</span>
              </span>
            </Link>

            {/* Contact Card */}
            <a 
              href="mailto:contact@kilalitribe.com"
              className="group relative bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:border-[#8B0000]/50 hover:bg-white/10 transition-all hover:-translate-y-1 overflow-hidden text-left"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#8B0000]/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <div className="w-12 h-12 bg-[#8B0000]/20 text-red-400 rounded-2xl flex items-center justify-center mb-4 border border-[#8B0000]/30">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Need Help?</h3>
              <p className="text-sm text-gray-400 mb-4">Having trouble accessing your certificate or need to contact the team?</p>
              <span className="text-red-400 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Email Support <span>&rarr;</span>
              </span>
            </a>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/50 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 text-center md:text-left">
            &copy; <CopyrightYear /> Kilali Tribe. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
            <a href="mailto:contact@kilalitribe.com" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
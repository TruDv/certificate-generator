// app/certificate/page.tsx
"use client";

import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- KILALI BRAND CONSTANTS ---
const PRIMARY_RED = '#8B0000';
const ACCENT_GOLD = '#FFD700';
const TEXT_DARK = '#1f2937';
const EVENT_TITLE = 'Kilali Tribe Conference 2025';
const EVENT_THEME = 'Bold Moves How Women Win: Wealth, Power, and Creativity';

// Images loaded from the /public folder
const KILALI_LOGO_URL = '/Kilalilogo.jpg'; 
const SIGNATURE_IMAGE_URL = '/Signature.png'; 

export default function CertificatePortal() {
  const [formData, setFormData] = useState({ name: '', registeredEmail: '', feedback: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<'form' | 'success'>('form');

  // Helper to load images for PDF
  const loadImage = async (src: string) => {
    try {
      const response = await fetch(src);
      if (!response.ok) throw new Error('Image fetch failed');
      const blob = await response.blob();
      return new Promise<{dataUrl: string, width: number, height: number}>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const img = new Image();
          img.onload = () => resolve({ dataUrl: reader.result as string, width: img.naturalWidth, height: img.naturalHeight });
          img.onerror = reject;
          img.src = reader.result as string;
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.warn(`Failed to load image from ${src}`, error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setMessage('Checking your registration...');

    const submittedEmail = formData.registeredEmail.trim().toLowerCase();

    try {
      // 1. Check if email exists and hasn't submitted feedback yet
      const { data: record, error: fetchError } = await supabase
        .from('feedback_submissions')
        .select('*')
        .eq('registered_email', submittedEmail)
        .single();

      if (fetchError || !record) {
        throw new Error('Email not found in our approved list. Please contact support.');
      }

      if (record.name && record.name !== 'Not NULL') {
        // They already submitted feedback, just let them download
        setFormData(prev => ({ ...prev, name: record.name }));
        setStep('success');
        setMessage('✅ Feedback already submitted. Click below to download your certificate.');
        setIsGenerating(false);
        return;
      }

      // 2. Update Supabase with their name and feedback
      setMessage('Saving your feedback...');
      const { error: updateError } = await supabase
        .from('feedback_submissions')
        .update({ name: formData.name, feedback: formData.feedback })
        .eq('registered_email', submittedEmail);

      if (updateError) throw updateError;

      setStep('success');
      setMessage('✅ Thank you! Click below to download your certificate.');

    } catch (error: any) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    setMessage('Generating certificate...');

    try {
      const [logoData, sigData] = await Promise.all([
        loadImage(KILALI_LOGO_URL),
        loadImage(SIGNATURE_IMAGE_URL)
      ]);

      if (!logoData || !sigData) throw new Error("Failed to load images. Check your URLs.");

      const doc = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a4' });
      const w = doc.internal.pageSize.getWidth();
      const h = doc.internal.pageSize.getHeight();
      const padding = 15;

      // Background & Borders
      doc.setFillColor('#FFFFFF'); doc.rect(0, 0, w, h, 'F');
      doc.setFillColor(PRIMARY_RED); doc.triangle(w, 0, w, h * 0.4, w * 0.6, 0, 'F');
      doc.setFillColor(ACCENT_GOLD); doc.triangle(w, 0, w, h * 0.3, w * 0.7, 0, 'F');
      doc.setDrawColor(ACCENT_GOLD); doc.setLineWidth(1.5); doc.rect(padding, padding, w - 2 * padding, h - 2 * padding, 'S');

      // Logo
      const logoType = logoData.dataUrl.split(';')[0].split('/')[1].toUpperCase();
      const targetLogoWidth = 35;
      const logoAspectRatio = logoData.width / logoData.height;
      const finalLogoHeight = targetLogoWidth / logoAspectRatio;
      doc.addImage(logoData.dataUrl, logoType, padding + 5, padding + 5, targetLogoWidth, finalLogoHeight);

      // Text
      const contentStartX = w / 2;
      const contentStartY = 65;
      doc.setFont('helvetica', 'bold'); doc.setFontSize(24); doc.setTextColor(PRIMARY_RED);
      doc.text(EVENT_TITLE, contentStartX, contentStartY, { align: 'center' });

      doc.setFontSize(45); doc.setTextColor(TEXT_DARK);
      doc.text('CERTIFICATE OF PARTICIPATION', contentStartX, contentStartY + 15, { align: 'center' });

      doc.setFont('helvetica', 'normal'); doc.setFontSize(16); doc.setTextColor(TEXT_DARK);
      doc.text('Proudly Presented to', contentStartX, contentStartY + 35, { align: 'center' });

      doc.setFont('times', 'bolditalic'); doc.setFontSize(60); doc.setTextColor(PRIMARY_RED);
      const participantName = formData.name || 'Participant Name';
      doc.text(participantName, contentStartX, contentStartY + 65, { align: 'center' });

      // Name underline
      doc.setDrawColor(ACCENT_GOLD); doc.setLineWidth(1);
      const nameTextWidth = doc.getStringUnitWidth(participantName) * 60 / doc.internal.scaleFactor;
      doc.line(contentStartX - nameTextWidth / 2, contentStartY + 70, contentStartX + nameTextWidth / 2, contentStartY + 70);

      // Theme details
      const detailY = contentStartY + 85;
      doc.setFont('helvetica', 'normal'); doc.setFontSize(12); doc.setTextColor(TEXT_DARK);
      doc.text('For successful participation in the annual conference themed:', contentStartX, detailY, { align: 'center' });
      doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.setTextColor(PRIMARY_RED);
      doc.text(`“${EVENT_THEME}”`, contentStartX, detailY + 8, { align: 'center' });
      doc.setFont('helvetica', 'normal'); doc.setFontSize(12); doc.setTextColor(TEXT_DARK);
      doc.text(`Held on Thursday, October 23rd, at Hotel Presidential, Port Harcourt.`, contentStartX, detailY + 18, { align: 'center' });

      // Signatures
      const sigBlockY = h - 28;
      const sig1X = w / 4;
      const sigType = sigData.dataUrl.split(';')[0].split('/')[1].toUpperCase();
      const sigTargetWidth = 32;
      const sigAspectRatio = sigData.width / sigData.height;
      const finalSigHeight = sigTargetWidth / sigAspectRatio;
      doc.addImage(sigData.dataUrl, sigType, sig1X - (sigTargetWidth / 2), sigBlockY - finalSigHeight - 2, sigTargetWidth, finalSigHeight);
      
      doc.setDrawColor(TEXT_DARK); doc.setLineWidth(0.5); doc.line(sig1X - 30, sigBlockY, sig1X + 30, sigBlockY);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(TEXT_DARK);
      doc.text('Dr Mrs Tonye Ifie-Sekibo', sig1X, sigBlockY + 6, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.text('Chairperson, The Kilali Tribe', sig1X, sigBlockY + 10, { align: 'center' });

      const sig2X = w * 3 / 4;
      doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
      doc.text(`${new Date().toISOString().slice(0, 10)}`, sig2X, sigBlockY - 2, { align: 'center' });
      doc.setDrawColor(TEXT_DARK); doc.setLineWidth(0.5); doc.line(sig2X - 30, sigBlockY, sig2X + 30, sigBlockY);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
      doc.text('Date of Issuance', sig2X, sigBlockY + 6, { align: 'center' });

      // Save PDF
      doc.save(`${participantName.replace(/\s/g, '_')}_Certificate.pdf`);

      // Update download timestamp
      await supabase
        .from('feedback_submissions')
        .update({ certificate_downloaded_at: new Date().toISOString() })
        .eq('registered_email', formData.registeredEmail.trim().toLowerCase());
      
      setMessage('✅ Certificate downloaded successfully!');

    } catch (error: any) {
      console.error(error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* Card Container - Softer shadow and rounded corners */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden max-w-xl w-full">
        
        {/* Header - Keep the brand red here for impact, but with gold text */}
        <div className="bg-[#8B0000] p-8 text-center">
          <h2 className="text-sm font-bold text-[#FFD700] tracking-widest uppercase mb-2">
            {EVENT_TITLE}
          </h2>
          <h1 className="text-3xl font-extrabold text-white">Certificate Portal</h1>
        </div>

        <div className="p-8 md:p-10">
          {/* Status Message - Softer colors */}
          {message && (
            <div className={`p-4 mb-8 rounded-xl text-sm font-medium text-center border ${
              message.startsWith('❌') 
                ? 'bg-red-50 text-red-700 border-red-100' 
                : 'bg-green-50 text-green-700 border-green-100'
            }`}>
              {message}
            </div>
          )}

          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-slate-600 text-center mb-6 text-sm leading-relaxed">
                Please enter the email you registered with to receive your certificate.
              </p>
              
              {/* Input styling: White bg, dark text, gold focus ring */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Registered Email</label>
                <input 
                  type="email" 
                  placeholder="e.g., jane@example.com" 
                  value={formData.registeredEmail}
                  onChange={(e) => setFormData({...formData, registeredEmail: e.target.value})}
                  required 
                  className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] outline-none transition-all"
                />
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-6">
                <p className="text-slate-500 text-center text-xs font-medium uppercase tracking-wider">
                  Not submitted feedback yet? Fill this out to claim it.
                </p>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Name as it should appear on the certificate" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required 
                    className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Your Feedback</label>
                  <textarea 
                    placeholder="What did you enjoy about the conference?" 
                    value={formData.feedback}
                    onChange={(e) => setFormData({...formData, feedback: e.target.value})}
                    required 
                    className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] outline-none transition-all h-28 resize-none"
                  />
                </div>
              </div>

              {/* Submit Button - Gold background, dark text */}
              <button 
                type="submit" 
                disabled={isGenerating}
                className="w-full bg-[#FFD700] text-slate-900 p-4 rounded-xl font-bold text-lg hover:bg-yellow-400 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {isGenerating ? 'Checking...' : 'Submit & Continue'}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Thank You!</h3>
              <p className="text-slate-600 mb-8 max-w-xs mx-auto">Your feedback has been saved. You can now download your certificate.</p>
              
              {/* Download Button - Gold background */}
              <button 
                onClick={handleDownload} 
                disabled={isGenerating}
                className="w-full bg-[#FFD700] text-slate-900 p-4 rounded-xl font-bold text-lg hover:bg-yellow-400 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Generating PDF...' : 'Download Certificate Now'}
              </button>
            </div>
          )}
        </div>
      </div>
      
      <Link href="/" className="mt-8 text-sm text-slate-500 hover:text-[#8B0000] font-medium transition-colors">
        &larr; Back to Home
      </Link>
    </main>
  );
}
// app/admin/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ADMIN_EMAIL = 'admin@kilalitribe.com'; 

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState<{name: string, email: string, feedback: string} | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('feedback_submissions')
      .select('*')
      .neq('registered_email', ADMIN_EMAIL)
      .order('created_at', { ascending: false });

    if (error) {
      setMessage('❌ Error fetching data.');
    } else {
      setSubmissions(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim().toLowerCase() === ADMIN_EMAIL) {
      setIsLoggedIn(true);
      setMessage(''); 
    } else {
      setMessage('❌ Unauthorized email.');
    }
  };

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    
    setMessage('Adding...');
    const { error } = await supabase
      .from('feedback_submissions')
      .insert({ registered_email: newEmail.trim().toLowerCase() });

    if (error) {
      if (error.code === '23505') setMessage('❌ Email already exists in the database.');
      else setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage('✅ Participant added successfully!');
      setNewEmail('');
      fetchData();
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.origin + '/certificate');
    setMessage('✅ Link copied to clipboard!');
    setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
  };

  // --- LOGIN SCREEN ---
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#8B0000] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-8 h-8 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800 mb-2">Admin Portal</h1>
          <p className="text-gray-500 text-sm mb-8">Enter your credentials to access the dashboard.</p>
          
          {message && <p className="text-red-500 mb-4 text-sm bg-red-50 p-2 rounded-lg">{message}</p>}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="email" 
              placeholder="Admin Email" 
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-none transition-all"
            />
            <button className="w-full bg-[#8B0000] text-white p-4 rounded-xl font-bold hover:bg-red-900 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Sign In
            </button>
          </form>
          <Link href="/" className="block mt-8 text-sm text-gray-500 hover:text-[#8B0000] font-medium transition-colors">← Back to website</Link>
        </div>
      </main>
    );
  }

  // --- DASHBOARD SCREEN ---
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      
      {/* Modern Top Bar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#8B0000] rounded-lg flex items-center justify-center">
              <span className="text-[#FFD700] font-bold text-sm">K</span>
            </div>
            <span className="font-bold text-gray-800 text-lg hidden sm:block">Kilali Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={copyLink} className="text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
              Copy Portal Link
            </button>
            <button onClick={() => setIsLoggedIn(false)} className="text-sm font-semibold text-gray-600 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Overview</h1>
          <p className="text-gray-500 mt-1">Manage attendees and monitor certificate downloads.</p>
        </div>

        {message && (
          <div className={`p-4 mb-6 rounded-xl text-center font-medium border ${message.includes('❌') ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
            {message}
          </div>
        )}

        {/* Modern Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Attendees</p>
              <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Downloaded</p>
              <p className="text-2xl font-bold text-gray-900">{submissions.filter(s => s.certificate_downloaded_at).length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{submissions.filter(s => !s.certificate_downloaded_at).length}</p>
            </div>
          </div>
        </div>

        {/* Add Participant */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col sm:flex-row gap-2">
          <input 
            type="email" 
            placeholder="Enter attendee email address..." 
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
            className="flex-grow p-3 px-4 bg-transparent text-gray-900 placeholder-gray-400 outline-none"
          />
          <button 
            onClick={handleAddParticipant}
            disabled={isLoading} 
            className="bg-[#8B0000] text-white px-6 py-3 rounded-xl font-bold hover:bg-red-900 transition-colors shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Adding...' : 'Add Attendee'}
          </button>
        </div>

        {/* Desktop Table View (Hidden on Mobile) */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-5 font-semibold">Attendee</th>
                <th className="p-5 font-semibold">Feedback</th>
                <th className="p-5 font-semibold text-center">Status</th>
                <th className="p-5 font-semibold text-right">Downloaded At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-gray-500">No attendees added yet.</td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5">
                      <p className="font-semibold text-gray-900">{sub.registered_email}</p>
                      <p className="text-sm text-gray-500">{sub.name || 'Name pending...'}</p>
                    </td>
                    <td className="p-5">
                      {sub.feedback ? (
                        <button 
                          onClick={() => setSelectedFeedback({ name: sub.name, email: sub.registered_email, feedback: sub.feedback })}
                          className="text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-lg"
                        >
                          Read
                        </button>
                      ) : (
                        <span className="text-sm text-gray-400 italic">None</span>
                      )}
                    </td>
                    <td className="p-5 text-center">
                      {sub.certificate_downloaded_at ? (
                        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Downloaded
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span> Pending
                        </span>
                      )}
                    </td>
                    <td className="p-5 text-right text-sm text-gray-500">
                      {sub.certificate_downloaded_at ? new Date(sub.certificate_downloaded_at).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View (Hidden on Desktop) */}
        <div className="md:hidden space-y-4">
          {submissions.map((sub) => (
            <div key={sub.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-gray-900 break-all">{sub.registered_email}</p>
                  <p className="text-sm text-gray-500">{sub.name || 'Name pending...'}</p>
                </div>
                {sub.certificate_downloaded_at ? (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider">Done</span>
                ) : (
                  <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider">Pending</span>
                )}
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                {sub.feedback ? (
                  <button 
                    onClick={() => setSelectedFeedback({ name: sub.name, email: sub.registered_email, feedback: sub.feedback })}
                    className="text-sm font-semibold text-blue-600"
                  >
                    View Feedback
                  </button>
                ) : (
                  <span className="text-sm text-gray-400 italic">No feedback</span>
                )}
                <span className="text-xs text-gray-400">
                  {sub.certificate_downloaded_at ? new Date(sub.certificate_downloaded_at).toLocaleDateString() : ''}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Feedback Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4 sm:p-6">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all">
            <div className="bg-[#8B0000] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Attendee Feedback</h3>
                <p className="text-sm text-red-200 truncate">{selectedFeedback.name} ({selectedFeedback.email})</p>
              </div>
              <button onClick={() => setSelectedFeedback(null)} className="text-white/70 hover:text-white bg-white/10 p-2 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="p-8">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg italic">
                "{selectedFeedback.feedback}"
              </p>
            </div>
            <div className="bg-slate-50 p-4 border-t border-slate-100 text-right">
              <button 
                onClick={() => setSelectedFeedback(null)}
                className="bg-gray-200 text-gray-800 px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
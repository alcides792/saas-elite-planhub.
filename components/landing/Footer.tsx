"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Mail, AtSign, Loader2 } from 'lucide-react';
import { subscribeToNewsletter } from '@/app/actions/newsletter';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    const result = await subscribeToNewsletter(email);

    if (result?.error) {
      setStatus('error');
      setMessage(result.error);
    } else {
      setStatus('success');
      setMessage('Welcome to Kovr!');
      setEmail('');
    }
  };

  return (
    <footer className="relative z-10 bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          
          {/* Branding & Newsletter */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <Image 
                src="/icons/kovr-3d.png" 
                alt="Kovr Logo" 
                width={32} 
                height={32} 
                className="group-hover:scale-110 transition-transform"
              />
              <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">Kovr</span>
            </Link>
            
            <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-xs leading-relaxed">
              Manage all your subscriptions in one place. Save money and optimize your expenses smartly.
            </p>
            
            <div className="mt-2 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Stay updated</h3>
              <form className="flex gap-2 max-w-sm" onSubmit={handleSubscribe}>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  placeholder="Your best email" 
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-500 disabled:opacity-50"
                  required
                />
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-sm disabled:opacity-70 flex items-center justify-center min-w-[95px]"
                >
                  {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : 'Subscribe'}
                </button>
              </form>
              {message && (
                <p className={`text-xs mt-1 font-medium ${status === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {message}
                </p>
              )}
            </div>
          </div>

          {/* Links Columns */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Product</h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link href="/pricing" className="text-slate-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Pricing</Link></li>
              <li><Link href="/features" className="text-slate-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Features</Link></li>
              <li><Link href="/blog" className="text-slate-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Legal</h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link href="/privacy-policy" className="text-slate-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Privacy</Link></li>
              <li><Link href="/terms-of-service" className="text-slate-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Terms</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Support</h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link href="/help" className="text-slate-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Help (FAQ)</Link></li>
              <li className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-slate-600 dark:text-zinc-400">System Online</span>
              </li>
            </ul>
            
            {/* Social Icons Integrated in Support/Last Column or Bottom */}
            <div className="flex items-center gap-3 mt-2">
              <a href="https://x.com/cyt141455" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800 hover:text-blue-500 dark:hover:text-blue-400 transition-all">
                <Twitter size={18} />
              </a>
              {/* Threads icon using AtSign */}
              <a href="https://www.threads.net/@eu_cyt" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800 hover:text-blue-500 dark:hover:text-blue-400 transition-all">
                <AtSign size={18} />
              </a>
              <a href="mailto:coyotequinho@gmail.com" className="p-2 rounded-full bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800 hover:text-blue-500 dark:hover:text-blue-400 transition-all">
                <Mail size={18} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-100 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 dark:text-zinc-500 text-xs font-medium uppercase tracking-tight">
            © 2026 Kovr. All rights reserved.
          </p>
          <p className="text-slate-500 dark:text-zinc-500 text-xs font-medium uppercase tracking-tight">
            Made with ❤️ by <span className="text-blue-500">alcides</span>
          </p>
        </div>
        
      </div>
    </footer>
  );
}

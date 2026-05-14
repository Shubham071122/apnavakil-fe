"use client";

import React from "react";
import Link from "next/link";
import { Scale, Mic, Zap, ArrowRight, Play, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] selection:bg-[#B89B5E]/30">
      {/* Background Glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-[#B89B5E]/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Navigation */}
      <nav className="relative z-50 h-24 flex items-center justify-between px-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#B89B5E] to-[#8C7342] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#B89B5E]/20">
            <Scale size={20} />
          </div>
          <span className="font-display font-bold text-2xl text-white tracking-tight">ApnaVakil</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10">
            <Link href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</Link>
            <Link href="#pricing" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Expertise</Link>
            <Link href="#faq" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">About</Link>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-semibold text-white hover:text-[#B89B5E] transition-colors">Sign In</Link>
          <Link href="/signup" className="px-6 py-3 bg-white text-[#020617] rounded-full text-sm font-bold hover:bg-[#B89B5E] hover:text-white transition-all shadow-xl shadow-white/5">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-10 pt-24 pb-32">
        <div className="flex flex-col items-center text-center space-y-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em]"
          >
            <span className="w-2 h-2 bg-[#B89B5E] rounded-full animate-pulse"></span>
            <span>Now Live: Multi-Modal Legal Intelligence</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl space-y-6"
          >
            <h1 className="text-6xl md:text-8xl font-display font-bold text-white leading-[1.05] tracking-tight">
              Justice, Accelerated <br />
              <span className="gold-gradient-text italic font-light">by Intelligence.</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
              The world's most advanced AI legal assistant. Instant case summaries, real-time voice consultations, and precise law indexing—crafted for the modern world.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center gap-6 pt-4"
          >
            <Link href="/chat" className="group px-10 py-5 bg-[#B89B5E] text-white rounded-full text-lg font-bold shadow-2xl shadow-[#B89B5E]/30 flex items-center gap-3 hover:scale-105 transition-all">
              <span>Start Your Consultation</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-full text-lg font-bold hover:bg-white/10 transition-all flex items-center gap-3">
              <Play size={18} fill="currentColor" />
              <span>Watch the Demo</span>
            </button>
          </motion.div>

          {/* Trusted By / Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-20"
          >
            {[
              { label: "Precision Rate", value: "99.8%" },
              { label: "Legal Sources", value: "10k+" },
              { label: "Voice Latency", value: "<150ms" },
              { label: "Trusted Users", value: "5k+" },
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-1">
                <p className="text-3xl font-display font-bold text-white">{stat.value}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Floating Mockup Preview */}
        <motion.div
           initial={{ opacity: 0, y: 100 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5, duration: 1 }}
           className="mt-32 relative max-w-5xl mx-auto"
        >
          <div className="absolute -inset-4 bg-[#B89B5E]/20 blur-3xl rounded-full opacity-20"></div>
          <div className="glass-card rounded-[2.5rem] p-4 shadow-2xl overflow-hidden border border-white/10">
            <div className="bg-[#020617] rounded-[2rem] aspect-video flex flex-col overflow-hidden">
               {/* Mockup UI Header */}
               <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40"></div>
                  </div>
                  <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-500 font-medium">
                    secure.apnavakil.ai/chat
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5"></div>
               </div>
               
               {/* Mockup Chat Content */}
               <div className="flex-1 p-10 flex flex-col justify-center items-center text-center space-y-8">
                  <div className="w-24 h-24 bg-[#B89B5E]/20 rounded-full flex items-center justify-center text-[#B89B5E] shadow-inner shadow-[#B89B5E]/40">
                    <Mic size={48} className="animate-pulse" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-display font-medium text-white italic">"How do I file for intellectual property?"</h3>
                    <p className="text-slate-500 text-sm">Processing legal citation for Copyright Act, 1957...</p>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

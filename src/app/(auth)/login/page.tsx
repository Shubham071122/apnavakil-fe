"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { Scale, Mail, Lock, ChevronRight, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { loginAction } from "../../../../actions/auth";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await loginAction(formData);
      if (!result.success) {
        setError(result.message);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 selection:bg-[#B89B5E]/30">
      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(184,155,94,0.05)_0%,transparent_100%)] pointer-events-none"></div>
      
      <Link href="/" className="fixed top-10 left-10 text-slate-500 hover:text-white flex items-center gap-2 transition-colors">
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Back to site</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[450px] space-y-8 relative z-10"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[#B89B5E] to-[#8C7342] rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-[#B89B5E]/20">
            <Scale size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 text-sm font-medium">Your legal intelligence is waiting</p>
          </div>
        </div>

        <form action={handleSubmit} className="glass-card p-8 rounded-[2rem] space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  name="email"
                  type="email" 
                  placeholder="name@company.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-[#B89B5E]/20 focus:border-[#B89B5E] outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">Password</label>
                <Link href="#" className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#B89B5E] hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  name="password"
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-[#B89B5E]/20 focus:border-[#B89B5E] outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20 text-xs font-medium">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit"
            disabled={isPending}
            className="w-full py-4 bg-[#B89B5E] text-white rounded-xl font-bold shadow-xl shadow-[#B89B5E]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span>Secure Sign In</span>
                <ChevronRight size={20} />
              </>
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold">
              <span className="bg-[#0b1224] px-4 text-slate-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button type="button" className="flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-colors cursor-pointer">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              <span>Google</span>
            </button>
            <button type="button" className="flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-colors cursor-pointer">
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="Facebook" />
              <span>Facebook</span>
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-slate-500">
          New to ApnaVakil? <Link href="/signup" className="text-[#B89B5E] font-bold hover:underline">Create Account</Link>
        </p>
      </motion.div>
    </div>
  );
}

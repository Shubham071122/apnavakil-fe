"use client";

import React, { useState, useRef, useTransition, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Scale, ShieldCheck, ChevronRight, RefreshCcw, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { verifyOtpAction, resendOtpAction } from "../../../../actions/auth";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isPending, startTransition] = useTransition();
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);


  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value !== "" && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(data)) return;

    const pasteData = data.split("").slice(0, 6);
    const newOtp = [...otp];
    pasteData.forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    const nextIndex = Math.min(pasteData.length, 5);
    inputs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) return;

    setError(null);
    setSuccessMsg(null);
    startTransition(async () => {
      const result = await verifyOtpAction(emailFromQuery, code); 
      if (!result.success) {
        setError(result.message);
      }
    });
  };

  const handleResend = async () => {
    if (timer > 0 || isResending) return;
    
    setIsResending(true);
    setError(null);
    setSuccessMsg(null);
    
    const result = await resendOtpAction(emailFromQuery);
    if (result.success) {
      setTimer(60);
      setSuccessMsg("Verification code resent successfully!");
    } else {
      setError(result.message);
    }
    setIsResending(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 selection:bg-[#B89B5E]/30">
      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(184,155,94,0.05)_0%,transparent_100%)] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[500px] space-y-8 relative z-10"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-14 h-14 bg-[#B89B5E]/10 border border-[#B89B5E]/20 rounded-2xl flex items-center justify-center text-[#B89B5E] shadow-2xl">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Verify Your Email</h1>
            <p className="text-slate-500 text-sm font-medium max-w-xs mx-auto">
              We've sent a 6-digit code to <br />
              <span className="text-[#B89B5E] font-bold">{emailFromQuery || "your email"}</span>
            </p>
          </div>
        </div>

        <div className="glass-card p-10 rounded-[2.5rem] space-y-8">
          <div className="flex justify-between gap-3" onPaste={handlePaste}>
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                ref={(el) => { inputs.current[index] = el; }}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-full aspect-square bg-white/5 border border-white/10 rounded-2xl text-center text-2xl font-bold text-white focus:ring-2 focus:ring-[#B89B5E] focus:border-[#B89B5E] outline-none transition-all"
              />
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20 text-xs font-medium">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 text-green-400 bg-green-400/10 p-3 rounded-lg border border-green-400/20 text-xs font-medium">
              <ShieldCheck size={14} />
              <span>{successMsg}</span>
            </div>
          )}

          <button 
            onClick={handleVerify}
            disabled={isPending || otp.join("").length < 6}
            className="w-full py-4 bg-[#B89B5E] text-white rounded-xl font-bold shadow-xl shadow-[#B89B5E]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <span>Secure Verify</span>
                <ChevronRight size={20} />
              </>
            )}
          </button>

          <div className="flex flex-col items-center gap-4">
            <p className="text-xs text-slate-500 font-medium">Didn't receive the code?</p>
            <button 
              onClick={handleResend}
              disabled={timer > 0 || isResending}
              className="flex items-center gap-2 text-sm font-bold text-[#B89B5E] hover:text-white transition-colors group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? <Loader2 className="animate-spin" size={14} /> : <RefreshCcw size={14} className={`${timer === 0 ? 'group-hover:rotate-180' : ''} transition-transform duration-500`} />}
              <span>{timer > 0 ? `Resend in ${timer}s` : "Resend Verification Code"}</span>
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500">
          Want to use a different email? <Link href="/signup" className="text-white font-bold hover:underline transition-colors">Change Email</Link>
        </p>
      </motion.div>
    </div>
  );
}

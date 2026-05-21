"use client";

import React, { Suspense, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ChevronRight, Loader2, RefreshCcw, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { resendOtpAction, verifyOtpAction } from "../../../../actions/auth";

function VerifyEmailContent() {
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
      setSuccessMsg("Verification code resent successfully.");
    } else {
      setError(result.message);
    }
    setIsResending(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-5 py-10 text-[#F5F5F5]">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-[500px]"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[1.35rem] border border-white/10 bg-[#18181B]">
            <ShieldCheck size={24} strokeWidth={1.8} />
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Verify your email</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#A1A1AA]">
            Enter the 6-digit code sent to <span className="text-[#F5F5F5]">{emailFromQuery || "your email"}</span>.
          </p>
        </div>

        <div className="apple-surface rounded-[2rem] p-6 sm:p-8">
          <div className="grid grid-cols-6 gap-2.5 sm:gap-3" onPaste={handlePaste}>
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                ref={(el) => {
                  inputs.current[index] = el;
                }}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="premium-input aspect-square w-full rounded-2xl text-center text-xl font-semibold outline-none transition sm:text-2xl"
              />
            ))}
          </div>

          {error && (
            <div className="mt-5 flex items-center gap-2 rounded-2xl border border-red-300/15 bg-red-300/8 p-3 text-xs font-medium text-red-200">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mt-5 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-xs font-medium text-[#D4D4D8]">
              <ShieldCheck size={14} />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            onClick={handleVerify}
            disabled={isPending || otp.join("").length < 6}
            className="quiet-button mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl py-4 text-sm font-semibold transition duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="animate-spin" size={19} />
            ) : (
              <>
                Verify
                <ChevronRight size={18} />
              </>
            )}
          </button>

          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="text-xs text-[#71717A]">Did not receive the code?</p>
            <button
              onClick={handleResend}
              disabled={timer > 0 || isResending}
              className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-[#D4D4D8] transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isResending ? <Loader2 className="animate-spin" size={14} /> : <RefreshCcw size={14} />}
              <span>{timer > 0 ? `Resend in ${timer}s` : "Resend code"}</span>
            </button>
          </div>
        </div>

        <p className="mt-7 text-center text-sm text-[#A1A1AA]">
          Need a different email?{" "}
          <Link href="/signup" className="font-medium text-[#F5F5F5] transition-colors hover:text-white">
            Change email
          </Link>
        </p>
      </motion.section>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-5 py-10 text-[#F5F5F5]">
          <Loader2 className="animate-spin text-[#A1A1AA]" size={24} />
        </main>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}

"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ChevronRight, Loader2, Mail, Scale, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { forgotPasswordAction } from "../../../../actions/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [redirectTimer, setRedirectTimer] = useState(5);

  useEffect(() => {
    if (!successMessage) return;

    const countdownId = window.setInterval(() => {
      setRedirectTimer((currentTime) => Math.max(currentTime - 1, 0));
    }, 1000);
    const redirectId = window.setTimeout(() => {
      router.push("/login");
    }, 5000);

    return () => {
      window.clearInterval(countdownId);
      window.clearTimeout(redirectId);
    };
  }, [router, successMessage]);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setSuccessMessage(null);

    const email = formData.get("email")?.toString().trim() || "";
    if (!email) {
      setFieldError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError("Please enter a valid email address.");
      return;
    }

    setFieldError(null);
    startTransition(async () => {
      const result = await forgotPasswordAction(email);
      if (result.success) {
        setRedirectTimer(5);
        setSuccessMessage("Reset link sent to your mail.");
      } else {
        setError(result.message || "We could not send the reset link. Please try again.");
      }
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-5 py-10 text-[#F5F5F5]">
      <Link href="/login" className="fixed left-6 top-6 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-[#A1A1AA] transition-colors hover:text-white sm:left-10 sm:top-10">
        <ArrowLeft size={17} />
        Back
      </Link>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-[440px]"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[1.35rem] border border-white/10 bg-[#18181B]">
            <Scale size={24} strokeWidth={1.8} />
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Forgot password</h1>
          <p className="mt-2 text-sm leading-6 text-[#A1A1AA]">
            {successMessage ? "Check your inbox for the password reset link." : "Enter your email and we will send a reset link."}
          </p>
        </div>

        {successMessage ? (
          <div className="apple-surface rounded-[2rem] p-6 text-center sm:p-8">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
              <ShieldCheck size={22} strokeWidth={1.8} />
            </div>
            <h2 className="font-display text-2xl font-semibold tracking-tight">Reset link sent</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#A1A1AA]">
              {successMessage} Redirecting to login in {redirectTimer} seconds.
            </p>
            <Link
              href="/login"
              className="quiet-button mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-semibold transition duration-200"
            >
              Go to login
              <ChevronRight size={18} />
            </Link>
          </div>
        ) : (
          <form action={handleSubmit} noValidate className="apple-surface rounded-[2rem] p-6 sm:p-7">
            <div className="space-y-2">
              <label className="ml-1 text-xs font-medium text-[#A1A1AA]">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717A]" size={18} />
                <input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  aria-invalid={Boolean(fieldError)}
                  aria-describedby={fieldError ? "forgot-email-error" : undefined}
                  className={`premium-input w-full rounded-2xl py-4 pl-12 pr-4 text-sm outline-none transition ${
                    fieldError ? "border-red-300/35" : ""
                  }`}
                  onChange={() => {
                    setFieldError(null);
                    setError(null);
                  }}
                />
              </div>
              {fieldError && (
                <p id="forgot-email-error" className="ml-1 text-xs font-medium text-red-200">
                  {fieldError}
                </p>
              )}
            </div>

            {error && (
              <div className="mt-5 flex items-center gap-2 rounded-2xl border border-red-300/15 bg-red-300/8 p-3 text-xs font-medium text-red-200">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="quiet-button mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl py-4 text-sm font-semibold transition duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="animate-spin" size={19} />
              ) : (
                <>
                  Send reset link
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>
        )}
      </motion.section>
    </main>
  );
}

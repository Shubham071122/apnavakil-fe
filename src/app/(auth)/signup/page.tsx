"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, ChevronRight, Loader2, Lock, Mail, Scale, User } from "lucide-react";
import { motion } from "framer-motion";
import { signupAction } from "../../../../actions/auth";

export default function SignupPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
  }>({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setFieldErrors((currentErrors) => ({ ...currentErrors, [e.target.name]: undefined }));
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setError(null);
    const nextFieldErrors: typeof fieldErrors = {};
    const fullName = formData.fullName.trim();
    const email = formData.email.trim();
    const password = formData.password;

    if (!fullName) {
      nextFieldErrors.fullName = "Please enter your full name.";
    }

    if (!email) {
      nextFieldErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextFieldErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      nextFieldErrors.password = "Please create a password.";
    } else if (password.length < 6) {
      nextFieldErrors.password = "Password must be at least 6 characters.";
    }

    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length > 0) return;

    startTransition(async () => {
      const result = await signupAction({ fullName, email, password });
      if (!result.success) {
        setError(result.message || "We could not create your account. Please try again.");
      }
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-5 py-10 text-[#F5F5F5]">
      <Link href="/" className="fixed left-6 top-6 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-[#A1A1AA] transition-colors hover:text-white sm:left-10 sm:top-10">
        <ArrowLeft size={17} />
        Back
      </Link>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-[460px]"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[1.35rem] border border-white/10 bg-[#18181B]">
            <Scale size={24} strokeWidth={1.8} />
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Create account</h1>
          <p className="mt-2 text-sm leading-6 text-[#A1A1AA]">Start with a calm space for legal work.</p>
        </div>

        <form action={handleSubmit} noValidate className="apple-surface rounded-[2rem] p-6 sm:p-7">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="ml-1 text-xs font-medium text-[#A1A1AA]">Full name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717A]" size={18} />
                <input
                  name="fullName"
                  type="text"
                  placeholder="Your name"
                  value={formData.fullName}
                  aria-invalid={Boolean(fieldErrors.fullName)}
                  aria-describedby={fieldErrors.fullName ? "signup-name-error" : undefined}
                  className={`premium-input w-full rounded-2xl py-4 pl-12 pr-4 text-sm outline-none transition ${
                    fieldErrors.fullName ? "border-red-300/35" : ""
                  }`}
                  onChange={handleChange}
                />
              </div>
              {fieldErrors.fullName && (
                <p id="signup-name-error" className="ml-1 text-xs font-medium text-red-200">
                  {fieldErrors.fullName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-xs font-medium text-[#A1A1AA]">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717A]" size={18} />
                <input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? "signup-email-error" : undefined}
                  className={`premium-input w-full rounded-2xl py-4 pl-12 pr-4 text-sm outline-none transition ${
                    fieldErrors.email ? "border-red-300/35" : ""
                  }`}
                  onChange={handleChange}
                />
              </div>
              {fieldErrors.email && (
                <p id="signup-email-error" className="ml-1 text-xs font-medium text-red-200">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-xs font-medium text-[#A1A1AA]">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717A]" size={18} />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={fieldErrors.password ? "signup-password-error" : undefined}
                  className={`premium-input w-full rounded-2xl py-4 pl-12 pr-4 text-sm outline-none transition ${
                    fieldErrors.password ? "border-red-300/35" : ""
                  }`}
                  onChange={handleChange}
                />
              </div>
              {fieldErrors.password && (
                <p id="signup-password-error" className="ml-1 text-xs font-medium text-red-200">
                  {fieldErrors.password}
                </p>
              )}
            </div>
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
                Create account
                <ChevronRight size={18} />
              </>
            )}
          </button>

          <p className="mt-5 text-center text-xs leading-5 text-[#71717A]">
            By signing up, you agree to our <Link href="/terms" className="text-[#D4D4D8] hover:text-white">Terms</Link> and{" "}
            <Link href="/privacy" className="text-[#D4D4D8] hover:text-white">Privacy Policy</Link>.
          </p>
        </form>

        <p className="mt-7 text-center text-sm text-[#A1A1AA]">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[#F5F5F5] transition-colors hover:text-white">
            Sign in
          </Link>
        </p>
      </motion.section>
    </main>
  );
}

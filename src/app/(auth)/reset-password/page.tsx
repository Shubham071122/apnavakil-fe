"use client";

import React, { Suspense, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ChevronRight, Loader2, Lock, Scale, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { resetPasswordAction } from "../../../../actions/auth";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [redirectTimer, setRedirectTimer] = useState(5);
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [fieldErrors, setFieldErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setFieldErrors((currentErrors) => ({ ...currentErrors, [e.target.name]: undefined }));
    setFormData((currentData) => ({
      ...currentData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    setError(null);

    const nextFieldErrors: typeof fieldErrors = {};
    if (!formData.password) {
      nextFieldErrors.password = "Please enter your new password.";
    } else if (formData.password.length < 6) {
      nextFieldErrors.password = "Password must be at least 6 characters.";
    }

    if (!formData.confirmPassword) {
      nextFieldErrors.confirmPassword = "Please confirm your new password.";
    } else if (formData.password !== formData.confirmPassword) {
      nextFieldErrors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length > 0) return;

    if (!token) {
      setError("Reset token is missing. Please open the reset link from your email.");
      return;
    }

    startTransition(async () => {
      const result = await resetPasswordAction(token, formData.password);
      if (result.success) {
        setRedirectTimer(5);
        setSuccessMessage("Your password has been reset.");
        setFormData({ password: "", confirmPassword: "" });
      } else {
        setError(result.message || "We could not reset your password. Please try again.");
      }
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-5 py-10 text-[#F5F5F5]">
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
          <h1 className="font-display text-3xl font-semibold tracking-tight">Reset password</h1>
          <p className="mt-2 text-sm leading-6 text-[#A1A1AA]">
            {successMessage ? "Your account is ready to sign in again." : "Create a new password for your ApnaVakil account."}
          </p>
        </div>

        {successMessage ? (
          <div className="apple-surface rounded-[2rem] p-6 text-center sm:p-8">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
              <ShieldCheck size={22} strokeWidth={1.8} />
            </div>
            <h2 className="font-display text-2xl font-semibold tracking-tight">Password reset</h2>
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
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="ml-1 text-xs font-medium text-[#A1A1AA]">New password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717A]" size={18} />
                  <input
                    name="password"
                    type="password"
                    placeholder="New password"
                    value={formData.password}
                    aria-invalid={Boolean(fieldErrors.password)}
                    aria-describedby={fieldErrors.password ? "reset-password-error" : undefined}
                    className={`premium-input w-full rounded-2xl py-4 pl-12 pr-4 text-sm outline-none transition ${
                      fieldErrors.password ? "border-red-300/35" : ""
                    }`}
                    onChange={handleChange}
                  />
                </div>
                {fieldErrors.password && (
                  <p id="reset-password-error" className="ml-1 text-xs font-medium text-red-200">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-xs font-medium text-[#A1A1AA]">Confirm password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717A]" size={18} />
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    aria-invalid={Boolean(fieldErrors.confirmPassword)}
                    aria-describedby={fieldErrors.confirmPassword ? "reset-confirm-password-error" : undefined}
                    className={`premium-input w-full rounded-2xl py-4 pl-12 pr-4 text-sm outline-none transition ${
                      fieldErrors.confirmPassword ? "border-red-300/35" : ""
                    }`}
                    onChange={handleChange}
                  />
                </div>
                {fieldErrors.confirmPassword && (
                  <p id="reset-confirm-password-error" className="ml-1 text-xs font-medium text-red-200">
                    {fieldErrors.confirmPassword}
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
                  Reset password
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {!successMessage && (
          <p className="mt-7 text-center text-sm text-[#A1A1AA]">
            Remember your password?{" "}
            <Link href="/login" className="font-medium text-[#F5F5F5] transition-colors hover:text-white">
              Sign in
            </Link>
          </p>
        )}
      </motion.section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-5 py-10 text-[#F5F5F5]">
          <Loader2 className="animate-spin text-[#A1A1AA]" size={24} />
        </main>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}

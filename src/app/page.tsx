"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Check, FileText, Mic, Scale, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Ask naturally",
    description: "Speak or type the way you would with a trusted legal assistant.",
    icon: Mic,
  },
  {
    title: "Read with clarity",
    description: "Dense legal material is organized into calm, scannable answers.",
    icon: FileText,
  },
  {
    title: "Stay grounded",
    description: "Every response is built for careful review, not flashy certainty.",
    icon: ShieldCheck,
  },
];

const assurances = ["Private by design", "Built for legal workflows", "Human review encouraged"];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5]">
      <header className="mx-auto flex h-24 w-full max-w-7xl items-center justify-between px-6 sm:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[#18181B] shadow-sm">
            <Scale size={19} strokeWidth={1.9} />
          </div>
          <div>
            <p className="font-display text-lg font-semibold tracking-tight">ApnaVakil</p>
            <p className="text-xs text-[#71717A]">Legal intelligence</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#product" className="text-sm text-[#A1A1AA] transition-colors hover:text-[#F5F5F5]">Product</Link>
          <Link href="#workflow" className="text-sm text-[#A1A1AA] transition-colors hover:text-[#F5F5F5]">Workflow</Link>
          <Link href="#trust" className="text-sm text-[#A1A1AA] transition-colors hover:text-[#F5F5F5]">Trust</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden rounded-2xl px-4 py-2 text-sm font-medium text-[#D4D4D8] transition-colors hover:text-white sm:block">
            Sign in
          </Link>
          <Link href="/signup" className="quiet-button rounded-2xl px-5 py-2.5 text-sm font-semibold transition duration-200">
            Get started
          </Link>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-6rem)] w-full max-w-7xl items-center gap-14 px-6 pb-20 pt-10 sm:px-10 lg:grid-cols-[1.02fr_0.98fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="mb-9 inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-[#A1A1AA]">
            Calm legal help, designed for focus
          </div>
          <h1 className="font-display text-5xl font-semibold leading-[1.03] tracking-tight text-[#F5F5F5] sm:text-6xl lg:text-7xl">
            Legal answers with the restraint of a good advisor.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#A1A1AA]">
            ApnaVakil brings research, drafting support, and voice consultation into a quiet workspace that feels clear, premium, and trustworthy.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/chat" className="quiet-button inline-flex items-center justify-center gap-2 rounded-3xl px-6 py-4 text-sm font-semibold transition duration-200">
              Start consultation
              <ArrowRight size={17} />
            </Link>
            <Link href="/login" className="ghost-button inline-flex items-center justify-center rounded-3xl px-6 py-4 text-sm font-semibold transition duration-200">
              Sign in
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {assurances.map((item) => (
              <div key={item} className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-sm text-[#A1A1AA]">
                <Check size={14} className="text-[#D4D4D8]" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.6, ease: "easeOut" }}
          className="apple-surface overflow-hidden rounded-[2rem] p-3"
        >
          <div className="rounded-[1.55rem] border border-white/8 bg-[#0F0F0F] p-5 sm:p-7">
            <div className="flex items-center justify-between border-b border-white/8 pb-5">
              <div>
                <p className="text-sm font-semibold text-[#F5F5F5]">Consultation</p>
                <p className="mt-1 text-xs text-[#71717A]">Property agreement review</p>
              </div>
              <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#A1A1AA]">Live</div>
            </div>

            <div className="space-y-6 py-8">
              <div className="max-w-[84%] rounded-[1.35rem] bg-[#1F1F1F] px-5 py-4 text-sm leading-6 text-[#E4E4E7]">
                Can you explain what I should verify before signing a sale deed?
              </div>
              <div className="ml-auto max-w-[88%] space-y-4 text-sm leading-6 text-[#D4D4D8]">
                <p>
                  Start with title continuity, encumbrance records, identity of parties, payment clauses, possession date, and registration requirements.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {["Title chain", "Mutation records", "Stamp duty", "Possession terms"].map((item) => (
                    <div key={item} className="matte-card rounded-2xl px-4 py-3 text-xs text-[#A1A1AA]">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[1.45rem] border border-white/8 bg-white/[0.04] p-3">
              <div className="flex items-center gap-3 rounded-[1.15rem] bg-[#121212] px-4 py-4">
                <span className="h-2 w-2 rounded-full bg-[#D4D4D8]" />
                <p className="text-sm text-[#71717A]">Ask a legal question...</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="product" className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-medium text-[#A1A1AA]">Product</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">A quieter way to work through legal questions.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map(({ title, description, icon: Icon }) => (
            <div key={title} className="matte-card rounded-[1.75rem] p-6">
              <div className="mb-12 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.055] text-[#D4D4D8]">
                <Icon size={20} strokeWidth={1.8} />
              </div>
              <h3 className="font-display text-xl font-semibold tracking-tight">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#A1A1AA]">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="workflow" className="mx-auto w-full max-w-7xl px-6 pb-24 sm:px-10">
        <div className="apple-surface grid gap-10 rounded-[2rem] p-8 sm:p-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-medium text-[#A1A1AA]">Workflow</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">Built around the way careful decisions are made.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {["Question", "Review", "Act"].map((step, index) => (
              <div key={step} className="rounded-[1.5rem] border border-white/8 bg-[#121212] p-5">
                <p className="text-xs text-[#71717A]">0{index + 1}</p>
                <p className="mt-8 font-display text-lg font-semibold">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

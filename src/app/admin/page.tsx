"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock,
  Database,
  FileText,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const stats = [
    { label: "Active clients", value: "1,284", icon: Users, change: "+12%" },
    { label: "Vault documents", value: "45,021", icon: Database, change: "+5%" },
    { label: "Consultations", value: "8,942", icon: MessageSquare, change: "+28%" },
    { label: "System health", value: "99.9%", icon: ShieldCheck, change: "Stable" },
  ];

  const recentActivities = [
    { id: 1, type: "Upload", item: "IPC Section 420 Amendment", user: "Admin Alpha", time: "2 mins ago", status: "Indexed" },
    { id: 2, type: "User", item: "Karan Sharma registered", user: "System", time: "15 mins ago", status: "Verified" },
    { id: 3, type: "Alert", item: "High traffic on /chat", user: "Node-01", time: "1 hour ago", status: "Resolved" },
    { id: 4, type: "Vault", item: "Auto-backup completed", user: "CRON", time: "3 hours ago", status: "Success" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-sm font-medium text-[#A1A1AA]">Administration</p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white">Dashboard</h1>
          <p className="mt-3 text-sm leading-6 text-[#A1A1AA]">A quiet overview of usage, documents, and operational health.</p>
        </div>
        <div className="flex gap-3">
          <button className="ghost-button rounded-2xl px-5 py-3 text-sm font-semibold transition duration-200">
            Export report
          </button>
          <button className="quiet-button rounded-2xl px-5 py-3 text-sm font-semibold transition duration-200">
            System pulse
          </button>
        </div>
      </header>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={item} className="matte-card rounded-[1.75rem] p-6">
            <div className="mb-8 flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.055] text-[#D4D4D8]">
                <stat.icon size={20} strokeWidth={1.85} />
              </div>
              <span className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-[#A1A1AA]">
                {stat.change}
              </span>
            </div>
            <p className="font-display text-3xl font-semibold tracking-tight text-white">{stat.value}</p>
            <p className="mt-2 text-sm text-[#A1A1AA]">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="matte-card overflow-hidden rounded-[2rem] lg:col-span-2"
        >
          <div className="flex items-center justify-between border-b border-white/8 p-6">
            <h3 className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-white">
              <Clock size={19} className="text-[#A1A1AA]" />
              Recent activity
            </h3>
            <button className="text-sm font-medium text-[#D4D4D8] hover:text-white">View all</button>
          </div>
          <div className="overflow-x-auto p-3">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-white/8 text-xs font-medium text-[#71717A]">
                  <th className="px-4 py-4">Event</th>
                  <th className="px-4 py-4">Origin</th>
                  <th className="px-4 py-4">Timeline</th>
                  <th className="px-4 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8">
                {recentActivities.map((act) => (
                  <tr key={act.id} className="transition-colors hover:bg-white/[0.025]">
                    <td className="px-4 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{act.item}</span>
                        <span className="mt-1 text-xs text-[#71717A]">{act.type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-5 text-sm text-[#A1A1AA]">{act.user}</td>
                    <td className="px-4 py-5 text-sm text-[#A1A1AA]">{act.time}</td>
                    <td className="px-4 py-5">
                      <span className="inline-flex items-center rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs font-medium text-[#D4D4D8]">
                        {act.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="matte-card rounded-[2rem] p-6"
          >
            <h3 className="font-display text-xl font-semibold tracking-tight text-white">Quick actions</h3>
            <div className="mt-5 space-y-2">
              <Link href="/admin/documents" className="flex items-center justify-between rounded-2xl border border-transparent bg-white/[0.035] p-4 transition duration-200 hover:border-white/10 hover:bg-white/[0.06]">
                <span className="flex items-center gap-3 text-sm font-medium text-[#D4D4D8]">
                  <FileText size={18} />
                  Ingest document
                </span>
                <ArrowUpRight size={17} className="text-[#71717A]" />
              </Link>
              <button className="flex w-full items-center justify-between rounded-2xl border border-transparent bg-white/[0.035] p-4 transition duration-200 hover:border-white/10 hover:bg-white/[0.06]">
                <span className="flex items-center gap-3 text-sm font-medium text-[#D4D4D8]">
                  <Users size={18} />
                  Manage clients
                </span>
                <ArrowUpRight size={17} className="text-[#71717A]" />
              </button>
              <button className="flex w-full items-center justify-between rounded-2xl border border-transparent bg-white/[0.035] p-4 transition duration-200 hover:border-white/10 hover:bg-white/[0.06]">
                <span className="flex items-center gap-3 text-sm font-medium text-[#D4D4D8]">
                  <TrendingUp size={18} />
                  Usage insights
                </span>
                <ArrowUpRight size={17} className="text-[#71717A]" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="matte-card rounded-[2rem] p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-sm font-medium text-[#A1A1AA]">System load</h3>
              <span className="text-sm font-medium text-[#D4D4D8]">24%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "24%" }}
                transition={{ duration: 0.8, delay: 0.45 }}
                className="h-full rounded-full bg-[#D4D4D8]"
              />
            </div>
            <p className="mt-4 text-xs leading-5 text-[#71717A]">
              Services are steady. No operational bottlenecks are currently detected.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

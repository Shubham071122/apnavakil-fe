"use client";

import React from "react";
import { 
  Users, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  ArrowUpRight,
  Database,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminDashboard() {
  const stats = [
    { label: "Active Clients", value: "1,284", icon: Users, color: "text-blue-400", change: "+12%" },
    { label: "Vault Documents", value: "45,021", icon: Database, color: "text-[#B89B5E]", change: "+5%" },
    { label: "AI Consultations", value: "8,942", icon: MessageSquare, color: "text-purple-400", change: "+28%" },
    { label: "System Health", value: "99.9%", icon: ShieldCheck, color: "text-green-400", change: "Stable" },
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
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight mb-2">
            Command <span className="gold-gradient-text italic font-light">Center</span>
          </h1>
          <p className="text-slate-400 font-medium">Welcome back, Administrator. System status is optimal.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white hover:bg-white/10 transition-all">
            Export Report
          </button>
          <button className="px-6 py-3 bg-[#B89B5E] rounded-2xl text-sm font-bold text-white shadow-lg shadow-[#B89B5E]/20 hover:scale-105 transition-all">
            System Pulse
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            variants={item}
            className="glass-card p-6 rounded-[2rem] hover:border-white/20 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-3xl font-display font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-card rounded-[2.5rem] overflow-hidden"
        >
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock size={20} className="text-[#B89B5E]" />
              Real-time Activity
            </h3>
            <button className="text-sm font-bold text-[#B89B5E] hover:underline">View All</button>
          </div>
          <div className="p-4">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">
                  <th className="px-4 py-4">Event</th>
                  <th className="px-4 py-4">Origin</th>
                  <th className="px-4 py-4">Timeline</th>
                  <th className="px-4 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentActivities.map((act) => (
                  <tr key={act.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-6">
                      <div className="flex flex-col">
                        <span className="text-white font-semibold text-sm">{act.item}</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">{act.type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-6 text-slate-400 text-sm">{act.user}</td>
                    <td className="px-4 py-6 text-slate-400 text-sm">{act.time}</td>
                    <td className="px-4 py-6">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase py-1 px-3 rounded-full bg-[#B89B5E]/10 text-[#B89B5E] border border-[#B89B5E]/20">
                        <div className="w-1 h-1 rounded-full bg-[#B89B5E] animate-pulse" />
                        {act.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Quick Actions & System Info */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-8 rounded-[2.5rem] bg-gradient-to-br from-white/[0.03] to-transparent"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Zap size={20} className="text-[#B89B5E]" />
              Quick Actions
            </h3>
            <div className="space-y-4">
              <Link href="/admin/documents" className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-[#B89B5E]/10 hover:border-[#B89B5E]/20 border border-transparent transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-[#B89B5E]">
                    <FileText size={18} />
                  </div>
                  <span className="font-bold text-sm text-slate-300 group-hover:text-white">Ingest New Artifact</span>
                </div>
                <ArrowUpRight size={18} className="text-slate-600 group-hover:text-[#B89B5E]" />
              </Link>
              <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-blue-500/10 hover:border-blue-500/20 border border-transparent transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-blue-400">
                    <Users size={18} />
                  </div>
                  <span className="font-bold text-sm text-slate-300 group-hover:text-white">Manage Clients</span>
                </div>
                <ArrowUpRight size={18} className="text-slate-600 group-hover:text-blue-400" />
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-purple-500/10 hover:border-purple-500/20 border border-transparent transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-purple-400">
                    <TrendingUp size={18} />
                  </div>
                  <span className="font-bold text-sm text-slate-300 group-hover:text-white">Live Intelligence</span>
                </div>
                <ArrowUpRight size={18} className="text-slate-600 group-hover:text-purple-400" />
              </button>
            </div>
          </motion.div>

          {/* System Load */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-8 rounded-[2.5rem]"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Neural Load</h3>
              <span className="text-[#B89B5E] font-bold text-xs">24%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "24%" }}
                transition={{ duration: 1, delay: 1 }}
                className="h-full bg-gradient-to-r from-[#B89B5E] to-[#D4AF37]"
              />
            </div>
            <p className="mt-4 text-[10px] text-slate-500 font-medium leading-relaxed">
              Inference engines are operating at peak efficiency. No bottlenecks detected in the legal reasoning pipeline.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}


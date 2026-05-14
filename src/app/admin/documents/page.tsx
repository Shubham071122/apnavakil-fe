"use client";

import React, { useState } from "react";
import { Upload, File, CheckCircle2, AlertCircle, Loader2, ShieldCheck, Database } from "lucide-react";
import api from "@/services/api";

export default function DocumentsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Criminal Law");
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("category", category);

    try {
      await api.post("/legal/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus({ type: "success", message: "Document safely stored and indexed in the vault." });
      setFile(null);
      setTitle("");
    } catch (error) {
      setStatus({ type: "error", message: "Vault ingestion failed. Please verify the PDF integrity." });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-2">
           <Database className="text-[#B89B5E]" size={24} />
           <h1 className="text-3xl font-display font-bold text-white tracking-tight">Legal Vault <span className="text-slate-500 font-light text-xl">/ Ingestion</span></h1>
        </div>
        <p className="text-slate-400 text-lg">Securely upload and index legal precedents into the ApnaVakil intelligence core.</p>
      </header>

      {/* Main Glass Card */}
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] border border-white/5 p-10 shadow-2xl relative overflow-hidden">
        {/* Decorative Internal Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#B89B5E]/5 blur-[80px] rounded-full -mr-32 -mt-32" />
        
        <form onSubmit={handleUpload} className="relative z-10 space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Document Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Indian Penal Code 1860"
                className="w-full bg-[#050A18] p-4 rounded-2xl border border-white/5 text-white placeholder-slate-600 focus:ring-1 focus:ring-[#B89B5E]/30 focus:border-[#B89B5E]/50 outline-none transition-all duration-300 font-medium"
                required
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Legal Category</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#050A18] p-4 rounded-2xl border border-white/5 text-white appearance-none focus:ring-1 focus:ring-[#B89B5E]/30 focus:border-[#B89B5E]/50 outline-none transition-all duration-300 font-medium cursor-pointer"
                >
                  <option>Criminal Law</option>
                  <option>Civil Law</option>
                  <option>Constitution</option>
                  <option>Family Law</option>
                  <option>Corporate Law</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#B89B5E]">
                  <ShieldCheck size={18} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">PDF Artifact</label>
            <div className="group relative">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="file-upload"
              />
              <label 
                htmlFor="file-upload" 
                className={`
                  flex flex-col items-center justify-center p-12 rounded-[2rem] border-2 border-dashed transition-all duration-500 cursor-pointer
                  ${file ? 'border-[#B89B5E]/50 bg-[#B89B5E]/5' : 'border-white/10 bg-[#050A18] hover:border-[#B89B5E]/30 hover:bg-white/[0.02]'}
                `}
              >
                <div className={`
                  w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-500
                  ${file ? 'bg-[#B89B5E] text-white shadow-xl shadow-[#B89B5E]/20 rotate-0' : 'bg-white/5 text-slate-500 group-hover:scale-110 group-hover:text-[#B89B5E]'}
                `}>
                  {file ? <File size={32} /> : <Upload size={32} />}
                </div>
                <span className={`text-xl font-bold mb-2 transition-colors ${file ? 'text-white' : 'text-slate-400'}`}>
                  {file ? file.name : "Secure Upload Engine"}
                </span>
                <span className="text-sm text-slate-600 font-medium uppercase tracking-widest">
                  {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB • PDF READY` : "Drag and drop legal artifacts here"}
                </span>
              </label>
            </div>
          </div>

          {status && (
            <div className={`p-5 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300 ${
              status.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}>
              {status.type === "success" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
              <span className="text-sm font-bold tracking-wide uppercase">{status.message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!file || isUploading}
            className="group relative w-full py-5 rounded-2xl overflow-hidden shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
          >
            {/* Premium Gold Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#B89B5E] via-[#D4AF37] to-[#8C7342] group-hover:scale-[1.05] transition-transform duration-500" />
            
            <div className="relative flex items-center justify-center gap-3 text-white font-bold text-lg uppercase tracking-[0.2em]">
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span>Ingesting Data...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={24} />
                  <span>Commit to Legal Vault</span>
                </>
              )}
            </div>
          </button>
        </form>
      </div>
      
      <div className="mt-8 flex justify-center items-center gap-8 text-[10px] font-bold text-slate-700 uppercase tracking-[0.4em]">
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#B89B5E]" />
            <span>Encrypted Tunnel</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#B89B5E]" />
            <span>Automatic Indexing</span>
         </div>
      </div>
    </div>
  );
}

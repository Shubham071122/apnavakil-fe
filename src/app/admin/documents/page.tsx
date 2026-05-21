"use client";

import React, { useState } from "react";
import { AlertCircle, CheckCircle2, Database, File, Loader2, ShieldCheck, Upload } from "lucide-react";
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
      setStatus({ type: "success", message: "Document stored and indexed." });
      setFile(null);
      setTitle("");
    } catch (error) {
      console.error("Document upload failed:", error);
      setStatus({ type: "error", message: "Upload failed. Please verify the PDF and try again." });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl py-2">
      <header className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <Database className="text-[#A1A1AA]" size={22} />
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white">Legal Vault</h1>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-[#A1A1AA]">
          Upload and index legal documents in a clean administrative workflow.
        </p>
      </header>

      <div className="apple-surface rounded-[2rem] p-6 sm:p-8">
        <form onSubmit={handleUpload} className="space-y-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="ml-1 text-xs font-medium text-[#A1A1AA]">Document title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Indian Penal Code 1860"
                className="premium-input w-full rounded-2xl p-4 text-sm outline-none transition"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="ml-1 text-xs font-medium text-[#A1A1AA]">Legal category</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="premium-input w-full cursor-pointer appearance-none rounded-2xl p-4 pr-11 text-sm outline-none transition"
                >
                  <option>Criminal Law</option>
                  <option>Civil Law</option>
                  <option>Constitution</option>
                  <option>Family Law</option>
                  <option>Corporate Law</option>
                </select>
                <ShieldCheck className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#71717A]" size={17} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-xs font-medium text-[#A1A1AA]">PDF document</label>
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
                className={`flex cursor-pointer flex-col items-center justify-center rounded-[1.75rem] border border-dashed p-10 text-center transition duration-200 ${
                  file
                    ? "border-white/18 bg-white/[0.055]"
                    : "border-white/10 bg-[#121212] hover:border-white/18 hover:bg-white/[0.045]"
                }`}
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[1.35rem] bg-white/[0.055] text-[#D4D4D8]">
                  {file ? <File size={26} /> : <Upload size={26} />}
                </div>
                <span className="text-base font-semibold text-white">
                  {file ? file.name : "Choose a PDF"}
                </span>
                <span className="mt-2 text-xs text-[#71717A]">
                  {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB selected` : "Drag and drop or browse from your device"}
                </span>
              </label>
            </div>
          </div>

          {status && (
            <div
              className={`flex items-center gap-3 rounded-2xl border p-4 text-sm font-medium ${
                status.type === "success"
                  ? "border-white/10 bg-white/[0.045] text-[#D4D4D8]"
                  : "border-red-300/15 bg-red-300/8 text-red-200"
              }`}
            >
              {status.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span>{status.message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!file || isUploading}
            className="quiet-button flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl py-4 text-sm font-semibold transition duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isUploading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Uploading
              </>
            ) : (
              <>
                <ShieldCheck size={19} />
                Upload document
              </>
            )}
          </button>
        </form>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs text-[#71717A]">
        <span className="rounded-full border border-white/8 bg-white/[0.035] px-3 py-1.5">Encrypted upload</span>
        <span className="rounded-full border border-white/8 bg-white/[0.035] px-3 py-1.5">Automatic indexing</span>
      </div>
    </div>
  );
}

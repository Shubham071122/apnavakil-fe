"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, Send, Bot, User, Loader2, Scale, Trash2, Cpu, Zap, Search, Fingerprint } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { socket } from "@/services/socket";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { useChatStore } from "@/store/useChatStore";
import { marked } from "marked";

marked.setOptions({
  breaks: true,
  gfm: true
});

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [currentStatus, setCurrentStatus] = useState<string>("Ready to assist");
  const { messages, addMessage, isProcessing, setProcessing } = useChatStore();
  const { isRecording, startRecording, stopRecording } = useVoiceRecorder();
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    console.log("Connecting to socket...");
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setCurrentStatus("Consultation Ready");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      setCurrentStatus("Connection Error");
    });
    
    socket.on("voice_response", (data) => {
      setProcessing(false);
      setCurrentStatus("Analysis Complete");
      addMessage({
        role: "ASSISTANT",
        content: data.text,
        fullLegalText: data.metadata?.fullLegalText,
      });

      if (data.audio) {
        const blob = new Blob([data.audio], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.play();
        }
      }
    });

    socket.on("response", (data) => {
      setProcessing(false);
      setCurrentStatus("Consultation Ready");
      addMessage({
        role: "ASSISTANT",
        content: data.text,
        fullLegalText: data.metadata?.fullLegalText,
      });
    });

    socket.on("processing", (data) => {
      setProcessing(true);
      setCurrentStatus(data?.status || "Analyzing legal precedents...");
    });

    return () => {
      console.log("Disconnecting socket...");
      socket.off("connect");
      socket.off("connect_error");
      socket.off("voice_response");
      socket.off("response");
      socket.off("processing");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendText = () => {
    if (!input.trim()) return;
    setCurrentStatus("Transmitting data...");
    addMessage({ role: "USER", content: input });
    socket.emit("message", { text: input, conversationId: "default" });
    setInput("");
  };

  const handleVoiceMessage = async () => {
    if (isRecording) {
      setCurrentStatus("Processing audio...");
      const audioBlob = await stopRecording();
      setProcessing(true);
      socket.emit("voice_message", { audio: audioBlob, conversationId: "default" });
    } else {
      setCurrentStatus("Listening to your query...");
      startRecording();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-slate-300 overflow-hidden selection:bg-[#B89B5E]/30 font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(184,155,94,0.05)_0%,transparent_100%)] pointer-events-none" />
      
      <header className="h-20 border-b border-white/5 flex items-center px-10 justify-between relative z-20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#B89B5E] to-[#8C7342] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#B89B5E]/20">
            <Scale size={24} />
          </div>
          <div>
            <h1 className="text-white font-display font-bold text-xl tracking-tight leading-none">ApnaVakil <span className="text-[#B89B5E]">AI</span></h1>
            <p className="text-xs capitalize font-bold text-slate-500 mt-1">Multi-Modal Legal Intelligence</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* <button 
            title="Clear Consultation"
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/20 transition-all text-slate-500 hover:text-red-400 group"
          >
            <Trash2 size={18} className="transition-transform group-active:scale-90" />
          </button> */}
        </div>
      </header>

      {/* 🌌 Chat Stream Area */}
      <div className="flex-1 overflow-y-auto px-6 py-10 custom-scrollbar relative z-10">
        <div className="max-w-4xl mx-auto space-y-10">
          <AnimatePresence initial={false}>
            {messages.length === 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="h-[60vh] flex flex-col items-center justify-center text-center">
                <div className="relative mb-8">
                  <div className="absolute -inset-4 bg-[#B89B5E]/20 blur-3xl rounded-full" />
                  <div className="relative w-24 h-24 bg-[#0a0f1e] border border-white/10 rounded-[2.5rem] flex items-center justify-center text-[#B89B5E] shadow-2xl">
                    <Bot size={48} className="animate-pulse" />
                  </div>
                </div>
                <h2 className="text-3xl font-display font-bold text-white tracking-tight mb-3">Welcome to ApnaVakil AI</h2>
                <p className="text-slate-500 max-w-sm text-sm font-medium leading-relaxed">
                  Start a conversation by typing below or use the microphone for a voice consultation.
                </p>
                <div className="grid grid-cols-2 gap-3 mt-10 w-full max-w-md">
                  {['IPC Section 302', 'Property Sale Deed', 'Divorce Laws', 'Rental Agreement'].map(q => (
                    <button key={q} onClick={() => { setInput(q); handleSendText(); }} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#B89B5E]/30 text-[10px] font-bold uppercase text-slate-400 hover:text-white transition-all text-center">
                      {q}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "USER" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-6 max-w-[85%] ${msg.role === "USER" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center border transition-all duration-500 ${
                    msg.role === "USER" 
                      ? "bg-gradient-to-br from-[#B89B5E] to-[#8C7342] border-white/10 text-white shadow-xl shadow-[#B89B5E]/20" 
                      : "bg-[#0a0f1e] border-white/10 text-[#B89B5E] shadow-xl shadow-black/50"
                  }`}>
                    {msg.role === "USER" ? <Fingerprint size={24} /> : <Cpu size={24} />}
                  </div>
                  
                  <div className={`space-y-4 ${msg.role === "USER" ? "items-end text-right" : "items-start text-left"}`}>
                    <div className={`p-6 rounded-[2rem] shadow-2xl backdrop-blur-xl transition-all ${
                      msg.role === "USER" 
                        ? "bg-white/[0.04] border border-white/10 text-white" 
                        : "bg-[#0a0f1e]/80 border border-white/10 text-slate-200"
                    }`}>
                      <div 
                        className="text-sm font-medium leading-relaxed tracking-wide markdown-content"
                        dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) as string }}
                      />
                    </div>
                    
                    {msg.fullLegalText && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 bg-white/[0.03] border border-white/5 rounded-[2rem] space-y-4 max-w-4xl shadow-2xl">
                        <div className="flex items-center gap-2 text-[#B89B5E] mb-4 opacity-80">
                          <Zap size={14} fill="currentColor" />
                          <span className="text-[10px] uppercase font-bold">Analysis & Precedents</span>
                        </div>
                        <div 
                          className="text-sm text-slate-300 font-medium leading-relaxed markdown-content"
                          dangerouslySetInnerHTML={{ __html: marked.parse(msg.fullLegalText) as string }}
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isProcessing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex gap-6 items-center">
                <div className="w-11 h-11 bg-[#0a0f1e] border border-white/10 rounded-2xl flex items-center justify-center text-[#B89B5E] animate-pulse">
                  <Bot size={24} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{currentStatus}</span>
                  <div className="flex gap-1.5 mt-1">
                    <div className="w-1.5 h-1.5 bg-[#B89B5E] rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-[#B89B5E] rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-[#B89B5E] rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={scrollRef} />
        </div>
      </div>

      <footer className="p-10 relative z-20">
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <AnimatePresence>
              {isRecording && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute -top-20 left-1/2 -translate-x-1/2 flex flex-col items-center"
                >
                  <div className="flex gap-1.5 items-end h-10 mb-2">
                    {[1, 2, 3, 4, 5, 6, 7].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ height: [8, 24, 8] }}
                        transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                        className="w-1.5 bg-[#B89B5E] rounded-full"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#B89B5E]">Listening...</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={`relative flex items-center gap-3 bg-[#0a0f1e]/80 border transition-all duration-500 rounded-[2.5rem] p-3 pl-8 backdrop-blur-3xl shadow-2xl ${
              isRecording ? 'border-[#B89B5E] shadow-[#B89B5E]/10 scale-[1.02]' : 'border-white/10 shadow-black/50'
            }`}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendText()}
                placeholder={isRecording ? "" : "Ask a legal question or search the law..."}
                className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-white placeholder-slate-600 py-4 font-medium tracking-wide text-lg"
              />
              
              <div className="flex items-center gap-2 pr-2">
                <button
                  onClick={handleVoiceMessage}
                  className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 ${
                    isRecording 
                      ? "bg-red-500 text-white shadow-xl shadow-red-500/30" 
                      : "bg-white/5 text-[#B89B5E] hover:bg-[#B89B5E] hover:text-white border border-white/5"
                  }`}
                >
                  {isRecording ? <Loader2 className="animate-spin" size={24} /> : <Mic size={24} />}
                </button>
                
                <button 
                  onClick={handleSendText}
                  disabled={!input.trim() || isRecording}
                  className="w-14 h-14 bg-gradient-to-br from-[#B89B5E] to-[#8C7342] rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-[#B89B5E]/20 hover:scale-[1.05] active:scale-[0.95] transition-all disabled:opacity-30 disabled:scale-100 disabled:grayscale"
                >
                  <Send size={24} />
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-600 font-bold capitalize">AI Makes Mistakes. Consult a Lawyer.</span>
            </div>
          </div>
        </div>
      </footer>

      <audio ref={audioRef} className="hidden" />
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(184, 155, 94, 0.2);
        }
      `}</style>
    </div>
  );
}

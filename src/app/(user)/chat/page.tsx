"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Bot, Loader2, LogOut, Mic, Scale, Send, Square, Zap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { marked } from "marked";
import { logoutAction } from "../../../../actions/auth";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { socket } from "@/services/socket";
import { useChatStore } from "@/store/useChatStore";

marked.setOptions({
  breaks: true,
  gfm: true,
});

function TypingMarkdown({
  content,
  className,
  onTick,
  onComplete,
  stopped,
}: {
  content: string;
  className?: string;
  onTick?: () => void;
  onComplete?: () => void;
  stopped?: boolean;
}) {
  const [visibleContent, setVisibleContent] = useState("");

  useEffect(() => {
    let index = 0;
    let frameId: number | undefined;

    const typeNextChunk = () => {
      if (stopped) return;

      index = Math.min(content.length, index + 5);
      setVisibleContent(content.slice(0, index));
      onTick?.();

      if (index < content.length) {
        frameId = window.setTimeout(typeNextChunk, 12);
      } else {
        onComplete?.();
      }
    };

    frameId = window.setTimeout(typeNextChunk, 0);

    return () => {
      if (frameId) {
        window.clearTimeout(frameId);
      }
    };
  }, [content, onComplete, onTick, stopped]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: marked.parse(visibleContent) as string }}
    />
  );
}

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [currentStatus, setCurrentStatus] = useState<string>("Ready");
  const [activeTypingKey, setActiveTypingKey] = useState<string | null>(null);
  const [stoppedTypingKey, setStoppedTypingKey] = useState<string | null>(null);
  const { messages, addMessage, isProcessing, setProcessing } = useChatStore();
  const { isRecording, startRecording, stopRecording } = useVoiceRecorder();
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ignoreNextResponseRef = useRef(false);
  const messagesLengthRef = useRef(0);

  useEffect(() => {
    messagesLengthRef.current = messages.length;
  }, [messages.length]);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      setCurrentStatus("Ready");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      setCurrentStatus("Connection issue");
    });

    socket.on("voice_response", (data) => {
      setProcessing(false);
      setCurrentStatus("Ready");
      if (ignoreNextResponseRef.current) {
        ignoreNextResponseRef.current = false;
        return;
      }

      setActiveTypingKey(`${messagesLengthRef.current}-${data.text.length}`);
      setStoppedTypingKey(null);
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
      setCurrentStatus("Ready");
      if (ignoreNextResponseRef.current) {
        ignoreNextResponseRef.current = false;
        return;
      }

      setActiveTypingKey(`${messagesLengthRef.current}-${data.text.length}`);
      setStoppedTypingKey(null);
      addMessage({
        role: "ASSISTANT",
        content: data.text,
        fullLegalText: data.metadata?.fullLegalText,
      });
    });

    socket.on("processing", (data) => {
      setProcessing(true);
      setCurrentStatus(data?.status || "Reviewing your question");
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("voice_response");
      socket.off("response");
      socket.off("processing");
      socket.disconnect();
    };
  }, [addMessage, setProcessing]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const scrollToLatestMessage = useCallback(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const stopResponse = () => {
    if (isProcessing) {
      ignoreNextResponseRef.current = true;
      socket.emit("cancel_response", { conversationId: "default" });
    }

    setProcessing(false);
    setCurrentStatus("Ready");
    setStoppedTypingKey(activeTypingKey);
    setActiveTypingKey(null);
  };

  const sendText = (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    setCurrentStatus("Sending");
    addMessage({ role: "USER", content: trimmedText });
    socket.emit("message", { text: trimmedText, conversationId: "default" });
    setInput("");
  };

  const handleSendText = () => {
    if (isProcessing || activeTypingKey) {
      stopResponse();
      return;
    }

    sendText(input);
  };

  const handleVoiceMessage = async () => {
    if (isRecording) {
      setCurrentStatus("Processing audio");
      const audioBlob = await stopRecording();
      setProcessing(true);
      socket.emit("voice_message", { audio: audioBlob, conversationId: "default" });
    } else {
      setCurrentStatus("Listening");
      startRecording();
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0A0A0A] text-[#F5F5F5]">
      <header className="relative z-20 border-b border-white/8 bg-[#0A0A0A]/88 px-5 py-4 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[1.15rem] border border-white/10 bg-[#18181B]">
              <Scale size={20} strokeWidth={1.85} />
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold tracking-tight">ApnaVakil</h1>
              <p className="mt-0.5 text-xs text-[#71717A]">{currentStatus}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden rounded-full border border-white/8 bg-white/[0.035] px-3 py-1.5 text-xs text-[#A1A1AA] sm:block">
              Legal workspace
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                aria-label="Logout"
                title="Logout"
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.035] text-[#A1A1AA] transition duration-200 hover:bg-white/[0.07] hover:text-white"
              >
                <LogOut size={17} />
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="custom-scrollbar relative z-10 flex-1 overflow-y-auto px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-3xl space-y-9">
          <AnimatePresence initial={false}>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex min-h-[58vh] flex-col items-center justify-center text-center"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[1.35rem] border border-white/10 bg-[#18181B]">
                  <Scale size={24} strokeWidth={1.7} />
                </div>
                <h2 className="font-display text-3xl font-semibold tracking-tight text-[#F5F5F5]">
                  How can I help today?
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-[#A1A1AA]">
                  Ask a legal question, review a document, or use voice when it is easier to speak.
                </p>
                <div className="mt-8 grid w-full max-w-lg grid-cols-1 gap-2 sm:grid-cols-2">
                  {["IPC Section 302", "Property sale deed", "Divorce laws", "Rental agreement"].map((q) => (
                    <button
                      key={q}
                      onClick={() => sendText(q)}
                      className="rounded-2xl border border-white/8 bg-white/[0.035] px-4 py-3 text-left text-sm text-[#D4D4D8] transition duration-200 hover:bg-white/[0.07] hover:text-white"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {messages.map((msg, idx) => {
              const typingKey = `${idx}-${msg.content.length}`;
              const shouldType = activeTypingKey === typingKey || stoppedTypingKey === typingKey;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "USER" ? "justify-end" : "justify-start"}`}
                >
                  <div className={msg.role === "USER" ? "max-w-[82%]" : "w-full"}>
                    <div
                      className={
                        msg.role === "USER"
                          ? "rounded-[1.35rem] bg-[#1F1F1F] px-5 py-3.5 text-left text-sm leading-6 text-[#F5F5F5]"
                          : "text-left text-[#E4E4E7]"
                      }
                    >
                      {msg.role === "ASSISTANT" && shouldType ? (
                        <TypingMarkdown
                          content={msg.content}
                          onTick={scrollToLatestMessage}
                          onComplete={() => {
                            setActiveTypingKey((currentKey) => currentKey === typingKey ? null : currentKey);
                          }}
                          stopped={stoppedTypingKey === typingKey}
                          className="markdown-content text-[15px] font-medium leading-7"
                        />
                      ) : (
                        <div
                          className="markdown-content text-[15px] font-medium leading-7"
                          dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) as string }}
                        />
                      )}
                    </div>

                    {msg.fullLegalText && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-5 border-t border-white/10 pt-5"
                      >
                        <div className="mb-4 flex items-center gap-2 text-[#A1A1AA]">
                          <Zap size={14} />
                          <span className="text-xs font-medium">Analysis and references</span>
                        </div>
                        {shouldType ? (
                          <TypingMarkdown
                            content={msg.fullLegalText}
                            onTick={scrollToLatestMessage}
                            stopped={stoppedTypingKey === typingKey}
                            className="markdown-content text-sm font-medium leading-7 text-[#D4D4D8]"
                          />
                        ) : (
                          <div
                            className="markdown-content text-sm font-medium leading-7 text-[#D4D4D8]"
                            dangerouslySetInnerHTML={{ __html: marked.parse(msg.fullLegalText) as string }}
                          />
                        )}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {isProcessing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/8 bg-white/[0.035] px-4 py-3">
                <Bot size={17} className="text-[#A1A1AA]" />
                <span className="text-xs font-medium text-[#A1A1AA]">{currentStatus}</span>
                <div className="flex gap-1">
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#A1A1AA] [animation-delay:-0.3s]" />
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#A1A1AA] [animation-delay:-0.15s]" />
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#A1A1AA]" />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={scrollRef} />
        </div>
      </div>

      <footer className="relative z-20 px-5 pb-5 pt-3 sm:px-8 sm:pb-7">
        <div className="mx-auto max-w-3xl">
          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="mb-3 text-center text-xs font-medium text-[#D4D4D8]"
              >
                Listening...
              </motion.div>
            )}
          </AnimatePresence>

          <div className="apple-surface flex items-center gap-2 rounded-[2rem] p-2 pl-5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendText()}
              disabled={isProcessing || Boolean(activeTypingKey)}
              placeholder={isRecording ? "" : "Ask a legal question or search the law..."}
              className="min-w-0 flex-1 bg-transparent py-4 text-base text-[#F5F5F5] outline-none placeholder:text-[#71717A] disabled:opacity-60"
            />

            <button
              onClick={handleVoiceMessage}
              aria-label="Record voice"
              className={`flex h-12 w-12 items-center justify-center rounded-[1.35rem] border transition duration-200 ${
                isRecording
                  ? "border-red-200/20 bg-red-300/12 text-red-100"
                  : "border-white/8 bg-white/[0.045] text-[#D4D4D8] hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              {isRecording ? <Loader2 className="animate-spin" size={21} /> : <Mic size={21} />}
            </button>

            <button
              onClick={handleSendText}
              disabled={!(isProcessing || activeTypingKey) && (!input.trim() || isRecording)}
              aria-label={isProcessing || activeTypingKey ? "Stop response" : "Send message"}
              className="quiet-button flex h-12 w-12 items-center justify-center rounded-[1.35rem] transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35"
            >
              {isProcessing || activeTypingKey ? <Square size={18} fill="currentColor" /> : <Send size={20} />}
            </button>
          </div>

          <p className="mt-3 text-center text-xs text-[#71717A]">AI can make mistakes. Consult a lawyer before acting.</p>
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
          background: rgba(255, 255, 255, 0.08);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.16);
        }
      `}</style>
    </div>
  );
}

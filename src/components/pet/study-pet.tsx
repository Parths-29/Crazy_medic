"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, Send, Sparkles, Loader2, Trash2 } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hi Medico! I'm Dr. Medico. Ask me for high-yield MBBS mnemonics, which handwritten notebook suits your Prof exam, or help with your Library!",
  },
];

const QUICK_PROMPTS = [
  "Which notes for Ophthal?",
  "Give a Surgery mnemonic",
  "How does 2-device limit work?",
];

export function StudyPet() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Never clutter the focused 3D notebook stage or protected PDF viewer
  if (pathname === "/stage" || pathname?.startsWith("/viewer")) {
    return null;
  }

  const sendMessage = async (textToSend: string) => {
    const clean = textToSend.trim();
    if (!clean || isThinking) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: "user",
      content: clean,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: clean }),
      });

      const data = await res.json();
      const replyText =
        data.reply || data.error || "Oops! My stethoscope dropped. Please try asking again.";

      setMessages((prev) => [
        ...prev,
        {
          id: `a_${Date.now()}`,
          role: "assistant",
          content: replyText,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: "assistant",
          content: "Network hiccup! Try asking again in a second.",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-sans">
      {/* Expanded Chat Panel */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] sm:w-96 bg-white border-3 border-[var(--navy)] rounded-2xl shadow-[6px_6px_0_var(--navy)] overflow-hidden flex flex-col max-h-[75dvh] animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-[var(--navy)] text-[var(--cream)] px-4 py-3 flex items-center justify-between border-b-2 border-[var(--navy)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--coral)] border-2 border-white/20 flex items-center justify-center">
                <MascotSvg state={isThinking ? "think" : "idle"} className="w-6 h-6" />
              </div>
              <div>
                <span className="font-serif font-bold text-sm block leading-none">
                  Dr. Medico AI
                </span>
                <span className="text-[10px] font-mono text-[var(--coral)]">
                  The Crazy Medic Companion
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages(INITIAL_MESSAGES)}
                title="Clear chat"
                className="p-1.5 rounded-lg hover:bg-white/10 text-[var(--cream)]/70 hover:text-[var(--cream)] transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close AI assistant"
                className="p-1.5 rounded-lg hover:bg-white/10 text-[var(--cream)]/70 hover:text-[var(--cream)] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div
            ref={scrollRef}
            className="flex-1 p-4 space-y-3 overflow-y-auto bg-[#F5EEDF]/60 min-h-[240px] max-h-[380px]"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-xs leading-relaxed border-2 border-[var(--navy)] ${
                    m.role === "user"
                      ? "bg-[var(--coral)] text-[var(--navy)] font-semibold shadow-[2px_2px_0_var(--navy)]"
                      : "bg-white text-[var(--navy)] shadow-[2px_2px_0_var(--navy)]"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex justify-start">
                <div className="px-3.5 py-2 rounded-xl bg-white border-2 border-[var(--navy)] text-xs font-mono text-[var(--navy)]/70 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--coral)]" />
                  <span>Consulting textbooks...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompt Pills */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 bg-white border-t border-[var(--navy)]/10 flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-[var(--cream)] hover:bg-[var(--coral)]/20 border border-[var(--navy)]/20 text-[var(--navy)] transition cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t-2 border-[var(--navy)] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about notes or mnemonics..."
              maxLength={500}
              className="flex-1 px-3 py-2 rounded-lg border-2 border-[var(--navy)] text-xs text-[var(--navy)] focus:outline-none bg-[#F5EEDF]/30"
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              aria-label="Send message"
              className="p-2 rounded-lg border-2 border-[var(--navy)] bg-[var(--coral)] hover:bg-[var(--coral-hover)] text-[var(--navy)] transition shadow-[2px_2px_0_var(--navy)] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Mascot Pill Trigger */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle Dr. Medico AI Assistant"
          className="group flex items-center gap-2.5 pl-2.5 pr-4 py-2 rounded-full bg-[var(--cream)] border-2 border-[var(--navy)] shadow-[4px_4px_0_var(--navy)] hover:bg-white active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-[var(--coral)] border-2 border-[var(--navy)] flex items-center justify-center shrink-0">
            <MascotSvg state={isOpen ? "talk" : "idle"} className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="font-serif font-bold text-xs text-[var(--navy)] flex items-center gap-1 leading-none">
              <span>Ask Dr. Medico</span>
              <Sparkles className="w-3 h-3 text-[var(--coral-ink)]" />
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

function MascotSvg({
  state,
  className = "w-6 h-6",
}: {
  state: "idle" | "think" | "talk";
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Cute notebook/pill head */}
      <rect
        x="5"
        y="6"
        width="26"
        height="24"
        rx="6"
        fill="#F5EEDF"
        stroke="#141A2E"
        strokeWidth="2.5"
      />
      {/* Spine accent */}
      <line x1="10" y1="6" x2="10" y2="30" stroke="#141A2E" strokeWidth="2" />
      {/* Medical Cross badge */}
      <path d="M22 10V14M20 12H24" stroke="#BA3320" strokeWidth="2" strokeLinecap="round" />
      {/* Eyes */}
      {state === "think" ? (
        <>
          <circle cx="17" cy="19" r="1.8" fill="#141A2E" />
          <circle cx="25" cy="18" r="1.8" fill="#141A2E" />
        </>
      ) : (
        <>
          <circle cx="17" cy="19.5" r="2" fill="#141A2E" />
          <circle cx="25" cy="19.5" r="2" fill="#141A2E" />
        </>
      )}
      {/* Smile */}
      <path
        d={state === "talk" ? "M18 24.5C19.5 26 22.5 26 24 24.5" : "M18.5 24C20 25.2 22 25.2 23.5 24"}
        stroke="#141A2E"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

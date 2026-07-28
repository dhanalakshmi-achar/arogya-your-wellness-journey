import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Send, RotateCcw, Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "@/store/app";
import { coachReply } from "@/lib/ai";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/ai-coach")({
  head: () => ({ meta: [{ title: "AI Coach — Arogya" }, { name: "description", content: "Chat with your personal AI health coach." }] }),
  component: AICoach,
});

const PROMPTS = ["Summarize my week", "Why am I tired?", "Suggest something now", "Cycle update"];

function AICoach() {
  const chat = useApp((s) => s.chat);
  const addChat = useApp((s) => s.addChat);
  const clearChat = useApp((s) => s.clearChat);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chat.length]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    addChat({ role: "user", text: trimmed, at: Date.now() });
    const reply = coachReply(trimmed, useApp.getState());
    setTimeout(() => addChat({ role: "ai", text: reply, at: Date.now() }), 350);
    setInput("");
  };

  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { toast.error("Voice not supported in this browser"); return; }
    const rec = new SR();
    rec.lang = "en-US"; rec.interimResults = false;
    setListening(true);
    rec.onresult = (e: any) => { setInput(e.results[0][0].transcript); setListening(false); };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
  };

  return (
    <div className="mx-auto flex h-[calc(100dvh-6rem)] max-w-3xl flex-col px-4 py-6 md:px-8 md:py-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl gradient-hero text-white shadow-glow"><Sparkles className="h-5 w-5" /></div>
          <div>
            <h1 className="font-heading text-xl font-bold">AI Coach</h1>
            <p className="text-xs text-muted-foreground">Personal wellness companion</p>
          </div>
        </div>
        <button onClick={clearChat} className="inline-flex items-center gap-1 rounded-2xl border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">
          <RotateCcw className="h-3 w-3" /> New chat
        </button>
      </div>

      <div ref={scrollRef} className="mt-6 flex-1 space-y-3 overflow-y-auto rounded-3xl border bg-card p-4 shadow-soft">
        {chat.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {PROMPTS.map((p) => (
          <button key={p} onClick={() => send(p)} className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary">
            {p}
          </button>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="mt-3 flex items-center gap-2 rounded-full border bg-card p-2 shadow-soft">
        <button type="button" onClick={startVoice} className={`grid h-10 w-10 place-items-center rounded-full ${listening ? "bg-destructive text-white" : "bg-muted text-muted-foreground"}`} aria-label="Voice">
          <Mic className="h-4 w-4" />
        </button>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything…" className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground" />
        <button type="submit" className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow" aria-label="Send">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Send } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/ai-coach")({
  head: () => ({ meta: [{ title: "AI Coach — Arogya" }, { name: "description", content: "Chat with your personal AI health coach." }] }),
  component: AICoach,
});

type Msg = { role: "user" | "ai"; text: string };

function AICoach() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "Hi 👋 I'm your Arogya coach. How are you feeling today?" },
  ]);
  const [input, setInput] = useState("");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((m) => [
      ...m,
      { role: "user", text: input },
      { role: "ai", text: "I'm listening — full AI wiring is coming in the next update. In the meantime, try a 3-minute breathing break." },
    ]);
    setInput("");
  };

  return (
    <div className="mx-auto flex h-[calc(100dvh-6rem)] max-w-3xl flex-col px-4 py-6 md:px-8 md:py-10">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl gradient-hero text-white shadow-glow">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold">AI Coach</h1>
          <p className="text-xs text-muted-foreground">Your personal wellness companion</p>
        </div>
      </div>

      <div className="mt-6 flex-1 space-y-3 overflow-y-auto rounded-3xl border bg-card p-4 shadow-soft">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
              }`}
            >
              {m.text}
            </div>
          </motion.div>
        ))}
      </div>

      <form onSubmit={send} className="mt-4 flex items-center gap-2 rounded-full border bg-card p-2 shadow-soft">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about sleep, nutrition, workouts…"
          className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-muted-foreground"
        />
        <button type="submit" className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow" aria-label="Send">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

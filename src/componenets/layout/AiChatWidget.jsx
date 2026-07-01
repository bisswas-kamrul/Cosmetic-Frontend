import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";

const API_URL = "https://cosmetic-backend-e6ia.onrender.com";

const createInitialMessage = (welcomeMessage) => ({
  id: Date.now(),
  sender: "assistant",
  text:
    welcomeMessage ||
    "Hi! I can help with products, prices, shipping, returns, and checkout.",
});

const AiChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    enabled: true,
    welcomeMessage:
      "Hi! I can help with products, prices, shipping, returns, and checkout.",
    suggestedQuestions: [],
  });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/ai/settings`);
        setSettings(data);
        setMessages([createInitialMessage(data.welcomeMessage)]);
      } catch (error) {
        console.error("Failed to load AI settings", error);
        setMessages([
          createInitialMessage(
            "Hi! I can help with products, prices, shipping, returns, and checkout.",
          ),
        ]);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const suggestedQuestions = useMemo(
    () => settings.suggestedQuestions || [],
    [settings.suggestedQuestions],
  );

  const handleSend = async (messageText = input) => {
    const trimmed = messageText.trim();
    if (!trimmed || loading) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/ai/chat`, {
        message: trimmed,
      });
      const assistantMessage = {
        id: Date.now() + 1,
        sender: "assistant",
        text:
          data.reply ||
          "I can help with products, prices, shipping, returns, and checkout.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: "assistant",
          text: "The support assistant is unavailable right now. Please try again shortly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  if (!settings.enabled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[92vw] max-w-[380px] overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-black/10 bg-black px-4 py-3 text-white dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-white/15 p-2">
                  <Sparkles size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold">AI Support</p>
                  <p className="text-xs text-white/70">Online now</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-white/80 transition hover:bg-white/10"
                aria-label="Close chat">
                <X size={18} />
              </button>
            </div>

            <div className="flex h-[420px] flex-col">
              <div className="flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-white to-slate-50 p-4 dark:from-zinc-900 dark:to-zinc-950">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6 shadow-sm ${message.sender === "user" ? "bg-black text-white" : "bg-white text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"}`}>
                      <div className="whitespace-pre-wrap">{message.text}</div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm dark:bg-zinc-800 dark:text-zinc-200">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-black dark:bg-white" />
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-black/70 dark:bg-white/70"
                          style={{ animationDelay: "0.15s" }}
                        />
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-black/40 dark:bg-white/40"
                          style={{ animationDelay: "0.3s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {suggestedQuestions.length > 0 && (
                <div className="border-t border-black/10 bg-white/90 p-3 dark:border-white/10 dark:bg-zinc-900/90">
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Suggested questions
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((question) => (
                      <button
                        key={question}
                        onClick={() => handleSend(question)}
                        className="rounded-full border border-black/10 bg-zinc-50 px-2.5 py-1.5 text-xs text-zinc-700 transition hover:bg-zinc-100 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200">
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-black/10 bg-white p-3 dark:border-white/10 dark:bg-zinc-900">
                <div className="flex items-center gap-2 rounded-full border border-black/10 bg-zinc-50 px-3 py-2 dark:border-white/10 dark:bg-zinc-800">
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about products or support..."
                    className="flex-1 border-none bg-transparent text-sm outline-none"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => handleSend()}
                    disabled={loading || !input.trim()}>
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
        <MessageCircle size={18} />
        <span className="hidden sm:inline">Need help?</span>
      </motion.button>
    </div>
  );
};

export default AiChatWidget;

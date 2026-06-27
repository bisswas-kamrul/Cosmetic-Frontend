import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  Bot,
  ChevronDown,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://cosmetic-backend-e6ia.onrender.com";

const SESSION_STORAGE_KEY = "cosmetic_support_chat_session";
const VISITOR_STORAGE_KEY = "cosmetic_support_visitor";

function createClientId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `visitor-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getStoredValue(key, fallback = "") {
  try {
    return window.localStorage.getItem(key) || fallback;
  } catch (error) {
    return fallback;
  }
}

function setStoredValue(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    // Local storage can be blocked in private browsing; chat still works without it.
  }
}

const initialMessages = [
  {
    role: "assistant",
    text:
      "Hi! I can help you choose the right cosmetics from our live catalog. Tell me your skin/hair type, concern, and budget.\n\nহ্যালো! আমাদের লাইভ ক্যাটালগ থেকে আপনার জন্য ঠিক পণ্য বেছে দিতে পারি। আপনার স্কিন/হেয়ার টাইপ, সমস্যা আর বাজেট বলুন।",
    products: [],
  },
];

const CustomerSupportChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => getStoredValue(SESSION_STORAGE_KEY));
  const [visitorId] = useState(() => {
    const storedVisitorId = getStoredValue(VISITOR_STORAGE_KEY);
    if (storedVisitorId) return storedVisitorId;

    const newVisitorId = createClientId();
    setStoredValue(VISITOR_STORAGE_KEY, newVisitorId);
    return newVisitorId;
  });

  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const canSend = useMemo(() => message.trim().length > 0 && !loading, [message, loading]);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, open]);

  const sendMessage = async (event) => {
    event.preventDefault();

    const customerMessage = message.trim();
    if (!customerMessage || loading) return;

    setMessages((items) => [...items, { role: "user", text: customerMessage, products: [] }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/chatbot/message`, {
        message: customerMessage,
        sessionId,
        visitorId,
      });

      const reply = res.data?.data;

      if (reply?.sessionId) {
        setSessionId(reply.sessionId);
        setStoredValue(SESSION_STORAGE_KEY, reply.sessionId);
      }

      setMessages((items) => [
        ...items,
        {
          role: "assistant",
          text:
            reply?.answer ||
            "Sorry, I could not find that information in the database right now.",
          products: Array.isArray(reply?.products) ? reply.products : [],
        },
      ]);
    } catch (error) {
      setMessages((items) => [
        ...items,
        {
          role: "assistant",
          text: "Sorry, support chat is not responding right now. Please try again in a moment.",
          products: [],
        },
      ]);
    } finally {
      setLoading(false);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <div className="fixed bottom-5 right-4 z-50 sm:right-6">
      {open && (
        <div className="mb-3 flex h-[min(640px,calc(100vh-7rem))] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-950 px-4 py-3 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-neutral-950">
                <Bot className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">Beauty Support</p>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>Online</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-2 transition hover:bg-white/10"
              aria-label="Close support chat"
              title="Close">
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-neutral-50 p-3">
            {messages.map((item, index) => {
              const isUser = item.role === "user";

              return (
                <div
                  key={`${item.role}-${index}`}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[88%] rounded-lg px-3 py-2 text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? "bg-neutral-950 text-white"
                        : "border border-neutral-200 bg-white text-neutral-800"
                    }`}>
                    <p className="whitespace-pre-line break-words">{item.text}</p>

                    {item.products.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {item.products.map((product) => (
                          <Link
                            key={product.id}
                            to={`/ProductDetails/${product.id}`}
                            onClick={() => setOpen(false)}
                            className="flex gap-2 rounded-md border border-neutral-200 bg-white p-2 text-neutral-800 transition hover:border-neutral-950">
                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-neutral-400">
                                  <Sparkles className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-medium">{product.name}</span>
                              <span className="mt-1 block text-xs text-neutral-600">
                                ৳{product.price} · Stock: {product.stock}
                              </span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-600 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Checking catalog...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="flex gap-2 border-t border-neutral-200 bg-white p-3">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask in English or Bangla..."
              className="min-w-0 flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-neutral-950"
              maxLength={1000}
            />

            <button
              type="submit"
              disabled={!canSend}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-neutral-950 text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
              aria-label="Send message"
              title="Send">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-950 text-white shadow-xl transition hover:bg-neutral-800"
        aria-label="Open customer support chat"
        title="Support chat">
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
};

export default CustomerSupportChatbot;

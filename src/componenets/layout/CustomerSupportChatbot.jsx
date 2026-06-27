import React, { useMemo, useRef, useState } from "react";
import axios from "axios";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";
import { Link } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://cosmetic-backend-e6ia.onrender.com";

const initialMessages = [
  {
    role: "bot",
    text:
      "Hi! Ask me about products, prices, stock, or recommendations. I only use products available in our database.\n\nহ্যালো! পণ্য, দাম, স্টক বা সাজেশন জানতে পারেন। আমি শুধু আমাদের ডাটাবেসের পণ্য নিয়েই উত্তর দিই।",
    products: [],
  },
];

const CustomerSupportChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const canSend = useMemo(() => message.trim().length > 0 && !loading, [message, loading]);

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
      });

      const reply = res.data?.data;

      setMessages((items) => [
        ...items,
        {
          role: "bot",
          text: reply?.answer || "Sorry, I could not find a product answer right now.",
          products: Array.isArray(reply?.products) ? reply.products : [],
        },
      ]);
    } catch (error) {
      setMessages((items) => [
        ...items,
        {
          role: "bot",
          text:
            "Sorry, support chat is not responding right now. Please try again in a moment.",
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
        <div className="mb-3 flex h-[min(620px,calc(100vh-7rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-lg border bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b bg-black px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <div>
                <p className="text-sm font-semibold">AI Support</p>
                <p className="text-xs text-white/70">Database products only</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 transition hover:bg-white/10"
              aria-label="Close support chat">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-3">
            {messages.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[88%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                    item.role === "user"
                      ? "bg-black text-white"
                      : "border bg-white text-gray-800"
                  }`}>
                  <p className="whitespace-pre-line">{item.text}</p>

                  {item.products.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {item.products.map((product) => (
                        <Link
                          key={product.id}
                          to={`/ProductDetails/${product.id}`}
                          onClick={() => setOpen(false)}
                          className="flex gap-2 rounded-md border bg-white p-2 text-gray-800 transition hover:border-black">
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-12 w-12 rounded object-cover"
                            />
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium">{product.name}</span>
                            <span className="block text-xs text-gray-600">
                              ৳{product.price} | Stock: {product.stock}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking products...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="flex gap-2 border-t bg-white p-3">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask in English or Bangla..."
              className="min-w-0 flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:border-black"
              maxLength={1000}
            />

            <button
              type="submit"
              disabled={!canSend}
              className="flex h-10 w-10 items-center justify-center rounded-md bg-black text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
              aria-label="Send message">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-xl transition hover:bg-gray-800"
        aria-label="Open customer support chat">
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
};

export default CustomerSupportChatbot;

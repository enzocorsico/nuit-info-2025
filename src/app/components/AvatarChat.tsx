"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";

interface Message {
  id: string;
  type: "user" | "bot";
  text: string;
  timestamp: Date;
}

export default function AvatarChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      text: "🎃 Yo ! Moi c'est le Pirate NIRD ! Tu veux discuter de numérique responsable ?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Create empty bot message for streaming
    const botMessageId = (Date.now() + 1).toString();
    const botMessage: Message = {
      id: botMessageId,
      type: "bot",
      text: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      // Check if it's a stream response
      if (response.headers.get("content-type")?.includes("text/plain")) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          let accumulatedText = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            accumulatedText += chunk;

            // Update the bot message with accumulated text
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === botMessageId
                  ? { ...msg, text: accumulatedText }
                  : msg
              )
            );
          }
        }
      } else {
        // Fallback for JSON response
        const data = await response.json();
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? { ...msg, text: data.response }
              : msg
          )
        );

        if (data.isOffline) {
          const errorMessage: Message = {
            id: (Date.now() + 2).toString(),
            type: "bot",
            text: "😅 Oups, j'ai eu un problème... Réessaie !",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      }
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        text: "😅 Oups, une erreur est survenue...",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setIsReturning(true);
      setTimeout(() => {
        setPosition({ x: 0, y: 0 });
        setTimeout(() => setIsReturning(false), 3500);
      }, 50);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <>
      {/* Floating Avatar - Draggable character - Only show when chat is closed */}
      {!isOpen && (
        <div
          ref={avatarRef}
          onMouseDown={handleMouseDown}
          onClick={() => !isDragging && setIsOpen(!isOpen)}
          className="fixed right-8 bottom-1/3 z-40 focus:outline-none group"
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            transition: isReturning ? "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)" : isDragging ? "none" : "transform 0.3s ease",
            cursor: isDragging ? "grabbing" : "grab",
          }}
        >
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            <div className={`absolute inset-0 group-hover:scale-110 transition-transform duration-300 ${
              isDragging ? "" : isReturning ? "animate-spin-return" : "animate-float-smooth"
            }`}>
              <Image
                src="/Half_le_pirate_fou.png"
                alt="Pirate NIRD"
                fill
                className="object-contain drop-shadow-2xl"
                priority
                draggable={false}
              />

              {/* Speech bubble indicator */}
              {!isDragging && (
                <div className="absolute -top-2 -right-2 bg-white rounded-full px-3 py-1 shadow-lg border-2 border-amber-400 animate-pulse">
                  <span className="text-2xl">💬</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-32 md:bottom-6 right-6 z-30 w-96 h-[600px] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          {/* Header with floating character */}
          <div className="bg-linear-to-r from-amber-400 via-orange-400 to-pink-400 p-6 flex items-center justify-between relative">
            {/* Floating character on the left */}
            <div className="absolute left-2 top-1/2 -translate-y-1/3 w-20 h-20 animate-float-smooth">
              <Image
                src="/Half_le_pirate_fou.png"
                alt="Pirate NIRD"
                fill
                className="object-contain drop-shadow-2xl"
              />
            </div>

            <div className="flex items-center gap-3 ml-28">
              <div>
                <h3 className="font-bold text-white text-lg">Chat'bruti</h3>
                <p className="text-white/80 text-xs">Toujours prêt à discuter!</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-linear-to-b from-slate-50 to-white">
            {messages.map((message, index) => (
              message.type === "user" || message.text ? (
                <div
                  key={index}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-2xl ${
                      message.type === "user"
                        ? "bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-br-none"
                        : "bg-slate-200 text-slate-900 rounded-bl-none"
                    } shadow-sm`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </div>
              ) : null
            ))}

            {isLoading && !messages[messages.length - 1]?.text && (
              <div className="flex justify-start">
                <div className="bg-slate-200 text-slate-900 px-4 py-3 rounded-2xl rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="border-t border-slate-200 bg-white p-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Dis quelque chose..."
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-linear-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

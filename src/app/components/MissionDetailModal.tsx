"use client";

import { useState, useEffect, useRef } from "react";
import { XMarkIcon, PaperAirplaneIcon, SparklesIcon } from "@heroicons/react/24/solid";

interface Step {
  id: string;
  title: string;
  description: string;
}

interface MissionDetail {
  id: string;
  title: string;
  description: string;
  steps: Step[];
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  stepId?: string;
}

interface MissionDetailModalProps {
  missionId: string;
  role: string;
  lieu: string;
  isOpen: boolean;
  onClose: () => void;
  scores: {
    inclusion: number;
    responsabilité: number;
    durabilité: number;
  };
}

export default function MissionDetailModal({
  missionId,
  role,
  lieu,
  isOpen,
  onClose,
  scores,
}: MissionDetailModalProps) {
  const [missionData, setMissionData] = useState<MissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load mission data
  useEffect(() => {
    if (!isOpen) return;

    const loadMissionData = async () => {
      try {
        const response = await fetch(`/api/missions-content/${missionId}`);
        if (response.ok) {
          const data = await response.json();
          setMissionData(data);
          // Initialize first step
          if (data.steps && data.steps.length > 0) {
            setSelectedStepId(data.steps[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to load mission data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMissionData();
  }, [isOpen, missionId]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: chatInput,
      stepId: selectedStepId || undefined,
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: chatInput,
          type: "mission-help",
          missionId,
          stepId: selectedStepId,
          context: {
            missionTitle: missionData?.title,
            stepTitle: missionData?.steps.find((s: Step) => s.id === selectedStepId)?.title,
          },
        }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      // Add empty assistant message that we'll update
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
          stepId: selectedStepId || undefined,
        },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;

        // Update the last message with accumulated response
        setChatMessages((prev) => {
          const updated = [...prev];
          if (updated[updated.length - 1]?.role === "assistant") {
            updated[updated.length - 1].content = fullResponse;
          }
          return updated;
        });
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Erreur de connexion. Assure-toi qu'Ollama est lancé (http://localhost:11434).",
          stepId: selectedStepId || undefined,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{missionData?.title || "Mission"}</h2>
            <p className="text-sm text-slate-600 mt-1">
              Rôle: {role} • Lieu: {lieu}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <p className="text-lg text-slate-600">Chargement des détails...</p>
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            {/* Left side: Questions and recap */}
            <div className="flex-1 overflow-y-auto p-6 border-r border-slate-200">
              <div className="space-y-6">
                {/* Scores recap */}
                <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                  <h3 className="font-bold text-slate-900 mb-3">Vos scores à cette mission</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-slate-600 font-semibold">❤️ Inclusion</p>
                      <p className="text-2xl font-bold text-blue-600">{scores.inclusion}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-slate-600 font-semibold">🧠 Responsabilité</p>
                      <p className="text-2xl font-bold text-pink-600">{scores.responsabilité}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-slate-600 font-semibold">🌱 Durabilité</p>
                      <p className="text-2xl font-bold text-amber-600">{scores.durabilité}</p>
                    </div>
                  </div>
                </div>

                {/* Questions */}
                <div>
                  <h3 className="font-bold text-slate-900 mb-3">Les questions</h3>
                  <div className="space-y-2">
                    {missionData?.steps.map((step: Step) => (
                      <button
                        key={step.id}
                        onClick={() => setSelectedStepId(step.id)}
                        className={`w-full text-left p-4 rounded-lg transition-all ${
                          selectedStepId === step.id
                            ? "bg-purple-100 border-2 border-purple-500"
                            : "bg-slate-100 border-2 border-transparent hover:bg-slate-200"
                        }`}
                      >
                        <p className="font-semibold text-slate-900">{step.title}</p>
                        <p className="text-sm text-slate-600 mt-1">{step.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Chat */}
            <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
              {/* Chat header */}
              <div className="p-4 border-b border-slate-200 bg-white">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-purple-600" />
                  <div>
                    <h3 className="font-bold text-slate-900">Besoin d'aide?</h3>
                    <p className="text-xs text-slate-600">
                      Posez une question sur la question sélectionnée
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-slate-600">
                      Vous avez un doute? Posez une question pour améliorer votre compréhension
                    </p>
                  </div>
                )}

                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                        msg.role === "user"
                          ? "bg-purple-600 text-white"
                          : "bg-white text-slate-900 border border-slate-200"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-slate-900 border border-slate-200 px-4 py-2 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-slate-200 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Posez votre question..."
                    className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    disabled={chatLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={chatLoading || !chatInput.trim()}
                    className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

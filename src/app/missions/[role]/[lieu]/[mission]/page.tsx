"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import confetti from "canvas-confetti";

// Mission data structure
interface Choice {
  id: string;
  text: string;
  scores: {
    inclusion: number;
    responsabilité: number;
    durabilité: number;
  };
  feedback: string;
}

interface Step {
  id: string;
  title: string;
  description: string;
  choices: Choice[];
}

interface Mission {
  id: string;
  title: string;
  description: string;
  theme: string;
  steps: Step[];
}

// Empty missions database (will be loaded from JSON)
const missionsDatabase: Record<string, Mission> = {
  "mission-1": {
    id: "mission-1",
    title: "Les données collectées : qui en profite?",
    description: "Analyser comment vos données personnelles sont utilisées par les grandes tech",
    theme: "données",
    steps: [
      {
        id: "step-1",
        title: "Première découverte",
        description: "Vous découvrez que vos données de navigation sont vendues à des annonceurs. Que faites-vous ?",
        choices: [
          {
            id: "choice-1",
            text: "Je refuse et j'utilise un VPN + bloqueurs de publicités",
            feedback: "Excellente réaction ! Vous protégez votre vie privée de manière active.",
            scores: { inclusion: 10, responsabilité: 20, durabilité: 10 },
          },
          {
            id: "choice-2",
            text: "Je n'y fais pas attention, c'est normal maintenant",
            feedback: "Attention ! En ignorant cela, vous acceptez une surveillance massive de votre activité.",
            scores: { inclusion: 0, responsabilité: 0, durabilité: 0 },
          },
          {
            id: "choice-3",
            text: "Je cherche à comprendre ce qui se passe exactement",
            feedback: "Très bien ! Comprendre les enjeux est le premier pas vers une action responsable.",
            scores: { inclusion: 15, responsabilité: 15, durabilité: 15 },
          },
        ],
      },
      {
        id: "step-2",
        title: "Le choix des outils",
        description: "Pour votre établissement, vous devez choisir entre Google Workspace (gratuit mais trace) et une suite bureautique open-source (payante mais souveraine).",
        choices: [
          {
            id: "choice-1",
            text: "Google Workspace - facile et gratuit",
            feedback: "Pratique, mais vous acceptez la dépendance technologique aux GAFAM.",
            scores: { inclusion: 5, responsabilité: -10, durabilité: -5 },
          },
          {
            id: "choice-2",
            text: "Suite open-source - responsable mais complexe",
            feedback: "Excellent choix pour l'indépendance numérique ! Un peu de courbe d'apprentissage en vaut la peine.",
            scores: { inclusion: 20, responsabilité: 30, durabilité: 25 },
          },
          {
            id: "choice-3",
            text: "Hybrid : open-source avec formation pour tous",
            feedback: "Parfait ! Vous cherchez l'équilibre entre accessibilité et responsabilité.",
            scores: { inclusion: 25, responsabilité: 25, durabilité: 20 },
          },
        ],
      },
      {
        id: "step-3",
        title: "L'engagement collectif",
        description: "Vous proposez une campagne de sensibilisation sur la vie privée numérique. Comment l'organisez-vous ?",
        choices: [
          {
            id: "choice-1",
            text: "Un atelier inclusif pour tous, du débutant à l'expert",
            feedback: "Magnifique ! Vous pratiquez l'inclusion numérique.",
            scores: { inclusion: 30, responsabilité: 20, durabilité: 15 },
          },
          {
            id: "choice-2",
            text: "Un webinaire technique réservé aux experts",
            feedback: "Efficace mais limité... Vous n'incluez pas tous les niveaux.",
            scores: { inclusion: 10, responsabilité: 15, durabilité: 10 },
          },
          {
            id: "choice-3",
            text: "Une série de ressources en ligne accessibles 24/7",
            feedback: "Excellent ! Vous maximisez la portée et l'accessibilité pour tous.",
            scores: { inclusion: 25, responsabilité: 20, durabilité: 30 },
          },
        ],
      },
    ],
  },
  "mission-prof-1": {
    id: "mission-prof-1",
    title: "Enseigner le numérique responsable",
    description: "Intégrer NIRD dans votre curriculum pédagogique",
    theme: "pédagogie",
    steps: [
      {
        id: "step-1",
        title: "Préparation de votre cours",
        description: "Comment allez-vous introduire la responsabilité numérique à vos élèves ?",
        choices: [
          {
            id: "choice-1",
            text: "Par des cas concrets et des débats",
            feedback: "Parfait ! L'apprentissage critique et engageant.",
            scores: { inclusion: 20, responsabilité: 25, durabilité: 15 },
          },
          {
            id: "choice-2",
            text: "Par une présentation magistrale",
            feedback: "Efficace mais pas très interactif...",
            scores: { inclusion: 10, responsabilité: 10, durabilité: 5 },
          },
          {
            id: "choice-3",
            text: "En les impliquant dans un projet collectif",
            feedback: "Excellent ! L'apprentissage par l'action est plus efficace.",
            scores: { inclusion: 25, responsabilité: 20, durabilité: 25 },
          },
        ],
      },
      {
        id: "step-2",
        title: "Outils pédagogiques",
        description: "Quel type de ressources allez-vous créer ?",
        choices: [
          {
            id: "choice-1",
            text: "Utiliser les ressources NIRD existantes",
            feedback: "Bon départ ! Vous économisez du temps et maintenez la cohérence.",
            scores: { inclusion: 15, responsabilité: 15, durabilité: 15 },
          },
          {
            id: "choice-2",
            text: "Créer vos propres ressources adaptées à vos élèves",
            feedback: "Excellent ! Personnalisé et adapté à votre contexte.",
            scores: { inclusion: 25, responsabilité: 20, durabilité: 20 },
          },
          {
            id: "choice-3",
            text: "Combiner ressources existantes et création personnelle",
            feedback: "Parfait ! Vous bénéficiez du meilleur des deux approches.",
            scores: { inclusion: 30, responsabilité: 25, durabilité: 25 },
          },
        ],
      },
    ],
  },
};

export default function MissionRunnerPage({
  params,
}: {
  params: Promise<{ role: string; lieu: string; mission: string }>;
}) {
  const { role, lieu, mission: missionId } = use(params);
  const router = useRouter();

  // Helper function to get plant emoji based on durabilité score
  const getPlantEmoji = (score: number): string => {
    if (score <= 0) return "🌱";
    if (score < 30) return "🌿";
    if (score < 60) return "🌾";
    if (score < 90) return "🌳";
    return "🌲";
  };

  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [scores, setScores] = useState({
    inclusion: 0,
    responsabilité: 0,
    durabilité: 0,
  });
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);

  // Load mission content from JSON
  useEffect(() => {
    async function fetchMission() {
      try {
        // Try to dynamically import the JSON file
        const data = await import(`@/data/missions-content/${missionId}.json`);
        setMission(data.default || missionsDatabase[missionId] || null);
      } catch {
        console.error(`No mission content found for ${missionId}`);
        // Fallback to old data structure
        setMission(missionsDatabase[missionId] || null);
      } finally {
        setLoading(false);
      }
    }

    fetchMission();
  }, [missionId]);

  if (loading) {
    return (
      <main className="min-h-screen w-full bg-linear-to-br from-slate-50 to-slate-100 py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-12 text-center">
          <p className="text-lg text-slate-600">Chargement de la mission...</p>
        </div>
      </main>
    );
  }

  if (!mission) {
    return (
      <main className="min-h-screen w-full bg-linear-to-br from-slate-50 to-slate-100 py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-12 text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Mission non trouvée</h1>
          <p className="text-lg text-slate-600 mb-8">Cette mission n'existe pas ou a été supprimée.</p>
          <Link href={`/missions/${role}/${lieu}`}>
            <button className="px-8 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
              Retour aux missions
            </button>
          </Link>
        </div>
      </main>
    );
  }

  const currentStep = mission.steps[currentStepIndex];
  const isLastStep = currentStepIndex === mission.steps.length - 1;
  const progress = ((currentStepIndex + 1) / mission.steps.length) * 100;

  const handleChoice = (choice: Choice) => {
    setSelectedChoice(choice);
  };

  const handleValidateChoice = () => {
    if (!selectedChoice) return;

    setShowFeedback(selectedChoice.feedback);

    // Update scores
    setScores((prev) => ({
      inclusion: prev.inclusion + selectedChoice.scores.inclusion,
      responsabilité: prev.responsabilité + selectedChoice.scores.responsabilité,
      durabilité: prev.durabilité + selectedChoice.scores.durabilité,
    }));
  };

  const handleNext = () => {
    if (isLastStep) {
      // Trigger confetti before redirect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        // Redirect to results with scores
        const queryParams = new URLSearchParams({
          inclusion: scores.inclusion.toString(),
          responsabilité: scores.responsabilité.toString(),
          durabilité: scores.durabilité.toString(),
          mission: missionId,
          role,
        });
        router.push(`/result?${queryParams.toString()}`);
      }, 500);
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
      setShowFeedback(null);
      setSelectedChoice(null);
    }
  };

  const totalScore = scores.inclusion + scores.responsabilité + scores.durabilité;
  const isCatastrophe = totalScore < 0;

  return (
    <main className={`min-h-screen w-full py-8 md:py-16 px-4 md:px-6 ${
      isCatastrophe
        ? "bg-linear-to-br from-amber-50 via-orange-50 to-amber-50"
        : "bg-linear-to-br from-slate-50 to-slate-100"
    }`}>
      <style>{`
        @keyframes bounce-water {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes shake-scale {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(-3deg); }
          75% { transform: scale(1.1) rotate(3deg); }
        }
        @keyframes grow-plant {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.15) rotate(-5deg); }
        }
        @keyframes white-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.1); }
          50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.3); }
        }
        @keyframes catastrophe-flash {
          0%, 100% { background: linear-gradient(to bottom right, rgb(153, 27, 27), rgb(194, 65, 12)); }
          50% { background: linear-gradient(to bottom right, rgb(185, 28, 28), rgb(217, 119, 6)); }
        }
        .animate-bounce-water {
          animation: bounce-water 1s infinite;
        }
        .animate-shake-scale {
          animation: shake-scale 0.6s infinite;
        }
        .animate-grow-plant {
          animation: grow-plant 1.2s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.4)); }
          50% { filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.8)); }
        }
        .glow-white {
          animation: white-glow 1.5s ease-in-out infinite;
        }
        .catastrophe-bg {
          animation: catastrophe-flash 1.5s ease-in-out infinite;
        }
      `}</style>
      {/* Header with mission title */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link
          href={`/missions/${role}/${lieu}`}
          className={`inline-flex items-center mb-6 font-semibold cursor-pointer transition-colors ${
            isCatastrophe
              ? "text-red-700 hover:text-red-900"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </Link>

        <div className="mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isCatastrophe ? "text-red-700" : "text-slate-900"}`}>
            {mission.title}
          </h1>
          <p className={isCatastrophe ? "text-red-600" : "text-slate-600"}>
            Étape {currentStepIndex + 1} sur {mission.steps.length}
          </p>
        </div>

        {/* Progress bar */}
        <div className={`w-full rounded-full h-3 overflow-hidden ${isCatastrophe ? "bg-red-200" : "bg-slate-200"}`}>
          <div
            className={`h-full transition-all duration-500 ${
              isCatastrophe
                ? "bg-linear-to-r from-red-400 to-orange-400"
                : "bg-linear-to-r from-blue-500 via-purple-500 to-pink-500"
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Step content - main card */}
          <div className="lg:col-span-2">
            <div className={`rounded-2xl shadow-lg p-8 md:p-12 transition-all duration-700 ${
              isCatastrophe
                ? "bg-red-50 border-2 border-red-200"
                : "bg-white"
            }`}>
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${isCatastrophe ? "text-red-700" : "text-slate-900"}`}>
                {currentStep.title}
              </h2>

              <p className={`text-lg mb-12 leading-relaxed ${isCatastrophe ? "text-red-600" : "text-slate-700"}`}>
                {currentStep.description}
              </p>

              {/* Choices */}
              <div className="space-y-4">
                {currentStep.choices.map(choice => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoice(choice)}
                    disabled={showFeedback !== null}
                    className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                      showFeedback !== null
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:border-blue-500 hover:shadow-md hover:scale-102"
                    } ${
                      selectedChoice?.id === choice.id
                        ? isCatastrophe ? "border-orange-400 bg-red-800" : "border-blue-500 bg-blue-50"
                        : isCatastrophe ? "border-orange-300 bg-red-800 hover:bg-red-700" : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 shrink-0 mt-1 ${
                        selectedChoice?.id === choice.id
                          ? isCatastrophe ? "border-orange-400 bg-orange-400" : "border-blue-500 bg-blue-500"
                          : isCatastrophe ? "border-orange-300" : "border-slate-300"
                      }`}></div>
                      <div className="grow">
                        <p className={`text-lg font-semibold ${isCatastrophe ? "text-orange-100" : "text-slate-900"}`}>
                          {choice.text}
                        </p>
                      </div>
                    </div>

                    {/* Feedback message - shown after validation */}
                    {showFeedback === choice.feedback && (
                      <div className={`mt-4 ml-10 p-4 rounded-lg border ${
                        isCatastrophe
                          ? "bg-orange-700 border-orange-500"
                          : "bg-green-100 border-green-300"
                      }`}>
                        <div className="flex items-start gap-3">
                          <CheckCircleIcon className={`w-5 h-5 shrink-0 mt-0.5 ${isCatastrophe ? "text-orange-200" : "text-green-600"}`} />
                          <p className={`font-semibold ${isCatastrophe ? "text-orange-100" : "text-green-900"}`}>{choice.feedback}</p>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Validate button - appears when choice is selected */}
              {selectedChoice && !showFeedback && (
                <div className="mt-8">
                  <button
                    onClick={handleValidateChoice}
                    className={`w-full px-6 py-4 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                      isCatastrophe
                        ? "bg-linear-to-r from-orange-500 to-red-500"
                        : "bg-linear-to-r from-green-500 to-emerald-600"
                    }`}
                  >
                    Valider mon choix
                  </button>
                </div>
              )}

              {/* Next button */}
              {showFeedback && (
                <div className="mt-8 flex gap-4">
                  <button
                    onClick={handleNext}
                    className={`flex-1 px-6 py-4 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                      isCatastrophe
                        ? "bg-linear-to-r from-orange-600 to-red-600"
                        : "bg-linear-to-r from-blue-500 to-purple-600"
                    }`}
                  >
                    {isLastStep ? "Voir mes résultats" : "Suivant"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Score sidebar */}
          <div className="lg:col-span-1">
            <div className={`rounded-2xl shadow-xl p-8 sticky top-8 border transition-all duration-700 ${
              isCatastrophe
                ? "bg-red-50 border-red-200"
                : "bg-linear-to-br from-slate-50 to-slate-100 border-slate-200"
            }`}>
              <h3 className={`text-2xl font-bold mb-8 flex items-center gap-2 ${isCatastrophe ? "text-orange-200" : "text-slate-900"}`}>
                🎮 Votre progression
              </h3>

              <div className="space-y-7">
                {/* Inclusion - Cœur */}
                <div className="group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-4xl transition-all duration-500 ${scores.inclusion > 0 ? "animate-shake-scale" : ""}`}>
                        ❤️
                      </span>
                      <span className="font-bold text-slate-900">Inclusion</span>
                    </div>
                    <span className={`font-bold text-xl px-3 py-1 rounded-lg transition-all ${scores.inclusion > 0 ? "bg-blue-100 text-blue-700 animate-pulse" : "bg-slate-100 text-slate-600"}`}>
                      {scores.inclusion > 0 ? "+" : ""}{scores.inclusion}
                    </span>
                  </div>
                  <div className="w-full bg-linear-to-r from-slate-200 to-slate-300 rounded-full h-5 overflow-hidden shadow-inner relative">
                    <div
                      className="h-full transition-all duration-700 ease-out bg-linear-to-r from-blue-400 to-cyan-500 shadow-lg"
                      style={{ width: `${Math.min(Math.max(scores.inclusion, 0) / 2, 100)}%` }}
                    >
                      {scores.inclusion > 0 && (
                        <div className="absolute inset-0 animate-pulse-glow" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }}></div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 font-medium">Accessibilité pour tous</p>
                </div>

                {/* Responsabilité - Cerveau */}
                <div className="group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-4xl transition-all duration-500 ${scores.responsabilité > 0 ? "animate-bounce-water" : ""}`}>
                        🧠
                      </span>
                      <span className="font-bold text-slate-900">Responsabilité</span>
                    </div>
                    <span className={`font-bold text-xl px-3 py-1 rounded-lg transition-all ${scores.responsabilité > 0 ? "bg-pink-100 text-pink-700 animate-pulse" : "bg-slate-100 text-slate-600"}`}>
                      {scores.responsabilité > 0 ? "+" : ""}{scores.responsabilité}
                    </span>
                  </div>
                  <div className="w-full bg-linear-to-r from-slate-200 to-slate-300 rounded-full h-5 overflow-hidden shadow-inner relative">
                    <div
                      className="h-full transition-all duration-700 ease-out bg-linear-to-r from-pink-400 to-rose-500 shadow-lg"
                      style={{ width: `${Math.min(Math.max(scores.responsabilité, 0) / 2, 100)}%` }}
                    >
                      {scores.responsabilité > 0 && (
                        <div className="absolute inset-0 animate-pulse-glow" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }}></div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 font-medium">Éthique & Souveraineté</p>
                </div>

                {/* Durabilité - Plante qui pousse */}
                <div className="group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-4xl transition-all duration-500 ${scores.durabilité > 0 ? "animate-grow-plant" : ""}`}>
                        {getPlantEmoji(scores.durabilité)}
                      </span>
                      <span className="font-bold text-slate-900">Durabilité</span>
                    </div>
                    <span className={`font-bold text-xl px-3 py-1 rounded-lg transition-all ${scores.durabilité > 0 ? "bg-amber-100 text-amber-700 animate-pulse" : "bg-slate-100 text-slate-600"}`}>
                      {scores.durabilité > 0 ? "+" : ""}{scores.durabilité}
                    </span>
                  </div>
                  <div className="w-full bg-linear-to-r from-slate-200 to-slate-300 rounded-full h-5 overflow-hidden shadow-inner relative">
                    <div
                      className="h-full transition-all duration-700 ease-out bg-linear-to-r from-amber-400 to-yellow-500 shadow-lg"
                      style={{ width: `${Math.min(Math.max(scores.durabilité, 0) / 2, 100)}%` }}
                    >
                      {scores.durabilité > 0 && (
                        <div className="absolute inset-0 animate-pulse-glow" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }}></div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 font-medium">Impact écologique</p>
                </div>
              </div>

              {/* Total score */}
              <div className={`mt-8 pt-8 transition-all ${
                isCatastrophe ? "border-t-red-200" : "border-t-slate-200"
              } border-t-2`}>
                {isCatastrophe ? (
                  // Catastrophe UI
                  <div className="bg-red-700 rounded-xl p-6 border-2 border-orange-400 shadow-lg animate-pulse">
                    <p className="text-xs font-semibold text-orange-200 uppercase tracking-wider mb-2">⚠️ Catastrophe!</p>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-4xl font-black text-orange-300">
                        {totalScore}
                      </span>
                      <span className="text-sm text-orange-200 font-medium">points</span>
                    </div>
                    <p className="text-sm text-orange-100 font-semibold">🔥 Vous avez fait des choix désastreux!</p>
                    <p className="text-xs text-orange-200 mt-2">Les enjeux numériques ne sont pas à prendre à la légère...</p>
                  </div>
                ) : (
                  // Normal UI
                  <div className="bg-linear-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200 shadow-md">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Score Total</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-blue-600">
                        {totalScore}
                      </span>
                      <span className="text-sm text-slate-500 font-medium">points</span>
                    </div>
                    {totalScore > 0 && (
                      <p className="text-xs text-slate-600 mt-3">✨ Excellent travail!</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

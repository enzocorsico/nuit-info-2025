'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

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

// Mock missions database
const missionsDatabase: Record<string, Mission> = {
  'mission-1': {
    id: 'mission-1',
    title: 'Les données collectées : qui en profite?',
    description: 'Analyser comment vos données personnelles sont utilisées par les grandes tech',
    theme: 'données',
    steps: [
      {
        id: 'step-1',
        title: 'Première découverte',
        description: 'Vous découvrez que vos données de navigation sont vendues à des annonceurs. Que faites-vous ?',
        choices: [
          {
            id: 'choice-1',
            text: 'Je refuse et j\'utilise un VPN + bloqueurs de publicités',
            feedback: 'Excellente réaction ! Vous protégez votre vie privée de manière active.',
            scores: { inclusion: 10, responsabilité: 20, durabilité: 10 },
          },
          {
            id: 'choice-2',
            text: 'Je n\'y fais pas attention, c\'est normal maintenant',
            feedback: 'Attention ! En ignorant cela, vous acceptez une surveillance massive de votre activité.',
            scores: { inclusion: 0, responsabilité: 0, durabilité: 0 },
          },
          {
            id: 'choice-3',
            text: 'Je cherche à comprendre ce qui se passe exactement',
            feedback: 'Très bien ! Comprendre les enjeux est le premier pas vers une action responsable.',
            scores: { inclusion: 15, responsabilité: 15, durabilité: 15 },
          },
        ],
      },
      {
        id: 'step-2',
        title: 'Le choix des outils',
        description: 'Pour votre établissement, vous devez choisir entre Google Workspace (gratuit mais trace) et une suite bureautique open-source (payante mais souveraine).',
        choices: [
          {
            id: 'choice-1',
            text: 'Google Workspace - facile et gratuit',
            feedback: 'Pratique, mais vous acceptez la dépendance technologique aux GAFAM.',
            scores: { inclusion: 5, responsabilité: -10, durabilité: -5 },
          },
          {
            id: 'choice-2',
            text: 'Suite open-source - responsable mais complexe',
            feedback: 'Excellent choix pour l\'indépendance numérique ! Un peu de courbe d\'apprentissage en vaut la peine.',
            scores: { inclusion: 20, responsabilité: 30, durabilité: 25 },
          },
          {
            id: 'choice-3',
            text: 'Hybrid : open-source avec formation pour tous',
            feedback: 'Parfait ! Vous cherchez l\'équilibre entre accessibilité et responsabilité.',
            scores: { inclusion: 25, responsabilité: 25, durabilité: 20 },
          },
        ],
      },
      {
        id: 'step-3',
        title: 'L\'engagement collectif',
        description: 'Vous proposez une campagne de sensibilisation sur la vie privée numérique. Comment l\'organisez-vous ?',
        choices: [
          {
            id: 'choice-1',
            text: 'Un atelier inclusif pour tous, du débutant à l\'expert',
            feedback: 'Magnifique ! Vous pratiquez l\'inclusion numérique.',
            scores: { inclusion: 30, responsabilité: 20, durabilité: 15 },
          },
          {
            id: 'choice-2',
            text: 'Un webinaire technique réservé aux experts',
            feedback: 'Efficace mais limité... Vous n\'incluez pas tous les niveaux.',
            scores: { inclusion: 10, responsabilité: 15, durabilité: 10 },
          },
          {
            id: 'choice-3',
            text: 'Une série de ressources en ligne accessibles 24/7',
            feedback: 'Excellent ! Vous maximisez la portée et l\'accessibilité pour tous.',
            scores: { inclusion: 25, responsabilité: 20, durabilité: 30 },
          },
        ],
      },
    ],
  },
  'mission-prof-1': {
    id: 'mission-prof-1',
    title: 'Enseigner le numérique responsable',
    description: 'Intégrer NIRD dans votre curriculum pédagogique',
    theme: 'pédagogie',
    steps: [
      {
        id: 'step-1',
        title: 'Préparation de votre cours',
        description: 'Comment allez-vous introduire la responsabilité numérique à vos élèves ?',
        choices: [
          {
            id: 'choice-1',
            text: 'Par des cas concrets et des débats',
            feedback: 'Parfait ! L\'apprentissage critique et engageant.',
            scores: { inclusion: 20, responsabilité: 25, durabilité: 15 },
          },
          {
            id: 'choice-2',
            text: 'Par une présentation magistrale',
            feedback: 'Efficace mais pas très interactif...',
            scores: { inclusion: 10, responsabilité: 10, durabilité: 5 },
          },
          {
            id: 'choice-3',
            text: 'En les impliquant dans un projet collectif',
            feedback: 'Excellent ! L\'apprentissage par l\'action est plus efficace.',
            scores: { inclusion: 25, responsabilité: 20, durabilité: 25 },
          },
        ],
      },
      {
        id: 'step-2',
        title: 'Outils pédagogiques',
        description: 'Quel type de ressources allez-vous créer ?',
        choices: [
          {
            id: 'choice-1',
            text: 'Utiliser les ressources NIRD existantes',
            feedback: 'Bon départ ! Vous économisez du temps et maintenez la cohérence.',
            scores: { inclusion: 15, responsabilité: 15, durabilité: 15 },
          },
          {
            id: 'choice-2',
            text: 'Créer vos propres ressources adaptées à vos élèves',
            feedback: 'Excellent ! Personnalisé et adapté à votre contexte.',
            scores: { inclusion: 25, responsabilité: 20, durabilité: 20 },
          },
          {
            id: 'choice-3',
            text: 'Combiner ressources existantes et création personnelle',
            feedback: 'Parfait ! Vous bénéficiez du meilleur des deux approches.',
            scores: { inclusion: 30, responsabilité: 25, durabilité: 25 },
          },
        ],
      },
    ],
  },
};

type ScoreType = 'inclusion' | 'responsabilité' | 'durabilité';

export default function MissionRunnerPage({
  params,
}: {
  params: Promise<{ role: string; lieu: string; mission: string }>;
}) {
  const { role, lieu, mission: missionId } = use(params);
  const router = useRouter();

  const mission = missionsDatabase[missionId];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [scores, setScores] = useState({
    inclusion: 0,
    responsabilité: 0,
    durabilité: 0,
  });
  const [showFeedback, setShowFeedback] = useState<string | null>(null);

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
    setShowFeedback(choice.feedback);

    // Update scores
    setScores((prev) => ({
      inclusion: prev.inclusion + choice.scores.inclusion,
      responsabilité: prev.responsabilité + choice.scores.responsabilité,
      durabilité: prev.durabilité + choice.scores.durabilité,
    }));

    // Auto advance after 2 seconds
    setTimeout(() => {
      if (isLastStep) {
        // Redirect to results with scores
        const queryParams = new URLSearchParams({
          inclusion: (scores.inclusion + choice.scores.inclusion).toString(),
          responsabilité: (scores.responsabilité + choice.scores.responsabilité).toString(),
          durabilité: (scores.durabilité + choice.scores.durabilité).toString(),
          mission: missionId,
          role,
        });
        router.push(`/result?${queryParams.toString()}`);
      } else {
        setCurrentStepIndex(currentStepIndex + 1);
        setShowFeedback(null);
      }
    }, 2000);
  };

  const getScoreColor = (value: number): string => {
    if (value < 0) return 'text-red-600';
    if (value < 20) return 'text-orange-600';
    if (value < 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <main className="min-h-screen w-full bg-linear-to-br from-slate-50 to-slate-100 py-8 md:py-16 px-4 md:px-6">
      {/* Header with mission title */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link
          href={`/missions/${role}/${lieu}`}
          className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6 font-semibold cursor-pointer transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{mission.title}</h1>
          <p className="text-slate-600">Étape {currentStepIndex + 1} sur {mission.steps.length}</p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Step content - main card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                {currentStep.title}
              </h2>

              <p className="text-lg text-slate-700 mb-12 leading-relaxed">
                {currentStep.description}
              </p>

              {/* Choices */}
              <div className="space-y-4">
                {currentStep.choices.map((choice, idx) => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoice(choice)}
                    disabled={showFeedback !== null}
                    className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                      showFeedback !== null
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:border-blue-500 hover:shadow-md hover:scale-102'
                    } ${
                      showFeedback === choice.feedback
                        ? 'border-green-500 bg-green-50'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 shrink-0 mt-1 ${
                        showFeedback === choice.feedback
                          ? 'border-green-500 bg-green-500'
                          : 'border-slate-300'
                      }`}></div>
                      <div className="grow">
                        <p className="text-lg font-semibold text-slate-900">
                          {choice.text}
                        </p>
                      </div>
                    </div>

                    {/* Feedback message */}
                    {showFeedback === choice.feedback && (
                      <div className="mt-4 ml-10 p-4 bg-green-100 rounded-lg border border-green-300">
                        <div className="flex items-start gap-3">
                          <CheckCircleIcon className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                          <p className="text-green-900 font-semibold">{choice.feedback}</p>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Auto-advance indicator */}
              {showFeedback && (
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
                  <p className="text-blue-900 font-semibold">
                    {isLastStep ? 'Redirection vers les résultats...' : 'Passage à l\'étape suivante...'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Score sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Votre progression</h3>

              <div className="space-y-6">
                {/* Inclusion */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-900">Inclusion</span>
                    <span className={`font-bold text-lg ${getScoreColor(scores.inclusion)}`}>
                      {scores.inclusion > 0 ? '+' : ''}{scores.inclusion}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full transition-all duration-500"
                      style={{ width: `${Math.min(scores.inclusion / 2, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Accessibilité pour tous</p>
                </div>

                {/* Responsabilité */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-900">Responsabilité</span>
                    <span className={`font-bold text-lg ${getScoreColor(scores.responsabilité)}`}>
                      {scores.responsabilité > 0 ? '+' : ''}{scores.responsabilité}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-pink-500 h-full transition-all duration-500"
                      style={{ width: `${Math.min(scores.responsabilité / 2, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Éthique & Souveraineté</p>
                </div>

                {/* Durabilité */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-900">Durabilité</span>
                    <span className={`font-bold text-lg ${getScoreColor(scores.durabilité)}`}>
                      {scores.durabilité > 0 ? '+' : ''}{scores.durabilité}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-yellow-500 h-full transition-all duration-500"
                      style={{ width: `${Math.min(scores.durabilité / 2, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Impact écologique</p>
                </div>
              </div>

              {/* Total score */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-slate-900">
                    {scores.inclusion + scores.responsabilité + scores.durabilité}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

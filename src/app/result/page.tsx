"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TrophyIcon, StarIcon, SparklesIcon } from "@heroicons/react/24/solid";

export default function ResultPage() {
  const searchParams = useSearchParams();

  const inclusion = parseInt(searchParams.get("inclusion") || "0");
  const responsabilité = parseInt(searchParams.get("responsabilité") || "0");
  const durabilité = parseInt(searchParams.get("durabilité") || "0");
  const role = searchParams.get("role") || "élève";

  const totalScore = inclusion + responsabilité + durabilité;

  // Determine achievement level
  const getAchievementLevel = () => {
    if (totalScore >= 150) return { level: "Maître NIRD", emoji: "🏆", color: "from-yellow-400 to-orange-500" };
    if (totalScore >= 100) return { level: "Expert NIRD", emoji: "⭐", color: "from-blue-400 to-purple-500" };
    if (totalScore >= 50) return { level: "Champion NIRD", emoji: "🎯", color: "from-purple-400 to-pink-500" };
    return { level: "Apprenti NIRD", emoji: "🌱", color: "from-green-400 to-teal-500" };
  };

  const achievement = getAchievementLevel();

  const getScoreMessage = (score: number, label: string) => {
    if (score < 0) return `Attention : vos choix ont diminué votre ${label}`;
    if (score < 30) return `Vous avez progressé légèrement en ${label}`;
    if (score < 60) return `Bons progrès en ${label} !`;
    return `Excellent ! Vous maîtrisez bien ${label}`;
  };

  return (
    <main className="min-h-screen w-full bg-linear-to-br from-slate-50 to-slate-100 py-12 md:py-20 px-4 md:px-6">
      {/* Main achievement card */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className={`bg-linear-to-br ${achievement.color} rounded-3xl shadow-2xl p-12 md:p-16 text-center text-white`}>
          <div className="text-7xl md:text-9xl mb-6">{achievement.emoji}</div>
          <h1 className="text-4xl md:text-6xl font-black mb-4">
            {achievement.level}
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-6">
            Score total : <span className="font-bold text-3xl">{totalScore} points</span>
          </p>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Bravo pour vos choix responsables et inclusifs ! Vous progressez dans votre compréhension de la résilience numérique.
          </p>
        </div>
      </div>

      {/* Detailed scores */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Inclusion */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">Inclusion</h3>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <div className="text-4xl font-black text-blue-600 mb-4">{inclusion}</div>
            <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(inclusion / 2, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-slate-600">
              {getScoreMessage(inclusion, "accessibilité")}
            </p>
          </div>

          {/* Responsabilité */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">Responsabilité</h3>
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚖️</span>
              </div>
            </div>
            <div className="text-4xl font-black text-pink-600 mb-4">{responsabilité}</div>
            <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
              <div
                className="bg-pink-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(responsabilité / 2, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-slate-600">
              {getScoreMessage(responsabilité, "l'éthique numérique")}
            </p>
          </div>

          {/* Durabilité */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">Durabilité</h3>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌍</span>
              </div>
            </div>
            <div className="text-4xl font-black text-yellow-600 mb-4">{durabilité}</div>
            <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
              <div
                className="bg-yellow-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(durabilité / 2, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-slate-600">
              {getScoreMessage(durabilité, "l'impact écologique")}
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Et maintenant ?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Share achievement */}
            <div className="p-6 bg-linear-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-purple-600" />
                Partager vos progrès
              </h3>
              <p className="text-slate-600 mb-4">
                Montrez à vos camarades et enseignants votre achèvement de cette mission !
              </p>
              <button className="w-full px-6 py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer">
                Copier le lien de partage
              </button>
            </div>

            {/* Try another mission */}
            <div className="p-6 bg-linear-to-br from-blue-50 to-teal-50 rounded-xl border border-blue-200">
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <StarIcon className="w-5 h-5 text-blue-600" />
                Explorer d'autres missions
              </h3>
              <p className="text-slate-600 mb-4">
                Progressez dans votre apprentissage en découvrant d'autres défis NIRD.
              </p>
              <Link href={`/village?role=${role}`}>
                <button className="w-full px-6 py-3 bg-linear-to-r from-blue-500 to-teal-500 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer">
                  Retour au village
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats box */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrophyIcon className="w-6 h-6 text-yellow-500" />
            Vos statistiques
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-black text-slate-900">{totalScore}</div>
              <p className="text-sm text-slate-600">Points totaux</p>
            </div>
            <div>
              <div className="text-3xl font-black text-blue-600">{Math.ceil(inclusion / 2)}%</div>
              <p className="text-sm text-slate-600">Inclusion</p>
            </div>
            <div>
              <div className="text-3xl font-black text-pink-600">{Math.ceil(responsabilité / 2)}%</div>
              <p className="text-sm text-slate-600">Responsabilité</p>
            </div>
            <div>
              <div className="text-3xl font-black text-yellow-600">{Math.ceil(durabilité / 2)}%</div>
              <p className="text-sm text-slate-600">Durabilité</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

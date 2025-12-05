"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRightIcon, SparklesIcon } from "@heroicons/react/24/solid";
import MissionDetailModal from "../components/MissionDetailModal";

interface MissionProgress {
  missionId: string;
  role: string;
  lieu: string;
  scores: {
    inclusion: number;
    responsabilité: number;
    durabilité: number;
  };
  completedAt: string;
}

const roles = ["eleve", "prof", "direction", "tech", "famille", "collectivite"];
const lieux = [
  { id: "salle-profs", name: "Salle des Profs" },
  { id: "atelier-linux", name: "Atelier Linux" },
  { id: "salle-serveur", name: "Salle Serveur" },
  { id: "bureau-direction", name: "Bureau Direction" },
  { id: "quartier-familles", name: "Quartier Familles" },
  { id: "collectivite", name: "Collectivité" },
];

export default function ProgressionPage() {
  const [progress, setProgress] = useState<Record<string, MissionProgress>>({});
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [expandedLieu, setExpandedLieu] = useState<string | null>(null);
  const [selectedMission, setSelectedMission] = useState<{
    missionId: string;
    role: string;
    lieu: string;
    scores: { inclusion: number; responsabilité: number; durabilité: number };
  } | null>(null);

  // Load progress from localStorage
  useEffect(() => {
    try {
      const data = localStorage.getItem("nird-progress");
      if (data) {
        setProgress(JSON.parse(data));
      }
    } catch (error) {
      console.error("Failed to load progress:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate totals
  const completedMissions = Object.values(progress).length;

  const totalScores = Object.values(progress).reduce(
    (acc, mission) => ({
      inclusion: acc.inclusion + mission.scores.inclusion,
      responsabilité: acc.responsabilité + mission.scores.responsabilité,
      durabilité: acc.durabilité + mission.scores.durabilité,
    }),
    { inclusion: 0, responsabilité: 0, durabilité: 0 }
  );

  // Group by role
  const progressByRole: Record<string, any> = {};
  roles.forEach((role) => {
    const roleMissions = Object.values(progress).filter((m) => m.role === role);
    progressByRole[role] = {
      completed: roleMissions.length,
      scores: roleMissions.reduce(
        (sum, m) => ({
          inclusion: sum.inclusion + m.scores.inclusion,
          responsabilité: sum.responsabilité + m.scores.responsabilité,
          durabilité: sum.durabilité + m.scores.durabilité,
        }),
        { inclusion: 0, responsabilité: 0, durabilité: 0 }
      ),
    };
  });

  // Group by lieu
  const progressByLieu: Record<string, any> = {};
  lieux.forEach((lieu) => {
    const lieuMissions = Object.values(progress).filter((m) => m.lieu === lieu.id);
    progressByLieu[lieu.id] = {
      name: lieu.name,
      completed: lieuMissions.length,
      scores: lieuMissions.reduce(
        (sum, m) => ({
          inclusion: sum.inclusion + m.scores.inclusion,
          responsabilité: sum.responsabilité + m.scores.responsabilité,
          durabilité: sum.durabilité + m.scores.durabilité,
        }),
        { inclusion: 0, responsabilité: 0, durabilité: 0 }
      ),
    };
  });

  const getPlantEmoji = (score: number): string => {
    if (score <= 0) return "🌱";
    if (score < 50) return "🌿";
    if (score < 100) return "🌾";
    if (score < 150) return "🌳";
    return "🌲";
  };

  const getRoleDisplayName = (role: string): string => {
    const names: Record<string, string> = {
      eleve: "Élève",
      prof: "Professeur",
      direction: "Direction",
      tech: "Technologue",
      famille: "Famille",
      collectivite: "Collectivité",
    };
    return names[role] || role;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-lg text-slate-600">Chargement de votre progression...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-12 md:py-16 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/village"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6 font-semibold cursor-pointer transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour au village
          </Link>

          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 flex items-center gap-3">
              <SparklesIcon className="w-10 h-10 text-purple-500" />
              Votre Progression
            </h1>
          </div>
          <p className="text-lg text-slate-600">Suivez votre avancée dans le monde NIRD</p>
        </div>

        {/* Global Score Card */}
        <div className="bg-linear-to-br from-purple-50 via-blue-50 to-cyan-50 rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-purple-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Score Global</h2>
              <p className="text-slate-600">
                {completedMissions} mission{completedMissions !== 1 ? "s" : ""} complétée{completedMissions !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="text-6xl">{getPlantEmoji(totalScores.durabilité)}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Inclusion */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">❤️ Inclusion</h3>
                <span className="text-3xl font-bold text-blue-600">{totalScores.inclusion}</span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-blue-400 to-cyan-500 transition-all"
                  style={{ width: `${Math.min(totalScores.inclusion / 2, 100)}%` }}
                />
              </div>
            </div>

            {/* Responsabilité */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">🧠 Responsabilité</h3>
                <span className="text-3xl font-bold text-pink-600">{totalScores.responsabilité}</span>
              </div>
              <div className="w-full bg-pink-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-pink-400 to-rose-500 transition-all"
                  style={{ width: `${Math.min(totalScores.responsabilité / 2, 100)}%` }}
                />
              </div>
            </div>

            {/* Durabilité */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">🌱 Durabilité</h3>
                <span className="text-3xl font-bold text-amber-600">{totalScores.durabilité}</span>
              </div>
              <div className="w-full bg-amber-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-amber-400 to-yellow-500 transition-all"
                  style={{ width: `${Math.min(totalScores.durabilité / 2, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Role/Lieu */}
        <div className="mb-8 flex gap-4 flex-wrap">
          <button
            onClick={() => setSelectedRole(null)}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              selectedRole === null
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-white text-slate-900 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Vue par Rôles
          </button>
          <button
            onClick={() => setSelectedRole("lieux")}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              selectedRole === "lieux"
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-white text-slate-900 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Vue par Lieux
          </button>
        </div>

        {/* View by Roles */}
        {selectedRole !== "lieux" && (
          <div className="space-y-4 mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Progression par Rôle</h2>
            {roles.map((role) => {
              const isExpanded = expandedRole === role;
              const roleMissions = Object.values(progress).filter((m) => m.role === role);

              return (
                <div key={role}>
                  <button
                    onClick={() => setExpandedRole(isExpanded ? null : role)}
                    className="w-full text-left bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer border border-slate-200 hover:border-slate-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900">
                          {getRoleDisplayName(role)}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {progressByRole[role].completed} mission{progressByRole[role].completed !== 1 ? "s" : ""} complétée{progressByRole[role].completed !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className={`transform transition-transform ${isExpanded ? "rotate-90" : ""}`}>
                        <ChevronRightIcon className="w-6 h-6 text-slate-400" />
                      </div>
                    </div>

                    {/* Score bars for this role */}
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-600 mb-2">❤️ Inclusion</p>
                        <p className="text-lg font-bold text-blue-600">{progressByRole[role].scores.inclusion}</p>
                        <div className="w-full bg-blue-100 rounded-full h-2 mt-2 overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all"
                            style={{ width: `${Math.min(progressByRole[role].scores.inclusion / 50, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-600 mb-2">🧠 Responsabilité</p>
                        <p className="text-lg font-bold text-pink-600">{progressByRole[role].scores.responsabilité}</p>
                        <div className="w-full bg-pink-100 rounded-full h-2 mt-2 overflow-hidden">
                          <div
                            className="h-full bg-pink-500 transition-all"
                            style={{ width: `${Math.min(progressByRole[role].scores.responsabilité / 50, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-600 mb-2">🌱 Durabilité</p>
                        <p className="text-lg font-bold text-amber-600">{progressByRole[role].scores.durabilité}</p>
                        <div className="w-full bg-amber-100 rounded-full h-2 mt-2 overflow-hidden">
                          <div
                            className="h-full bg-amber-500 transition-all"
                            style={{ width: `${Math.min(progressByRole[role].scores.durabilité / 50, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Expanded missions list */}
                  {isExpanded && roleMissions.length > 0 && (
                    <div className="mt-2 bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-2">
                      <p className="text-sm font-semibold text-slate-600 mb-4">Missions complétées:</p>
                      {roleMissions.map((mission) => (
                        <button
                          key={mission.missionId}
                          onClick={() =>
                            setSelectedMission({
                              missionId: mission.missionId,
                              role: mission.role,
                              lieu: mission.lieu,
                              scores: mission.scores,
                            })
                          }
                          className="w-full text-left flex items-center justify-between p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors cursor-pointer border border-slate-200 hover:border-blue-300"
                        >
                          <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                              <p className="font-semibold text-slate-900">{mission.missionId}</p>
                              <p className="text-xs text-slate-600">{mission.lieu}</p>
                            </div>
                          </div>
                          <div className="text-right text-sm">
                            <p className="text-blue-600 font-semibold">{mission.scores.inclusion}</p>
                            <p className="text-pink-600 font-semibold">{mission.scores.responsabilité}</p>
                            <p className="text-amber-600 font-semibold">{mission.scores.durabilité}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* View by Lieux */}
        {selectedRole === "lieux" && (
          <div className="space-y-4 mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Progression par Lieu</h2>
            {lieux.map((lieu) => {
              const isExpanded = expandedLieu === lieu.id;
              const lieuMissions = Object.values(progress).filter((m) => m.lieu === lieu.id);

              return (
                <div key={lieu.id}>
                  <button
                    onClick={() => setExpandedLieu(isExpanded ? null : lieu.id)}
                    className="w-full text-left bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer border border-slate-200 hover:border-slate-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900">
                          {lieu.name}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {progressByLieu[lieu.id].completed} mission{progressByLieu[lieu.id].completed !== 1 ? "s" : ""} complétée{progressByLieu[lieu.id].completed !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className={`transform transition-transform ${isExpanded ? "rotate-90" : ""}`}>
                        <ChevronRightIcon className="w-6 h-6 text-slate-400" />
                      </div>
                    </div>

                    {/* Score bars for this lieu */}
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-600 mb-2">❤️ Inclusion</p>
                        <p className="text-lg font-bold text-blue-600">{progressByLieu[lieu.id].scores.inclusion}</p>
                        <div className="w-full bg-blue-100 rounded-full h-2 mt-2 overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all"
                            style={{ width: `${Math.min(progressByLieu[lieu.id].scores.inclusion / 50, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-600 mb-2">🧠 Responsabilité</p>
                        <p className="text-lg font-bold text-pink-600">{progressByLieu[lieu.id].scores.responsabilité}</p>
                        <div className="w-full bg-pink-100 rounded-full h-2 mt-2 overflow-hidden">
                          <div
                            className="h-full bg-pink-500 transition-all"
                            style={{ width: `${Math.min(progressByLieu[lieu.id].scores.responsabilité / 50, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-600 mb-2">🌱 Durabilité</p>
                        <p className="text-lg font-bold text-amber-600">{progressByLieu[lieu.id].scores.durabilité}</p>
                        <div className="w-full bg-amber-100 rounded-full h-2 mt-2 overflow-hidden">
                          <div
                            className="h-full bg-amber-500 transition-all"
                            style={{ width: `${Math.min(progressByLieu[lieu.id].scores.durabilité / 50, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Expanded missions list */}
                  {isExpanded && lieuMissions.length > 0 && (
                    <div className="mt-2 bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-2">
                      <p className="text-sm font-semibold text-slate-600 mb-4">Missions complétées:</p>
                      {lieuMissions.map((mission) => (
                        <button
                          key={mission.missionId}
                          onClick={() =>
                            setSelectedMission({
                              missionId: mission.missionId,
                              role: mission.role,
                              lieu: mission.lieu,
                              scores: mission.scores,
                            })
                          }
                          className="w-full text-left flex items-center justify-between p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors cursor-pointer border border-slate-200 hover:border-blue-300"
                        >
                          <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                              <p className="font-semibold text-slate-900">{mission.role}</p>
                              <p className="text-xs text-slate-600">{mission.missionId}</p>
                            </div>
                          </div>
                          <div className="text-right text-sm">
                            <p className="text-blue-600 font-semibold">{mission.scores.inclusion}</p>
                            <p className="text-pink-600 font-semibold">{mission.scores.responsabilité}</p>
                            <p className="text-amber-600 font-semibold">{mission.scores.durabilité}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {completedMissions === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl shadow-lg">
            <p className="text-2xl text-slate-600 mb-6">Pas encore de missions complétées</p>
            <Link href="/village" className="inline-block px-8 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors">
              Commence une mission!
            </Link>
          </div>
        )}
      </div>

      {/* Mission Detail Modal */}
      {selectedMission && (
        <MissionDetailModal
          missionId={selectedMission.missionId}
          role={selectedMission.role}
          lieu={selectedMission.lieu}
          scores={selectedMission.scores}
          isOpen={!!selectedMission}
          onClose={() => setSelectedMission(null)}
        />
      )}
    </main>
  );
}

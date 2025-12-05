"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import {
  CheckCircleIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";

// Mission type
type Mission = {
  id: string;
  title: string;
  description: string;
  difficulty: "facile" | "moyen" | "difficile";
  duration: string;
  participants: number;
  reward: number;
  objectives: string[];
};

// Empty fallback data structure
const missionsDataFallback: Record<string, Record<string, Array<Mission>>> = {};

const lieuNames: Record<string, string> = {
  "salle-profs": "Salle des Profs",
  "atelier-linux": "Atelier Linux",
  "salle-serveur": "Salle Serveur",
  "bureau-direction": "Bureau Direction",
  "quartier-familles": "Quartier Familles",
  collectivite: "Collectivité",
};

export default function MissionsPage({
  params,
}: {
  params: Promise<{ role: string; lieu: string }>;
}) {
  const { role, lieu } = use(params);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMissions() {
      try {
        // Try to dynamically import the JSON file
        const data = await import(`@/data/missions/${lieu}/${role}.json`);
        setMissions(data.default || []);
      } catch (error) {
        console.error(`No missions found for ${role} in ${lieu}`);
        // Fallback to old data structure
        setMissions(missionsDataFallback[lieu]?.[role] || []);
      } finally {
        setLoading(false);
      }
    }

    fetchMissions();
  }, [role, lieu]);

  const lieuName = lieuNames[lieu] || lieu;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "facile":
        return "bg-green-100 text-green-800";
      case "moyen":
        return "bg-yellow-100 text-yellow-800";
      case "difficile":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <main className="min-h-screen w-full bg-linear-to-br from-slate-50 to-slate-100 py-12 md:py-20 px-4 md:px-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <Link href={`/village?role=${role}`} className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-8 font-semibold cursor-pointer transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          {lieuName}
        </h1>
        <p className="text-lg text-slate-600 mb-2">
          Missions disponibles pour les <span className="font-bold capitalize">{role}</span>
        </p>
      </div>

      {/* Missions Grid */}
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-slate-200">
            <p className="text-lg text-slate-600">Chargement des missions...</p>
          </div>
        ) : missions.length > 0 ? (
          <div className="space-y-6">
            {missions.map((mission: Mission) => (
              <div
                key={mission.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-8 border border-slate-200 hover:border-slate-300 group cursor-pointer transform hover:scale-102"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  {/* Left content */}
                  <div className="grow">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                        {mission.title}
                      </h2>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(mission.difficulty)}`}>
                        {mission.difficulty.charAt(0).toUpperCase() + mission.difficulty.slice(1)}
                      </span>
                    </div>

                    <p className="text-base text-slate-600 mb-6">
                      {mission.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center text-slate-600">
                        <ClockIcon className="w-5 h-5 mr-2 text-slate-400" />
                        <span className="text-sm">{mission.duration}</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <UserGroupIcon className="w-5 h-5 mr-2 text-slate-400" />
                        <span className="text-sm">{mission.participants} participants</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <StarIcon className="w-5 h-5 mr-2 text-yellow-500" />
                        <span className="text-sm font-semibold">{mission.reward} pts</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-semibold text-slate-900 mb-3">Objectifs :</h3>
                      <ul className="space-y-2">
                        {mission.objectives.map((objective: string, idx: number) => (
                          <li key={idx} className="flex items-start text-slate-600">
                            <CheckCircleIcon className="w-5 h-5 mr-3 text-green-500 shrink-0 mt-0.5" />
                            <span>{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="md:ml-6">
                    <Link href={`/missions/${role}/${lieu}/${mission.id}`}>
                      <button className="px-8 py-4 bg-linear-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer whitespace-nowrap">
                        Commencer
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-slate-200">
            <p className="text-lg text-slate-600 mb-4">
              Pas de missions disponibles pour le moment
            </p>
            <Link href={`/village?role=${role}`}>
              <button className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
                Retour au village
              </button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  BookOpenIcon,
  CommandLineIcon,
  ServerStackIcon,
  BriefcaseIcon,
  HeartIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/solid";

const lieux = [
  {
    id: "salle-profs",
    name: "Salle des Profs",
    description: "Découvrez des ressources pédagogiques et des outils pour enseigner la responsabilité numérique",
    icon: BookOpenIcon,
    color: "from-blue-400 to-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "atelier-linux",
    name: "Atelier Linux",
    description: "Apprenez les bases du système Linux libre et découvrez les alternatives open-source",
    icon: CommandLineIcon,
    color: "from-orange-400 to-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    id: "salle-serveur",
    name: "Salle Serveur",
    description: "Comprenez l'infrastructure numérique et la gestion responsable des données",
    icon: ServerStackIcon,
    color: "from-red-400 to-red-600",
    bgColor: "bg-red-50",
  },
  {
    id: "bureau-direction",
    name: "Bureau Direction",
    description: "Stratégie numérique d'établissement et gouvernance responsable",
    icon: BriefcaseIcon,
    color: "from-purple-400 to-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: "quartier-familles",
    name: "Quartier Familles",
    description: "Conseils et ressources pour une utilisation saine du numérique en famille",
    icon: HeartIcon,
    color: "from-pink-400 to-pink-600",
    bgColor: "bg-pink-50",
  },
  {
    id: "collectivite",
    name: "Collectivité",
    description: "Initiatives territoriales et projets communautaires pour la résilience numérique",
    icon: GlobeAltIcon,
    color: "from-teal-400 to-teal-600",
    bgColor: "bg-teal-50",
  },
];

function VillageContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "eleve";

  return (
    <>
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm md:text-base font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Bienvenue dans le village NIRD
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4">
              Explore les lieux
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl">
              En tant que <span className="font-bold capitalize">{role}</span>, découvrez les différentes ressources et missions adaptées à ton rôle
            </p>
          </div>
        </div>
      </div>

      {/* Lieux Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {lieux.map((lieu) => {
            const IconComponent = lieu.icon;
            return (
              <Link key={lieu.id} href={`/missions/${role}/${lieu.id}`}>
                <div className={`group h-full ${lieu.bgColor} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden border border-slate-200 hover:border-slate-300`}>
                  {/* Gradient top bar */}
                  <div className={`h-3 bg-linear-to-r ${lieu.color}`}></div>

                  {/* Card content */}
                  <div className="p-8 md:p-10 h-full flex flex-col">
                    {/* Icon */}
                    <div className={`mb-6 inline-flex p-4 bg-linear-to-br ${lieu.color} rounded-xl w-fit group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>

                    {/* Lieu name */}
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">
                      {lieu.name}
                    </h2>

                    {/* Description */}
                    <p className="text-base md:text-lg text-slate-600 mb-6 grow">
                      {lieu.description}
                    </p>

                    {/* CTA arrow */}
                    <div className="flex items-center text-slate-500 group-hover:text-slate-900 transition-colors font-semibold">
                      <span>Explorer</span>
                      <svg
                        className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Back button */}
      <div className="max-w-6xl mx-auto mt-16">
        <Link href="/roles">
          <button className="px-6 py-3 text-slate-600 hover:text-slate-900 font-semibold transition-colors flex items-center cursor-pointer">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux rôles
          </button>
        </Link>
      </div>
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="max-w-6xl mx-auto text-center py-20">
      <div className="animate-spin mb-4">
        <svg className="w-8 h-8 text-blue-500 mx-auto" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      <p className="text-slate-600">Chargement du village...</p>
    </div>
  );
}

export default function VillagePage() {
  return (
    <main className="min-h-screen w-full bg-linear-to-br from-slate-50 to-slate-100 py-12 md:py-20 px-4 md:px-6">
      <Suspense fallback={<LoadingFallback />}>
        <VillageContent />
      </Suspense>
    </main>
  );
}

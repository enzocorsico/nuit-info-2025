'use client';

import Link from 'next/link';
import {
  AcademicCapIcon,
  PencilIcon,
  BuildingOfficeIcon,
  CogIcon,
  UsersIcon,
  MapPinIcon,
} from '@heroicons/react/24/solid';

const roles = [
  {
    id: 'eleve',
    name: 'Élève',
    description: 'Découvrez comment développer votre pensée critique face aux Big Tech',
    icon: AcademicCapIcon,
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 'prof',
    name: 'Professeur',
    description: 'Outillez vos cours avec une approche numérique responsable',
    icon: PencilIcon,
    color: 'from-purple-400 to-purple-600',
  },
  {
    id: 'direction',
    name: 'Direction',
    description: 'Pilotez la transformation numérique de votre établissement',
    icon: BuildingOfficeIcon,
    color: 'from-pink-400 to-pink-600',
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Contribuez aux solutions NIRD innovantes et durables',
    icon: CogIcon,
    color: 'from-yellow-400 to-yellow-600',
  },
  {
    id: 'famille',
    name: 'Famille',
    description: 'Sensibilisez vos enfants à un numérique conscient',
    icon: UsersIcon,
    color: 'from-red-400 to-red-600',
  },
  {
    id: 'collectivite',
    name: 'Collectivité',
    description: 'Encouragez la résilience numérique de votre territoire',
    icon: MapPinIcon,
    color: 'from-teal-400 to-teal-600',
  },
];

export default function RolesPage() {
  return (
    <main className="min-h-screen w-full bg-linear-to-br from-slate-50 to-slate-100 py-12 md:py-20 px-4 md:px-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-16 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4">
          Choisis ton rôle
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
          Sélectionne ta position dans la communauté NIRD pour découvrir ton parcours personnalisé
        </p>
      </div>

      {/* Roles Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <Link key={role.id} href={`/village?role=${role.id}`}>
                <div className="group h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden border border-slate-200 hover:border-slate-300">
                  {/* Gradient top bar */}
                  <div className={`h-2 bg-linear-to-r ${role.color}`}></div>

                  {/* Card content */}
                  <div className="p-8 md:p-10 h-full flex flex-col">
                    {/* Icon */}
                    <div className={`mb-6 inline-flex p-4 bg-linear-to-br ${role.color} rounded-xl w-fit group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>

                    {/* Role name */}
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">
                      {role.name}
                    </h2>

                    {/* Description */}
                    <p className="text-base md:text-lg text-slate-600 mb-6 grow">
                      {role.description}
                    </p>

                    {/* CTA arrow */}
                    <div className="flex items-center text-slate-500 group-hover:text-slate-900 transition-colors font-semibold">
                      <span>Continuer</span>
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
        <Link href="/">
          <button className="px-6 py-3 text-slate-600 hover:text-slate-900 font-semibold transition-colors flex items-center cursor-pointer">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </button>
        </Link>
      </div>
    </main>
  );
}

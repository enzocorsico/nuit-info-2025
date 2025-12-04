"use client";

import Link from "next/link";
import Image from "next/image";
import {
  AcademicCapIcon,
  SparklesIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import AvatarChat from "./components/AvatarChat";
import { Logo3DImage } from "./components/Logo3DImage";

const badges = [
  { label: "Inclusion", color: "bg-blue-500" },
  { label: "Responsabilité", color: "bg-pink-500" },
  { label: "Durabilité", color: "bg-yellow-400" },
];

const steps = [
  {
    number: "01",
    title: "Choisis ton rôle",
    description: "Élève, Professeur, Direction, Tech, Famille ou Collectivité - chaque perspective compte",
    icon: AcademicCapIcon,
    color: "text-blue-500",
  },
  {
    number: "02",
    title: "Explore ton village",
    description: "Découvre 6 lieux uniques : salle des profs, atelier linux, serveurs, direction, familles et collectivité",
    icon: MapPinIcon,
    color: "text-purple-500",
  },
  {
    number: "03",
    title: "Lance des missions",
    description: "Complète des défis adaptés à ton rôle et accumule des points d'Inclusion, Responsabilité et Durabilité",
    icon: SparklesIcon,
    color: "text-pink-500",
  },
];

const pillars = [
  {
    title: "🌍 Inclusion",
    description: "Assurer que le numérique bénéficie à tous, sans laisser personne derrière",
    details: "Accessibilité, égalité des chances, formation pour tous les âges",
    color: "from-blue-400 to-cyan-400",
  },
  {
    title: "⚖️ Responsabilité",
    description: "Prendre en charge l'impact de nos choix numériques sur la société",
    details: "Éthique, transparence, protection des données et vie privée",
    color: "from-pink-400 to-rose-400",
  },
  {
    title: "🌱 Durabilité",
    description: "Créer un écosystème numérique viable pour les générations futures",
    details: "Sobriété énergétique, longévité des équipements, alternatives libres",
    color: "from-yellow-300 to-orange-400",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen w-full overflow-hidden">
      {/* Avatar Chat Component */}
      <AvatarChat />

      {/* Hero Section */}
      <div className="relative min-h-screen w-full flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 py-20 max-w-4xl mx-auto text-center">
          {/* NIRD Logo */}
          <div className="mb-8 flex justify-center">
            <Image
              src="/logo-accueil.png"
              alt="Logo NIRD"
              width={170}
              height={100}
            />
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            Ton établissement peut résister aux <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-pink-400 to-yellow-300">Big Tech</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Rejoignez la communauté NIRD et découvrez comment développer une stratégie numérique responsable, inclusive et durable pour votre établissement.
          </p>

          {/* CTA Button */}
          <Link href="/roles">
            <button className="inline-block px-10 py-4 md:px-12 md:py-5 bg-linear-to-r from-blue-500 via-pink-500 to-yellow-400 text-slate-900 font-bold text-lg md:text-xl rounded-full hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer">
              Entrer dans le village
            </button>
          </Link>

          {/* Values Pills */}
          <div className="mt-16 flex flex-wrap gap-4 justify-center">
            {badges.map((badge, index) => (
              <div
                key={index}
                className={`px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold text-white text-sm md:text-base ${badge.color} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110`}
              >
                {badge.label}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Section 1: Comment ça marche */}
      <section className="py-20 md:py-32 px-6 bg-linear-to-b from-slate-900 to-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              3 étapes simples pour transformer ta vision du numérique responsable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="group">
                  {/* Card */}
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-700 hover:border-slate-600 h-full">
                    {/* Number and Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-5xl font-bold text-slate-200">
                        {step.number}
                      </div>
                      <Icon className={`w-10 h-10 ${step.color}`} />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-3">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 2: Les 3 Piliers */}
      <section className="py-20 md:py-32 px-6 bg-linear-to-b from-white to-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Les 3 Piliers NIRD
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Notre mission repose sur trois valeurs fondamentales pour transformer le numérique
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
              <div
                key={index}
                className={`group relative bg-linear-to-br ${pillar.color} rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-white/10 to-black/20"></div>

                {/* Content */}
                <div className="relative z-10 p-10 h-full flex flex-col justify-between text-white">
                  <div>
                    <h3 className="text-3xl font-bold mb-4">
                      {pillar.title}
                    </h3>
                    <p className="text-lg font-semibold mb-4 opacity-90">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="pt-8 border-t border-white/30">
                    <p className="text-base opacity-80">
                      {pillar.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Statistics */}
      <section className="py-20 md:py-32 px-6 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="group">
              <div className="text-5xl md:text-6xl font-bold mb-4 text-blue-400 group-hover:scale-110 transition-transform">
                6
              </div>
              <p className="text-xl text-slate-300">
                Rôles différents à explorer
              </p>
            </div>
            <div className="group">
              <div className="text-5xl md:text-6xl font-bold mb-4 text-pink-400 group-hover:scale-110 transition-transform">
                6
              </div>
              <p className="text-xl text-slate-300">
                Lieux à découvrir
              </p>
            </div>
            <div className="group">
              <div className="text-5xl md:text-6xl font-bold mb-4 text-yellow-400 group-hover:scale-110 transition-transform">
                3
              </div>
              <p className="text-xl text-slate-300">
                Piliers à maîtriser
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3D Logo */}
      <section className="py-20 md:py-32 px-6 bg-linear-to-b from-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Explore en 3D
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Découvre une expérience interactive avec le logo KLUB
            </p>
          </div>
          <Logo3DImage />
        </div>
      </section>

      {/* Section 4: CTA Final */}
      <section className="py-20 md:py-32 px-6 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à rejoindre la révolution ?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Commence dès maintenant à explorer le village NIRD et découvre comment tu peux contribuer à un numérique plus responsable.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/roles">
              <button className="px-10 py-4 md:px-12 md:py-5 bg-white text-purple-600 font-bold text-lg rounded-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                Commencer maintenant
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 text-slate-400 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-bold text-white mb-4">NIRD</h4>
              <p className="text-sm">
                Numérique Inclusif Responsable Durable
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Explorer</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/roles" className="hover:text-white transition">Rôles</Link></li>
                <li><Link href="/village" className="hover:text-white transition">Village</Link></li>
                <li><Link href="/communaute" className="hover:text-white transition">Communauté</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">À propos</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Notre mission</a></li>
                <li><a href="#" className="hover:text-white transition">Valeurs</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Suivez-nous</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition">Discord</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">&copy; 2025 NIRD. Tous droits réservés.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-sm hover:text-white transition">Conditions d'utilisation</a>
              <a href="#" className="text-sm hover:text-white transition">Politique de confidentialité</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

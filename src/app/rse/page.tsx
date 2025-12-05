"use client";

import Link from "next/link";
import {
  CheckCircleIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  SparklesIcon,
  HeartIcon,
  CpuChipIcon,
} from "@heroicons/react/24/solid";

export default function RSEPage() {
  return (
    <main className="min-h-screen w-full bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 py-12 md:py-20 px-4 md:px-6">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto mb-16 text-center">
        <div className="inline-block mb-6 px-6 py-2 bg-green-500 text-white rounded-full font-semibold text-sm">
          🌱 Défi Numih France - RSE by Design
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-slate-900 mb-6">
          RSE by Design
        </h1>
        <p className="text-xl md:text-2xl text-slate-700 max-w-3xl mx-auto mb-8">
          Une plateforme éthique et responsable, conçue dès l'origine pour un impact positif
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <span className="px-4 py-2 bg-white rounded-full text-green-700 font-medium shadow-sm border border-green-200">
            ♻️ Éco-conception
          </span>
          <span className="px-4 py-2 bg-white rounded-full text-green-700 font-medium shadow-sm border border-green-200">
            🔒 Privacy by Design
          </span>
          <span className="px-4 py-2 bg-white rounded-full text-green-700 font-medium shadow-sm border border-green-200">
            🌍 Accessibilité
          </span>
          <span className="px-4 py-2 bg-white rounded-full text-green-700 font-medium shadow-sm border border-green-200">
            🤝 Inclusion
          </span>
        </div>
      </div>

      {/* Notre Vision RSE */}
      <div className="max-w-6xl mx-auto mb-16">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border-2 border-green-200">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <SparklesIcon className="w-10 h-10 text-green-500" />
            Notre Vision : RSE by Design
          </h2>
          <div className="prose prose-lg max-w-none text-slate-700">
            <p className="text-xl leading-relaxed mb-4">
              Après le <strong className="text-green-600">"privacy by design"</strong> et le <strong className="text-green-600">"security by design"</strong>,
              le <strong className="text-green-600">"RSE by design"</strong> intègre la Responsabilité Sociétale et Environnementale
              dès la conception du projet, pas comme une couche ajoutée après coup.
            </p>
            <p className="text-lg leading-relaxed">
              Notre plateforme NIRD (Numérique Inclusif, Responsable et Durable) incarne cette philosophie en plaçant
              l'éthique, l'inclusion et la durabilité au cœur de chaque décision technique et fonctionnelle.
            </p>
          </div>
        </div>
      </div>

      {/* Piliers RSE */}
      <div className="max-w-6xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
          Nos 6 Piliers RSE
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pilier 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">1. Éco-conception Web</h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span>Code optimisé (Next.js SSR, lazy loading)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span>Images WebP compressées</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span>Minimisation des requêtes HTTP</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span>Hébergement avec énergies renouvelables</span>
              </li>
            </ul>
          </div>

          {/* Pilier 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">2. Privacy by Design</h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span>Pas de cookies tiers ni tracking publicitaire</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span>Données utilisateur minimales</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span>AI locale (Ollama) - pas d'envoi vers clouds US</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span>Transparence totale sur l'usage des données</span>
              </li>
            </ul>
          </div>

          {/* Pilier 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <GlobeAltIcon className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">3. Accessibilité Universelle</h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                <span>Normes WCAG 2.1 niveau AA</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                <span>Navigation clavier complète</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                <span>Contrastes élevés, polices lisibles</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                <span>Compatible lecteurs d'écran</span>
              </li>
            </ul>
          </div>

          {/* Pilier 4 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-pink-500 hover:shadow-xl transition-shadow">
            <div className="bg-pink-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <HeartIcon className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">4. Inclusion Sociale</h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                <span>6 profils adaptés (élève, prof, direction, tech, famille, collectivité)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                <span>Parcours personnalisés selon les besoins</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                <span>Contenu adapté à tous les niveaux</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                <span>Gratuit et open source</span>
              </li>
            </ul>
          </div>

          {/* Pilier 5 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow">
            <div className="bg-yellow-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <CpuChipIcon className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">5. IA Éthique</h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <span>Modèle open source (Mistral via Ollama)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <span>Exécution locale, données non partagées</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <span>Transparence sur les réponses générées</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <span>Pas de biais algorithmiques commerciaux</span>
              </li>
            </ul>
          </div>

          {/* Pilier 6 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-teal-500 hover:shadow-xl transition-shadow">
            <div className="bg-teal-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">6. Contribution Communautaire</h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                <span>Code open source sur GitHub</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                <span>Documentation complète et accessible</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                <span>Système de feedback utilisateur</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                <span>Amélioration continue collaborative</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Impact Mesurable */}
      <div className="max-w-6xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
          Impact Mesurable
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="text-5xl font-bold mb-2">-40%</div>
            <div className="text-green-100 text-lg">Émissions CO₂ vs site moyen</div>
          </div>
          <div className="bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="text-5xl font-bold mb-2">0</div>
            <div className="text-blue-100 text-lg">Tracking tiers ou cookies publicitaires</div>
          </div>
          <div className="bg-linear-to-br from-purple-500 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="text-5xl font-bold mb-2">100%</div>
            <div className="text-purple-100 text-lg">Accessible (WCAG 2.1 AA)</div>
          </div>
          <div className="bg-linear-to-br from-yellow-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="text-5xl font-bold mb-2">6</div>
            <div className="text-yellow-100 text-lg">Profils inclusifs différents</div>
          </div>
        </div>
      </div>

      {/* Technologies RSE */}
      <div className="max-w-6xl mx-auto mb-16">
        <div className="bg-slate-900 rounded-3xl shadow-2xl p-8 md:p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-3">
            <CpuChipIcon className="w-10 h-10 text-green-400" />
            Stack Technique RSE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-green-400 mb-4">Frontend Optimisé</h3>
              <ul className="space-y-2 text-slate-300">
                <li>• Next.js 16 avec SSR pour performance optimale</li>
                <li>• TailwindCSS v4 pour CSS minimal</li>
                <li>• React Three Fiber pour 3D performant</li>
                <li>• Images WebP + lazy loading</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-4">Backend Éthique</h3>
              <ul className="space-y-2 text-slate-300">
                <li>• Ollama local pour IA sans cloud</li>
                <li>• Docker pour déploiement reproductible</li>
                <li>• Pas de base de données utilisateur</li>
                <li>• API minimaliste, pas de sur-infrastructure</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="bg-linear-to-br from-green-500 to-emerald-600 rounded-3xl p-12 shadow-2xl text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Rejoignez la Révolution RSE
          </h2>
          <p className="text-xl mb-8 text-green-50">
            Découvrez comment chaque utilisateur peut contribuer à un numérique plus responsable
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/roles" className="px-8 py-4 bg-white text-green-600 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors shadow-lg cursor-pointer inline-block">
              Commencer mon parcours
            </Link>
            <Link href="/village" className="px-8 py-4 bg-green-700 text-white rounded-xl font-bold text-lg hover:bg-green-800 transition-colors border-2 border-white/30 cursor-pointer inline-block">
              Explorer le village
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Badge */}
      <div className="max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg border-2 border-green-200">
          <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
          </svg>
          <span className="font-bold text-slate-900">Certifié RSE by Design</span>
          <span className="text-slate-500">|</span>
          <span className="text-green-600 font-semibold">Nuit de l'Info 2025</span>
        </div>
      </div>

      {/* Back button */}
      <div className="max-w-6xl mx-auto mt-12">
        <Link href="/" className="px-6 py-3 text-slate-600 hover:text-slate-900 font-semibold transition-colors inline-flex items-center cursor-pointer">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à l'accueil
        </Link>
      </div>
    </main>
  );
}

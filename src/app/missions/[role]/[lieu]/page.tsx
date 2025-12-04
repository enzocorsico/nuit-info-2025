"use client";

import Link from "next/link";
import { use } from "react";
import {
  CheckCircleIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";

// Missions data structure
const missionsData: Record<string, Record<string, Array<{
  id: string;
  title: string;
  description: string;
  difficulty: "facile" | "moyen" | "difficile";
  duration: string;
  participants: number;
  reward: number;
  objectives: string[];
}>>> = {
  "salle-profs": {
    eleve: [
      {
        id: "mission-1",
        title: "Les données collectées : qui en profite?",
        description: "Analyser comment vos données personnelles sont utilisées par les grandes tech",
        difficulty: "facile",
        duration: "30 min",
        participants: 245,
        reward: 100,
        objectives: [
          "Comprendre le modèle économique des GAFAM",
          "Identifier les données personnelles",
          "Évaluer l'impact sur la vie privée",
        ],
      },
      {
        id: "mission-2",
        title: "Créer une stratégie numérique responsable",
        description: "Proposer des alternatives éthiques aux outils numériques classiques",
        difficulty: "moyen",
        duration: "1h30",
        participants: 156,
        reward: 250,
        objectives: [
          "Rechercher des alternatives open-source",
          "Comparer les outils",
          "Présenter votre proposition",
        ],
      },
      {
        id: "mission-3",
        title: "Le défi du déconnexion",
        description: "Relever des défis pour réduire votre consommation numérique",
        difficulty: "difficile",
        duration: "1 semaine",
        participants: 89,
        reward: 500,
        objectives: [
          "Suivre votre consommation",
          "Relever les défis proposés",
          "Partager votre expérience",
        ],
      },
    ],
    prof: [
      {
        id: "mission-prof-1",
        title: "Enseigner le numérique responsable",
        description: "Intégrer NIRD dans votre curriculum pédagogique",
        difficulty: "moyen",
        duration: "2h",
        participants: 78,
        reward: 300,
        objectives: [
          "Découvrir les ressources pédagogiques",
          "Planifier une séquence",
          "Adapter à votre niveau",
        ],
      },
    ],
    direction: [
      {
        id: "mission-direction-1",
        title: "Gouvernance numérique responsable",
        description: "Mettre en place une politique numérique inclusive et durable",
        difficulty: "difficile",
        duration: "3h",
        participants: 42,
        reward: 450,
        objectives: [
          "Analyser les besoins de l'établissement",
          "Définir les principes NIRD",
          "Planifier l'implémentation",
        ],
      },
    ],
  },
  "atelier-linux": {
    eleve: [
      {
        id: "linux-1",
        title: "Installer Linux : votre premier pas",
        description: "Découvrir et installer une distribution Linux",
        difficulty: "facile",
        duration: "45 min",
        participants: 312,
        reward: 150,
        objectives: [
          "Choisir une distribution",
          "Installer le système",
          "Naviguer dans l'interface",
        ],
      },
    ],
    prof: [
      {
        id: "linux-prof-1",
        title: "Enseigner Linux aux élèves",
        description: "Guide pédagogique pour initier les élèves à Linux",
        difficulty: "moyen",
        duration: "2h",
        participants: 45,
        reward: 200,
        objectives: [
          "Préparer un cours sur Linux",
          "Créer des TP pratiques",
          "Évaluer les compétences",
        ],
      },
    ],
    direction: [
      {
        id: "linux-direction-1",
        title: "Linux pour une infrastructure durable",
        description: "Intégrer le logiciel libre dans la stratégie IT de l'établissement",
        difficulty: "difficile",
        duration: "2h30",
        participants: 28,
        reward: 350,
        objectives: [
          "Évaluer les coûts de Linux",
          "Planifier la migration",
          "Former l'équipe IT",
        ],
      },
    ],
    tech: [
      {
        id: "linux-tech-1",
        title: "Administrer Linux en production",
        description: "Gérer et maintenir des serveurs Linux en environnement scolaire",
        difficulty: "difficile",
        duration: "3h",
        participants: 35,
        reward: 400,
        objectives: [
          "Configurer les permissions",
          "Gérer les utilisateurs",
          "Sécuriser le système",
        ],
      },
    ],
  },
  "salle-serveur": {
    eleve: [
      {
        id: "serveur-1",
        title: "Comprendre l'infrastructure du web",
        description: "Découvrir comment fonctionnent les serveurs et l'hébergement",
        difficulty: "moyen",
        duration: "1h",
        participants: 198,
        reward: 200,
        objectives: [
          "Apprendre l'architecture web",
          "Découvrir les serveurs",
          "Comprendre la sécurité des données",
        ],
      },
    ],
    tech: [
      {
        id: "serveur-tech-1",
        title: "Configurer un serveur sécurisé",
        description: "Mettre en place une infrastructure serveur responsable",
        difficulty: "difficile",
        duration: "3h",
        participants: 67,
        reward: 400,
        objectives: [
          "Configurer un serveur",
          "Mettre en place le SSL/TLS",
          "Optimiser les performances",
        ],
      },
    ],
    prof: [
      {
        id: "serveur-prof-1",
        title: "Enseigner l'infrastructure web",
        description: "Aider les élèves à comprendre l'architecture d'Internet",
        difficulty: "moyen",
        duration: "2h",
        participants: 54,
        reward: 250,
        objectives: [
          "Préparer des démonstrations",
          "Expliquer les concepts clés",
          "Créer des TP pratiques",
        ],
      },
    ],
    direction: [
      {
        id: "serveur-direction-1",
        title: "Planifier l'infrastructure numérique",
        description: "Définir la stratégie de l'hébergement et de la sécurité",
        difficulty: "difficile",
        duration: "2h30",
        participants: 32,
        reward: 380,
        objectives: [
          "Évaluer les besoins IT",
          "Choisir un hébergement",
          "Planifier la sécurité",
        ],
      },
    ],
  },
  "bureau-direction": {
    direction: [
      {
        id: "direction-1",
        title: "Plan numérique de votre établissement",
        description: "Élaborer une stratégie numérique alignée avec NIRD",
        difficulty: "difficile",
        duration: "3h",
        participants: 45,
        reward: 500,
        objectives: [
          "Audit numérique",
          "Identifier les enjeux",
          "Définir les priorités",
        ],
      },
    ],
    prof: [
      {
        id: "direction-prof-1",
        title: "Intégrer NIRD dans vos cours",
        description: "Enseigner la responsabilité numérique aux élèves",
        difficulty: "moyen",
        duration: "2h",
        participants: 87,
        reward: 250,
        objectives: [
          "Créer des ressources pédagogiques",
          "Évaluer la compréhension",
          "Partager les bonnes pratiques",
        ],
      },
    ],
    eleve: [
      {
        id: "direction-eleve-1",
        title: "Participer à la gouvernance numérique",
        description: "S'impliquer dans les décisions numériques de l'établissement",
        difficulty: "moyen",
        duration: "1h30",
        participants: 76,
        reward: 180,
        objectives: [
          "Comprendre la stratégie numérique",
          "Proposer des améliorations",
          "Participer aux décisions",
        ],
      },
    ],
    tech: [
      {
        id: "direction-tech-1",
        title: "Déployer NIRD en infrastructure",
        description: "Mettre en place l'infrastructure pour soutenir NIRD",
        difficulty: "difficile",
        duration: "2h30",
        participants: 38,
        reward: 420,
        objectives: [
          "Évaluer l'infrastructure actuelle",
          "Planifier les évolutions",
          "Mettre en place les solutions",
        ],
      },
    ],
  },
  "quartier-familles": {
    famille: [
      {
        id: "famille-1",
        title: "Bien accompagner ses enfants en ligne",
        description: "Guide pratique pour une utilisation saine du numérique",
        difficulty: "facile",
        duration: "45 min",
        participants: 523,
        reward: 100,
        objectives: [
          "Comprendre les risques",
          "Définir les règles",
          "Discuter avec ses enfants",
        ],
      },
    ],
    eleve: [
      {
        id: "famille-eleve-1",
        title: "Initier ses parents au numérique",
        description: "Aider les générations à se comprendre",
        difficulty: "moyen",
        duration: "1h30",
        participants: 156,
        reward: 150,
        objectives: [
          "Expliquer les risques numériques",
          "Montrer les bonnes pratiques",
          "Créer un dialogue intergénérationnel",
        ],
      },
    ],
    prof: [
      {
        id: "famille-prof-1",
        title: "Impliquer les familles dans NIRD",
        description: "Co-construire une vision partagée du numérique responsable",
        difficulty: "moyen",
        duration: "2h",
        participants: 89,
        reward: 200,
        objectives: [
          "Organiser une réunion parents-école",
          "Sensibiliser aux enjeux",
          "Impliquer les familles",
        ],
      },
    ],
    direction: [
      {
        id: "famille-direction-1",
        title: "Politique famille-école numérique",
        description: "Créer des liens positifs entre école et familles sur le numérique",
        difficulty: "difficile",
        duration: "2h30",
        participants: 41,
        reward: 380,
        objectives: [
          "Écouter les familles",
          "Définir une politique",
          "Mettre en œuvre le partenariat",
        ],
      },
    ],
  },
  "collectivite": {
    collectivite: [
      {
        id: "collectivite-1",
        title: "Initiative territoriale NIRD",
        description: "Développer un projet communautaire pour la résilience numérique",
        difficulty: "difficile",
        duration: "2 jours",
        participants: 67,
        reward: 1000,
        objectives: [
          "Identifier les besoins locaux",
          "Former une équipe",
          "Lancer le projet",
        ],
      },
    ],
    eleve: [
      {
        id: "collectivite-eleve-1",
        title: "Jeunes citoyens numériques",
        description: "Comprendre la politique numérique locale et s'impliquer",
        difficulty: "moyen",
        duration: "1h",
        participants: 92,
        reward: 120,
        objectives: [
          "Découvrir les enjeux municipaux",
          "S'impliquer en tant que citoyen",
          "Proposer des améliorations",
        ],
      },
    ],
    prof: [
      {
        id: "collectivite-prof-1",
        title: "Partenariat école-collectivité",
        description: "Co-construire des projets numériques responsables avec les collectivités",
        difficulty: "moyen",
        duration: "2h30",
        participants: 67,
        reward: 280,
        objectives: [
          "Identifier les partenaires",
          "Co-définir les objectifs",
          "Monter un projet collaboratif",
        ],
      },
    ],
  },
};

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

  const missions = missionsData[lieu]?.[role] || [];

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
        {missions.length > 0 ? (
          <div className="space-y-6">
            {missions.map((mission) => (
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
                        {mission.objectives.map((objective, idx) => (
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

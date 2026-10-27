import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  ArrowLeft,
  Compass,
  Dumbbell,
  GraduationCap,
  HeartPulse,
  Home,
  Layers,
  LineChart,
  ShieldCheck
} from 'lucide-react';

const ProjetEPS = () => {
  const navigate = useNavigate();

  const axesAEFE = [
    'Développement du réseau',
    'Excellence pédagogique et valeurs humanistes',
    'Formation des personnels',
    'Rayonnement culturel, diplomatie et francophonie'
  ];

  const axesProjet = [
    {
      title: 'Axe 1 – Réussite et différenciation',
      points: [
        'Développer l’autonomie et la prise d’initiative.',
        'Adapter les contenus aux profils variés par la différenciation.',
        'Renforcer l’articulation cycle 3 – cycle 4.'
      ]
    },
    {
      title: 'Axe 2 – Parcours personnel et citoyen',
      points: [
        'Proposer une offre diversifiée d’APSA et un parcours sportif personnalisé.',
        'Renforcer l’éducation à la santé et à l’égalité filles/garçons.',
        'Valoriser les élèves engagés (jeunes officiels, arbitres…) et l’orientation vers les métiers du sport.'
      ]
    },
    {
      title: 'Axe 3 – Ouverture internationale et partenariats',
      points: [
        'Développer des projets sportifs partagés avec des établissements étrangers.',
        'Inscrire l’EPS dans la dynamique des JOJ Dakar 2026 et des JIJ 2026.',
        'Communiquer sur les projets sportifs pour favoriser le rayonnement du LFJP.'
      ]
    },
    {
      title: 'Axe 4 – Cadre de vie et bien-être',
      points: [
        'Optimiser les infrastructures sportives et organiser des événements fédérateurs (cross, journées olympiques…).',
        'Promouvoir un climat scolaire positif par le sport et le vivre-ensemble intercycles.',
        'Mettre en avant l’activité physique pour la santé.'
      ]
    },
    {
      title: 'Axe 5 – Politique numérique au service de l’EPS',
      points: [
        'Utiliser les outils numériques pour enrichir les apprentissages et l’auto-évaluation.',
        'Produire des ressources accessibles et des projets sportifs connectés.'
      ]
    }
  ];

  const team = [
    {
      name: 'DRAME Claire',
      epsHours: '19 h',
      extraHours: '3 h SS + 2 h AS',
      roles: 'Coordonnatrice, secrétaire AS',
      skills: 'Boxe assaut et boxe française'
    },
    {
      name: 'NDIAYE Alassane',
      epsHours: '20 h',
      extraHours: '3 h SS + 1 h AS',
      roles: 'Coordonnateur, secrétaire AS',
      skills: 'Judo'
    },
    {
      name: 'DIANDI Antoine',
      epsHours: '—',
      extraHours: '3 h SS',
      roles: 'Secrétaire AS',
      skills: 'Basket-ball'
    }
  ];

  const facilities = [
    {
      title: 'Plateau sportif',
      activities: 'Basket-ball, hand-ball, volley-ball, athlétisme, ultimate',
      notes: 'Séquences de 12 leçons, installations partagées avec l’école primaire.'
    },
    {
      title: 'Dojo',
      activities: 'Danse, acrosport, gymnastique, boxe française, step, judo, lutte'
    },
    {
      title: 'Aérodrome',
      activities: 'Athlétisme, ultimate'
    },
    {
      title: 'Piscine de la clinique Senghor',
      activities: 'Natation'
    }
  ];

  const actionsPhares = [
    '2 sections sportives : basket-ball et judo, avec liens cycle 3-4.',
    'Séjour scolaire d’intégration sportive en Activités de Pleine Nature.',
    'Organisation d’un cross national et participation aux compétitions UNSS.',
    'Pôle de formation national en judo et en boxe.',
    'Participation à la Semaine olympique et paralympique, aux jeux de la ZAO et aux JIJ.'
  ];

  const aflLycee = [
    {
      champ: 'CA1 : Produire une performance optimale',
      attendu: 'Réaliser des performances mesurables et gérer son effort.',
      priorites: 'Maîtrise technique, planification de l’entraînement, analyse de performance.'
    },
    {
      champ: 'CA2 : Adapter ses déplacements',
      attendu: 'Se déplacer efficacement en environnement varié et sécurisé.',
      priorites: 'Prise d’informations, adaptation aux contraintes, sécurité.'
    },
    {
      champ: 'CA3 : Réaliser une prestation artistique ou acrobatique',
      attendu: 'Composer et présenter une prestation expressive structurée.',
      priorites: 'Créativité, maîtrise corporelle, gestion de l’espace et du rythme.'
    },
    {
      champ: 'CA4 : Conduire et maîtriser un affrontement',
      attendu: 'Mettre en œuvre des stratégies pour attaquer, défendre, coopérer ou s’opposer.',
      priorites: 'Compréhension des règles, tactique, communication, maîtrise émotionnelle.'
    },
    {
      champ: 'CA5 : Entretenir sa santé',
      attendu: 'Construire un projet personnel d’entretien physique.',
      priorites: 'Compréhension physiologique, régularité, auto-évaluation.'
    }
  ];

  const programmationLycee = [
    {
      titre: 'Seconde',
      items: [
        'Demi-fond : gérer son effort et planifier un projet de course (menu 1 – 3 × 500).',
        'Acrosport : créer et maîtriser une prestation expressive.',
        'Basket-ball : stratégies collectives, communication et opposition.',
        'Cross training : construire un projet d’entretien physique.'
      ]
    },
    {
      titre: 'Première',
      items: [
        'Menu 1 – 3 × 500 : régulation de l’effort et optimisation de performance.',
        'Acrosport : structurer une prestation expressive.',
        'Handball : stratégies, coopération et opposition.',
        'Cross training : projet personnel d’entretien physique.'
      ]
    },
    {
      titre: 'Terminale',
      items: [
        'Menu 2 – Cross Training : mener un projet personnel d’entretien physique.',
        'Menu 1 – Basket-ball et Menu 2 – Hand-ball : stratégies collectives confirmées.',
        'Boxe française : maîtrise de l’affrontement et contrôle émotionnel.'
      ]
    }
  ];

  const programmationCollege = [
    {
      titre: 'Sixième',
      items: [
        'Combiné athlétique : course de 1/2 fond et lancer de vortex.',
        'Course de relais.',
        'Boxe française, step ou gymnastique.',
        'Volley-ball.'
      ]
    },
    {
      titre: 'Cinquième',
      items: [
        'Course de relais, course de vitesse et combiné athlétique.',
        'Natation : savoir nager.',
        'Acrosport.',
        'Ultimate et handball.'
      ]
    },
    {
      titre: 'Quatrième',
      items: [
        'Course de vitesse, combiné course + lancer.',
        'Step ou acrosport.',
        'Lutte, basket-ball, handball, ultimate.'
      ]
    },
    {
      titre: 'Troisième',
      items: [
        'Course de 1/2 fond + lancer.',
        'Acrosport.',
        'Basket-ball, volley-ball, handball, ultimate.',
        'Cross training.'
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col font-raleway">
      <Navbar showLogo={true} />

      <div className="bg-gradient-to-r from-blue-800 via-french-blue to-cyan-600 text-white py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <GraduationCap className="h-14 w-14" />
            <div>
              <p className="text-sm uppercase tracking-widest text-white/80">Cadre scolaire & santé</p>
              <h1 className="text-3xl md:text-5xl font-playfair font-bold">Projet EPS</h1>
              <p className="text-lg md:text-2xl text-white/90 mt-2">
                Projet pédagogique d’Éducation Physique et Sportive du Lycée Français Jacques Prévert
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-4 flex gap-2">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <Button variant="outline" onClick={() => navigate('/')}>
          <Home className="mr-2 h-4 w-4" />
          Accueil
        </Button>
      </div>

      <main className="flex-1 bg-gradient-to-b from-slate-50 via-white to-white">
        <div className="container mx-auto px-6 py-12 space-y-10">
          <Card className="shadow-sm border-blue-100">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <Compass className="h-6 w-6 text-blue-900" />
                <CardTitle className="text-2xl text-blue-900">Contexte et ancrage</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-700">
              <p>
                Le lycée, situé à Saly-Portudal sur la Petite Côte, bénéficie d’un environnement touristique en expansion et
                d’infrastructures modernes. La population scolaire internationale est dynamique et en forte croissance,
                offrant un terreau propice aux projets sportifs, partenariaux et inclusifs.
              </p>
              <p>
                Le projet EPS s’inscrit dans les axes stratégiques de l’AEFE et répond aux objectifs de l’établissement :
                réussite de tous, accompagnement des parcours, ouverture internationale, amélioration du cadre de vie et
                politique numérique au service de la communauté éducative.
              </p>
              <div className="flex flex-wrap gap-2">
                {axesAEFE.map((axe) => (
                  <Badge key={axe} variant="secondary" className="bg-blue-50 text-blue-900 border border-blue-200">
                    {axe}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-emerald-100">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-emerald-700" />
                <CardTitle className="text-2xl text-emerald-800">Équipe EPS</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-700">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 font-semibold">Nom</th>
                    <th className="py-2 font-semibold">Heures d’EPS</th>
                    <th className="py-2 font-semibold">Heures complémentaires</th>
                    <th className="py-2 font-semibold">Rôles</th>
                    <th className="py-2 font-semibold">Spécialités</th>
                  </tr>
                </thead>
                <tbody>
                  {team.map((member) => (
                    <tr key={member.name} className="border-b last:border-none">
                      <td className="py-2 font-semibold text-slate-900">{member.name}</td>
                      <td className="py-2">{member.epsHours}</td>
                      <td className="py-2">{member.extraHours}</td>
                      <td className="py-2">{member.roles}</td>
                      <td className="py-2">{member.skills}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-orange-100">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <HeartPulse className="h-6 w-6 text-orange-500" />
                <CardTitle className="text-2xl text-orange-700">Conditions d’enseignement</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {facilities.map((facility) => (
                <div key={facility.title} className="p-4 rounded-lg bg-orange-50 border border-orange-100">
                  <h3 className="font-semibold text-orange-700 mb-1">{facility.title}</h3>
                  <p className="text-slate-800">{facility.activities}</p>
                  {facility.notes && <p className="text-sm text-slate-600 mt-1">{facility.notes}</p>}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-indigo-100">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <Layers className="h-6 w-6 text-indigo-600" />
                <CardTitle className="text-2xl text-indigo-700">Axes du projet EPS</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700">
              {axesProjet.map((axe) => (
                <div key={axe.title} className="p-4 rounded-lg bg-indigo-50 border border-indigo-100">
                  <h3 className="font-semibold text-indigo-800 mb-2">{axe.title}</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {axe.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-amber-100">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <Dumbbell className="h-6 w-6 text-amber-600" />
                <CardTitle className="text-2xl text-amber-700">Actions phares EPS & AS</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-700">
              <p>
                La place de l’EPS et de l’Association Sportive dans l’établissement repose sur une offre riche et ouverte,
                favorisant la réussite, la cohésion et le rayonnement du LFJP.
              </p>
              <ul className="list-disc list-inside space-y-2">
                {actionsPhares.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-emerald-100">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <LineChart className="h-6 w-6 text-emerald-700" />
                <CardTitle className="text-2xl text-emerald-800">Attendus de fin de lycée (AFL)</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-700 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 font-semibold">Champ d’apprentissage</th>
                    <th className="py-2 font-semibold">AFL</th>
                    <th className="py-2 font-semibold">Éléments prioritaires</th>
                  </tr>
                </thead>
                <tbody>
                  {aflLycee.map((item) => (
                    <tr key={item.champ} className="border-b last:border-none align-top">
                      <td className="py-2 font-semibold text-slate-900">{item.champ}</td>
                      <td className="py-2">{item.attendu}</td>
                      <td className="py-2">{item.priorites}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card className="shadow-sm border-indigo-100">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-indigo-600" />
                  <CardTitle className="text-2xl text-indigo-700">Programmation Lycée</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-slate-700">
                {programmationLycee.map((niveau) => (
                  <div key={niveau.titre} className="p-4 rounded-lg bg-indigo-50 border border-indigo-100">
                    <h3 className="font-semibold text-indigo-800 mb-2">{niveau.titre}</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {niveau.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-sm border-blue-100">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-6 w-6 text-blue-800" />
                  <CardTitle className="text-2xl text-blue-900">Programmation Collège</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-slate-700">
                {programmationCollege.map((niveau) => (
                  <div key={niveau.titre} className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                    <h3 className="font-semibold text-blue-900 mb-2">{niveau.titre}</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {niveau.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjetEPS;

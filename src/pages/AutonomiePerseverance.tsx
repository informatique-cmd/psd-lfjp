import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Home, TrendingUp, Target, CalendarCheck, LayoutGrid } from 'lucide-react';

const AutonomiePerseverance = () => {
  const axes = [
    {
      id: 'axe1',
      title: 'Construire l’autonomie progressivement',
      description:
        'Installer des jalons clairs de développement de l’autonomie, de la maternelle au lycée, en outillant les élèves pour organiser leur travail et comprendre les attendus.',
      items: [
        'Progression explicite de l’autonomie du primaire au lycée avec des repères partagés par cycle.',
        'Organisation du travail personnel : plan de travail, gestion du temps, méthodologie de prise de notes.',
        'Clarification des attendus scolaires et des critères de réussite pour chaque discipline.',
        'Autoévaluation guidée et stratégies d’apprentissage différenciées.',
        'Usage raisonné et responsable des outils numériques, en lien avec le Profil digital LFJP.',
      ],
    },
    {
      id: 'axe2',
      title: 'Installer une culture de l’effort et de la persévérance',
      description:
        'Mobiliser toute la communauté éducative pour valoriser la progression, expliciter les critères d’évaluation et sécuriser le droit à l’erreur.',
      items: [
        'Valorisation des progrès et non des seuls résultats, avec des feedbacks réguliers.',
        'Évaluation plus formative et explicite, en cohérence avec les autres parcours (Bien-être, Réussites).',
        'Erreur reconnue comme levier d’apprentissage, en lien avec le programme « Valorisation de l’erreur ». ',
        'Cohérence éducative autour du règlement intérieur, des sanctions éducatives et de la médiation entre pairs.',
      ],
    },
    {
      id: 'axe3',
      title: 'Accompagner les moments clés du parcours scolaire',
      description:
        'Sécuriser les transitions et articuler autonomie, motivation et orientation choisie, en synergie avec le Parcours Avenir.',
      items: [
        'Dispositifs renforcés pour les transitions CM2–6e, 3e–lycée et lycée–enseignement supérieur.',
        'Tutorats, suivis individualisés et entretiens réguliers avec les familles.',
        'Liens explicites entre autonomie scolaire, confiance en soi et choix d’orientation.',
      ],
    },
    {
      id: 'axe4',
      title: 'Donner aux élèves des espaces d’engagement',
      description:
        'Multiplier les occasions d’agir et de prendre des responsabilités pour ancrer l’autonomie et la persévérance dans des projets concrets.',
      items: [
        'Instances représentatives (délégués, CVL) renforcées et formées.',
        'Projets citoyens, culturels, sportifs, environnementaux et numériques pilotés par les élèves.',
        'Valorisation de l’engagement et de la persévérance dans les cérémonies de réussites et les communications du LFJP.',
      ],
    },
  ];

  const indicators = [
    'Sentiment d’encouragement et de reconnaissance mesuré par les enquêtes climat scolaire.',
    'Perception de la justice et de la cohérence des règles et sanctions éducatives.',
    'Engagement des élèves dans les projets (culturels, sportifs, citoyens, numériques).',
    'Évolution de l’assiduité et des parcours d’orientation, en lien avec Parcours Avenir.',
    'Prévention du décrochage scolaire et accompagnement des situations de fragilité.',
  ];

  return (
    <div className="min-h-screen flex flex-col font-raleway bg-slate-50 text-slate-900">
      <Navbar showLogo={true} />

      <header className="bg-gradient-to-br from-french-blue via-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-6 py-20 md:py-28">
          <p className="uppercase tracking-[0.35em] text-xs md:text-sm text-white/80">Plan stratégique 2026-2030 · Axe 4</p>
          <h1 className="mt-4 text-3xl md:text-5xl font-playfair font-bold">Autonomie et persévérance</h1>
          <p className="mt-4 max-w-3xl text-base md:text-lg text-white/90">
            Former des élèves acteurs de leur parcours et capables de s’engager dans la durée.
          </p>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-6 py-10 md:py-14 space-y-12">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild className="bg-white text-french-blue border-french-blue hover:bg-french-blue hover:text-white">
              <Link to="/plan-strategique" state={{ axe: 'axe4' }}>
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden /> Retour au Plan stratégique
              </Link>
            </Button>
            <Button variant="outline" asChild className="bg-white text-french-blue border-french-blue hover:bg-french-blue hover:text-white">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" aria-hidden /> Accueil
              </Link>
            </Button>
          </div>

          <section aria-labelledby="intro-title" className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-blue-100">
              <h2 id="intro-title" className="text-2xl md:text-3xl font-playfair font-semibold text-french-blue">
                Intention éducative
              </h2>
              <p className="mt-4 text-slate-700 leading-relaxed">
                L’autonomie et la persévérance constituent des compétences transversales essentielles à la réussite scolaire, à l’orientation et à la formation du citoyen. Elles soutiennent la mission du LFJP de préparer chaque élève à son projet personnel et à l’enseignement supérieur, en cohérence avec la valeur « persévérance » de l’établissement. Elles s’inscrivent dans les orientations de l’Éducation nationale et de l’AEFE visant à former des élèves responsables, capables de s’autoévaluer et de s’engager durablement.
              </p>
              <p className="mt-4 text-slate-700 leading-relaxed">
                Cette page complète les démarches déjà engagées autour du bien-être et de la valorisation des réussites, et se connecte aux parcours d’orientation (Parcours Avenir) pour consolider un continuum d’accompagnement.
              </p>
            </div>

            <div className="rounded-3xl bg-blue-50 p-6 shadow-inner border border-blue-100">
              <h3 className="text-xl font-semibold text-french-blue flex items-center gap-2">
                <Target className="h-5 w-5" aria-hidden />
                Repères clés
              </h3>
              <ul className="mt-4 space-y-3 text-slate-700 text-sm">
                <li>Préparer l’autonomie académique et l’orientation post-bac.</li>
                <li>Faire vivre la valeur « persévérance » auprès des élèves et des familles.</li>
                <li>S’aligner sur les cadres nationaux et AEFE en matière d’accompagnement.</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="diagnostic-title" className="space-y-4">
            <h2 id="diagnostic-title" className="text-2xl md:text-3xl font-playfair font-semibold text-french-blue">
              Diagnostic – Ce qui est déjà en place au LFJP
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-blue-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-french-blue">Forces et attentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-slate-700">
                  <p>Climat scolaire globalement favorable aux apprentissages et sentiment d’appartenance solide.</p>
                  <p>Attentes identifiées des élèves : encouragements réguliers, reconnaissance des efforts et clarté des règles de vie.</p>
                </CardContent>
              </Card>
              <Card className="border-blue-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-french-blue">Leviers existants</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-700 list-disc list-inside">
                    <li>Progressivité des exigences scolaires et accompagnement méthodologique.</li>
                    <li>Dispositifs d’orientation et Parcours Avenir déjà structurés.</li>
                    <li>Engagement des élèves dans des projets culturels, sportifs, citoyens et numériques.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section aria-labelledby="axes-title" className="space-y-6">
            <div className="flex items-center gap-3">
              <LayoutGrid className="h-6 w-6 text-french-blue" aria-hidden />
              <h2 id="axes-title" className="text-2xl md:text-3xl font-playfair font-semibold text-french-blue">
                Axes de développement 2026–2030
              </h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {axes.map((axe) => (
                <Card key={axe.id} className="h-full border-slate-200 shadow-sm">
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-lg text-french-blue leading-snug">{axe.title}</CardTitle>
                    <p className="text-sm text-slate-700">{axe.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-slate-700 list-disc list-inside">
                      {axe.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section aria-labelledby="indicators-title" className="rounded-3xl bg-white p-8 shadow-sm border border-blue-100">
            <div className="flex items-center gap-3">
              <CalendarCheck className="h-6 w-6 text-french-blue" aria-hidden />
              <h2 id="indicators-title" className="text-2xl md:text-3xl font-playfair font-semibold text-french-blue">
                Indicateurs de suivi
              </h2>
            </div>
            <ul className="mt-4 grid gap-3 md:grid-cols-2 text-slate-700 list-disc list-inside">
              {indicators.map((indicator) => (
                <li key={indicator}>{indicator}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="position-title" className="rounded-3xl bg-blue-50 p-8 shadow-inner border border-blue-100">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-french-blue" aria-hidden />
              <h2 id="position-title" className="text-2xl md:text-3xl font-playfair font-semibold text-french-blue">
                Positionnement institutionnel
              </h2>
            </div>
            <p className="mt-4 text-slate-700 leading-relaxed">
              Cette feuille de route s’inscrit dans les priorités nationales de l’Éducation nationale et dans les orientations stratégiques de l’AEFE. Elle contribue à la cohérence globale de l’Axe 4 « Façonner les réussites » du PSD et renforce la capacité du LFJP à former des élèves autonomes, persévérants et engagés dans leurs parcours.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AutonomiePerseverance;

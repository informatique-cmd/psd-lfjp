import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Home, Award, HeartHandshake, BookOpenCheck, Sparkles, LineChart } from 'lucide-react';

const ToutesLesReussites = () => {
  const navigate = useNavigate();

  const reussites = [
    {
      title: 'Réussite académique',
      description:
        'Progression des acquis, maîtrise des attendus disciplinaires et confiance dans le travail personnel, en lien avec les programmes.'
    },
    {
      title: "Réussite d’orientation et de parcours",
      description:
        'Construction d’un projet réaliste, exploration des voies et spécialités, choix éclairés à chaque palier d’orientation.'
    },
    {
      title: 'Réussite citoyenne et engagement',
      description:
        'Participation aux instances, projets solidaires ou éco-responsables, capacité à prendre des responsabilités au service du collectif.'
    },
    {
      title: 'Réussite culturelle et artistique (PEAC)',
      description:
        'Découvertes, pratiques et médiations artistiques régulières, ouverture aux patrimoines locaux et internationaux.'
    },
    {
      title: 'Réussite personnelle et bien-être',
      description:
        'Équilibre entre exigences et bienveillance, confiance en soi, gestion du stress, compétences psychosociales et esprit de coopération.'
    },
    {
      title: 'Réussite inclusive',
      description:
        'Prise en compte des besoins éducatifs particuliers, aménagements raisonnables, accompagnement des parcours individualisés.'
    },
    {
      title: 'Réussite internationale et plurilingue',
      description:
        'Maîtrise du français et des langues étudiées, mobilité et projets internationaux, sensibilité interculturelle.'
    },
    {
      title: 'Réussite numérique',
      description:
        'Usages responsables du numérique, créativité et innovation, production de contenus et maîtrise des compétences digitales.'
    }
  ];

  const dispositifs = [
    {
      title: 'Portefeuille des réussites de l’élève',
      objectif: 'Rendre visibles les progrès et les talents de chaque élève tout au long de sa scolarité.',
      description:
        'Portfolio numérique et papier alimenté par les élèves et les équipes, réunissant productions, engagements, bilans et attestations.',
      public: 'Élèves du CM2 à la terminale, familles et équipes pédagogiques.',
      lien: 'Parcours Avenir, Parcours Citoyen, PEAC, valeurs de confiance et de responsabilité.'
    },
    {
      title: 'Politique d’encouragement et de valorisation des progrès',
      objectif: 'Installer une culture de l’encouragement et de la reconnaissance continue.',
      description:
        'Grilles de feedback positives, rituels de célébration sobres, mise en avant des progrès individuels et collectifs dans les instances et la communication.',
      public: 'Tous les élèves, avec un focus sur les cycles d’orientation et les classes à examen.',
      lien: 'Climat scolaire, Parcours Santé, valeurs de bienveillance et d’exigence.'
    },
    {
      title: 'Parcours Avenir renforcé',
      objectif: 'Assurer une orientation éclairée et progressive pour chaque élève.',
      description:
        'Ateliers métiers, rencontres alumni, stages d’observation consolidés, accompagnement personnalisé des choix de spécialité et du supérieur.',
      public: 'Cycle 4 et lycée, en lien avec les familles.',
      lien: 'Parcours Avenir, mission d’accompagnement vers l’enseignement supérieur.'
    },
    {
      title: 'Valorisation de l’engagement citoyen',
      objectif: 'Reconnaître les initiatives solidaires, écologiques et démocratiques.',
      description:
        'Certification interne de l’engagement, carnets de mission pour les éco-délégués et ambassadeurs, restitution annuelle lors des instances.',
      public: 'Élèves élus, éco-délégués, membres des clubs et projets citoyens.',
      lien: 'Parcours Citoyen, valeurs de civisme et de coopération.'
    },
    {
      title: 'Structuration du PEAC',
      objectif: 'Garantir la continuité des expériences artistiques et culturelles.',
      description:
        'Programmation pluriannuelle, résidences d’artistes, médiation par les élèves, articulation avec les enseignements et les sorties culturelles.',
      public: 'Élèves de la maternelle au lycée, partenaires culturels locaux et du réseau AEFE.',
      lien: 'PEAC, ouverture internationale et valorisation des talents créatifs.'
    },
    {
      title: 'Visibilité des réussites internationales et plurilingues',
      objectif: 'Mettre en lumière les mobilités, certifications et projets interculturels.',
      description:
        'Valorisation des sections européennes et internationales, partage des expériences de mobilité, présentation des certifications linguistiques.',
      public: 'Collégiens et lycéens engagés dans les parcours linguistiques et internationaux.',
      lien: 'Axe d’ouverture internationale, valeurs de curiosité et de respect des cultures.'
    },
    {
      title: 'Mise en valeur des réussites numériques et créatives',
      objectif: 'Encourager l’innovation responsable et la production numérique.',
      description:
        'Concours de projets, ateliers de créativité numérique, expositions des productions (vidéo, code, design), accompagnement au numérique responsable.',
      public: 'Élèves de tous niveaux, équipes pédagogiques et familles.',
      lien: 'Parcours Éducation aux médias et à l’information, stratégie numérique du LFJP.'
    }
  ];

  const indicateurs = [
    'Taux de participation des élèves aux projets, clubs et parcours proposés.',
    'Diversité des réussites valorisées dans les communications internes et publiques.',
    'Résultats des enquêtes de climat scolaire sur la confiance, l’encouragement et la reconnaissance.',
    'Présence et qualité des traces dans les portfolios élèves (productions, engagements, retours).',
    'Implication des élèves dans les instances, projets citoyens et événements culturels.',
    'Suivi des parcours d’orientation (stages, rencontres, choix éclairés, poursuites d’études).'
  ];

  return (
    <div className="min-h-screen flex flex-col font-raleway">
      <Navbar showLogo={true} />

      <div className="bg-gradient-to-r from-french-blue to-indigo-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-6 space-y-6">
          <div className="flex items-center gap-3">
            <Award className="h-12 w-12" />
            <div>
              <p className="uppercase text-sm tracking-[0.2em] text-white/80">PSD 2026-2030</p>
              <h1 className="text-3xl md:text-5xl font-playfair font-bold">Toutes les réussites au LFJP</h1>
            </div>
          </div>
          <p className="max-w-4xl text-lg md:text-xl text-white/90 leading-relaxed">
            La réussite est plurielle : chaque élève progresse à son rythme, selon ses talents, ses efforts et son parcours.
            Le LFJP s’inscrit pleinement dans les orientations de l’Éducation nationale et de l’AEFE pour reconnaître et
            accompagner toutes les formes de réussite.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-4 flex gap-2">
        <Button variant="outline" onClick={() => navigate('/plan-strategique')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au plan stratégique
        </Button>
        <Button variant="outline" onClick={() => navigate('/')}>
          <Home className="mr-2 h-4 w-4" />
          Accueil
        </Button>
      </div>

      <main className="flex-1 bg-gradient-to-b from-slate-50 to-white pb-16">
        <section className="container mx-auto px-6 py-10 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-slate-900">Définir les réussites au LFJP</h2>
            <p className="text-slate-700 max-w-4xl leading-relaxed">
              L’établissement reconnaît et accompagne huit dimensions complémentaires de la réussite. Chaque élève peut y
              trouver des occasions de progresser, de se distinguer et d’être encouragé.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {reussites.map((item) => (
              <Card key={item.title} className="border-slate-200 shadow-sm h-full">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-900">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-6 py-10 space-y-6">
          <div className="rounded-3xl border border-amber-100 bg-amber-50/60 p-8 shadow-sm">
            <div className="flex items-start gap-3">
              <Sparkles className="h-6 w-6 text-amber-600" />
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-playfair font-bold text-amber-900">Des bases solides déjà en place</h3>
                <p className="text-amber-900/90 leading-relaxed">
                  Les équipes éducatives sont engagées, le climat scolaire est globalement positif et de nombreux dispositifs de
                  soutien et de parcours structurent déjà l’accompagnement. L’établissement affirme sa volonté de valoriser le
                  meilleur de chacun tout en consolidant la culture de l’encouragement et la reconnaissance de l’engagement des élèves.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-10 space-y-6">
          <div className="space-y-3">
            <h3 className="text-2xl md:text-3xl font-playfair font-bold text-slate-900">Axes de développement 2026-2030</h3>
            <p className="text-slate-700 max-w-4xl leading-relaxed">
              Chaque dispositif s’inscrit dans une feuille de route mesurable et relie les parcours éducatifs aux valeurs du LFJP.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {dispositifs.map((dispositif) => (
              <Card key={dispositif.title} className="h-full border-slate-200 shadow-sm">
                <CardHeader className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-french-blue/10 p-2 text-french-blue">
                      <BookOpenCheck className="h-5 w-5" aria-hidden />
                    </div>
                    <CardTitle className="text-xl text-slate-900">{dispositif.title}</CardTitle>
                  </div>
                  <p className="text-sm text-slate-600">Objectif : {dispositif.objectif}</p>
                </CardHeader>
                <CardContent className="space-y-3 text-slate-700 leading-relaxed">
                  <p className="font-medium text-slate-800">Description concrète</p>
                  <p>{dispositif.description}</p>
                  <p className="font-medium text-slate-800">Public concerné</p>
                  <p>{dispositif.public}</p>
                  <p className="font-medium text-slate-800">Lien avec les parcours et valeurs</p>
                  <p>{dispositif.lien}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-6 py-10 space-y-6">
          <div className="flex items-center gap-3">
            <LineChart className="h-6 w-6 text-slate-700" />
            <h3 className="text-2xl md:text-3xl font-playfair font-bold text-slate-900">Comment mesurer les réussites ?</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {indicateurs.map((indicateur) => (
              <Card key={indicateur} className="border-slate-200 bg-white shadow-sm">
                <CardContent className="p-6 text-slate-700 leading-relaxed">{indicateur}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-6 py-10">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <HeartHandshake className="h-6 w-6 text-french-blue" />
              <h3 className="text-2xl md:text-3xl font-playfair font-bold text-slate-900">Conclusion</h3>
            </div>
            <p className="text-slate-700 leading-relaxed">
              La réussite, dans toutes ses dimensions, est un levier de confiance et de cohésion pour la communauté éducative.
              Le LFJP fait le choix d’une réussite exigeante, bienveillante et partagée. Cette politique s’inscrit pleinement dans
              le Plan Stratégique de Développement 2026-2030 et donne à chaque élève les moyens d’avancer sereinement vers son avenir.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ToutesLesReussites;

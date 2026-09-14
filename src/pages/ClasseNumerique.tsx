import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  ArrowLeft,
  Home,
  Laptop,
  Truck,
  RefreshCcw,
  Sparkles,
  Target,
  Building2,
} from 'lucide-react';

const phases = [
  {
    title: 'Phase 1 – 2025 : Lancement réussi',
    icon: Laptop,
    summary:
      "Acquisition de 15 ordinateurs portables formant la première classe numérique mobile et création d'une cariole artisanale pour faciliter le transport.",
    highlights: [
      'Investissement initial financé sur la première tranche du plan triennal.',
      "Conception interne d'une cariole numérique à coût quasi nul par l'équipe entretien/travaux.",
      'Illustration concrète des valeurs de créativité et de persévérance du LFJP.',
    ],
  },
  {
    title: 'Phase 2 – 2025-2026 : Consolidation',
    icon: Truck,
    summary:
      'Achat prévu d’une deuxième unité mobile pour augmenter la disponibilité du matériel et soutenir la diffusion des usages pédagogiques du numérique.',
    highlights: [
      "Réponse à la demande croissante des enseignants souhaitant intégrer le numérique à leurs pratiques.",
      'Renforcement de la différenciation pédagogique et du travail collaboratif dans tous les cycles.',
      "Alignement avec les orientations de l'Éducation nationale et de l'AEFE en matière de transformation numérique.",
    ],
  },
  {
    title: 'Phase 3 – 2026-2027 : Renouvellement',
    icon: RefreshCcw,
    summary:
      "Réaffectation de la troisième tranche d'investissement au renouvellement de la flotte d’iPad pour garantir la compatibilité avec les applications pédagogiques récentes.",
    highlights: [
      'Maintien d’un niveau homogène d’équipement entre les cycles.',
      'Pérennisation des usages numériques déjà installés en classe.',
      "Assurance d'une continuité technologique répondant aux standards actuels.",
    ],
  },
];

const impacts = [
  {
    title: 'Axe 3 du PSD 2026-2030',
    description:
      'Contribution directe à la priorité « Digital, numérique, innovation technologique » en offrant des équipements mobiles flexibles et évolutifs.',
    icon: Target,
  },
  {
    title: 'Transition numérique',
    description:
      "Mise en conformité avec les politiques éducatives françaises et de l'AEFE qui encouragent l'intégration quotidienne des outils numériques dans les apprentissages.",
    icon: Sparkles,
  },
  {
    title: 'Climat scolaire',
    description:
      "Réponse aux leviers identifiés par les enquêtes ELCS en améliorant l'engagement et la satisfaction des élèves comme des personnels.",
    icon: Building2,
  },
];

const ClasseNumerique = () => {
  return (
    <div className="min-h-screen flex flex-col font-raleway">
      <Navbar showLogo={true} />

      <section className="bg-gradient-to-r from-french-blue to-blue-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-4 animate-fade-in">
            Classe numérique mobile du LFJP
          </h1>
          <p className="text-lg md:text-xl max-w-3xl font-light animate-fade-in-delay-1">
            Un programme triennal d'investissement (2025-2027) de 4 333 333 FCFA par an pour équiper le lycée de solutions mobiles, inclusives et innovantes.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-6 flex flex-wrap gap-3">
        <Button
          variant="outline"
          className="bg-white text-french-blue border-french-blue hover:bg-french-blue hover:text-white focus-visible:ring-french-blue"
          asChild
        >
          <Link to="/plan-strategique" state={{ axe: 'axe3' }}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au plan stratégique
          </Link>
        </Button>
        <Button
          variant="outline"
          className="bg-white text-french-blue border-french-blue hover:bg-french-blue hover:text-white focus-visible:ring-french-blue"
          asChild
        >
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Accueil
          </Link>
        </Button>
      </div>

      <main className="container mx-auto px-6 pb-16 space-y-10">
        <section className="grid gap-6 lg:grid-cols-[2fr,1fr] items-start">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Note de synthèse</CardTitle>
              <CardDescription>Vision stratégique et financement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Validé lors de l’Assemblée générale du 20 février 2025, le projet engage le LFJP dans une trajectoire de modernisation durable. Un investissement de <strong>4 333 333 FCFA par an sur trois ans</strong> finance l’équipement progressif en classes numériques mobiles.
              </p>
              <p>
                Cette démarche s’inscrit pleinement dans la vision stratégique de l’établissement&nbsp;: démocratiser l’accès aux outils numériques, accompagner l’appropriation des innovations technologiques et faire de chaque élève un acteur autonome, créatif et responsable.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg overflow-hidden">
            <CardHeader>
              <CardTitle>Une logistique sur-mesure</CardTitle>
              <CardDescription>Cariole numérique artisanale</CardDescription>
            </CardHeader>
            <CardContent>
              <AspectRatio ratio={4 / 3} className="rounded-lg overflow-hidden bg-muted">
                <img
                  src="https://i.imgur.com/x1uTZAK_d.png?maxwidth=520&shape=thumb&fidelity=high"
                  alt="Cariole numérique artisanale conçue pour transporter les ordinateurs portables du LFJP"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </AspectRatio>
              <p className="mt-4 text-sm text-gray-600">
                Conçue par l’équipe entretien/travaux, cette cariole artisanale illustre la créativité et la persévérance au cœur des valeurs du LFJP.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-playfair font-bold text-french-blue">Feuille de route triennale</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {phases.map((phase) => {
              const Icon = phase.icon;
              return (
                <Card key={phase.title} className="h-full">
                  <CardHeader className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Icon className="h-6 w-6 text-french-blue" aria-hidden="true" />
                      <CardTitle className="text-lg">{phase.title}</CardTitle>
                    </div>
                    <CardDescription>{phase.summary}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-outside space-y-2 pl-5 text-sm text-gray-700">
                      {phase.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-playfair font-bold text-french-blue">Impact attendu</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {impacts.map(({ title, description, icon: Icon }) => (
              <Card key={title} className="h-full">
                <CardHeader className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-french-blue" aria-hidden="true" />
                    <CardTitle className="text-lg">{title}</CardTitle>
                  </div>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <Card className="border-l-4 border-french-blue">
            <CardHeader>
              <CardTitle>Conclusion</CardTitle>
              <CardDescription>Modernisation progressive et responsable</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                La classe numérique mobile consolide la capacité du LFJP à proposer un environnement pédagogique moderne, inclusif et durable. Elle favorise l’appropriation des outils numériques par les élèves, soutient l’engagement des équipes éducatives et renforce l’attractivité de l’établissement.
              </p>
              <p>
                À l’issue de la troisième année, le lycée disposera de deux unités mobiles complètes et d’une flotte d’iPad renouvelée, garantissant la continuité des usages numériques dans tous les cycles.
              </p>
              <p className="text-sm text-gray-600">
                Besoin d’une version PDF prête pour insertion dans le PSD&nbsp;? Contactez l’équipe projet pour en obtenir une déclinaison formalisée.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ClasseNumerique;

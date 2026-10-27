import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Home, ExternalLink, FileText, GraduationCap, Users, MapPin } from 'lucide-react';

const filmAnnualLinks = [
  {
    level: '3e',
    description: 'Des jalons pour consolider les découvertes et préparer l\'affectation en lycée.',
    to: '/film-annuel/3e',
  },
  {
    level: '2nde',
    description: 'Identifier ses forces et sélectionner les spécialités cohérentes avec son projet.',
    to: '/film-annuel/2nde',
  },
  {
    level: '1ère',
    description: 'Anticiper Parcoursup et ouvrir le champ des possibles avant la Terminale.',
    to: '/film-annuel/1ere',
  },
  {
    level: 'Terminale',
    description: 'Accompagnement intensif pour finaliser les voeux et réussir la transition post-bac.',
    to: '/film-annuel/terminale',
  },
];

const resourceLinks = [
  {
    title: 'Abonnement Onisep',
    href: 'https://www.onisep.fr/',
    description: 'Accédez à des fiches métiers, des vidéos et des outils interactifs pour affiner votre orientation.',
  },
  {
    title: 'Ressources nationales',
    href: 'https://eduscol.education.fr/794/orientation',
    description: 'Le portail du ministère de l\'Éducation nationale pour comprendre les étapes du Parcours Avenir.',
  },
];

const ParcoursAvenir = () => {
  return (
    <div className="min-h-screen flex flex-col font-raleway bg-slate-50 text-slate-900">
      <Navbar showLogo={true} />

      <header className="relative overflow-hidden bg-gradient-to-br from-french-blue via-blue-700 to-blue-900 text-white">
        <div className="absolute inset-0 bg-white/5" aria-hidden />
        <div className="container mx-auto px-6 py-20 md:py-28 relative z-10">
          <p className="uppercase tracking-[0.35em] text-xs md:text-sm text-white/70">
            Plan stratégique 2026-2030 · Axe 4
          </p>
          <h1 className="mt-4 text-3xl md:text-5xl font-playfair font-bold">Parcours Avenir</h1>
          <p className="mt-6 max-w-3xl text-base md:text-lg text-white/90">
            Construire pas à pas un projet d&apos;orientation ambitieux et réaliste.
          </p>
          <p className="mt-4 max-w-2xl text-base md:text-lg text-white/80">
            L&apos;équipe pédagogique accompagne les élèves de 3e à Terminale dans la découverte d&apos;eux-mêmes, des métiers et des formations, tout au long de leur scolarité.
          </p>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6 flex flex-wrap gap-3">
        <Button
          variant="outline"
          className="bg-white text-french-blue border-french-blue hover:bg-french-blue hover:text-white focus-visible:ring-french-blue"
          asChild
        >
          <Link to="/plan-strategique" state={{ axe: 'axe4' }}>
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
            Retour au plan stratégique
          </Link>
        </Button>
        <Button
          variant="outline"
          className="bg-white text-french-blue border-french-blue hover:bg-french-blue hover:text-white focus-visible:ring-french-blue"
          asChild
        >
          <Link to="/">
            <Home className="mr-2 h-4 w-4" aria-hidden />
            Accueil
          </Link>
        </Button>
      </div>

      <main className="flex-1">
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-playfair font-semibold text-french-blue">
                  Explorer le Parcours Avenir au LFJP
                </h2>
                <p className="text-base md:text-lg text-slate-700">
                  Retrouvez les priorités, les temps forts et les partenaires mobilisés pour guider chaque élève vers un avenir éclairé. Choisissez un niveau pour consulter le film annuel et accéder à des ressources adaptées.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {filmAnnualLinks.map((level) => (
                    <Card key={level.level} className="border-blue-100 shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-within:ring-2 focus-within:ring-french-blue">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between text-french-blue">
                          <span>Film annuel — {level.level}</span>
                          <FileText className="h-5 w-5" aria-hidden />
                        </CardTitle>
                        <CardDescription>{level.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button asChild className="w-full" variant="secondary">
                          <Link to={level.to}>
                            Découvrir les actions
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-4 rounded-3xl bg-white p-6 shadow-xl border border-blue-100">
                <h3 className="text-xl font-playfair font-semibold text-french-blue flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" aria-hidden />
                  Ressources clés
                </h3>
                <p className="text-sm text-slate-600">
                  Consolidez votre projet d&apos;orientation grâce aux outils en ligne et aux publications officielles.
                </p>
                <ul className="space-y-3">
                  {resourceLinks.map((resource) => (
                    <li key={resource.title}>
                      <a
                        href={resource.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-start gap-3 rounded-xl border border-transparent bg-blue-50/60 px-4 py-3 text-sm text-french-blue transition hover:border-french-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-french-blue"
                      >
                        <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 transition group-hover:translate-x-0.5" aria-hidden />
                        <span>
                          <span className="font-semibold block">{resource.title}</span>
                          <span className="text-slate-600 block">{resource.description}</span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="rounded-3xl border border-blue-200 bg-blue-50/80 p-8 shadow-sm">
              <h2 className="text-2xl font-playfair font-semibold text-french-blue flex items-center gap-2">
                <FileText className="h-6 w-6" aria-hidden />
                Kiosque Onisep
              </h2>
              <p className="mt-4 text-slate-700">
                Accédez au kiosque numérique Onisep pour consulter des fiches métiers détaillées et préparer vos recherches d&apos;orientation.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-white p-4 shadow border border-blue-100">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Adresse</p>
                  <a
                    href="https://kiosque.onisep.fr"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-2 text-french-blue font-semibold hover:underline"
                  >
                    kiosque.onisep.fr
                    <ExternalLink className="h-4 w-4" aria-hidden />
                  </a>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow border border-blue-100">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Identifiant</p>
                  <p className="mt-2 font-semibold text-slate-800">3410017R</p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow border border-blue-100">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Mot de passe</p>
                  <p className="mt-2 font-semibold text-slate-800 break-all">ufr4dnVh@</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
              <div>
                <h2 className="text-2xl font-playfair font-semibold text-french-blue flex items-center gap-2">
                  <Users className="h-6 w-6" aria-hidden />
                  Points de contact
                </h2>
                <p className="mt-4 text-slate-700">
                  Pour toute question ou pour construire votre projet d&apos;orientation, prenez rendez-vous auprès des personnes ressources suivantes.
                </p>
                <ul className="mt-6 space-y-5">
                  <li className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-french-blue">Madame D&apos;Aquino</h3>
                    <p className="text-sm text-slate-600">Personne ressource à l&apos;information et à l&apos;orientation (PRIO)</p>
                    <p className="mt-2 text-sm text-slate-700">
                      Conseils personnalisés, accompagnement aux démarches Parcoursup et animation du kiosque Onisep.
                    </p>
                  </li>
                  <li className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-french-blue">Professeurs principaux</h3>
                    <p className="text-sm text-slate-600">Référents de chaque classe</p>
                    <p className="mt-2 text-sm text-slate-700">
                      Suivi des élèves, préparation des conseils de classe et validation des étapes du Parcours Avenir.
                    </p>
                  </li>
                  <li className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-french-blue">Équipe pédagogique &amp; CPE</h3>
                    <p className="text-sm text-slate-600">Partenaires du projet d&apos;orientation</p>
                    <p className="mt-2 text-sm text-slate-700">
                      Organisation des actions collectives, suivi du bien-être et articulation avec les familles.
                    </p>
                  </li>
                </ul>
              </div>
              <div className="rounded-3xl border border-blue-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-french-blue flex items-center gap-2">
                  <MapPin className="h-5 w-5" aria-hidden />
                  Prendre rendez-vous
                </h3>
                <p className="mt-3 text-sm text-slate-700">
                  Rendez-vous au bureau d&apos;orientation pour un accompagnement individuel ou sollicitez votre professeur principal pour un premier échange. Les créneaux peuvent être réservés via Pronote ou directement auprès de la vie scolaire.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ParcoursAvenir;

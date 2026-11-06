import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BarChart2, BookOpen, Flag, Globe2, Home, MapPin, ShieldCheck, Users2 } from 'lucide-react';

const PAGE_TITLE = 'Échanges scolaires ADN-AEFE | PSD LFJP';

const benefits = [
  'Ouverture culturelle et internationale renforcée.',
  'Autonomie et maturité développées grâce à l’immersion.',
  'Maîtrise accrue des langues vivantes.',
  'Compréhension des enjeux contemporains dans un contexte interculturel.',
];

const stats = [
  {
    year: '2023-2024',
    value: '0 élève inscrit',
    detail: 'Phase de lancement du dispositif au LFJP.',
  },
  {
    year: '2024-2025',
    value: '11 élèves en échange',
    detail: 'Montée en puissance rapide et ancrage dans la dynamique AEFE.',
  },
];

const governance = [
  {
    title: 'PRIO',
    role: 'Pilotage pédagogique, conseil aux familles, suivi des candidatures.',
  },
  {
    title: 'CPE',
    role: 'Suivi quotidien, coordination avec les établissements d’accueil, logistique des départs et retours.',
  },
];

const objectives = [
  'Stabiliser 10 à 12 mobilités par an, niveau jugé très satisfaisant pour le LFJP.',
  'Diversifier les destinations au sein du réseau AEFE.',
  'Intégrer systématiquement ADN-AEFE au Parcours Avenir et au Parcours Citoyen.',
  'Structurer un protocole complet de préparation et de retour d’expérience.',
  'Valoriser les mobilités lors des temps institutionnels (SLFM, Forum des métiers, CVL, etc.).',
];

const EchangesScolairesADNAEFE = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-raleway text-slate-900">
      <Navbar showLogo />

      <header className="relative isolate overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-french-blue py-24 text-white md:py-28">
        <div className="absolute inset-0 opacity-15" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=80"
            alt="Élèves en échange scolaire"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="relative container mx-auto px-6">
          <p className="text-sm uppercase tracking-[0.35em] text-white/70">Axe 2 · Ouverture internationale</p>
          <h1 className="mt-6 max-w-4xl text-3xl font-playfair font-bold leading-tight md:text-5xl">
            Échanges scolaires ADN-AEFE
          </h1>
          <p className="mt-6 max-w-3xl text-base text-white/85 md:text-lg">
            Un levier structurant pour former des citoyens du monde ouverts, plurilingues et autonomes grâce à des immersions de plusieurs semaines dans le réseau AEFE.
          </p>
        </div>
      </header>

      <div className="container mx-auto flex flex-wrap gap-3 px-6 py-6">
        <Button variant="outline" onClick={() => navigate('/plan-strategique')} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour au PSD
        </Button>
        <Button variant="outline" onClick={() => navigate('/')} className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Accueil
        </Button>
      </div>

      <main className="flex-1 space-y-12 bg-gradient-to-b from-slate-50 via-white to-slate-50 py-10 md:py-16">
        <div className="container mx-auto space-y-10 px-6">
          <section className="grid gap-8 lg:grid-cols-2">
            <Card className="border-blue-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl font-playfair text-french-blue">
                  <Globe2 className="h-6 w-6" />
                  Présentation du dispositif
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed text-slate-700">
                <p>
                  Le programme ADN-AEFE permet aux élèves de seconde des lycées français du monde d’effectuer un échange scolaire de plusieurs semaines dans un autre établissement du réseau.
                </p>
                <ul className="space-y-3">
                  {benefits.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-french-blue">
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="rounded-2xl bg-blue-50 p-4 text-sm text-blue-900">
                  Au LFJP, le dispositif s’inscrit pleinement dans l’ambition de former des citoyens du monde ouverts, plurilingues et autonomes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl font-playfair text-french-blue">
                  <BarChart2 className="h-6 w-6" />
                  Données et évolution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-base leading-relaxed text-slate-700">
                <div className="grid gap-4 md:grid-cols-2">
                  {stats.map(({ year, value, detail }) => (
                    <div key={year} className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
                      <div className="text-sm uppercase tracking-[0.2em] text-blue-900/70">{year}</div>
                      <div className="mt-2 text-xl font-semibold text-slate-900">{value}</div>
                      <p className="mt-2 text-sm text-slate-600">{detail}</p>
                    </div>
                  ))}
                </div>
                <p>
                  Cette montée en puissance rapide marque l’ancrage du LFJP dans une dynamique internationale solide. Pour un établissement de notre taille, un volume d’environ 10 élèves par an constitue un excellent indicateur de participation et d’attractivité, parfaitement aligné avec les standards AEFE.
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-8 lg:grid-cols-2">
            <Card className="border-blue-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl font-playfair text-french-blue">
                  <Users2 className="h-6 w-6" />
                  Pilotage et organisation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed text-slate-700">
                <p>Un pilotage partagé garantit une gestion fiable, sécurisée et alignée sur les objectifs pédagogiques du lycée.</p>
                <div className="space-y-3">
                  {governance.map(({ title, role }) => (
                    <div key={title} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                      <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-900">
                        {title === 'PRIO' ? <BookOpen className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{title}</h3>
                        <p className="text-sm text-slate-600">{role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl font-playfair text-french-blue">
                  <Flag className="h-6 w-6" />
                  Objectifs stratégiques 2026-2030
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base leading-relaxed text-slate-700">
                <ul className="space-y-3">
                  {objectives.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-french-blue">
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="rounded-2xl bg-blue-50 p-4 text-sm text-blue-900">
                  <p>
                    Ces objectifs structurent un protocole complet de préparation, de mobilité et de retour d’expérience, afin d’ancrer durablement les échanges scolaires dans la culture du LFJP.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 p-8 text-white shadow-md">
            <div className="grid gap-8 lg:grid-cols-[2fr,1fr] lg:items-center">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.3em] text-white/70">Cap vers 2030</p>
                <h2 className="text-2xl font-playfair font-semibold md:text-3xl">
                  Des mobilités au service du Parcours Avenir et du Parcours Citoyen
                </h2>
                <p className="text-base text-white/90">
                  En consolidant les échanges ADN-AEFE, le LFJP confirme sa place dans le réseau mondial des lycées français et offre à chaque élève l’opportunité de vivre une expérience interculturelle riche et structurante.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" onClick={() => navigate('/plan-strategique')} className="bg-white text-blue-900 hover:bg-slate-100">
                    <Globe2 className="mr-2 h-4 w-4" />
                    Retour au plan stratégique
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/parcours-avenir')}
                    className="border-white bg-white text-blue-900 hover:bg-slate-100"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Découvrir le Parcours Avenir
                  </Button>
                </div>
              </div>
              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <ShieldCheck className="h-5 w-5" />
                  Une dynamique sécurisée
                </h3>
                <p className="mt-3 text-sm text-white/85">
                  Coordination fine avec les établissements d’accueil, accompagnement des familles et suivi quotidien des élèves : le dispositif garantit des mobilités sûres et pleinement alignées avec les objectifs pédagogiques du lycée.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EchangesScolairesADNAEFE;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  ArrowLeft,
  Home,
  Users,
  GraduationCap,
  Globe2,
  CalendarClock,
  Sparkles,
} from 'lucide-react';

const ReseauAlumniMentorat = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-raleway bg-slate-50">
      <Navbar showLogo={true} />

      <main className="flex-1">
        <div className="bg-gradient-to-br from-french-blue via-blue-700 to-indigo-800 text-white py-16 md:py-24">
          <div className="container mx-auto px-6 text-center md:text-left">
            <p className="uppercase tracking-[0.35em] text-xs md:text-sm text-white/80">
              Plan stratégique 2026-2030 · Axe 4
            </p>
            <h1 className="mt-4 text-3xl md:text-5xl font-playfair font-bold">
              Réseau d'alumni et mentorat
            </h1>
            <p className="mt-4 max-w-2xl text-base md:text-lg text-white/80">
              Le Lycée Français Jacques Prévert souhaite maintenir un lien fort avec
              ses anciens élèves, valoriser leurs parcours et offrir aux lycéens
              actuels un réseau d&apos;appui, d&apos;inspiration et de mentorat.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12 md:py-16">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="bg-white/80"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden /> Retour
            </Button>
            <Button variant="outline" asChild className="bg-white/80">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" aria-hidden /> Accueil
              </Link>
            </Button>
          </div>

          <section className="mt-12 grid gap-12">
            <div className="rounded-3xl bg-white/80 p-8 shadow-sm ring-1 ring-slate-200/70">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-french-blue/10 text-french-blue">
                  <Users className="h-7 w-7" aria-hidden />
                </div>
                <div>
                  <h2 className="text-2xl font-playfair font-semibold text-slate-900">
                    Base de données des anciens élèves
                  </h2>
                  <p className="mt-3 text-slate-600">
                    Mise en place d&apos;un annuaire digital sécurisé pour rassembler les
                    parcours des alumni et faciliter les connexions entre
                    générations.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600 md:text-base">
                    <li>• Collecte d&apos;informations : études, expériences professionnelles, pays de résidence.</li>
                    <li>• Outil collaboratif pour activer une communauté solidaire et accessible.</li>
                    <li>• Mise en relation simplifiée pour les projets pédagogiques et professionnels.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white/80 p-8 shadow-sm ring-1 ring-slate-200/70">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-french-blue/10 text-french-blue">
                  <GraduationCap className="h-7 w-7" aria-hidden />
                </div>
                <div>
                  <h2 className="text-2xl font-playfair font-semibold text-slate-900">
                    Mentorat lycéens / alumni
                  </h2>
                  <p className="mt-3 text-slate-600">
                    Un programme de parrainage pour accompagner l&apos;orientation et
                    les projets des lycéens, nourri par l&apos;expérience des anciens
                    élèves.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600 md:text-base">
                    <li>• Parrainage individuel ou en petit groupe pour l&apos;orientation et les premières expériences professionnelles.</li>
                    <li>• Ateliers, témoignages et visioconférences thématiques animés par les alumni.</li>
                    <li>• Plateforme de mise en relation encadrée par l&apos;établissement.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white/80 p-8 shadow-sm ring-1 ring-slate-200/70">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-french-blue/10 text-french-blue">
                  <Globe2 className="h-7 w-7" aria-hidden />
                </div>
                <div>
                  <h2 className="text-2xl font-playfair font-semibold text-slate-900">
                    Les Oiseaux de Passage
                  </h2>
                  <p className="mt-3 text-slate-600">
                    Un rendez-vous éditorial pour mettre en lumière la diversité des
                    parcours et renforcer le sentiment d&apos;appartenance.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600 md:text-base">
                    <li>• Rubrique dédiée dans le Petit Prévert et sur les réseaux sociaux du lycée.</li>
                    <li>• Mini-interviews d&apos;anciens élèves en études supérieures ou déjà insérés professionnellement.</li>
                    <li>• Valorisation visuelle avec portraits, citations et un logo spécifique.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-[1px]">
              <div className="h-full rounded-[calc(1.5rem-1px)] bg-white/90 p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900/5 text-slate-900">
                    <Sparkles className="h-7 w-7" aria-hidden />
                  </div>
                  <div>
                    <h2 className="text-2xl font-playfair font-semibold text-slate-900">
                      Pistes visuelles
                    </h2>
                    <p className="mt-3 text-slate-600">
                      Une identité graphique dédiée pour illustrer la dynamique du
                      réseau.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-slate-600 md:text-base">
                      <li>• Carte interactive du monde avec la localisation des anciens élèves.</li>
                      <li>• Portraits stylisés et citations inspirantes des alumni.</li>
                      <li>• Création d&apos;un emblème « Les Oiseaux de Passage ».</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white/80 p-8 shadow-sm ring-1 ring-slate-200/70">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-french-blue/10 text-french-blue">
                  <CalendarClock className="h-7 w-7" aria-hidden />
                </div>
                <div className="w-full">
                  <h2 className="text-2xl font-playfair font-semibold text-slate-900">
                    Échéancier 2026-2030
                  </h2>
                  <p className="mt-3 text-slate-600">
                    Un déploiement progressif sur cinq ans pour ancrer durablement le
                    réseau d&apos;alumni et le mentorat.
                  </p>
                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white/90 p-5">
                      <p className="text-sm font-semibold uppercase tracking-wide text-french-blue">
                        Année 1
                      </p>
                      <p className="mt-2 text-sm text-slate-600 md:text-base">
                        Constitution de la base de données et publication des premiers portraits.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white/90 p-5">
                      <p className="text-sm font-semibold uppercase tracking-wide text-french-blue">
                        Année 2
                      </p>
                      <p className="mt-2 text-sm text-slate-600 md:text-base">
                        Lancement du mentorat pilote et évaluation des besoins des lycéens.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white/90 p-5">
                      <p className="text-sm font-semibold uppercase tracking-wide text-french-blue">
                        Années 3-4
                      </p>
                      <p className="mt-2 text-sm text-slate-600 md:text-base">
                        Extension du réseau, conférences thématiques et rencontres annuelles des alumni.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white/90 p-5">
                      <p className="text-sm font-semibold uppercase tracking-wide text-french-blue">
                        Année 5
                      </p>
                      <p className="mt-2 text-sm text-slate-600 md:text-base">
                        Structuration d&apos;un réseau autonome et durable, piloté avec les alumni.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReseauAlumniMentorat;

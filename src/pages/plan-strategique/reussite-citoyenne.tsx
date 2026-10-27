import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

const PAGE_TITLE = 'Parcours de la Réussite citoyenne | PSD LFJP';

const UrneIcon = () => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="h-12 w-12"
  >
    <path d="M16 22h32l4 32H12l4-32Z" />
    <path d="M22 22v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
    <path d="M20 32h24" />
  </svg>
);

const MicroIcon = () => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="h-12 w-12"
  >
    <rect x="22" y="8" width="20" height="32" rx="10" />
    <path d="M32 40v8" />
    <path d="M20 32v2a12 12 0 0 0 24 0v-2" />
    <path d="M24 52h16" />
  </svg>
);

const GlobeIcon = () => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="h-12 w-12"
  >
    <circle cx="32" cy="32" r="20" />
    <path d="M12 32h40" />
    <path d="M32 12c6 6 10 12 10 20s-4 14-10 20c-6-6-10-12-10-20s4-14 10-20Z" />
    <path d="M22 18c4 2 10 2 12-4 4 10 12 6 12 14 0 4-6 4-6 8 0 6 6 4 6 10" />
  </svg>
);

const civicBlocks = [
  {
    title: 'Projets solidaires et participatifs',
    description:
      'Budgets participatifs, collectes solidaires, actions E3D : nos élèves conçoivent et portent des projets au service du bien commun.',
    icon: <UrneIcon />,
  },
  {
    title: "Modules de formation à l’engagement citoyen",
    description:
      'EMC, citoyenneté numérique, débats argumentés, formation des délégués : un apprentissage structuré pour développer esprit critique et sens des responsabilités.',
    icon: <MicroIcon />,
  },
  {
    title: 'Ancrage local et ouverture internationale',
    description:
      'Partenariats avec les institutions locales, participation aux commémorations et aux projets AEFE comme Ambassadeurs en herbe.',
    icon: <GlobeIcon />,
  },
];

const objectives = [
  'Développer l’esprit critique, le sens des responsabilités et la culture du débat.',
  'Favoriser la participation active des élèves à la vie collective et associative.',
  'Encourager la solidarité et les projets au service du bien commun.',
  'Préparer chaque élève à devenir un acteur engagé de la société locale et mondiale.',
];

const skills = [
  'Coopérer et agir pour l’intérêt collectif.',
  'Connaître et respecter les règles, droits et devoirs.',
  'Exercer son jugement critique et sa liberté d’expression.',
  'Adopter des pratiques citoyennes responsables et inclusives.',
];

const ReussiteCitoyenne = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-raleway text-slate-900">
      <Navbar showLogo />

      <main>
        <section className="bg-gradient-to-br from-french-blue via-blue-700 to-blue-900 py-16 text-white md:py-24">
          <div className="container mx-auto px-6">
            <p className="text-sm uppercase tracking-widest text-white">Axe 4 · Réussites citoyennes</p>
            <h1 className="mt-4 text-3xl font-playfair font-bold leading-tight md:text-5xl">
              Parcours de la Réussite citoyenne
            </h1>
            <p className="mt-6 max-w-3xl text-base text-white/80 md:text-lg">
              Le Parcours de la Réussite citoyenne structure, de la maternelle à la terminale, l’éducation à l’engagement,
              au débat et à la solidarité. Il s’aligne sur le cadre du parcours citoyen de l’Éducation nationale.
            </p>
          </div>
        </section>

        <div className="container mx-auto flex gap-2 px-6 py-4">
          <Button variant="outline" onClick={() => navigate('/plan-strategique')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            <Home className="mr-2 h-4 w-4" />
            Accueil
          </Button>
        </div>

        <section className="bg-white py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {civicBlocks.map((block) => (
                <article
                  key={block.title}
                  className="flex h-full flex-col rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/40 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-within:-translate-y-1 focus-within:shadow-lg"
                >
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-french-blue">
                    {block.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-french-blue">{block.title}</h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-700 md:text-base">{block.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="objectifs" className="bg-slate-50 py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="grid gap-10 lg:grid-cols-[2fr,1fr]">
              <article className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-blue-100">
                <h2 id="objectifs" className="text-2xl font-playfair font-bold text-french-blue">
                  Objectifs du parcours
                </h2>
                <ul className="mt-6 space-y-4 text-base leading-relaxed text-slate-700">
                  {objectives.map((objective) => (
                    <li key={objective} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-french-blue">
                        •
                      </span>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <aside className="flex flex-col justify-between gap-6 rounded-2xl border border-blue-100 bg-white p-8 shadow-sm">
                <div>
                  <h2 className="text-lg font-semibold text-french-blue">Compétences visées</h2>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700 md:text-base">
                    {skills.map((skill) => (
                      <li key={skill} className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-french-blue">
                          ✓
                        </span>
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl bg-blue-50 p-5 text-sm text-blue-900">
                  <p className="font-semibold uppercase tracking-wide text-french-blue">Citation</p>
                  <p className="mt-3 italic">
                    « L’école doit faire partager aux élèves les valeurs de la République. » — Code de l’éducation, art. L.121-1
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="bg-white py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-8 shadow-sm">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-playfair font-bold text-french-blue">Ressource à découvrir</h2>
                  <p className="mt-2 max-w-2xl text-sm text-slate-700 md:text-base">
                    Pour approfondir la mise en œuvre du parcours citoyen, retrouvez les ressources officielles proposées par l’Éducation nationale.
                  </p>
                </div>
                <Button asChild className="self-start bg-french-blue px-6 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300">
                  <a href="https://eduscol.education.fr/" target="_blank" rel="noreferrer noopener">
                    En savoir plus sur le parcours citoyen (Eduscol)
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ReussiteCitoyenne;

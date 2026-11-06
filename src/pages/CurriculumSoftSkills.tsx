import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

interface CycleData {
  id: string;
  label: string;
  emoji: string;
  title: string;
  competenciesTitle: string;
  competencies: string[];
  dispositifsTitle: string;
  dispositifs: string[];
}

interface OverviewRow {
  cycle: string;
  competences: string;
  dispositifs: string;
}

const CurriculumSoftSkills = () => {
  const cycles: CycleData[] = useMemo(
    () => [
      {
        id: 'cycle1',
        label: 'Cycle 1 (PS–GS)',
        emoji: '🎈',
        title: 'Cycle 1 – Entrer en communication',
        competenciesTitle: 'Compétences attendues fin GS',
        competencies: [
          'Oser prendre la parole devant le groupe.',
          'Décrire une image ou un vécu avec un vocabulaire simple.',
          'Respecter la parole d’autrui (écoute, tour de parole).'
        ],
        dispositifsTitle: 'Dispositifs',
        dispositifs: [
          'Rituel « présenter un objet » hebdomadaire.',
          'Jeux de rôle et théâtre de marionnettes.',
          'Cercle de parole quotidien.',
          'Valorisation par petites vidéos partagées en classe.'
        ]
      },
      {
        id: 'cycle2',
        label: 'Cycle 2 (CP–CE2)',
        emoji: '📚',
        title: 'Cycle 2 – Structurer l’expression',
        competenciesTitle: 'Compétences attendues fin CE2',
        competencies: [
          'Lire un texte court avec fluidité et intonation.',
          'Exprimer un avis simple avec arguments.',
          'Se présenter clairement à l’oral.'
        ],
        dispositifsTitle: 'Dispositifs',
        dispositifs: [
          'Lectures à voix haute (coin lecture, bibliothèque).',
          'Débats philo adaptés autour de questions simples.',
          '« Radio de classe » enregistrée une fois par mois.',
          'Jeux de scène courts pour restituer des contes.'
        ]
      },
      {
        id: 'cycle3',
        label: 'Cycle 3 (CM1–6e)',
        emoji: '🎭',
        title: 'Cycle 3 – Confiance et argumentation',
        competenciesTitle: 'Compétences attendues fin 6e',
        competencies: [
          'Conduire un exposé structuré (introduction, développement, conclusion).',
          'Utiliser une voix audible et une posture adaptée.',
          'Poser des questions pertinentes à un pair.'
        ],
        dispositifsTitle: 'Dispositifs',
        dispositifs: [
          'Exposés oraux réguliers (sciences, histoire).',
          'Débat réglé une fois par trimestre.',
          'Journal scolaire ou blog collaboratif.',
          'Théâtre d’improvisation en atelier péri-éducatif.'
        ]
      },
      {
        id: 'cycle4',
        label: 'Cycle 4 (5e–3e)',
        emoji: '💬',
        title: 'Cycle 4 – Argumenter et convaincre',
        competenciesTitle: 'Compétences attendues fin 3e',
        competencies: [
          'Argumenter dans un débat contradictoire.',
          'Adapter son registre de langue à la situation.',
          'Gérer ses émotions et son stress lors d’une prise de parole.'
        ],
        dispositifsTitle: 'Dispositifs',
        dispositifs: [
          'Club débat avec motions mensuelles.',
          'Concours d’éloquence collège.',
          'Méthodes de gestion du stress intégrées aux heures de vie de classe.',
          'Participation au projet Ambassadeurs en Herbe (AAEH) – sélections collège.'
        ]
      },
      {
        id: 'lycee',
        label: 'Lycée (2nde–Tle)',
        emoji: '🎤',
        title: 'Lycée – Maîtriser l’art oratoire',
        competenciesTitle: 'Compétences attendues fin Terminale',
        competencies: [
          'Produire un discours construit, nuancé et convaincant.',
          'Maîtriser les techniques oratoires (regard, gestes, voix).',
          'Répondre à un jury dans un temps limité.',
          'Développer une pensée critique face à un sujet complexe.'
        ],
        dispositifsTitle: 'Dispositifs',
        dispositifs: [
          'Ateliers « oral du bac » dès la Seconde (coaching posture et structure).',
          'Concours d’éloquence lycée et participation AAEH (niveau lycée).',
          'Clubs journalistiques et projets vidéo (interviews, reportages).',
          'Leadership : organisation d’événements par les élèves (forums, semaines thématiques).',
          'Certification interne « Badge Compétences Oratoires » (bronze/argent/or).'
        ]
      }
    ],
    []
  );

  const overview: OverviewRow[] = useMemo(
    () => [
      { cycle: 'PS–GS', competences: 'Oser parler, écouter', dispositifs: 'Objets à présenter, marionnettes, rituels' },
      { cycle: 'CP–CE2', competences: 'Lire et s’exprimer', dispositifs: 'Lectures, débats philo, radio de classe' },
      { cycle: 'CM1–6e', competences: 'Structurer un discours', dispositifs: 'Exposés, débats réglés, journal scolaire' },
      { cycle: '5e–3e', competences: 'Argumenter, gérer stress', dispositifs: 'Club débat, concours, gestion stress, AAEH' },
      { cycle: 'Lycée', competences: 'Convaincre, esprit critique', dispositifs: 'Oral bac, concours, leadership, badges' }
    ],
    []
  );

  const [activeTab, setActiveTab] = useState<string>(cycles[0]?.id ?? 'cycle1');

  return (
    <div className="min-h-screen flex flex-col font-raleway">
      <Navbar showLogo={true} />

      <div className="bg-gradient-to-r from-french-blue to-blue-700 text-white py-20 md:py-28">
        <div className="container mx-auto px-6">
          <p className="uppercase tracking-[0.3em] text-sm md:text-base opacity-80 mb-4">Curriculum vertical</p>
          <h1 className="text-3xl md:text-5xl font-playfair font-bold mb-4">Soft Skills &amp; Éloquence</h1>
          <p className="text-lg md:text-xl max-w-3xl font-light">
            De la petite section à la terminale, un parcours progressif pour former des élèves confiants,
            responsables et éloquents.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 flex flex-wrap gap-3">
        <Button
          variant="outline"
          className="bg-white text-french-blue border-french-blue hover:bg-french-blue hover:text-white focus-visible:ring-french-blue"
          asChild
        >
          <Link to="/plan-strategique" state={{ axe: 'axe4' }}>
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

      <main className="flex-1 bg-gray-50">
        <section className="softskills" aria-labelledby="softskills-title">
          <div className="max-w-5xl mx-auto">
            <header className="text-center mb-10">
              <h2 id="softskills-title" className="text-2xl md:text-3xl font-playfair font-bold text-french-blue mb-4">
                Curriculum des compétences transversales et de l’éloquence
              </h2>
              <p className="text-gray-600">
                Une progression verticale PS → Terminale articulée autour des compétences oratoires, de l’écoute active
                et de la pensée critique.
              </p>
            </header>

            <div className="tabs" role="tablist" aria-label="Cycles du curriculum Soft Skills">
              {cycles.map((cycle) => (
                <button
                  key={cycle.id}
                  type="button"
                  className={`tab${activeTab === cycle.id ? ' active' : ''}`}
                  onClick={() => setActiveTab(cycle.id)}
                  role="tab"
                  id={`${cycle.id}-tab`}
                  aria-selected={activeTab === cycle.id}
                  aria-controls={`${cycle.id}-panel`}
                >
                  {cycle.label}
                </button>
              ))}
            </div>

            {cycles.map((cycle) => (
              <article
                key={cycle.id}
                id={`${cycle.id}-panel`}
                role="tabpanel"
                aria-labelledby={`${cycle.id}-tab`}
                className={`tab-content${activeTab === cycle.id ? ' active' : ''}`}
              >
                <h3 className="text-xl font-playfair font-semibold text-french-blue mb-4">
                  <span role="img" aria-label={cycle.label} className="mr-2">
                    {cycle.emoji}
                  </span>
                  {cycle.title}
                </h3>
                <div className="space-y-6 text-gray-700">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">{cycle.competenciesTitle}</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      {cycle.competencies.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">{cycle.dispositifsTitle}</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      {cycle.dispositifs.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-6">
            <header className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-playfair font-bold text-french-blue mb-3">
                Vue d’ensemble de la progression verticale
              </h2>
              <p className="text-gray-600">
                Les compétences et dispositifs clés se renforcent tout au long du parcours.
              </p>
            </header>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 bg-white shadow-sm rounded-xl">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Cycle
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Compétences finales
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Dispositifs clés
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                  {overview.map((row) => (
                    <tr key={row.cycle}>
                      <td className="px-4 py-3 font-semibold text-french-blue">{row.cycle}</td>
                      <td className="px-4 py-3">{row.competences}</td>
                      <td className="px-4 py-3">{row.dispositifs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CurriculumSoftSkills;

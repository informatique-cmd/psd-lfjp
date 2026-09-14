import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, TrendingUp, Calculator } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';

const PAGE_TITLE = 'DNBi – Extension de la Section Internationale Américaine au collège | PSD LFJP';

const organisationPedagogique = [
  {
    title: 'Niveaux concernés',
    description: 'Tous les niveaux du collège (6e, 5e, 4e, 3e) pour garantir la continuité du parcours bilingue.',
  },
  {
    title: 'Volume horaire SIA',
    description: '6 heures hebdomadaires par niveau, soit 24 heures dédiées à la SIA pour l’ensemble du collège.',
  },
  {
    title: 'Enseignements mobilisés',
    description:
      'Langue et littérature anglaises, discipline non linguistique (histoire-géographie – programme américain) et projets interdisciplinaires et culturels.',
  },
];

const besoinsEnseignement = [
  {
    element: 'Anglais « classique »',
    volume: '52 h',
    commentaire: 'Volume stable par rapport à l’année 2025-2026.',
  },
  {
    element: 'SIA collège',
    volume: '24 h',
    commentaire: 'Nouvelle ouverture sur les quatre niveaux.',
  },
  {
    element: 'Total besoin',
    volume: '76 h',
    commentaire: 'Regroupe anglais classique et SIA.',
  },
  {
    element: 'Capacité actuelle (3 ETP)',
    volume: '60 h',
    commentaire: 'Capacité insuffisante pour couvrir l’ensemble des besoins.',
  },
  {
    element: 'Capacité après recrutement (4 ETP)',
    volume: '80 h',
    commentaire: 'Couverture intégrale avec une marge de 4 heures.',
  },
];

const synthese = [
  {
    annee: '2027-2028',
    niveaux: '6e à 3e',
    heures: '24 h',
    etp: '4',
    recrutement: '+1 ETP',
    marge: '4 h',
    cout: '≈ 20 M FCFA',
  },
];

const soutien = [
  '1 h de soutien individualisé par niveau (6e à 3e).',
  'Aucune surcharge pour les enseignants grâce à la marge dégagée.',
  'Maintien de conditions d’apprentissage équilibrées pour tous les élèves.',
];

const gradeFields = [
  { key: 'sixieme', label: '6e' },
  { key: 'cinquieme', label: '5e' },
  { key: 'quatrieme', label: '4e' },
  { key: 'troisieme', label: '3e' },
] as const;

type GradeKey = (typeof gradeFields)[number]['key'];

const numberFormatter = new Intl.NumberFormat('fr-FR');

const DNBi: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Record<GradeKey, number>>({
    sixieme: 18,
    cinquieme: 16,
    quatrieme: 16,
    troisieme: 17,
  });
  const [tuitionSurcharge, setTuitionSurcharge] = useState(300_000);
  const [teacherCost, setTeacherCost] = useState(20_000_000);

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  const totalStudents = useMemo(
    () =>
      gradeFields.reduce((acc, field) => {
        const value = students[field.key];
        return acc + (Number.isFinite(value) ? value : 0);
      }, 0),
    [students]
  );

  const totalRevenue = useMemo(() => totalStudents * tuitionSurcharge, [totalStudents, tuitionSurcharge]);
  const balance = useMemo(() => totalRevenue - teacherCost, [totalRevenue, teacherCost]);

  const breakevenStudents = useMemo(() => {
    if (tuitionSurcharge <= 0) {
      return undefined;
    }

    return Math.ceil(teacherCost / tuitionSurcharge);
  }, [teacherCost, tuitionSurcharge]);

  const handleStudentChange = (key: GradeKey) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(event.target.value, 10);

    setStudents((prev) => ({
      ...prev,
      [key]: Number.isNaN(value) ? 0 : Math.max(0, value),
    }));
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-raleway text-slate-900">
      <Navbar showLogo />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-french-blue via-blue-700 to-blue-900 py-16 text-white md:py-24">
          <div className="container mx-auto px-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">DNBi – Axe 2</p>
            <h1 className="mt-4 text-3xl font-playfair font-bold leading-tight md:text-5xl">
              Extension de la Section Internationale Américaine au collège
            </h1>
            <p className="mt-6 max-w-3xl text-base text-white/80 md:text-lg">
              À la rentrée 2027-2028, la Section Internationale Américaine s’ouvre sur l’ensemble du collège. Cette étape clé du
              parcours DNBi crée un continuum bilingue de l’école primaire jusqu’au lycée.
            </p>
          </div>
        </section>

        <div className="container mx-auto flex gap-2 px-6 py-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            <Home className="mr-2 h-4 w-4" />
            Accueil
          </Button>
        </div>

        <section className="-mt-10 pb-8 md:pb-12">
          <div className="container mx-auto px-6">
            <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-blue-100 md:p-10">
              <div className="grid gap-8 md:grid-cols-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-900">Note de synthèse</p>
                  <p className="mt-2 text-2xl font-playfair font-bold text-french-blue">
                    Déploiement SIA collège – rentrée 2027-2028
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-900">Objectif</p>
                  <p className="mt-2 text-base text-slate-700">
                    Structurer un parcours bilingue cohérent du primaire au secondaire et préparer l’accès au BFI.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-900">Ressource clé</p>
                  <p className="mt-2 text-base text-slate-700">
                    Création d’un quatrième poste d’enseignant d’anglais afin d’assurer les 24 heures SIA hebdomadaires.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-playfair font-bold text-french-blue md:text-3xl">1. Contexte</h2>
                <p className="mt-4 text-base text-slate-700">
                  Après l’ouverture de la SIA au primaire en 2026-2027, le Lycée Français Jacques Prévert étend le dispositif à tous
                  les niveaux du collège. Cette montée en puissance marque le lancement effectif du parcours bilingue complet au
                  secondaire, en cohérence avec l’ambition DNBi de faire rayonner le plurilinguisme.
                </p>
              </div>
              <div className="rounded-3xl bg-blue-50 p-8 text-blue-900">
                <h3 className="text-xl font-playfair font-bold">Un continuum sécurisé</h3>
                <p className="mt-4 text-base text-blue-900/80">
                  Les élèves bénéficient d’un accompagnement linguistique soutenu et d’une progression harmonisée jusqu’au BFI.
                  La DNBi garantit la cohérence pédagogique entre les cycles et sécurise les apprentissages sur le long terme.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="mb-8 max-w-3xl">
              <h2 className="text-2xl font-playfair font-bold text-french-blue md:text-3xl">2. Organisation pédagogique</h2>
              <p className="mt-4 text-base text-slate-700">
                La DNBi organise un environnement d’apprentissage immersif combinant langue, littérature, discipline non linguistique et projets culturels.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {organisationPedagogique.map((item) => (
                <Card key={item.title} className="border-blue-100 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-french-blue">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-700">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="grid gap-8 md:grid-cols-[3fr,2fr]">
              <div>
                <h2 className="text-2xl font-playfair font-bold text-french-blue md:text-3xl">3. Besoins en moyens d’enseignement</h2>
                <p className="mt-4 text-base text-slate-700">
                  Les besoins horaires soulignent la nécessité de recruter un enseignant supplémentaire pour couvrir la montée en charge de la SIA.
                </p>
                <div className="mt-6 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
                  <table className="min-w-full divide-y divide-blue-100 text-left text-sm">
                    <thead className="bg-blue-50 text-xs font-semibold uppercase tracking-wide text-blue-900">
                      <tr>
                        <th className="px-4 py-3">Élément</th>
                        <th className="px-4 py-3">Volume horaire</th>
                        <th className="px-4 py-3">Commentaire</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-50 text-slate-700">
                      {besoinsEnseignement.map((row) => (
                        <tr key={row.element} className="hover:bg-blue-50/50">
                          <td className="px-4 py-3 font-medium text-blue-900">{row.element}</td>
                          <td className="px-4 py-3">{row.volume}</td>
                          <td className="px-4 py-3">{row.commentaire}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="space-y-6">
                <Card className="border-blue-100 bg-blue-900 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="h-5 w-5" />
                      Marge horaire préservée
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-white/80">
                    {soutien.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-white" aria-hidden="true" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card className="border-blue-100 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-french-blue">4. Utilisation de la marge horaire</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-700">
                    <p>
                      Les 4 heures résiduelles financent un dispositif de soutien individualisé sans impacter la charge des
                      enseignants. Chaque niveau du collège bénéficie d’une heure de consolidation ciblée.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-playfair font-bold text-french-blue md:text-3xl">5. Impact financier</h2>
                <p className="mt-4 text-base text-slate-700">
                  Le recrutement d’un enseignant d’anglais supplémentaire représente un coût annuel estimé à 20&nbsp;000&nbsp;000 FCFA. Il est compensé par
                  un surcoût d’écolage spécifique à la SIA fixé à 300&nbsp;000 FCFA par élève et par an.
                </p>
                <div className="mt-6 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
                  <table className="min-w-full divide-y divide-blue-100 text-left text-sm">
                    <thead className="bg-blue-50 text-xs font-semibold uppercase tracking-wide text-blue-900">
                      <tr>
                        <th className="px-4 py-3">Poste supplémentaire</th>
                        <th className="px-4 py-3">Coût annuel estimé</th>
                        <th className="px-4 py-3">Financement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-50 text-slate-700">
                      <tr className="hover:bg-blue-50/50">
                        <td className="px-4 py-3 font-medium text-blue-900">1 ETP enseignant d’anglais</td>
                        <td className="px-4 py-3">≈ 20&nbsp;000&nbsp;000 FCFA/an</td>
                        <td className="px-4 py-3">Budget établissement</td>
                      </tr>
                      <tr className="hover:bg-blue-50/50">
                        <td className="px-4 py-3 font-medium text-blue-900">Surcoût SIA</td>
                        <td className="px-4 py-3">300&nbsp;000 FCFA/élève/an</td>
                        <td className="px-4 py-3">Participation des familles</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-playfair font-bold text-french-blue">6. Synthèse opérationnelle</h3>
                <div className="mt-6 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
                  <table className="min-w-full divide-y divide-blue-100 text-left text-sm">
                    <thead className="bg-blue-50 text-xs font-semibold uppercase tracking-wide text-blue-900">
                      <tr>
                        <th className="px-4 py-3">Année</th>
                        <th className="px-4 py-3">Niveaux</th>
                        <th className="px-4 py-3">Heures SIA</th>
                        <th className="px-4 py-3">ETP total</th>
                        <th className="px-4 py-3">Recrutement</th>
                        <th className="px-4 py-3">Marge</th>
                        <th className="px-4 py-3">Coût additionnel</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-50 text-slate-700">
                      {synthese.map((row) => (
                        <tr key={row.annee} className="hover:bg-blue-50/50">
                          <td className="px-4 py-3 font-medium text-blue-900">{row.annee}</td>
                          <td className="px-4 py-3">{row.niveaux}</td>
                          <td className="px-4 py-3">{row.heures}</td>
                          <td className="px-4 py-3">{row.etp}</td>
                          <td className="px-4 py-3">{row.recrutement}</td>
                          <td className="px-4 py-3">{row.marge}</td>
                          <td className="px-4 py-3">{row.cout}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-6 text-base text-slate-700">
                  L’équilibre financier est atteint à partir de 67 élèves inscrits en SIA au collège, assurant la couverture du coût
                  du poste supplémentaire tout en préservant les dispositifs de soutien.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-blue-100">
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-playfair font-bold text-french-blue md:text-3xl">Simulateur de point mort financier</h2>
                  <p className="mt-2 max-w-2xl text-sm text-slate-700 md:text-base">
                    Ajustez le nombre d’élèves par niveau, le surcoût d’écolage et la rémunération annuelle pour visualiser le seuil
                    d’équilibre entre dépenses et recettes de la SIA collège.
                  </p>
                </div>
                <Badge variant="secondary" className="flex items-center gap-2 bg-blue-50 text-french-blue">
                  <Calculator className="h-4 w-4" />
                  Outil DNBi
                </Badge>
              </div>

              <div className="grid gap-8 md:grid-cols-[2fr,3fr]">
                <div className="space-y-6">
                  <Card className="border-blue-100 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg text-french-blue">Paramétrage des effectifs</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {gradeFields.map((field) => (
                        <div key={field.key} className="space-y-2">
                          <Label htmlFor={`students-${field.key}`}>Nombre d’élèves en {field.label}</Label>
                          <Input
                            id={`students-${field.key}`}
                            type="number"
                            min={0}
                            value={students[field.key] ?? 0}
                            onChange={handleStudentChange(field.key)}
                            inputMode="numeric"
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-blue-100 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg text-french-blue">Paramètres financiers</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="tuition-surcharge">Surcoût SIA par élève (FCFA)</Label>
                        <Input
                          id="tuition-surcharge"
                          type="number"
                          min={0}
                          step={10_000}
                          value={tuitionSurcharge}
                          onChange={(event) => {
                            const value = Number.parseInt(event.target.value, 10);
                            setTuitionSurcharge(Number.isNaN(value) ? 0 : Math.max(0, value));
                          }}
                          inputMode="numeric"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="teacher-cost">Rémunération annuelle de l’enseignant (FCFA)</Label>
                        <Input
                          id="teacher-cost"
                          type="number"
                          min={0}
                          step={100_000}
                          value={teacherCost}
                          onChange={(event) => {
                            const value = Number.parseInt(event.target.value, 10);
                            setTeacherCost(Number.isNaN(value) ? 0 : Math.max(0, value));
                          }}
                          inputMode="numeric"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-blue-100 bg-blue-900 text-white">
                  <CardHeader>
                    <CardTitle className="text-xl font-playfair">Résultats de la simulation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 text-sm text-white/80 md:text-base">
                    <div className="flex items-center justify-between text-white">
                      <span>Total d’élèves SIA au collège</span>
                      <span className="text-2xl font-semibold">{numberFormatter.format(totalStudents)}</span>
                    </div>
                    <div className="flex items-center justify-between text-white">
                      <span>Recettes annuelles estimées</span>
                      <span className="text-2xl font-semibold">{numberFormatter.format(totalRevenue)} FCFA</span>
                    </div>
                    <div className="flex items-center justify-between text-white">
                      <span>Coût annuel du poste</span>
                      <span className="text-2xl font-semibold">{numberFormatter.format(teacherCost)} FCFA</span>
                    </div>
                    <div className="flex items-center justify-between text-white">
                      <span>Solde (recettes - coûts)</span>
                      <span className={`text-2xl font-semibold ${balance >= 0 ? 'text-emerald-300' : 'text-red-200'}`}>
                        {balance >= 0 ? '+' : ''}{numberFormatter.format(balance)} FCFA
                      </span>
                    </div>
                    <div className="rounded-2xl bg-blue-800/60 p-4 text-sm">
                      <p className="font-semibold text-white">Seuil de rentabilité</p>
                      {breakevenStudents !== undefined ? (
                        <p className="mt-2 text-white/80">
                          L’équilibre financier est atteint à partir de <strong>{breakevenStudents}</strong> élèves SIA au
                          collège avec le surcoût actuel.
                        </p>
                      ) : (
                        <p className="mt-2 text-white/80">
                          Indiquez un surcoût SIA strictement positif pour calculer le seuil de rentabilité.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8 text-blue-900 shadow-sm">
              <h2 className="text-2xl font-playfair font-bold md:text-3xl">Conclusion</h2>
              <p className="mt-4 text-base text-blue-900/80">
                L’extension de la Section Internationale Américaine au collège consolide la stratégie DNBi du Lycée Français Jacques
                Prévert. Le recrutement ciblé d’un enseignant garantit un déploiement équilibré du dispositif, sans impact négatif sur
                l’enseignement d’anglais classique et en maintenant les actions de soutien. Cette étape renforce l’attractivité de
                l’établissement et prépare sereinement la mise en œuvre du BFI.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default DNBi;

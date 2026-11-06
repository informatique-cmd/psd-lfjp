import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, TrendingUp, Calculator, PiggyBank } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';

const PAGE_TITLE = 'BFI – Déploiement du parcours lycée | PSD LFJP';

const organisationPedagogique = [
  {
    title: 'Niveaux concernés',
    description:
      'Ouverture simultanée de la Seconde SIA et des classes de Première et Terminale BFI à la rentrée 2028-2029 pour couvrir tout le lycée.',
  },
  {
    title: 'Volume horaire SIA/BFI',
    description:
      '6 heures hebdomadaires dédiées par niveau (langue, littérature, DNL et modules spécifiques BFI), soit 18 heures dès l’ouverture intégrale du lycée.',
  },
  {
    title: 'Enseignements mobilisés',
    description:
      'Langue et littérature américaine, histoire-géographie en DNL, renforcement linguistique, méthodologie et culture internationale.',
  },
];

const besoinsEnseignement = [
  {
    element: 'Anglais « classique »',
    volume: '52 h',
    commentaire: 'Volume stabilisé sur l’ensemble du secondaire.',
  },
  {
    element: 'SIA collège (maintien)',
    volume: '24 h',
    commentaire: 'Continuité du dispositif mis en place en 2027-2028.',
  },
  {
    element: 'SIA/BFI lycée',
    volume: '18 h',
    commentaire: 'Nouveau bloc horaire couvrant la Seconde SIA ainsi que les classes de Première et Terminale BFI.',
  },
  {
    element: 'Total besoin',
    volume: '94 h',
    commentaire: 'Exigences cumulées pour les parcours SIA et BFI.',
  },
  {
    element: 'Capacité actuelle (4 ETP)',
    volume: '80 h',
    commentaire: 'Capacité inférieure aux besoins identifiés.',
  },
  {
    element: 'Capacité après recrutement (5 ETP)',
    volume: '100 h',
    commentaire: 'Couverture intégrale avec une marge de 6 heures.',
  },
];

const utilisationMarge = [
  'Maintien des 4 h de soutien pour le collège, garantissant l’accompagnement linguistique des élèves.',
  'Création de 2 h de soutien en Seconde, Première et Terminale pour consolider la méthodologie et le niveau de langue.',
];

const equilibreFinancier = [
  {
    parametre: 'Surcoût total',
    valeur: '40 000 000 FCFA/an',
    interpretation: 'Deux postes d’anglais supplémentaires (collège puis lycée).',
  },
  {
    parametre: 'Surtaxe SIA/BFI',
    valeur: '300 000 FCFA/élève/an',
    interpretation: 'Contribution familiale dédiée au parcours international.',
  },
  {
    parametre: 'Équilibre 2028-2029 (7 niveaux 6e→Tle)',
    valeur: '≈ 23 élèves/groupe',
    interpretation: 'Seuil de rentabilité avec l’ouverture intégrale du lycée BFI.',
  },
  {
    parametre: 'Projection stabilisée (7 niveaux 6e→Tle)',
    valeur: '≈ 20 élèves/groupe',
    interpretation: 'Stabilité financière durable pour l’ensemble du secondaire.',
  },
];

const synthese = [
  {
    annee: '2028-2029',
    niveaux: '2nde à Tle BFI',
    heures: '18 h',
    etp: '5',
    recrutement: '+1 ETP',
    marge: '4 h collège + 2 h lycée',
    cout: '≈ 20 M FCFA',
  },
  {
    annee: 'À régime complet',
    niveaux: '6e à Tle',
    heures: '42 h',
    etp: '5',
    recrutement: '2 postes créés (2027-2028)',
    marge: '6 h de soutien total',
    cout: '≈ 40 M FCFA',
  },
];

const gradeFields = [
  { key: 'seconde', label: 'Seconde SIA' },
  { key: 'premiere', label: 'Première BFI' },
  { key: 'terminale', label: 'Terminale BFI' },
] as const;

type GradeKey = (typeof gradeFields)[number]['key'];

const numberFormatter = new Intl.NumberFormat('fr-FR');

const BFI: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Record<GradeKey, number>>({
    seconde: 24,
    premiere: 23,
    terminale: 22,
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

  const activeGroups = useMemo(
    () => gradeFields.filter((field) => (students[field.key] ?? 0) > 0).length || gradeFields.length,
    [students]
  );

  const averageStudentsPerGroup = useMemo(() => {
    if (activeGroups === 0) {
      return 0;
    }

    return totalStudents / activeGroups;
  }, [activeGroups, totalStudents]);

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
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">BFI – Axe 2</p>
            <h1 className="mt-4 text-3xl font-playfair font-bold leading-tight md:text-5xl">
              Déploiement du parcours BFI au lycée
            </h1>
            <p className="mt-6 max-w-3xl text-base text-white/80 md:text-lg">
              À la rentrée 2028-2029, le Lycée Français Jacques Prévert finalise le continuum bilingue en ouvrant simultanément
              la Seconde SIA et l’ensemble du cycle Baccalauréat Français International jusqu’en Terminale.
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
                    Ouverture BFI – rentrée 2028-2029
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-900">Objectif</p>
                  <p className="mt-2 text-base text-slate-700">
                    Offrir un parcours bilingue complet de la 6e à la Terminale et sécuriser la préparation au diplôme BFI.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-900">Ressource clé</p>
                  <p className="mt-2 text-base text-slate-700">
                    Recrutement d’un cinquième enseignant d’anglais pour couvrir les 18 heures hebdomadaires SIA/BFI au lycée.
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
                  Après l’ouverture réussie de la Section Internationale Américaine au collège en 2027-2028, le Lycée Français
                  Jacques Prévert franchit la dernière étape avec la mise en œuvre du BFI. Cette évolution garantit un continuum
                  bilingue et interculturel du primaire à la Terminale et consolide l’attractivité de l’établissement.
                </p>
              </div>
              <div className="rounded-3xl bg-blue-50 p-8 text-blue-900">
                <h3 className="text-xl font-playfair font-bold">Un dispositif stabilisé</h3>
                <p className="mt-4 text-base text-blue-900/80">
                  Le recrutement progressif de deux enseignants d’anglais (2027 puis 2028) sécurise les horaires et la qualité
                  pédagogique sur l’ensemble des niveaux.
                </p>
                <p className="mt-4 text-base text-blue-900/80">
                  La Terminale BFI est intégrée dès 2028-2029, assurant une préparation continue aux études supérieures
                  internationales.
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
                L’ouverture du BFI renforce l’approche bilingue autour de la langue, de la littérature, de la DNL et d’une
                préparation méthodologique spécifique aux exigences internationales.
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
                  Les besoins horaires confirment la nécessité de créer un cinquième poste pour absorber l’extension du parcours
                  BFI tout en conservant les soutiens au collège.
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
                      Utilisation de la marge horaire
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-white/80">
                    {utilisationMarge.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-white" aria-hidden="true" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card className="border-blue-100 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-french-blue">
                      <PiggyBank className="h-5 w-5" />
                      Recrutement ciblé
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-700">
                      L’embauche d’un cinquième enseignant d’anglais (1 ETP) est budgétée à 20 000 000 FCFA/an et assure la
                      montée en charge du lycée BFI.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="mb-6 max-w-3xl">
              <h2 className="text-2xl font-playfair font-bold text-french-blue md:text-3xl">4. Équilibre financier</h2>
              <p className="mt-4 text-base text-slate-700">
                Les indicateurs ci-dessous mettent en évidence le seuil de rentabilité lié au double recrutement engagé entre
                2027 et 2028.
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-blue-100 text-left text-sm">
                <thead className="bg-blue-50 text-xs font-semibold uppercase tracking-wide text-blue-900">
                  <tr>
                    <th className="px-4 py-3">Paramètre</th>
                    <th className="px-4 py-3">Valeur</th>
                    <th className="px-4 py-3">Interprétation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50 text-slate-700">
                  {equilibreFinancier.map((row) => (
                    <tr key={row.parametre} className="hover:bg-blue-50/50">
                      <td className="px-4 py-3 font-medium text-blue-900">{row.parametre}</td>
                      <td className="px-4 py-3">{row.valeur}</td>
                      <td className="px-4 py-3">{row.interpretation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-playfair font-bold text-french-blue md:text-3xl">5. Synthèse</h2>
                <p className="mt-4 text-base text-slate-700">
                  Les projections confirment la viabilité financière du dispositif dès 2028-2029 et sa consolidation à régime
                  complet grâce à la surtaxe dédiée.
                </p>
              </div>
              <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-blue-100 text-left text-sm">
                  <thead className="bg-blue-50 text-xs font-semibold uppercase tracking-wide text-blue-900">
                    <tr>
                      <th className="px-4 py-3">Année</th>
                      <th className="px-4 py-3">Niveaux</th>
                      <th className="px-4 py-3">Heures</th>
                      <th className="px-4 py-3">ETP</th>
                      <th className="px-4 py-3">Recrutement</th>
                      <th className="px-4 py-3">Marge</th>
                      <th className="px-4 py-3">Coût</th>
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
            </div>
          </div>
        </section>

        <section className="bg-white py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-blue-100">
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-playfair font-bold text-french-blue md:text-3xl">Simulateur de point mort financier</h2>
                  <p className="mt-2 max-w-2xl text-sm text-slate-700 md:text-base">
                    Ajustez les effectifs des classes de Seconde, Première et Terminale BFI, ainsi que les paramètres financiers,
                    pour visualiser le seuil d’équilibre du parcours bilingue lycée.
                  </p>
                </div>
                <Badge variant="secondary" className="flex items-center gap-2 bg-blue-50 text-french-blue">
                  <Calculator className="h-4 w-4" />
                  Outil BFI
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
                        <Label htmlFor="tuition-surcharge">Surtaxe SIA/BFI par élève (FCFA)</Label>
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
                        <Label htmlFor="teacher-cost">Coût annuel du dispositif (FCFA)</Label>
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
                      <span>Total d’élèves SIA/BFI lycée</span>
                      <span className="text-2xl font-semibold">{numberFormatter.format(totalStudents)}</span>
                    </div>
                    <div className="flex items-center justify-between text-white">
                      <span>Recettes annuelles estimées</span>
                      <span className="text-2xl font-semibold">{numberFormatter.format(totalRevenue)} FCFA</span>
                    </div>
                    <div className="flex items-center justify-between text-white">
                      <span>Coût annuel du dispositif</span>
                      <span className="text-2xl font-semibold">{numberFormatter.format(teacherCost)} FCFA</span>
                    </div>
                    <div className="flex items-center justify-between text-white">
                      <span>Solde (recettes - coûts)</span>
                      <span className={`text-2xl font-semibold ${balance >= 0 ? 'text-emerald-300' : 'text-red-200'}`}>
                        {balance >= 0 ? '+' : ''}
                        {numberFormatter.format(balance)} FCFA
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-white">
                      <span>Moyenne par groupe actif</span>
                      <span className="text-2xl font-semibold">
                        {Number.isFinite(averageStudentsPerGroup)
                          ? numberFormatter.format(Math.round(averageStudentsPerGroup))
                          : '—'}
                      </span>
                    </div>
                    <div className="rounded-2xl bg-blue-800/60 p-4 text-sm">
                      <p className="font-semibold text-white">Seuil de rentabilité</p>
                      {breakevenStudents !== undefined ? (
                        <p className="mt-2 text-white/80">
                          L’équilibre financier est atteint à partir de <strong>{breakevenStudents}</strong> élèves sur l’ensemble
                          des groupes SIA/BFI avec les paramètres actuels.
                        </p>
                      ) : (
                        <p className="mt-2 text-white/80">
                          Indiquez une surtaxe strictement positive pour calculer le seuil de rentabilité.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="rounded-3xl bg-blue-50 p-8 text-blue-900">
              <h2 className="text-2xl font-playfair font-bold md:text-3xl">6. Conclusion</h2>
              <p className="mt-4 text-base text-blue-900/80">
                L’année 2028-2029 parachève le déploiement du parcours bilingue du LFJP. Le recrutement complémentaire garantit
                les 18 heures hebdomadaires nécessaires, préserve les soutiens pédagogiques et sécurise l’équilibre financier grâce
                à une moyenne cible de 20 à 23 élèves par groupe. La Terminale BFI est opérationnelle dès 2028-2029 pour assurer
                la continuité totale jusqu’au diplôme international.
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

export default BFI;

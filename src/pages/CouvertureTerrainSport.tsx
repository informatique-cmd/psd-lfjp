import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Building,
  Table,
  BarChart3,
  Layers,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Home
} from 'lucide-react';

const offers = [
  {
    name: 'Entreprise A',
    surface: '1 008',
    total: '71 614 595',
    unit: '70 100',
    details: 'Poteaux béton 8 m, supports PV inclus'
  },
  {
    name: 'Entreprise B',
    surface: '1 008',
    total: '72 440 595',
    unit: '71 900',
    details: 'Poteaux mixtes béton 3 m + acier, supports PV inclus'
  },
  {
    name: 'Entreprise C',
    surface: '1 008',
    total: '74 210 595',
    unit: '73 600',
    details: 'Charpente complète, délais 75 j'
  },
  {
    name: 'Entreprise D',
    surface: '1 008',
    total: '64 390 188',
    unit: '63 900',
    details: 'Charpente + semelles + supports PV'
  },
  {
    name: 'Entreprise E',
    surface: '989',
    total: '76 522 678',
    unit: '77 400',
    details: 'Charpente complète + étanchéité, supports PV non précisés'
  }
];

const comparativeCriteria = [
  {
    label: 'Dimensions',
    observation:
      '24 × 42 m ou 43 × 23 m selon les variantes. Harmonisation nécessaire avant choix définitif.'
  },
  {
    label: 'Matériaux',
    observation:
      'Bac acier/aluzinc 0,45 mm pour toutes. Recommandation : envisager 0,5–0,63 mm pour meilleure résistance.'
  },
  {
    label: 'Poteaux et génie civil',
    observation:
      'Béton ou mixte acier-béton selon les variantes. Toutes incluent semelles et longrines BA.'
  },
  {
    label: 'Supports photovoltaïques',
    observation:
      'Intégrés pour les offres A, B, C, D. Non mentionnés pour l’offre E.'
  },
  {
    label: 'Étanchéité',
    observation:
      "Détail explicite uniquement dans l’offre E. Les autres nécessitent clarification des accessoires et joints."
  },
  {
    label: 'Traitement anticorrosion',
    observation:
      'Simple antirouille dans certaines offres ; exiger précisions (norme ISO 12944, galvanisation éventuelle).'
  },
  {
    label: 'Délais',
    observation: '75 à 90 jours selon les variantes. Aucun délai contractuel pour certaines offres.'
  },
  {
    label: 'Modalités de paiement',
    observation: 'De 45 % à 60 % d’acompte. Impacts trésorerie à considérer.'
  }
];

const ranking = [
  {
    position: '1',
    offer: 'Entreprise D',
    cost: '63 900',
    pv: 'Oui',
    comment: 'Meilleur rapport coût/prestations, mais anticorrosion standard'
  },
  {
    position: '2',
    offer: 'Entreprise A',
    cost: '70 100',
    pv: 'Oui',
    comment: 'Structure claire et bien documentée'
  },
  {
    position: '3',
    offer: 'Entreprise B',
    cost: '71 900',
    pv: 'Oui',
    comment: 'Variante mixte avec portiques acier'
  },
  {
    position: '4',
    offer: 'Entreprise C',
    cost: '73 600',
    pv: 'Oui',
    comment: 'Délais les plus courts'
  },
  {
    position: '5',
    offer: 'Entreprise E',
    cost: '77 400',
    pv: 'Non précisé',
    comment: 'Étanchéité détaillée, mais coût élevé'
  }
];

const riskPoints = [
  'Hauteur libre et débords à confirmer sur plans (24×42 m ≠ 43×23 m).',
  'Compatibilité photovoltaïque : notes de calcul nécessaires (charges permanentes + vent/pluie).',
  'Épaisseur des tôles à renforcer pour la durabilité.',
  'Métrés de bardage incohérents : recalcul demandé.',
  'Système de peinture à préciser : cycle complet, durée de protection, garantie.',
  'Gestion des eaux pluviales : dimensionnement et évacuation à vérifier.',
  'Garanties : exiger pénalités de retard et attestations décennales.'
];

const CouvertureTerrainSport = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-raleway">
      <Navbar showLogo={true} />

      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 text-white py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <Building className="h-14 w-14" />
            <div>
              <h1 className="text-3xl md:text-5xl font-playfair font-bold">Couverture du terrain de sport</h1>
              <p className="text-lg md:text-2xl text-slate-200 mt-2">
                Analyse comparative des propositions pour l’abri du terrain de handball
              </p>
            </div>
          </div>
          <p className="max-w-3xl text-base md:text-lg text-slate-100">
            Cette synthèse présente les cinq offres reçues pour la construction d’une couverture métallique
            intégrant la charpente, la couverture, le génie civil et les options photovoltaïques. Elle éclaire les
            choix budgétaires et techniques afin de sélectionner la proposition la plus adaptée aux ambitions du PSD.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-4 flex gap-2">
        <Button variant="outline" onClick={() => navigate('/plan-strategique')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <Button variant="outline" onClick={() => navigate('/')}>
          <Home className="mr-2 h-4 w-4" />
          Accueil
        </Button>
      </div>

      <div className="flex-1 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6 py-12 space-y-10">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                <CardTitle className="text-2xl text-slate-900">1. Présentation générale</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                Cinq propositions ont été reçues pour couvrir le terrain de handball du lycée avec un abri métallique.
                Les surfaces considérées s’étendent de <strong>989 m²</strong> à <strong>1 008 m²</strong> selon les variantes.
              </p>
              <p>
                Toutes les offres incluent la <strong>charpente métallique</strong>, la <strong>couverture en bac acier ou aluzinc</strong>,
                des <strong>semelles en béton armé</strong> ainsi que des options de <strong>bardage</strong> et de
                <strong>supports photovoltaïques</strong> selon les cas.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Table className="h-8 w-8 text-blue-600" />
                <CardTitle className="text-2xl text-slate-900">2. Synthèse financière (TTC)</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 text-gray-700">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-100 text-sm uppercase tracking-wide text-slate-600">
                    <tr>
                      <th className="px-4 py-3 text-left">Offre</th>
                      <th className="px-4 py-3 text-left">Surface (m²)</th>
                      <th className="px-4 py-3 text-left">Montant total TTC (FCFA)</th>
                      <th className="px-4 py-3 text-left">Prix unitaire TTC (FCFA/m²)</th>
                      <th className="px-4 py-3 text-left">Particularités</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {offers.map((offer) => (
                      <tr key={offer.name}>
                        <td className="px-4 py-3 font-semibold text-slate-800">{offer.name}</td>
                        <td className="px-4 py-3">{offer.surface}</td>
                        <td className="px-4 py-3">{offer.total}</td>
                        <td className="px-4 py-3">{offer.unit}</td>
                        <td className="px-4 py-3">{offer.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="rounded-xl bg-slate-100 p-4 text-sm text-slate-700">
                <p className="font-semibold">Option bardage (Entreprises A–C)</p>
                <p>
                  Surface annoncée : <strong>500 m²</strong> pour un montant de <strong>10 561 000 FCFA</strong>, soit environ
                  21 000–32 000 FCFA/m². Une vérification du métrage est requise (périmètre réel estimé à 330 m²).
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Layers className="h-8 w-8 text-indigo-600" />
                <CardTitle className="text-2xl text-slate-900">3. Éléments techniques comparés</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-100 text-sm uppercase tracking-wide text-slate-600">
                    <tr>
                      <th className="px-4 py-3 text-left">Critère</th>
                      <th className="px-4 py-3 text-left">Observations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {comparativeCriteria.map((criterion) => (
                      <tr key={criterion.label}>
                        <td className="px-4 py-3 font-semibold text-slate-800">{criterion.label}</td>
                        <td className="px-4 py-3">{criterion.observation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-amber-600" />
                <CardTitle className="text-2xl text-slate-900">4. Classement par coût unitaire TTC</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-100 text-sm uppercase tracking-wide text-slate-600">
                    <tr>
                      <th className="px-4 py-3 text-left">Rang</th>
                      <th className="px-4 py-3 text-left">Offre</th>
                      <th className="px-4 py-3 text-left">Coût unitaire (FCFA/m²)</th>
                      <th className="px-4 py-3 text-left">Supports PV</th>
                      <th className="px-4 py-3 text-left">Commentaire</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {ranking.map((item) => (
                      <tr key={item.position}>
                        <td className="px-4 py-3 font-semibold text-slate-800">{item.position}</td>
                        <td className="px-4 py-3">{item.offer}</td>
                        <td className="px-4 py-3">{item.cost}</td>
                        <td className="px-4 py-3">{item.pv}</td>
                        <td className="px-4 py-3">{item.comment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <CardTitle className="text-2xl text-slate-900">5. Points de vigilance</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5 text-gray-700">
                {riskPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-slate-100 text-slate-800 border-slate-200 text-xs uppercase tracking-wide">
                  Synthèse
                </Badge>
                <CardTitle className="text-2xl text-slate-900">6. Conclusion</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                L’analyse fait apparaître un <strong>écart de 20 %</strong> entre les offres les plus et les moins
                compétitives. L’<strong>offre D</strong> présente le meilleur rapport coût/prestations, sous réserve de renforcer le
                traitement anticorrosion et de confirmer les délais.
              </p>
              <p>
                Les <strong>offres A à C</strong> forment un groupe homogène intégrant les supports photovoltaïques et proposant des
                conditions de paiement raisonnables. L’<strong>offre E</strong>, plus complète sur l’étanchéité, reste significativement
                plus chère.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CouvertureTerrainSport;

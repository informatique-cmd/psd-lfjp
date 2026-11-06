import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const annualPlan = [
  { year: 'Année 1', secondary: 2, primary: 1, total: 3, budget: '5 250 000 FCFA' },
  { year: 'Année 2', secondary: 2, primary: 1, total: 3, budget: '5 250 000 FCFA' },
  { year: 'Année 3', secondary: 2, primary: 1, total: 3, budget: '5 250 000 FCFA' },
  { year: 'Année 4', secondary: 2, primary: 1, total: 3, budget: '5 250 000 FCFA' },
  { year: 'Année 5', secondary: 2, primary: 1, total: 3, budget: '5 250 000 FCFA' },
  { year: 'Année 6', secondary: 2, primary: 1, total: 3, budget: '5 250 000 FCFA' },
  { year: 'Année 7', secondary: 2, primary: 1, total: 3, budget: '5 250 000 FCFA' },
  { year: 'Année 8', secondary: 2, primary: 2, total: 4, budget: '7 000 000 FCFA' },
  { year: 'Année 9', secondary: 2, primary: 2, total: 4, budget: '7 000 000 FCFA' },
  { year: 'Année 10', secondary: 2, primary: 2, total: 4, budget: '7 000 000 FCFA' },
];

const RenouvellementMobilierScolaire: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-playfair text-french-blue">Renouvellement mobilier scolaire</CardTitle>
        <CardDescription className="text-lg">Plan de roulement sur 10 ans</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-3 text-lg font-semibold text-french-blue">Données de cadrage</h3>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>33 salles au total</li>
              <li>20 salles du secondaire</li>
              <li>13 salles du primaire</li>
              <li>Coût par salle : 1 750 000 FCFA</li>
              <li>Budget total décennal : 57 750 000 FCFA</li>
              <li>Amortissement prévu : 10 ans</li>
            </ul>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="mb-3 text-lg font-semibold text-french-blue">Lecture budgétaire</h3>
            <p className="text-slate-700">Effort moyen annuel : <strong>5 775 000 FCFA</strong> (57 750 000 ÷ 10).</p>
            <p className="mt-3 text-slate-700">
              Pour lisser les dépenses, une enveloppe cible de <strong>5 800 000 FCFA</strong> par an est recommandée,
              afin d&apos;absorber les années plus chargées (années 8 à 10).
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
          Il n&apos;est pas possible d&apos;avoir strictement chaque année plus de salles secondaires que primaires tout en
          atteignant les 13 salles du primaire sur 10 ans. Le plan prévoit donc un équilibre à 2 salles secondaires
          et 2 salles primaires sur les années 8, 9 et 10.
        </div>

        <section>
          <h3 className="mb-3 text-xl font-semibold text-french-blue">Plan décennal proposé</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Année</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Salles secondaire rénovées</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Salles primaire rénovées</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Total salles</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Budget annuel</th>
                </tr>
              </thead>
              <tbody>
                {annualPlan.map((item) => (
                  <tr key={item.year}>
                    <td className="border border-gray-300 px-4 py-2">{item.year}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.secondary}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.primary}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.total}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.budget}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-xl font-semibold text-french-blue">Bilan sur 10 ans</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Niveau</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Nombre de salles rénovées</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Coût total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Secondaire</td>
                  <td className="border border-gray-300 px-4 py-2">20 salles</td>
                  <td className="border border-gray-300 px-4 py-2">35 000 000 FCFA</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Primaire</td>
                  <td className="border border-gray-300 px-4 py-2">13 salles</td>
                  <td className="border border-gray-300 px-4 py-2">22 750 000 FCFA</td>
                </tr>
                <tr className="font-semibold">
                  <td className="border border-gray-300 px-4 py-2">Total</td>
                  <td className="border border-gray-300 px-4 py-2">33 salles</td>
                  <td className="border border-gray-300 px-4 py-2">57 750 000 FCFA</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </CardContent>
    </Card>
  );
};

export default RenouvellementMobilierScolaire;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  BusFront,
  MapPin,
  Users,
  LineChart,
  Lightbulb,
  ArrowLeft,
  Home
} from 'lucide-react';

const communes = [
  { ville: 'Saly', total: 291, part: '49 %' },
  { ville: 'Ngaparou', total: 120, part: '20 %' },
  { ville: 'Mbour', total: 99, part: '17 %' },
  { ville: 'Somone', total: 30, part: '5 %' },
  { ville: 'Malicounda', total: 23, part: '4 %' },
  { ville: 'Nguerigne', total: 14, part: '2 %' },
  { ville: 'Autres (> 30 km)', total: 16, part: '3 %' }
];

const TransportScolaire = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-raleway">
      <Navbar showLogo={true} />

      <div className="bg-gradient-to-r from-sky-800 via-sky-700 to-slate-800 text-white py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <BusFront className="h-14 w-14" />
            <div>
              <h1 className="text-3xl md:text-5xl font-playfair font-bold">Transport scolaire</h1>
              <p className="text-lg md:text-2xl text-slate-100 mt-2">
                Analyse de la distribution géographique des familles du LFJP et enjeux d&apos;attractivité
              </p>
            </div>
          </div>
          <p className="max-w-3xl text-base md:text-lg text-slate-100/90">
            Les données d&apos;adresses 2025 confirment une forte concentration des élèves à proximité immédiate de Saly. Cette page synthétise les enseignements de l&apos;analyse territoriale et les scénarios d&apos;usage d&apos;un service de transport scolaire au Lycée Français Jacques Prévert.
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

      <div className="flex-1 bg-gradient-to-b from-slate-50 via-white to-white">
        <div className="container mx-auto px-6 py-12 space-y-10">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <MapPin className="h-8 w-8 text-sky-700" />
                <div>
                  <CardTitle className="text-2xl text-slate-900">1. Contexte territorial</CardTitle>
                  <CardDescription className="text-slate-500">
                    Une population scolaire fortement localisée autour de Saly
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4 text-gray-700">
                <p>
                  L&apos;analyse des adresses principales (R1 et R2) met en évidence une distribution concentrée des familles.
                  <strong className="text-slate-900"> Près d&apos;un élève sur deux réside à Saly</strong>, tandis que les communes
                  limitrophes regroupent plus de 40 % supplémentaires.
                </p>
                <p>
                  Au-delà d&apos;un rayon de 30 km (Thiès, Dakar, etc.), les effectifs deviennent marginaux : seuls quelques
                  élèves sont concernés par des trajets longs et quotidiens.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-sky-100 text-sky-800 border-sky-200">Saly : 49 %</Badge>
                  <Badge variant="secondary" className="bg-sky-100 text-sky-800 border-sky-200">Périphérie immédiate : 42 %</Badge>
                  <Badge variant="secondary" className="bg-sky-100 text-sky-800 border-sky-200">&gt; 30 km : 9 %</Badge>
                </div>
              </div>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th scope="col" className="px-4 py-2 text-left font-semibold text-slate-700">Ville</th>
                      <th scope="col" className="px-4 py-2 text-right font-semibold text-slate-700">Total (R1+R2)</th>
                      <th scope="col" className="px-4 py-2 text-right font-semibold text-slate-700">Part estimée</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                    {communes.map((item) => (
                      <tr key={item.ville}>
                        <td className="px-4 py-2 font-medium capitalize">{item.ville}</td>
                        <td className="px-4 py-2 text-right">{item.total}</td>
                        <td className="px-4 py-2 text-right">{item.part}</td>
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
                <Users className="h-8 w-8 text-sky-700" />
                <div>
                  <CardTitle className="text-2xl text-slate-900">2. Ressenti des familles</CardTitle>
                  <CardDescription className="text-slate-500">
                    Le transport scolaire reste un sujet secondaire dans les enquêtes PSD 2025
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                Les sondages menés auprès des familles confirment que le <strong>transport scolaire n&apos;est pas identifié
                comme une priorité</strong>. Les trajets actuels demeurent courts pour l&apos;immense majorité des élèves et
                peuvent être gérés par les familles sans service dédié.
              </p>
              <p>
                Les attentes se concentrent davantage sur le <strong>cadre de vie</strong>, la <strong>restauration</strong> ou
                encore les dispositifs de <strong>bien-être</strong>. Un investissement dans le transport doit donc être justifié
                par une stratégie d&apos;attractivité plutôt que par une urgence opérationnelle.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <LineChart className="h-8 w-8 text-sky-700" />
                <div>
                  <CardTitle className="text-2xl text-slate-900">3. Scénarios de développement</CardTitle>
                  <CardDescription className="text-slate-500">
                    Un levier ciblé pour attirer ou sécuriser certaines familles
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Familles éloignées</strong> des zones périurbaines de Mbour ou de Malicounda pourraient bénéficier d&apos;une
                  desserte régulière, facilitant la continuité de scolarisation.
                </li>
                <li>
                  Un transport structuré peut devenir un <strong>outil d&apos;attractivité</strong> pour des élèves qui n&apos;auraient pas
                  envisagé le LFJP à cause de la distance.
                </li>
                <li>
                  La mise en service d&apos;un réseau doit rester conditionnée à la <strong>capacité d&apos;accueil disponible</strong> : sans
                  places supplémentaires, le dispositif risquerait de générer un effet d&apos;appel sans réponse.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Lightbulb className="h-8 w-8 text-sky-700" />
                <div>
                  <CardTitle className="text-2xl text-slate-900">4. Recommandations</CardTitle>
                  <CardDescription className="text-slate-500">
                    Positionnement stratégique du transport scolaire dans le PSD
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                Le transport scolaire ne constitue pas une priorité immédiate du PSD. Il peut toutefois être envisagé
                comme un <strong>investissement progressif</strong>, ciblé sur des secteurs ou des publics précis afin de soutenir la
                croissance future du lycée.
              </p>
              <p>
                Avant tout déploiement, il est recommandé de :
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Évaluer régulièrement les <strong>capacités d&apos;accueil</strong> par niveau et les marges d&apos;extension.</li>
                <li>Modéliser les <strong>coûts d&apos;exploitation</strong> et scénarios budgétaires (propriété vs. prestation).</li>
                <li>Identifier des <strong>itinéraires prioritaires</strong> en lien avec les nouvelles familles ciblées.</li>
              </ul>
              <p className="font-semibold text-slate-900">
                Conclusion : maintenir le suivi de la demande, préparer des options modulables et activer le transport
                scolaire en cohérence avec le développement des infrastructures.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TransportScolaire;


import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Calculator, Check } from 'lucide-react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const PCParLyceen = () => {
  const financialImpactData = [
    { name: 'Achat PC', value: 100000 },
    { name: 'Licences', value: 20000 },
    { name: 'Total annuel', value: 120000 }
  ];
  
  const monthlyImpactData = [
    { name: 'Impact mensuel par élève', value: 12000 }
  ];
  
  return (
    <div className="min-h-screen flex flex-col font-raleway">
      <Navbar showLogo={true} />
      
      <div className="bg-gradient-to-r from-french-blue to-blue-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-6 opacity-0 animate-fade-in">
            UN PC PAR LYCÉEN
          </h1>
          <p className="text-lg md:text-xl font-raleway font-light max-w-3xl opacity-0 animate-fade-in-delay-1">
            Analyse financière et pédagogique du projet
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-wrap gap-4 mb-8 items-center justify-center sm:justify-start">
          <Button
            variant="outline"
            className="bg-white text-french-blue border-french-blue hover:bg-french-blue hover:text-white focus-visible:ring-french-blue"
            asChild
          >
            <Link to="/plan-strategique" state={{ axe: 'axe4' }}>
              <ArrowLeft className="mr-2" />
              Retour au plan stratégique
            </Link>
          </Button>
          <Button
            variant="outline"
            className="bg-white text-french-blue border-french-blue hover:bg-french-blue hover:text-white focus-visible:ring-french-blue"
            asChild
          >
            <Link to="/">
              <Home className="mr-2" />
              Accueil
            </Link>
          </Button>
        </div>
        
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="text-2xl text-french-blue">Hypothèses de base</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check size={20} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Nombre d'élèves en Seconde : <strong>56</strong> (maximum)</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={20} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Durée d'utilisation : <strong>3 ans</strong> (Seconde à Terminale)</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={20} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Propriété : L'élève devient propriétaire à l'issue de la Terminale</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={20} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Restitution : PC restitué à l'établissement si départ avant la Terminale</span>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check size={20} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Cycle d'achat : Annuel pour la nouvelle cohorte d'élèves de Seconde</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={20} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Coût par PC : <strong>300 000 FCFA</strong> (exemple)</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={20} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Coût des licences de manuels numériques : <strong>20 000 FCFA</strong> par élève et par an</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={20} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <span>Répartition des écolages : Sur 10 mois par an</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Impact financier annuel par élève</CardTitle>
              <CardDescription>Répartition des coûts (FCFA)</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <AspectRatio ratio={16/9} className="bg-muted/20">
                <ChartContainer 
                  config={{ 
                    financialImpact: { theme: { light: '#3B82F6', dark: '#60A5FA' } }
                  }}
                  className="p-4"
                >
                  <BarChart data={financialImpactData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="value" name="FCFA" fill="#3B82F6" />
                  </BarChart>
                </ChartContainer>
              </AspectRatio>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Impact mensuel par élève</CardTitle>
              <CardDescription>Surcoût mensuel (sur 10 mois)</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <AspectRatio ratio={16/9} className="bg-muted/20">
                <ChartContainer 
                  config={{ 
                    monthlyImpact: { theme: { light: '#3B82F6', dark: '#60A5FA' } }
                  }}
                  className="p-4"
                >
                  <BarChart data={monthlyImpactData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="value" name="FCFA" fill="#3B82F6" />
                  </BarChart>
                </ChartContainer>
              </AspectRatio>
              <div className="mt-4 text-sm">
                <p>Surcoût annuel par élève: <strong>120 000 FCFA</strong></p>
                <p>Surcoût mensuel par élève (sur 10 mois): <strong>12 000 FCFA</strong></p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-10">
          <CardHeader>
            <CardTitle>Plan financier et d'amortissement</CardTitle>
            <CardDescription>Évolution sur les 5 premières années</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableCaption>Tableau de suivi des investissements PC sur 5 ans</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Année</TableHead>
                  <TableHead>Nouveaux PC</TableHead>
                  <TableHead>Investissement PC (FCFA)</TableHead>
                  <TableHead>Licences (FCFA)</TableHead>
                  <TableHead>Total dépenses (FCFA)</TableHead>
                  <TableHead>Recettes additionnelles (FCFA)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">1</TableCell>
                  <TableCell>56</TableCell>
                  <TableCell>16 800 000</TableCell>
                  <TableCell>1 120 000</TableCell>
                  <TableCell>17 920 000</TableCell>
                  <TableCell>6 720 000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">2</TableCell>
                  <TableCell>56</TableCell>
                  <TableCell>16 800 000</TableCell>
                  <TableCell>2 240 000</TableCell>
                  <TableCell>19 040 000</TableCell>
                  <TableCell>13 440 000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">3</TableCell>
                  <TableCell>56</TableCell>
                  <TableCell>16 800 000</TableCell>
                  <TableCell>3 360 000</TableCell>
                  <TableCell>20 160 000</TableCell>
                  <TableCell>20 160 000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">4</TableCell>
                  <TableCell>56</TableCell>
                  <TableCell>16 800 000</TableCell>
                  <TableCell>3 360 000</TableCell>
                  <TableCell>20 160 000</TableCell>
                  <TableCell>20 160 000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">5</TableCell>
                  <TableCell>56</TableCell>
                  <TableCell>16 800 000</TableCell>
                  <TableCell>3 360 000</TableCell>
                  <TableCell>20 160 000</TableCell>
                  <TableCell>20 160 000</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <Card>
            <CardHeader>
              <CardTitle>Arguments pédagogiques</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check size={20} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Accès universel et équitable aux ressources numériques</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Développement des compétences du XXIe siècle</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Pédagogie différenciée et personnalisée</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Engagement et motivation accrus</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Préparation à l'enseignement supérieur et au monde professionnel</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Potentiel de l'intelligence artificielle en éducation</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Communication facilitée via les plateformes de l'établissement</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Autonomie et responsabilisation de l'élève</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Points de vigilance</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-3">Fatigue visuelle et ergonomie</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <Check size={20} className="text-amber-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Sensibiliser à l'importance d'une bonne posture pour éviter les TMS</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-amber-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Encourager les pauses régulières (règle du "20-20-20")</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-amber-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Gérer le temps d'écran global</span>
                </li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-3">Controverses</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check size={20} className="text-amber-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Le PC : outil d'émancipation ou d'aliénation?</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-amber-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Égalité vs. équité numérique</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-amber-600 mr-2 mt-1 flex-shrink-0" />
                  <span>La machine peut-elle remplacer le maître ou le livre?</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-soft-purple p-6 rounded-lg mb-8">
          <h3 className="text-xl font-medium text-french-blue mb-3">Conclusion</h3>
          <p className="mb-2">Le projet "Un PC par lycéen" représente un investissement significatif mais soutenable, avec un impact financier de <strong>12 000 FCFA par mois et par élève</strong>.</p>
          <p className="mb-0">À partir de la troisième année, le projet atteint son régime de croisière où les recettes additionnelles couvrent intégralement les dépenses annuelles, tout en offrant de nombreux avantages pédagogiques et en préparant les élèves aux défis du monde numérique.</p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PCParLyceen;

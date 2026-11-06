import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Home, Layers, Monitor, TabletSmartphone, Users, MonitorPlay, Server, Cloud } from 'lucide-react';

const ProfilDigitalLFJP = () => {
  return (
    <div className="min-h-screen flex flex-col font-raleway">
      <Navbar showLogo />

      <section className="bg-gradient-to-r from-french-blue via-blue-700 to-blue-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-6 space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] font-semibold text-blue-100">Établissement digitalisé et partenariats</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold">Profil digital du LFJP</h1>
          <p className="text-lg md:text-xl max-w-4xl font-light">
            Le Lycée Français Jacques Prévert bénéficie d’un environnement numérique complet, structuré et en constante évolution,
            combinant équipements fixes et mobiles, solutions logicielles de référence et organisation facilitant l’accès aux outils
            pédagogiques pour tous.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-6 flex flex-wrap gap-3">
        <Button
          variant="outline"
          className="bg-white text-french-blue border-french-blue hover:bg-french-blue hover:text-white focus-visible:ring-french-blue"
          asChild
        >
          <Link to="/plan-strategique" state={{ axe: 'axe3' }}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au plan stratégique
          </Link>
        </Button>
        <Button
          variant="outline"
          className="bg-white text-french-blue border-french-blue hover:bg-french-blue hover:text-white focus-visible:ring-french-blue"
          asChild
        >
          <Link to="/plan-strategique" state={{ axe: 'axe3', rubrique: 'etablissement-digitalise' }}>
            <Layers className="mr-2 h-4 w-4" />
            Retour aux rubriques
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

      <main className="container mx-auto px-6 pb-16 space-y-10">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-french-blue">Un écosystème numérique cohérent</CardTitle>
            <CardDescription>Équipements, logiciels et organisation au service des apprentissages.</CardDescription>
          </CardHeader>
          <CardContent className="text-gray-700 leading-relaxed space-y-3">
            <p>
              Le profil digital du Lycée Français Jacques Prévert témoigne d’un environnement numérique complet, structuré et en constante évolution.
              Il s’appuie sur des équipements fixes et mobiles, des solutions logicielles de référence et une organisation permettant à tous les élèves
              et personnels d’accéder à des outils modernes et pédagogiquement pertinents.
            </p>
          </CardContent>
        </Card>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="shadow-lg h-full">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-3 text-2xl text-french-blue">
                <Monitor className="h-6 w-6" aria-hidden="true" />
                1. Parc informatique fixe
              </CardTitle>
              <CardDescription>Des postes répartis dans tous les espaces d’apprentissage.</CardDescription>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed">
              <ul className="list-disc pl-5 space-y-2">
                <li>Salle de technologie : 14 PC</li>
                <li>Centre de Documentation et d’Information (CDI) : une dizaine de PC</li>
                <li>Deux salles de sciences : une dizaine de PC chacune</li>
                <li>Classes du cycle 3 : 2 PC par classe</li>
                <li>Salle d’arts plastiques : 6 PC</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg h-full">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-3 text-2xl text-french-blue">
                <TabletSmartphone className="h-6 w-6" aria-hidden="true" />
                2. Classes numériques mobiles
              </CardTitle>
              <CardDescription>Deux chariots sécurisés pour des usages flexibles.</CardDescription>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed">
              <ul className="list-disc pl-5 space-y-2">
                <li>Une classe numérique mobile composée de 15 PC récents, avec un chariot sécurisé.</li>
                <li>Une classe numérique mobile composée de 15 tablettes iPad, utilisées dans de nombreux projets disciplinaires et transversaux.</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="shadow-lg h-full">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-3 text-2xl text-french-blue">
                <Users className="h-6 w-6" aria-hidden="true" />
                3. Équipements informatiques des personnels
              </CardTitle>
              <CardDescription>Ordinateurs portables et accès aux services partagés.</CardDescription>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed space-y-3">
              <ul className="list-disc pl-5 space-y-2">
                <li>Chaque enseignant dispose d’un PC portable fourni par l’établissement.</li>
                <li>Deux photocopieuses sont à disposition&nbsp;: une en salle des professeurs et une à l’accueil selon l’affectation des enseignants.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg h-full">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-3 text-2xl text-french-blue">
                <MonitorPlay className="h-6 w-6" aria-hidden="true" />
                4. Équipements audiovisuels des salles de classe
              </CardTitle>
              <CardDescription>Vidéoprojecteurs et plan de renouvellement coordonné.</CardDescription>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed space-y-3">
              <p>Toutes les salles sont équipées de vidéoprojecteurs.</p>
              <p>
                Un plan pluriannuel de renouvellement des vidéoprojecteurs est en cours, en complément du plan de renouvellement des PC fixes.
                Les deux volets sont détaillés dans le{' '}
                <Link to="/plan-maintenance-strategique#informatique" className="text-french-blue font-semibold underline">
                  plan de maintenance stratégique
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </section>

        <Card className="shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-3 text-2xl text-french-blue">
              <Server className="h-6 w-6" aria-hidden="true" />
              5. Solutions numériques de gestion et d’enseignement
            </CardTitle>
            <CardDescription>Des outils cohérents pour la vie scolaire, l’administration et la pédagogie.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-700 leading-relaxed">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 h-full">
                <div className="flex items-center gap-2 mb-2">
                  <Monitor className="h-5 w-5 text-french-blue" aria-hidden="true" />
                  <p className="font-semibold text-french-blue">a. Suite Index Éducation</p>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-sm md:text-base">
                  <li>Pronote (secondaire)</li>
                  <li>Pronote primaire</li>
                  <li>EDT pour la gestion des emplois du temps</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 h-full">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="h-5 w-5 text-french-blue" aria-hidden="true" />
                  <p className="font-semibold text-french-blue">b. EDUKA</p>
                </div>
                <p className="text-sm md:text-base">
                  Utilisé pour la gestion administrative et financière de l’établissement : inscriptions, facturation, dossiers et pilotage.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 h-full">
                <div className="flex items-center gap-2 mb-2">
                  <Cloud className="h-5 w-5 text-french-blue" aria-hidden="true" />
                  <p className="font-semibold text-french-blue">c. Google Workspace pour l’Éducation</p>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-sm md:text-base">
                  <li>Une adresse @lfgpsaly.org pour chaque élève et personnel.</li>
                  <li>Accès à Gmail, Drive, Docs, Sheets, Slides, Classroom et Meet.</li>
                  <li>Collaboration en ligne et stockage sécurisé pour les projets pédagogiques.</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 h-full">
                <div className="flex items-center gap-2 mb-2">
                  <TabletSmartphone className="h-5 w-5 text-french-blue" aria-hidden="true" />
                  <p className="font-semibold text-french-blue">d. Canva Éducation</p>
                </div>
                <p className="text-sm md:text-base">
                  Accessible à tous les élèves, connecté au Google Workspace, permettant la création graphique, la production multimédia et le travail collaboratif.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilDigitalLFJP;

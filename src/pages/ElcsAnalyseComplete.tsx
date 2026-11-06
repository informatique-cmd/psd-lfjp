
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Home } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import BreadcrumbNav from "../components/Breadcrumb";

const ElcsAnalyseComplete = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-raleway">
      <Navbar showLogo={true} />
      <BreadcrumbNav />
      
      <div className="bg-gradient-to-r from-french-blue to-blue-700 text-white py-16 md:py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-4 opacity-0 animate-fade-in">
            Analyse Complète du Climat Scolaire
          </h1>
          <p className="text-lg md:text-xl font-raleway font-light max-w-3xl opacity-0 animate-fade-in-delay-1">
            Enquêtes Locales de Climat Scolaire (ELCS) 2024-2025
          </p>
        </div>
      </div>

      <div className="py-8 md:py-12 bg-gray-50 flex-grow">
        <div className="container mx-auto px-6">
          <div className="flex justify-between mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            
            <Button 
              variant="outline"
              asChild
              className="flex items-center gap-2"
            >
              <Link to="/">
                <Home className="h-4 w-4" />
                Accueil
              </Link>
            </Button>
          </div>
          
          <Card className="mb-8 bg-white shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
              <CardTitle className="text-2xl text-french-blue">Introduction</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-700 mb-4">
                Cette analyse synthétise les perceptions du climat scolaire au LFJP de Saly, en croisant les données 
                quantitatives issues des questionnaires élèves, parents et personnels avec les éléments qualitatifs
                extraits des retours écrits (verbatim). L'objectif est d'identifier les points forts et les axes 
                d'amélioration prioritaires pour le bien-être et l'épanouissement de tous les membres de la 
                communauté éducative.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8 bg-white shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
              <CardTitle className="text-2xl text-french-blue">I. Satisfaction concernant les Infrastructures et le Confort Matériel</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold text-french-blue mb-4">Bâtiments et Cadre de Vie Général</h3>
              
              <h4 className="text-lg font-medium mb-2">Élèves :</h4>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <span className="font-medium">Données quantitatives (Lycée) :</span> Seulement 33% des élèves apprécient 
                  positivement les bâtiments (contre 75% au niveau national).
                </li>
                <li>
                  <span className="font-medium">Données quantitatives (Élémentaire) :</span> 84.8% des élèves de l'élémentaire 
                  ont une appréciation positive des bâtiments (jolis ou très jolis). C'est un contraste notable avec le lycée.
                </li>
              </ul>
              
              <h5 className="font-medium">Retours qualitatifs des élèves (verbatim) :</h5>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <span className="italic">Élémentaire :</span> Demande d'amélioration des espaces extérieurs (8 occurrences), 
                  agrandir la cour, installer une piscine. Propreté des toilettes (5 occurrences).
                </li>
                <li>
                  <span className="italic">Collège :</span> Demandes d'équipements (casiers, miroirs dans les toilettes) 
                  (14 occurrences).
                </li>
                <li>
                  <span className="italic">Lycée :</span> Demandes de casiers, fontaines à eau fraîche.
                </li>
              </ul>

              <h4 className="text-lg font-medium mb-2">Retours des Parents :</h4>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <span className="italic">Verbatim :</span> Les infrastructures sont un "enjeu central".
                </li>
                <li>
                  <span className="italic">Primaire :</span> Espaces de récréation mieux adaptés, jeux variés, 
                  espaces verts ombragés.
                </li>
                <li>
                  <span className="italic">Collège :</span> Rénovation des toilettes, vestiaires, CDI, 
                  insonorisation des salles.
                </li>
                <li>
                  <span className="italic">Lycée :</span> Renouvellement du mobilier, amélioration des conditions 
                  dans les salles (température, acoustique, confort).
                </li>
              </ul>

              <h4 className="text-lg font-medium mb-2">Retours des Personnels :</h4>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <span className="font-medium">Données quantitatives (Élémentaire) :</span> La proposition "des locaux 
                  plus adaptés" est classée avec une pertinence moyenne (rang 5.9 sur 16, où un rang plus bas indique 
                  une plus grande pertinence) pour améliorer le climat scolaire.
                </li>
                <li>
                  <span className="font-medium">Données quantitatives (Lycée) :</span> La proposition "des locaux plus adaptés" 
                  a un rang de pertinence de 7.7 (sur 16).
                </li>
              </ul>
              
              <h3 className="text-xl font-semibold text-french-blue mb-4 mt-8">Climatisation</h3>
              
              <h4 className="text-lg font-medium mb-2">Retours des Élèves :</h4>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <span className="italic">Verbatim Collège :</span> Très forte demande avec 53 occurrences 
                  (sur 132 réponses). <span className="font-medium">Statistique clé :</span> Environ 40% des verbatim 
                  du collège mentionnent la climatisation.
                </li>
                <li>
                  <span className="italic">Verbatim Lycée :</span> Demande prépondérante avec 47 occurrences 
                  (sur 89 réponses). <span className="font-medium">Statistique clé :</span> Environ 53% des verbatim 
                  du lycée mentionnent la climatisation.
                </li>
                <li>
                  <span className="italic">Verbatim Élémentaire :</span> Non mentionné comme priorité, les élèves se 
                  concentrent sur les jeux et activités.
                </li>
              </ul>
              
              <h4 className="text-lg font-medium mb-2">Retours des Parents :</h4>
              <p className="mb-4 pl-6">
                <span className="italic">Verbatim :</span> "La problématique de la chaleur revient régulièrement, 
                à tous les niveaux." Souhait de mesures pour améliorer la ventilation ou installer une climatisation efficace.
              </p>
              
              <h4 className="text-lg font-medium mb-2">Retours des Personnels :</h4>
              <p className="mb-4 pl-6">
                Bien que non explicitement demandé sous "climatisation", la demande pour "des locaux plus adaptés" 
                (voir ci-dessus) inclut probablement le confort thermique.
              </p>
              
              <h3 className="text-xl font-semibold text-french-blue mb-4 mt-8">Cantine Scolaire</h3>
              
              <h4 className="text-lg font-medium mb-2">Retours des Élèves :</h4>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <span className="italic">Verbatim Lycée :</span> Demande de services de restauration adaptés (11 occurrences).
                </li>
                <li>
                  <span className="italic">Verbatim Élémentaire & Collège :</span> Moins prégnant dans les synthèses verbatim élèves, 
                  mais l'absence est notée.
                </li>
              </ul>
              
              <h4 className="text-lg font-medium mb-2">Retours des Parents :</h4>
              <p className="mb-4 pl-6">
                <span className="italic">Verbatim :</span> "La mise en place d'une cantine scolaire est une demande très fréquente, 
                avec l'attente d'un espace propre, agréable et proposant une alimentation équilibrée et variée. Cette attente est 
                particulièrement forte et uniforme dans les trois niveaux."
              </p>
              
              <h4 className="text-lg font-medium mb-2">Retours des Personnels :</h4>
              <p className="mb-4 pl-6">
                <span className="font-medium">Données quantitatives (Élémentaire) :</span> L'absence de préoccupation des personnels 
                pour la sécurité à la cantine (100% se déclarant "pas concernés") indique son absence physique.
              </p>
              
              <h3 className="text-xl font-semibold text-french-blue mb-4 mt-8">Uniformes Scolaires</h3>
              
              <h4 className="text-lg font-medium mb-2">Retours des Élèves :</h4>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <span className="italic">Verbatim Élémentaire :</span> Vêtements plus confortables ou changement (6 occurrences).
                </li>
                <li>
                  <span className="italic">Verbatim Collège :</span> Demande de suppression ou modification (7 occurrences).
                </li>
                <li>
                  <span className="italic">Verbatim Lycée :</span> Plusieurs commentaires sur l'inconfort, demande de suppression 
                  ou assouplissement (8 occurrences).
                </li>
                <li>
                  <span className="italic">Général :</span> Question récurrente à tous les niveaux, davantage marquée au collège et lycée.
                </li>
              </ul>
              
              <p className="mb-4 pl-6">
                <span className="italic">Parents et Personnels :</span> Moins d'informations directes sur ce point dans les synthèses fournies.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8 bg-white shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
              <CardTitle className="text-2xl text-french-blue">II. Relations Humaines et Climat Relationnel</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <h4 className="text-lg font-medium mb-2">Élèves :</h4>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <span className="font-medium">Données quantitatives (Lycée) :</span> Relations avec les enseignants (81,7%) 
                  légèrement inférieures à la moyenne nationale (87,5%). Climat de violence psychologique (surnoms, mises à l'écart) 
                  nettement supérieur à la moyenne nationale.
                </li>
                <li>
                  <span className="font-medium">Points forts (Lycée) :</span> Très forte satisfaction concernant les relations avec 
                  les autres adultes de l'établissement (97,4%) et avec la vie scolaire (90,4%, au-dessus de la moyenne nationale). 
                  Bonne ambiance entre élèves légèrement supérieure à la moyenne nationale (88,7%).
                </li>
              </ul>
              
              <h5 className="font-medium">Retours qualitatifs des élèves (verbatim) :</h5>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <span className="italic">Élémentaire :</span> Meilleure écoute et moins de cris des enseignants (8 occurrences).
                </li>
                <li>
                  <span className="italic">Collège :</span> Améliorer communication et respect mutuel (12 occurrences). Rôle des 
                  surveillants pour encadrer les comportements (10 occurrences). Violence et harcèlement (9 occurrences).
                </li>
                <li>
                  <span className="italic">Lycée :</span> Signalement de comportements déplacés/démotivants de certains enseignants. 
                  Témoignages de moqueries fréquentes et harcèlement non pris en compte. Demande forte pour campagnes de sensibilisation, 
                  présence psychologique accrue, meilleur accompagnement.
                </li>
              </ul>

              <h4 className="text-lg font-medium mb-2">Retours des Parents :</h4>
              <p className="mb-4 pl-6">
                <span className="italic">Verbatim :</span> Souhait d'une vigilance accrue et actions concrètes contre le harcèlement 
                (particulièrement souligné au primaire). Appel à davantage d'écoute et de bienveillance de la part des adultes.
              </p>
              
              <h4 className="text-lg font-medium mb-2">Retours des Personnels :</h4>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <span className="font-medium">Données quantitatives (Élémentaire) :</span> Perception majoritairement "Bonne" 
                  ou "Très bonne" des relations entre élèves (100%), entre élèves et enseignants (100%), et entre adultes 
                  (87.6% Bonne ou Très Bonne).
                </li>
                <li>
                  <span className="font-medium">Données quantitatives (Lycée) :</span> Relations entre élèves "Très bonnes" (38.5%) 
                  ou "Bonnes" (61.5%). Relations entre élèves et enseignants "Très bonnes" (69.2%) ou "Bonnes" (30.8%).
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="mb-8 bg-white shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
              <CardTitle className="text-2xl text-french-blue">III. Charge de Travail et Organisation Scolaire</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <h4 className="text-lg font-medium mb-2">Élèves :</h4>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <span className="font-medium">Données quantitatives (Lycée) :</span> Intérêt des apprentissages perçu comme 
                  inférieur (66,1% vs 72% national). Avis mitigé sur l'encouragement et le soutien des enseignants.
                </li>
                <li>
                  <span className="font-medium">Retours qualitatifs des élèves (verbatim Lycée) :</span> Multiples critiques sur 
                  les emplois du temps (journées longues, permanences excessives). Charge de travail excessive, coefficients importants.
                </li>
              </ul>

              <h4 className="text-lg font-medium mb-2">Retours des Parents :</h4>
              <p className="mb-4 pl-6">
                <span className="italic">Verbatim (Collège et Lycée) :</span> Souhait d'une meilleure gestion des emplois du temps 
                (moins de "trous"). Maintien de classes à taille humaine.
              </p>
              
              <h4 className="text-lg font-medium mb-2">Retours des Personnels :</h4>
              <p className="mb-4 pl-6">
                Peu de données directes sur ce point dans les synthèses, mais la charge de travail des élèves peut impacter 
                leur relation avec les enseignants.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8 bg-white shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
              <CardTitle className="text-2xl text-french-blue">IV. Sécurité et Violences</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <h4 className="text-lg font-medium mb-2">Élèves :</h4>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <span className="font-medium">Données quantitatives (Lycée) :</span> Taux élevé de victimations (violences 
                  psychologiques et physiques). Indice de multivictimation significativement supérieur à la moyenne nationale.
                </li>
                <li>
                  <span className="font-medium">Point fort (Lycée) :</span> 90,4% des élèves déclarent n'avoir jamais manqué 
                  l'école en raison de faits de violence.
                </li>
              </ul>
              
              <h5 className="font-medium">Retours qualitatifs des élèves (verbatim) :</h5>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <span className="italic">Élémentaire :</span> Renforcer la sécurité contre les agressions extérieures (5 occurrences).
                </li>
                <li>
                  <span className="italic">Collège :</span> Renforcer la prévention et les sanctions contre violence et harcèlement 
                  (9 occurrences). Rôle accru des surveillants (10 occurrences).
                </li>
                <li>
                  <span className="italic">Lycée :</span> Appels à meilleure surveillance (toilettes, vestiaires). Témoignages de 
                  trafic de substances, comportements agressifs. Besoin de séances sur le harcèlement.
                </li>
              </ul>

              <h4 className="text-lg font-medium mb-2">Retours des Parents :</h4>
              <p className="mb-4 pl-6">
                <span className="italic">Verbatim :</span> Questions de sécurité importantes (accès à l'établissement, parking). 
                Mise en place d'un transport scolaire. Vigilance accrue contre le harcèlement.
              </p>
              
              <h4 className="text-lg font-medium mb-2">Retours des Personnels :</h4>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <span className="font-medium">Données quantitatives (Élémentaire) :</span> 93.8% des personnels estiment qu'il 
                  y a "Pas très souvent" de la violence, 6.3% "Plutôt souvent".
                </li>
                <li>
                  <span className="font-medium">Données quantitatives (Lycée) :</span> 76.9% estiment qu'il y a "Pas très souvent" 
                  de la violence, 23.1% "Plutôt souvent".
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="mb-8 bg-white shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
              <CardTitle className="text-2xl text-french-blue">Bilan Global de l'ELCS pour le Diagnostic Stratégique</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4">
                Le Lycée Français Jacques Prévert de Saly présente un climat scolaire contrasté, marqué par des points forts 
                relationnels mais aussi par d'importantes attentes matérielles et des préoccupations liées au bien-être et à 
                la sécurité.
              </p>
              
              <h3 className="text-xl font-semibold text-french-blue mb-4">Points Forts :</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>
                  <span className="font-medium">Relations avec les Adultes (hors enseignants) et la Vie Scolaire (Lycée) :</span> 
                  Les élèves du lycée expriment une satisfaction élevée, constituant un atout.
                </li>
                <li>
                  <span className="font-medium">Ambiance entre Élèves (Lycée) :</span> Globalement positive, malgré des tensions 
                  signalées.
                </li>
                <li>
                  <span className="font-medium">Faible Absentéisme lié à la Violence (Lycée) :</span> Indicateur rassurant sur la 
                  sécurité globale ressentie pour venir à l'école.
                </li>
                <li>
                  <span className="font-medium">Perception Positive des Relations par les Personnels :</span> Les personnels, tant à 
                  l'élémentaire qu'au lycée, ont une vision globalement positive des relations au sein de l'établissement.
                </li>
                <li>
                  <span className="font-medium">Accueil des Parents :</span> Les parents se sentent majoritairement bien ou 
                  très bien accueillis.
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-french-blue mb-4">Axes d'Amélioration Prioritaires et Enjeux Clés :</h3>
              
              <h4 className="text-lg font-medium mb-2">Confort Matériel et Infrastructures (Tous Niveaux) :</h4>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <span className="font-medium">Problématique Majeure :</span> La demande de climatisation est massive et urgente 
                  pour les collégiens (40% des verbatim) et lycéens (53% des verbatim), et soulignée par les parents.
                </li>
                <li>
                  <span className="font-medium">Cantine :</span> Demande très forte et uniforme des parents pour tous les niveaux, 
                  et exprimée par les lycéens (11 occurrences).
                </li>
                <li>
                  <span className="font-medium">État et Équipement des Bâtiments :</span> Faible appréciation des bâtiments par 
                  les lycéens (33%). Besoins spécifiques à chaque niveau (espaces de jeux au primaire, rénovations au collège, 
                  mobilier au lycée, casiers, fontaines à eau). La perception des élèves de l'élémentaire est plus positive 
                  (84.8% d'appréciation positive).
                </li>
                <li>
                  <span className="font-medium">Uniformes :</span> Source d'inconfort régulièrement mentionnée par les élèves à 
                  tous les niveaux.
                </li>
              </ul>
              
              <h4 className="text-lg font-medium mb-2">Climat Relationnel et Prise en Charge du Harcèlement (Tous Niveaux) :</h4>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <span className="font-medium">Élèves-Enseignants (Lycée) :</span> Relations perçues comme inférieures à la 
                  moyenne nationale, avec des signalements de comportements démotivants.
                </li>
                <li>
                  <span className="font-medium">Violence Psychologique et Harcèlement :</span> Nettement supérieur à la moyenne 
                  nationale au lycée. Les retours qualitatifs des élèves et des parents (tous niveaux) convergent sur la 
                  nécessité d'une meilleure prise en compte, de prévention et de sanctions. Demande d'écoute et de campagnes 
                  de sensibilisation.
                </li>
                <li>
                  <span className="font-medium">Soutien Psychologique :</span> Forte demande des lycéens et collégiens, 
                  corroborée par les parents.
                </li>
              </ul>
              
              <h4 className="text-lg font-medium mb-2">Sécurité et Surveillance (Tous Niveaux) :</h4>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <span className="font-medium">Perception d'Insécurité :</span> Malgré un faible absentéisme lié à la violence, 
                  les retours qualitatifs des élèves (notamment lycée) font état de zones (toilettes, vestiaires) et de 
                  comportements (agressivité, trafic) générant de l'insécurité.
                </li>
                <li>
                  <span className="font-medium">Demandes Parentales :</span> Sécurisation des accès, parking, transport scolaire.
                </li>
              </ul>
              
              <h4 className="text-lg font-medium mb-2">Charge de Travail et Organisation Pédagogique (Lycée Principalement) :</h4>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <span className="font-medium">Surcharge Ressentie :</span> Les lycéens critiquent des emplois du temps lourds 
                  et une charge de travail excessive, impactant leur intérêt pour les apprentissages. Les parents relaient des 
                  préoccupations sur les emplois du temps.
                </li>
                <li>
                  <span className="font-medium">Attentes Élevées :</span> Le public exigeant de l'établissement exprime un fort 
                  besoin d'équilibre entre performance et bien-être.
                </li>
              </ul>
              
              <p className="mb-6">
                <span className="font-medium">Écart de Perception :</span> Il existe un écart notable entre la perception 
                globalement positive des relations par les personnels et les difficultés exprimées par les élèves et les parents, 
                notamment concernant le harcèlement et la relation enseignant-élève au lycée.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8 bg-white shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
              <CardTitle className="text-2xl text-french-blue">Conclusion pour le Plan Stratégique de Développement</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4">
                Le diagnostic du climat scolaire au LFJP révèle que si l'établissement bénéficie d'un engagement fort de ses 
                personnels non-enseignants et d'une certaine convivialité entre élèves, des investissements et des actions 
                ciblées sont impératifs. Les attentes élevées du public de l'établissement exigent une attention particulière.
              </p>
              
              <p className="mb-4 font-medium">Les priorités pour le plan stratégique devraient inclure :</p>
              
              <ol className="list-decimal pl-6 mb-6 space-y-3">
                <li>
                  <span className="font-medium">Amélioration Drastique du Cadre de Vie :</span> Investissement prioritaire dans 
                  la climatisation (collège/lycée), la création d'une cantine, la rénovation et l'équipement des locaux (casiers, 
                  fontaines, mobilier, espaces extérieurs), et une réflexion sur le confort des uniformes.
                </li>
                <li>
                  <span className="font-medium">Renforcement de la Lutte contre le Harcèlement et les Violences :</span> Mise en 
                  place d'un plan d'action concret incluant surveillance accrue dans les zones identifiées, formation des personnels, 
                  campagnes de sensibilisation régulières pour élèves et adultes, et un protocole clair de prise en charge des 
                  victimes et des auteurs.
                </li>
                <li>
                  <span className="font-medium">Amélioration du Soutien et de l'Écoute :</span> Accroître la présence et 
                  l'accessibilité du soutien psychologique, former les enseignants à une communication plus positive et à l'écoute 
                  active, notamment pour désamorcer les tensions et répondre aux attentes relationnelles élevées.
                </li>
                <li>
                  <span className="font-medium">Optimisation de l'Organisation Scolaire et Pédagogique :</span> Réflexion sur 
                  l'équilibre de la charge de travail, l'aménagement des emplois du temps (surtout au lycée), et les pratiques 
                  pédagogiques pour maintenir l'engagement et l'intérêt des élèves, en adéquation avec leurs fortes attentes 
                  académiques et de bien-être.
                </li>
                <li>
                  <span className="font-medium">Sécurisation de l'Établissement :</span> Répondre aux demandes des parents 
                  concernant la sécurité des accès et envisager des solutions de transport scolaire.
                </li>
              </ol>
              
              <p className="mb-4">
                Agir sur ces leviers permettra de répondre aux besoins concrets exprimés par la communauté scolaire et d'améliorer 
                significativement le climat scolaire, condition essentielle à la réussite et à l'épanouissement de chaque élève.
              </p>
            </CardContent>
          </Card>
          
          <div className="flex justify-between mt-10">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour au diagnostic
            </Button>
            
            <Button 
              variant="outline"
              asChild
              className="flex items-center gap-2"
            >
              <Link to="/">
                <Home className="h-4 w-4" />
                Accueil
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ElcsAnalyseComplete;

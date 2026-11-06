import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Button } from '../components/ui/button';
import { 
  Building2, 
  Users, 
  Shield, 
  Calendar, 
  DollarSign, 
  FileText,
  CheckCircle,
  AlertCircle,
  Target,
  Wrench,
  ArrowLeft,
  Home
} from 'lucide-react';

const ConstructionCantine = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-raleway">
      <Navbar showLogo={true} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <Building2 className="h-12 w-12" />
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold">
                Construction d'une Cantine Scolaire
              </h1>
              <p className="text-xl md:text-2xl font-light mt-2">
                Guide pour partenaires - LFJP de Saly, Sénégal
              </p>
            </div>
          </div>
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

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        
        {/* Context */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-blue-600" />
              Contexte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">
              L'APE du LFJP souhaite construire une cantine scolaire pour répondre aux besoins de toute la 
              communauté éducative avec un partenaire technique prêt à investir/co-investir. Ce document est 
              un guide à l'attention des partenaires potentiels afin de les aider à préparer une proposition 
              complète et compétitive au comité de gestion de l'APE.
            </p>
          </CardContent>
        </Card>

        {/* Objectives */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Target className="h-6 w-6 text-green-600" />
              1. Objectifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <span>Construire un espace de restauration de <strong>150 à 300 couverts</strong> pour le déjeuner pendant l'année scolaire, adapté aux besoins des usagers</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <span>Garantir un service de restauration de qualité (équilibre nutritionnel, traçabilité des aliments, grammages conformes)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <span>Optimiser les coûts via un <strong>modèle de co-investissement</strong> (partage des dépenses et des risques)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <span>Intégrer les normes applicables : hygiène, environnement, accessibilité PMR, écologie</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <span>Garantir la continuité du service (même en cas de grève)</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Technical Requirements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Wrench className="h-6 w-6 text-blue-600" />
              2. Exigences techniques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Architecture */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                A. Architecture et aménagement
              </h3>
              <div className="space-y-2 ml-7">
                <p><strong>Surface minimale :</strong> à déterminer</p>
                <p><strong>Zones fonctionnelles :</strong></p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Cuisine équipée (normes HACCP)</li>
                  <li>Espace de restauration (mobilier ergonomique, éclairage naturel)</li>
                  <li>Zone de stockage (denrées, équipements)</li>
                  <li>Zone de livraison/déchargement</li>
                  <li>Sanitaires adaptés (enfants et PMR)</li>
                  <li>Espace administratif</li>
                  <li>Terrasse extérieure optionnelle</li>
                </ul>
              </div>
            </div>

            <Separator />

            {/* Equipment */}
            <div>
              <h3 className="font-semibold text-lg mb-3">B. Équipements</h3>
              <ul className="list-disc ml-6 space-y-1">
                <li>Matériel de cuisine professionnel</li>
                <li>Système de ventilation et traitement des odeurs</li>
                <li>Solutions énergétiques durables (incl. compteurs divisionnaires)</li>
              </ul>
            </div>

            <Separator />

            {/* Technology */}
            <div>
              <h3 className="font-semibold text-lg mb-3">C. Technologie</h3>
              <ul className="list-disc ml-6 space-y-1">
                <li>Système informatisé de gestion des repas</li>
                <li>Paiement via badge, tickets ou plateforme numérique</li>
                <li>Gestion des bourses scolaires intégrée</li>
              </ul>
            </div>

            <Separator />

            {/* Security */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                D. Sécurité et normes
              </h3>
              <ul className="list-disc ml-6 space-y-1">
                <li>Certifications ISO 9001, ISO 14001, ISO 22000 recommandées</li>
                <li>Systèmes de contrôle et d'alerte conformes</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Co-investment Model */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-green-600" />
              3. Modèle de co-investissement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">A. Contributions financières</h3>
              <ul className="list-disc ml-6 space-y-1">
                <li>Budget estimé : à préciser</li>
                <li>Répartition des coûts : à déterminer entre école et partenaire</li>
                <li>Participation financière forfaitaire par repas au bâtiment</li>
                <li>Tarification des repas : proposition avec modèle de rentabilité</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">B. Sources de financement</h3>
              <ul className="list-disc ml-6 space-y-1">
                <li>Co-investissement école/partenaire</li>
                <li>Subventions, aides locales, levées de fonds éventuelles</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Legal Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-600" />
              4. Informations juridiques et administratives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-6 space-y-1">
              <li>Structure juridique à préciser (convention, contrat de concession)</li>
              <li>Délai contractuel de X ans renouvelable sous conditions</li>
              <li>Engagements : garanties, assurances, permis de construire, exclusivité d'usage</li>
              <li>Clause de résiliation avec préavis</li>
            </ul>
          </CardContent>
        </Card>

        {/* Project Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-purple-600" />
              5. Gestion du projet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">A. Calendrier</h3>
              <ul className="list-disc ml-6 space-y-1">
                <li><strong>Phase 1 :</strong> soumission du projet complet</li>
                <li><strong>Phase 2 :</strong> Sélection des propositions</li>
                <li><strong>Phase 3 :</strong> Travaux et mise en service (début année scolaire XXXX)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">B. Rôles et responsabilités</h3>
              <ul className="list-disc ml-6 space-y-1">
                <li><strong>École :</strong> suivi de projet, garant de la qualité, communication avec les usagers</li>
                <li><strong>Partenaire :</strong> exécution, gestion, entretien, RH, assurances, réglementation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">C. Suivi et évaluation</h3>
              <ul className="list-disc ml-6 space-y-1">
                <li>Comité de pilotage mixte</li>
                <li>Indicateurs de qualité, satisfaction, audits</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Partner Profile */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Users className="h-6 w-6 text-green-600" />
              6. Profil du partenaire attendu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-6 space-y-1">
              <li>Expérience en gestion de restauration scolaire</li>
              <li>Solidité financière vérifiable</li>
              <li>Respect de la convention collective Sénégalaise</li>
              <li>Modèle écologique et durable</li>
            </ul>
          </CardContent>
        </Card>

        {/* Additional Services */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>7. Prestations complémentaires à inclure</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-6 space-y-1">
              <li>Surveillance pendant le temps de repas (personnel formé, casier vierge, français obligatoire)</li>
              <li>Nettoyage quotidien et pendant les fermetures (produits Ecolabel, plan de nettoyage)</li>
              <li>Traitement des déchets et recyclage (huiles, plastiques, etc.)</li>
            </ul>
          </CardContent>
        </Card>

        {/* Responsibilities and Insurance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>8. Responsabilités et assurances</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-6 space-y-1">
              <li>Assurance tous risques : exploitation, incendie, vol, intoxications</li>
              <li>Attestation annuelle à fournir</li>
              <li>Entretien et remplacement à charge du partenaire</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contractual Penalties */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>9. Pénalités contractuelles</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-6 space-y-1">
              <li>Retards, grammages non conformes, non-respect des menus, hygiène, absence de justificatifs</li>
              <li>Montants forfaitaires</li>
              <li>Possibilité pour l'école de recourir à un tiers en cas de manquement grave</li>
            </ul>
          </CardContent>
        </Card>

        {/* Required Documents */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>10. Pièces demandées aux candidats</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-6 space-y-1">
              <li>Proposition détaillée et chiffrée</li>
              <li>Portfolio de projets similaires</li>
              <li>Attestations fiscales et sociales</li>
              <li>Plans d'exécution</li>
            </ul>
          </CardContent>
        </Card>


      </div>

      <Footer />
    </div>
  );
};

export default ConstructionCantine;
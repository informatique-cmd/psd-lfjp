import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Button } from '../components/ui/button';
import { 
  Shield, 
  Users, 
  AlertTriangle,
  Target,
  MessageCircle,
  UserCheck,
  Mail,
  Phone,
  ArrowLeft,
  Home,
  FileText,
  Heart,
  Eye,
  BookOpen,
  Network
} from 'lucide-react';

const ProtocolePHARE = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-raleway">
      <Navbar showLogo={true} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <Shield className="h-16 w-16 text-white" />
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold mb-4 opacity-0 animate-fade-in">
                NON AU HARCÈLEMENT
              </h1>
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-purple-200 opacity-0 animate-fade-in-delay-1">
                PROTOCOLE PHARE
              </h2>
            </div>
          </div>
          <p className="text-xl md:text-2xl font-raleway font-light max-w-4xl opacity-0 animate-fade-in-delay-2">
            Lycée Français Jacques Prévert de Saly - Plan de prévention du harcèlement
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

      {/* Content */}
      <div className="flex-1 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6 py-12">

          {/* Introduction */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                Priorité absolue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg leading-relaxed">
                Le harcèlement est une violence qui peut avoir des conséquences graves et multiples sur les victimes. 
                La prévention et la lutte contre le harcèlement à l'École est une priorité.
              </p>
              <p className="text-lg leading-relaxed">
                Le ministère chargé de l'éducation nationale a arrêté un ensemble de mesures qui se décline sur 
                l'ensemble des territoires afin de combattre toutes les formes de harcèlement entre élèves.
              </p>
            </CardContent>
          </Card>

          {/* Définition du harcèlement */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <FileText className="h-6 w-6 text-blue-500" />
                Qu'est-ce que le harcèlement entre élèves ?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg leading-relaxed">
                Le harcèlement est une violence répétée, physique, verbale ou psychologique perpétrée par un ou plusieurs 
                élèves à l'encontre d'un de leurs camarades et ayant pour objet (ou pour effet) une dégradation de ses 
                conditions de vie se traduisant par une altération de sa santé physique ou mentale.
              </p>
              <p className="text-lg leading-relaxed">
                Avec le développement des nouvelles technologies et des réseaux sociaux, il dépasse le cadre scolaire 
                et affecte aussi les jeunes à travers le cyberharcèlement.
              </p>
              <p className="text-lg leading-relaxed font-medium text-red-600">
                Les victimes sont souvent seules face à cette menace diffuse.
              </p>
            </CardContent>
          </Card>

          {/* Caractéristiques du harcèlement */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Eye className="h-6 w-6 text-orange-500" />
                Identifier le harcèlement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-6">On observe trois types d'acteurs : la ou les victimes, le/la ou les harceleurs (ses), et les témoins.</p>
              <p className="text-lg mb-6 font-medium">On peut considérer qu'il y a harcèlement quand :</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3"></div>
                  <span>un rapport de force et de domination s'installe entre un ou plusieurs élèves et une ou plusieurs victimes</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3"></div>
                  <span>il y a répétition : différentes formes d'agressions se répètent régulièrement durant une longue période</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3"></div>
                  <span>isolement/abandon : la victime est isolée et mise à l'écart par le groupe. Ou dans d'autres cas, la victime s'enferme sur elle-même et se trouve dans l'incapacité de trouver les réponses appropriées pour s'en sortir.</span>
                </li>
              </ul>

              <div className="bg-red-50 p-6 rounded-lg mt-6">
                <h4 className="font-semibold text-lg mb-4 text-red-800">De graves conséquences</h4>
                <p className="mb-4">Les conséquences sur le bien-être et la santé mentale des jeunes victimes sont nombreuses :</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <span>décrochage scolaire voire déscolarisation (des études montrent que la peur des agressions expliquerait 25 % de l'absentéisme des collégiens et lycéens)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <span>désocialisation, anxiété, dépression</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <span>somatisation (maux de tête, de ventre, maladies)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <span>conduites autodestructrices, voire suicidaires</span>
                  </li>
                </ul>
                <p className="mt-4 font-medium">
                  L'objectif premier est la détection précoce des situations de harcèlement pour empêcher leur dégradation et permettre leur résolution.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cyberharcèlement */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Network className="h-6 w-6 text-cyan-500" />
                Le cybersexisme et cyberharcèlement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg leading-relaxed">
                D'après une étude réalisée par l'Observatoire universitaire international éducation et prévention 
                (OUIEP-université Paris-Est) et coordonnée par le Centre Hubertine Auclert auprès de 1 200 élèves 
                de collège et lycée en Île-de-France en 2016, les filles sont davantage exposées à des formes 
                spécifiques de cyberviolences à caractère sexiste et sexuel. On parle alors de cybersexisme.
              </p>
              <p className="text-lg leading-relaxed">
                Le cyberharcèlement est défini comme « un acte agressif, intentionnel perpétré par un individu ou 
                un groupe d'individus au moyen de formes de communication électroniques, de façon répétée à l'encontre 
                d'une victime qui ne peut facilement se défendre seule ». Il peut prendre la forme, par exemple, de 
                moqueries ou de menaces en lignes, de publication de photos ou de contenus montrant un élève en 
                mauvaise posture, ou encore de sexting non consenti.
              </p>
              <p className="text-lg leading-relaxed">
                L'anonymat, la viralité, la solitude des victimes derrière leur écran sont des caractéristiques 
                particulières du cyberharcèlement qui entraînent des conséquences pouvant être d'une gravité particulière.
              </p>
            </CardContent>
          </Card>

          {/* Programme pHARe */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Shield className="h-6 w-6 text-purple-500" />
                Le programme pHARe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg leading-relaxed">
                Le programme de lutte contre le harcèlement à l'École, « Phare », dote les écoles élémentaires et 
                les établissements scolaires d'un plan de prévention du harcèlement entre élèves fondé autour de 5 piliers :
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                      <span className="font-semibold">1. Éduquer</span>
                    </div>
                    <p className="text-sm">pour prévenir les phénomènes de harcèlement</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-green-500" />
                      <span className="font-semibold">2. Former</span>
                    </div>
                    <p className="text-sm">une communauté protectrice de professionnels et de personnels pour les élèves</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-yellow-500" />
                      <span className="font-semibold">3. Intervenir</span>
                    </div>
                    <p className="text-sm">efficacement sur les situations de harcèlement</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="h-5 w-5 text-blue-500" />
                      <span className="font-semibold">4. Associer</span>
                    </div>
                    <p className="text-sm">les parents et les partenaires, communiquer sur le programme</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <UserCheck className="h-5 w-5 text-orange-500" />
                      <span className="font-semibold">5. Mobiliser</span>
                    </div>
                    <p className="text-sm">les instances de démocratie scolaire (Conseil des élèves, CVC, CVL) et le comité de pilotage E3D</p>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <p className="text-lg leading-relaxed">
                  Il se présente sous la forme d'un <strong>échéancier d'actions à mettre en place tout au long de l'année scolaire</strong>. 
                  Les personnels impliqués dans le programme s'appuient sur une plateforme digitale sur laquelle de nombreuses ressources sont mises à leur disposition.
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  Phare est un moyen de créer une communauté protectrice qui participe à l'amélioration du climat scolaire, 
                  s'appuyant sur les personnels, des élèves ambassadeurs et les parents d'élèves.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions éducatives */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Éduquer */}
            <Card className="h-full" style={{backgroundColor: '#4A90E2'}}>
              <CardContent className="p-6 text-white h-full">
                <h3 className="text-xl font-bold mb-4 text-purple-200">Éduquer pour prévenir les phénomènes de harcèlement (10h par an)</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">À l'école maternelle :</h4>
                    <p className="text-sm leading-relaxed">
                      Verbaliser les émotions, pratiquer des jeux coopératifs, des travaux collectifs, 
                      développer l'empathie, éduquer au respect des différences et au consentement.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">À l'école élémentaire :</h4>
                    <p className="text-sm leading-relaxed">
                      EMC, développement des compétences psycho-sociales, pratiques inclusives, éducation au message clair, 
                      jeux de rôles, jeux collaboratifs, concours « non au harcèlement », médiation entre pairs, 
                      banc de l'amitié, éducation aux réseaux sociaux.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Au collège et au lycée :</h4>
                    <p className="text-sm leading-relaxed">
                      EMC, heures de vie de classe, développement des compétences psycho-sociales, sensibilisation au harcèlement, 
                      cyberharcèlement, cybersexisme, et à la protection des données.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Former */}
            <Card className="h-full" style={{backgroundColor: '#7CB342'}}>
              <CardContent className="p-6 text-white h-full">
                <h3 className="text-xl font-bold mb-4 text-purple-200">Former une communauté protectrice de professionnels et de personnels pour les élèves</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Personnels de direction, professeurs, CPE, AED, Services civiques :</h4>
                    <ul className="text-sm space-y-1">
                      <li>1. constitution d'un pôle ressources de personnels de services différents (regards croisés)</li>
                      <li>2. formation à la méthode de la préoccupation partagée</li>
                      <li>3. mise à disposition de ressources documentaires</li>
                      <li>4. Formation AEFE : Climat scolaire, bien-être et prévention des violences et du harcèlement (pHARe)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Élèves :</h4>
                    <ul className="text-sm space-y-1">
                      <li>1. identification des personnels ressource</li>
                      <li>2. formation à la médiation entre pairs (conseil des élèves, CVC, CVL)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Parents d'élèves :</h4>
                    <p className="text-sm">
                      1. mallette des parents pour identifier les situations de harcèlement et savoir comment agir
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Intervenir */}
            <Card className="h-full" style={{backgroundColor: '#FFB300'}}>
              <CardContent className="p-6 text-white h-full">
                <h3 className="text-xl font-bold mb-4 text-purple-800">Intervenir efficacement sur les situations de harcèlement</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">1. Qui alerter ?</h4>
                    <p className="text-sm">
                      Membre du pôle ressource, enseignants, CPE, AED, parent, personnel de direction
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">2. Comment alerter ?</h4>
                    <p className="text-sm mb-2">Directement</p>
                    <p className="text-sm">Adresse mail : cpe@lfjpsaly.org</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">3. Prise en charge de la victime, des harceleurs, des témoins, par des intervenants différents</h4>
                    <p className="text-sm">Demande de témoignages écrits.</p>
                    <p className="text-sm">Qui ? Membres du Pôle ressource</p>
                    <p className="text-sm">Quand ? Le plus tôt possible</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">4. Entretiens individuels répétés selon la méthode de la préoccupation partagée jusqu'à résolution</h4>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">5. Alerter les parents de la victime uniquement</h4>
                    <p className="text-sm">Qui ? Le référent de l'élève</p>
                    <p className="text-sm">Quand ? Dès que la victime est entendue (si mineure)</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">6. Pas de confrontation (sauf à la demande de la victime)</h4>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">7. Fiche de suivi</h4>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Associer */}
            <Card className="h-full" style={{backgroundColor: '#42A5F5'}}>
              <CardContent className="p-6 text-white h-full">
                <h3 className="text-xl font-bold mb-4 text-purple-200">Associer les parents et les partenaires, communiquer sur le programme</h3>
                <div className="space-y-4">
                  <ul className="text-sm space-y-2">
                    <li>1. Diffusion du protocole sur le site du Lycée Jacques Prévert de Saly</li>
                    <li>2. Intervention de l'infirmière</li>
                    <li>3. Partenaires de santé présents à Saly (psychologue, médecin généraliste...)</li>
                    <li>4. Échanger autour des pratiques au sein des autres établissements français de la Zone Afrique de l'Ouest (ZAO)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Mobiliser */}
            <Card className="h-full" style={{backgroundColor: '#FF7043'}}>
              <CardContent className="p-6 text-white h-full">
                <h3 className="text-xl font-bold mb-4 text-purple-200">Mobiliser les instances de démocratie scolaire (Conseil des élèves, CVC, CVL), CHSCS, parcours santé et citoyenneté</h3>
                <div className="space-y-4">
                  <ul className="text-sm space-y-2">
                    <li>1. Intervention d'ambassadeurs lycéens auprès des écoliers et collégiens</li>
                    <li>2. Valorisation des productions d'élèves dès le cycle 2 par diffusion auprès des autres classes, expositions, sur le site du LFJP et les réseaux sociaux</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Protocole d'intervention */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Network className="h-6 w-6 text-green-500" />
                Protocole de lutte contre le harcèlement et les intimidations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-center mb-6">
                  <h4 className="text-lg font-semibold text-blue-600 mb-2">Membres du Pôle ressource :</h4>
                  <p className="text-gray-700">CPE, Directrice, Proviseur, tous les professeurs de primaire, ...</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-orange-100 p-4 rounded-lg text-center">
                    <h5 className="font-semibold mb-2">Révélation des faits</h5>
                  </div>
                  <div className="bg-green-100 p-4 rounded-lg text-center">
                    <h5 className="font-semibold mb-2">Signalement à un membre du pôle</h5>
                    <Phone className="mx-auto h-6 w-6 text-green-600" />
                    <Users className="mx-auto h-6 w-6 text-green-600 mt-1" />
                  </div>
                  <div className="bg-green-100 p-4 rounded-lg text-center">
                    <h5 className="font-semibold mb-2">Le pôle ressource prend en compte la situation et détermine qui prend en charge la cible</h5>
                    <Users className="mx-auto h-6 w-6 text-green-600" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-orange-100 p-4 rounded-lg text-center">
                    <h5 className="font-semibold mb-2">Premier entretien avec la « cible »</h5>
                    <MessageCircle className="mx-auto h-6 w-6 text-orange-600" />
                  </div>
                  <div className="bg-purple-100 p-4 rounded-lg text-center">
                    <h5 className="font-semibold mb-2">Premier entretien avec les intimidateurs présumés</h5>
                    <MessageCircle className="mx-auto h-6 w-6 text-purple-600" />
                  </div>
                </div>

                <div className="bg-green-100 p-4 rounded-lg text-center mb-6">
                  <h5 className="font-semibold mb-2">Le pôle ressource décide s'il faut appliquer la méthode Pikas ou non</h5>
                  <div className="flex justify-center gap-8 mt-4">
                    <div className="text-center">
                      <h6 className="font-medium">Autre</h6>
                    </div>
                    <div className="text-center">
                      <h6 className="font-medium">Pikas</h6>
                      <Users className="mx-auto h-6 w-6 text-green-600 mt-1" />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-orange-100 p-4 rounded-lg text-center">
                    <h5 className="font-semibold mb-2">Deuxième entretien avec la « cible »</h5>
                    <MessageCircle className="mx-auto h-6 w-6 text-orange-600" />
                  </div>
                  <div className="bg-purple-100 p-4 rounded-lg text-center">
                    <h5 className="font-semibold mb-2">Deuxième entretien avec les intimidateurs présumés</h5>
                    <MessageCircle className="mx-auto h-6 w-6 text-purple-600" />
                  </div>
                </div>

                <div className="bg-green-100 p-4 rounded-lg text-center mb-6">
                  <h5 className="font-semibold mb-2">Bilan du Pôle ressource</h5>
                  <Users className="mx-auto h-6 w-6 text-green-600" />
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg text-center border">
                    <h5 className="font-semibold mb-2">Résolution de la situation</h5>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center border">
                    <h5 className="font-semibold mb-2">Passage à une autre méthode</h5>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center border">
                    <h5 className="font-semibold mb-2">Rencontre au sommet</h5>
                  </div>
                </div>

                <div className="bg-green-100 p-4 rounded-lg text-center mb-6">
                  <h5 className="font-semibold mb-2">Bilan de fin de prise en charge</h5>
                  <Users className="mx-auto h-6 w-6 text-green-600" />
                </div>

                <div className="bg-yellow-100 p-4 rounded-lg text-center">
                  <h5 className="font-semibold mb-2">Restons vigilants !</h5>
                  <div className="flex justify-center gap-2">
                    <Eye className="h-6 w-6 text-yellow-600" />
                    <MessageCircle className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Mail className="h-6 w-6 text-blue-500" />
                Contact et signalement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-lg font-semibold mb-4">Pour signaler une situation de harcèlement :</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span className="text-lg">cpe@lfjpsaly.org</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span className="text-lg">directriceprimaire@lfjpsaly.org</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span className="text-lg">proviseur@lfjpsaly.org</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  N'hésitez pas à nous contacter. Chaque signalement est pris au sérieux et traité avec confidentialité.
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProtocolePHARE;
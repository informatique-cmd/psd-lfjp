import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Home, GraduationCap, Users, BookOpenCheck, HeartHandshake, FileCheck2, Megaphone } from 'lucide-react';

const CelebrationReussitesDiplomes = () => {
  const ceremonies = [
    {
      title: 'Diplôme National du Brevet',
      description:
        'Une cérémonie sobre et collective pour marquer l’entrée dans le lycée, en présence des familles et des équipes éducatives.'
    },
    {
      title: 'Baccalauréat',
      description:
        'Remise institutionnelle des diplômes, célébrant le chemin parcouru par chaque élève et l’appui du collectif LFJP.'
    },
    {
      title: 'Reconnaissance du parcours',
      description:
        'Temps de célébration qui valorisent l’engagement, la persévérance et les progrès, sans classement ni palmarès.'
    }
  ];

  const academicProgress = [
    'Progressions individuelles rendues visibles dans chaque discipline et sur l’ensemble du parcours.',
    'Parcours de remobilisation réussis grâce à l’accompagnement et au tutorat.',
    'Projets pédagogiques aboutis, présentés à la communauté sans logique d’excellence élitiste.',
    'Travaux collectifs qui mettent en avant la coopération et la persévérance des élèves.'
  ];

  const engagements = [
    'Engagement citoyen dans les instances, clubs et actions de solidarité.',
    'Rôle de délégué et responsabilités assumées au service du collectif.',
    'Projets solidaires ou environnementaux menés avec la communauté éducative.',
    'Initiatives personnelles valorisant l’entraide, l’écoute et la prise de responsabilité.'
  ];

  const artsCultureSport = [
    'Pratiques artistiques et culturelles, expositions et représentations dans le cadre du PEAC.',
    'Projets menés avec des partenaires culturels et mise en valeur des productions d’élèves.',
    'Activités sportives qui renforcent l’esprit d’équipe, l’effort partagé et la cohésion.',
    'Valorisation du travail d’équipe, du fair-play et de l’investissement sur la durée.'
  ];

  const parcoursApresLfjp = [
    'Témoignages d’anciens élèves illustrant la diversité des parcours et des réussites.',
    'Réussites dans l’enseignement supérieur et dans les voies professionnelles choisies.',
    'Accompagnement à l’orientation réussie, en lien avec les équipes et les familles.',
    'Lien renforcé avec la rubrique « Les Oiseaux de Passage » pour suivre les trajectoires.'
  ];

  const dispositifs = [
    {
      title: 'Temps de valorisation collectifs',
      description: 'Moments réguliers pour partager les réussites de classe, de niveau ou d’établissement.'
    },
    {
      title: 'Publications dans Le Petit Prévert',
      description: 'Articles dédiés aux projets, parcours et engagements, co-rédigés avec les élèves.'
    },
    {
      title: 'Attestations d’engagement ou de persévérance',
      description: 'Documents institutionnels remis lors des cérémonies ou conseils, sans logique de récompense.'
    },
    {
      title: 'Mur des réussites',
      description: 'Espace physique ou numérique pour afficher les projets, photos et témoignages à venir.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col font-raleway bg-slate-50 text-slate-900">
      <Navbar showLogo={true} />

      <header className="bg-gradient-to-br from-french-blue via-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-6 py-20 md:py-28">
          <p className="uppercase tracking-[0.35em] text-xs md:text-sm text-white/80">PSD 2026-2030 · Axe 4 — Façonner les réussites</p>
          <h1 className="mt-4 text-3xl md:text-5xl font-playfair font-bold">Célébration des réussites et des diplômes</h1>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-6 py-10 md:py-14 space-y-12">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild className="bg-white text-french-blue border-french-blue hover:bg-french-blue hover:text-white">
              <Link to="/plan-strategique" state={{ axe: 'axe4' }}>
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden /> Retour au Plan stratégique
              </Link>
            </Button>
            <Button variant="outline" asChild className="bg-white text-french-blue border-french-blue hover:bg-french-blue hover:text-white">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" aria-hidden /> Accueil
              </Link>
            </Button>
          </div>

          <section aria-labelledby="intro-title" className="grid gap-6">
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-blue-100">
              <h2 id="intro-title" className="text-2xl md:text-3xl font-playfair font-semibold text-french-blue">
                Une réussite plurielle et inclusive
              </h2>
              <p className="mt-4 text-slate-700 leading-relaxed">
                La réussite au LFJP se mesure autant au chemin parcouru qu’au résultat final. Chaque progrès, chaque engagement et chaque diplôme illustre un parcours exigeant où les élèves sont accompagnés avec bienveillance et ambition.
              </p>
              <p className="mt-4 text-slate-700 leading-relaxed">
                Cette page s’inscrit explicitement dans l’Axe 4 du Plan Stratégique de Développement : « Façonner les réussites ». Elle valorise toutes les formes d’accomplissement, refuse la logique de classement et privilégie la reconnaissance collective.
              </p>
            </div>
          </section>

          <section aria-labelledby="ceremonies-title" className="space-y-6">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-french-blue" aria-hidden />
              <h2 id="ceremonies-title" className="text-2xl md:text-3xl font-playfair font-semibold text-slate-900">
                Diplômes et cérémonies officielles
              </h2>
            </div>
            <p className="text-slate-700 leading-relaxed max-w-4xl">
              Les remises de diplômes (DNB, Baccalauréat) sont conçues comme des moments symboliques et collectifs. Elles associent les familles, les équipes pédagogiques et les élèves pour honorer le parcours accompli, sans palmarès ni comparaison.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {ceremonies.map((item) => (
                <Card key={item.title} className="h-full border-blue-100">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-900">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 text-sm leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Emplacement pour insérer une galerie photo des cérémonies */}
          </section>

          <section aria-labelledby="academiques-title" className="grid gap-8 lg:grid-cols-[1.1fr,1fr]">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <BookOpenCheck className="h-7 w-7 text-french-blue" aria-hidden />
                <h2 id="academiques-title" className="text-2xl md:text-3xl font-playfair font-semibold text-slate-900">
                  Réussites académiques et progrès
                </h2>
              </div>
              <p className="text-slate-700 leading-relaxed max-w-3xl">
                Les progrès individuels et collectifs sont valorisés tout au long de l’année. Les réussites disciplinaires, les projets aboutis et les parcours de remobilisation témoignent de la persévérance des élèves et de l’accompagnement des équipes.
              </p>
              <ul className="space-y-3 text-slate-700 list-disc list-inside">
                {academicProgress.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-white border border-blue-100 p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-semibold text-french-blue flex items-center gap-2">
                <Megaphone className="h-5 w-5" aria-hidden />
                Mise en avant continue
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                Les réussites académiques sont présentées dans des temps collectifs, des expositions de travaux, des capsules vidéo ou des articles, toujours dans une logique de reconnaissance et de partage.
              </p>
              {/* Zone pour intégrer des témoignages d’élèves ou de professeurs */}
            </div>
          </section>

          <section aria-labelledby="engagements-title" className="grid gap-8 lg:grid-cols-[1fr,1fr]">
            <div className="rounded-3xl bg-white border border-blue-100 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <HeartHandshake className="h-7 w-7 text-french-blue" aria-hidden />
                <h2 id="engagements-title" className="text-2xl md:text-3xl font-playfair font-semibold text-slate-900">
                  Engagements et réussites personnelles
                </h2>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Les engagements citoyens, les responsabilités prises et les initiatives solidaires sont reconnus comme des réussites à part entière. Ils démontrent la capacité des élèves à contribuer au collectif et à persévérer dans leurs projets.
              </p>
              <ul className="space-y-3 text-slate-700 list-disc list-inside">
                {engagements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-blue-50 border border-blue-100 p-6 shadow-inner space-y-3">
              <h3 className="text-lg font-semibold text-french-blue">Parcours valorisés</h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                Les rôles de délégués, les projets citoyens et les initiatives environnementales sont présentés lors des assemblées, des journaux internes ou sur le mur des réussites. Chaque élève peut mesurer le chemin parcouru et le faire reconnaître.
              </p>
              {/* Placeholder pour citations ou courts témoignages d’élèves engagés */}
            </div>
          </section>

          <section aria-labelledby="arts-title" className="space-y-6">
            <div className="flex items-center gap-3">
              <Users className="h-7 w-7 text-french-blue" aria-hidden />
              <h2 id="arts-title" className="text-2xl md:text-3xl font-playfair font-semibold text-slate-900">
                Arts, culture et sport
              </h2>
            </div>
            <p className="text-slate-700 leading-relaxed max-w-4xl">
              Les pratiques artistiques, culturelles et sportives renforcent l’esprit collectif et l’investissement des élèves. Elles font partie intégrante de la réussite au LFJP et sont présentées sans logique de compétition.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {artsCultureSport.map((item) => (
                <Card key={item} className="border-blue-100 h-full">
                  <CardContent className="pt-6">
                    <p className="text-slate-700 leading-relaxed">{item}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Zone pour intégrer des visuels d’événements artistiques ou sportifs */}
          </section>

          <section aria-labelledby="parcours-title" className="grid gap-8 lg:grid-cols-[1fr,1.1fr]">
            <div className="rounded-3xl bg-white border border-blue-100 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <ArrowLeft className="h-6 w-6 text-french-blue" aria-hidden />
                <h2 id="parcours-title" className="text-2xl md:text-3xl font-playfair font-semibold text-slate-900">
                  Parcours après le LFJP
                </h2>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Les réussites se poursuivent après le lycée. Les élèves sont accompagnés dans leur orientation et restent en lien avec la communauté via la rubrique « Les Oiseaux de Passage ».
              </p>
              <ul className="space-y-3 text-slate-700 list-disc list-inside">
                {parcoursApresLfjp.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {/* Emplacement pour intégration de témoignages vidéo ou audio d’alumni */}
            </div>
            <div className="rounded-3xl bg-blue-50 border border-blue-100 p-6 shadow-inner space-y-4">
              <h3 className="text-lg font-semibold text-french-blue">Lien avec les alumni</h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                Les parcours supérieurs et professionnels sont valorisés dans les rencontres avec les élèves, les ateliers de mentorat et les communications régulières. Les familles et la communauté éducative sont associées pour inspirer les générations futures.
              </p>
              <Button variant="outline" asChild className="border-french-blue text-french-blue hover:bg-french-blue hover:text-white">
                <Link to="/reseau-alumni-mentorat">Découvrir le réseau des anciens élèves</Link>
              </Button>
            </div>
          </section>

          <section aria-labelledby="dispositifs-title" className="space-y-6">
            <div className="flex items-center gap-3">
              <FileCheck2 className="h-7 w-7 text-french-blue" aria-hidden />
              <h2 id="dispositifs-title" className="text-2xl md:text-3xl font-playfair font-semibold text-slate-900">
                Dispositifs de valorisation
              </h2>
            </div>
            <p className="text-slate-700 leading-relaxed max-w-4xl">
              Des dispositifs modulaires permettent de reconnaître les réussites de manière régulière et sobre. Ils sont pensés pour évoluer, sans promesse excessive et en respectant les valeurs de l’établissement.
            </p>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {dispositifs.map((item) => (
                <Card key={item.title} className="h-full border-blue-100">
                  <CardHeader>
                    <CardTitle className="text-base text-slate-900">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 text-sm leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Prévoir l’intégration d’un mur des réussites numérique avec filtres par parcours */}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CelebrationReussitesDiplomes;

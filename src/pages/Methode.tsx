import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightCircle, CheckCircle, RefreshCw, Users } from "lucide-react";

const steps = [
  {
    title: "Vérification des enjeux",
    description: "Clarifier le périmètre du plan stratégique, ses objectifs et le calendrier global (12 à 18 mois).",
  },
  {
    title: "Réalisation du diagnostic",
    description: "Recueillir données et perceptions pour dresser un état des lieux partagé.",
  },
  {
    title: "Analyse des résultats",
    description: "Identifier les points d'appui et les besoins prioritaires mis en lumière par le diagnostic.",
  },
  {
    title: "Identification des axes & options",
    description: "Structurer les grandes orientations qui guideront le plan stratégique.",
  },
  {
    title: "Plan d'action détaillé",
    description: "Construire les actions, jalons et indicateurs rattachés à chaque axe.",
  },
  {
    title: "Mise en œuvre, suivi & pilotage continu",
    description:
      "Déployer les actions, en suivre l'avancement et ajuster en continu grâce aux retours du terrain et aux instances de gouvernance.",
  },
];

const Methode = () => {
  return (
    <div className="min-h-screen flex flex-col font-raleway bg-white">
      <Navbar showLogo={true} />
      <Hero
        title="Démarche de réalisation du PSD"
        subtitle="Une méthode éprouvée et participative pour le Lycée Français Jacques Prévert"
      />

      <main className="flex-1">
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6 space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <p className="text-sm uppercase tracking-[0.2em] text-french-blue font-semibold">
                Démarche
              </p>
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-slate-900">
                6 étapes structurées sur 12 à 18 mois
              </h2>
              <p className="text-lg text-gray-600">
                Nous proposons d'emprunter une démarche éprouvée de réalisation de plan stratégique, organisée en
                étapes successives pour sécuriser les résultats.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {steps.map((step, index) => (
                <Card key={step.title} className="h-full border border-slate-100 shadow-sm">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-french-blue font-semibold">
                      <ArrowRightCircle className="h-5 w-5" />
                      <span>Étape {index + 1}</span>
                    </div>
                    <h3 className="text-xl font-playfair font-bold text-slate-900">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <Card className="border-none shadow-lg">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-3 text-french-blue">
                  <Users className="h-6 w-6" />
                  <p className="text-sm uppercase tracking-wide font-semibold">Approche participative & inclusive</p>
                </div>
                <h3 className="text-3xl font-playfair font-bold text-slate-900">
                  Une commission PSD mobilisée avec l'APE
                </h3>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    La commission PSD agit au service de l'APE. Un facteur clé de succès est la collaboration de l'ensemble
                    des parties prenantes : parents, élèves, corps enseignants et partenaires. À chaque étape, l'APE
                    intervient pour valider les orientations et les livrables.
                  </p>
                  <p>
                    Cette mobilisation collective garantit l'adéquation des propositions aux besoins du terrain et inscrit la
                    démarche dans une logique de co-construction.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-lg bg-blue-50 text-french-blue border border-blue-100 space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-wide">Rôle de la commission</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-french-blue/90">
                      <li>Coordonner l'avancement du plan.</li>
                      <li>Garantir l'inclusivité des échanges.</li>
                      <li>S'assurer de la cohérence avec les enjeux identifiés.</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 text-emerald-800 border border-green-100 space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-wide">Validation APE</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-emerald-700">
                      <li>Propositions à partir des idées et sondages.</li>
                      <li>Validation itérative des axes et actions.</li>
                      <li>Sollicitation régulière pour maintenir l'alignement.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="p-8 space-y-6 h-full flex flex-col">
                <div className="flex items-center gap-3 text-french-blue">
                  <RefreshCw className="h-6 w-6" />
                  <p className="text-sm uppercase tracking-wide font-semibold">Cycle de validation</p>
                </div>
                <h3 className="text-3xl font-playfair font-bold text-slate-900">Des boucles de validation régulières</h3>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Chaque étape de la démarche est soumise à validation : la commission PSD s'appuie sur les idées issues
                    des sondages et des groupes de travail pour formuler des propositions, présentées ensuite à l'APE.
                  </p>
                  <p>
                    En cas de besoin d'ajustement, un nouveau cycle d'aller-retour est enclenché jusqu'à validation. Cette
                    boucle garantit que la feuille de route finale soit partagée et réaliste.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-1" />
                    <div>
                      <p className="font-semibold text-slate-900">Feuille de route validée</p>
                      <p className="text-sm text-gray-600">Une fois validée, la mise en œuvre démarre immédiatement.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-1" />
                    <div>
                      <p className="font-semibold text-slate-900">Plan d'actions mis en œuvre</p>
                      <p className="text-sm text-gray-600">Le suivi continu garantit l'impact et la pertinence des actions.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Methode;

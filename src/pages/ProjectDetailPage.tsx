import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BreadcrumbNav from '@/components/Breadcrumb';
import BackToTop from '@/components/BackToTop';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Building2,
  Calendar,
  CheckCircle,
  Coins,
  Euro,
  ArrowLeft,
  Home,
  Clock,
  Sparkles,
  Layers,
  BarChart3,
  Users,
  Target,
  FileText,
  ShieldCheck,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  Sun,
  Trees,
  UtensilsCrossed,
  Wind,
  Waves,
  Wrench,
} from 'lucide-react';
import {
  defaultBudgetData,
  slugifyProject,
  getProjectDetailLink,
  type BudgetData,
  type BudgetProject,
} from '@/data/budgetTransportData';
import pageDataFile from '@/content/pageData.json';

const XOF_TO_EUR = 655.957;

const getCategoryDetails = (cat?: 'equipment' | 'infra' | 'land') => {
  switch (cat) {
    case 'equipment':
      return {
        label: 'Équipement & Transition',
        tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
        badge: 'Équipement',
        icon: Wrench,
      };
    case 'land':
      return {
        label: 'Foncier & Réserves foncières',
        tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        badge: 'Foncier',
        icon: Trees,
      };
    case 'infra':
    default:
      return {
        label: 'Infrastructures & Bâtiments',
        tagColor: 'bg-blue-100 text-blue-800 border-blue-200',
        badge: 'Infrastructure',
        icon: Building2,
      };
  }
};

const getProjectSpecificIcon = (id: string, title?: string, className = 'w-6 h-6') => {
  const s = `${id} ${title || ''}`.toLowerCase();
  if (s.includes('clim')) return <Wind className={className} />;
  if (s.includes('solaire') || s.includes('solar')) return <Sun className={className} />;
  if (s.includes('piscine') || s.includes('pool')) return <Waves className={className} />;
  if (s.includes('cantine') || s.includes('restauration')) return <UtensilsCrossed className={className} />;
  if (s.includes('foncier') || s.includes('terrain')) return <Trees className={className} />;
  return <Building2 className={className} />;
};

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [currency, setCurrency] = useState<'XOF' | 'EUR'>('XOF');

  // Load current budget data (localStorage draft -> pageDataFile -> default)
  const budgetData = useMemo<BudgetData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const draft = window.localStorage.getItem('lfjp-admin-page-data-draft');
        if (draft) {
          const parsed = JSON.parse(draft);
          if (parsed?.budgetData?.projects) {
            return parsed.budgetData as BudgetData;
          }
        }
      } catch {
        // fallback
      }
    }
    const fileBudget = (pageDataFile as { budgetData?: BudgetData }).budgetData;
    return fileBudget || defaultBudgetData;
  }, []);

  const projects = useMemo(() => {
    return budgetData.projects || defaultBudgetData.projects;
  }, [budgetData]);

  // Find project matching the slug
  const currentProject = useMemo<BudgetProject | undefined>(() => {
    if (!slug) return undefined;
    const cleanSlug = slug.toLowerCase().trim();

    return projects.find((p) => {
      const pId = p.id.toLowerCase();
      const pSlug = slugifyProject(p.title || p.name || p.id);
      const linkSlug = (p.link || '').replace(/^\/(projets|fiche-projet)\//, '').replace(/^\//, '').toLowerCase();

      return (
        pId === cleanSlug ||
        pSlug === cleanSlug ||
        linkSlug === cleanSlug ||
        p.id === `proj-${cleanSlug}` ||
        cleanSlug.includes(pSlug) ||
        pSlug.includes(cleanSlug)
      );
    });
  }, [projects, slug]);

  const totalCost = Number(currentProject?.totalCost) || Number(currentProject?.budget) || 0;
  const startYear = currentProject?.startYear || 2026;
  const duration = Math.max(1, currentProject?.durationYears || 1);
  const endYear = startYear + duration - 1;
  const annualAverage = Math.round(totalCost / duration);

  const formatCurrency = (amountInXOF?: number | null): string => {
    const num = typeof amountInXOF === 'number' && Number.isFinite(amountInXOF) ? amountInXOF : 0;
    if (currency === 'EUR') {
      const val = Math.round(num / XOF_TO_EUR);
      return `${val.toLocaleString('fr-FR').replace(/\s/g, ' ')} €`;
    }
    return `${num.toLocaleString('fr-FR').replace(/\s/g, ' ')} FCFA`;
  };

  const catMeta = getCategoryDetails(currentProject?.category);
  const CategoryIcon = catMeta.icon;

  if (!currentProject) {
    return (
      <div className="min-h-screen flex flex-col font-raleway bg-slate-50">
        <Navbar showLogo={true} />
        <BreadcrumbNav />
        <main className="container mx-auto px-6 py-16 flex-1 max-w-3xl">
          <Card className="border-slate-200 shadow-md p-8 text-center space-y-5 bg-white rounded-2xl">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#005BAC] flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold font-playfair text-slate-900">
              Fiche de projet introuvable
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Le projet associé au lien <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-blue-700">/projets/{slug}</span> n'a pas été trouvé ou a été renommé.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="default"
                className="bg-[#005BAC] hover:bg-blue-700 cursor-pointer"
                onClick={() => navigate('/budget-cadre-vie-infrastructures')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au budget Axe 1
              </Button>
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => navigate('/espace-direction')}
              >
                SuperAdmin
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 text-left">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Projets programmés disponibles :
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {projects.map((p) => (
                  <Link
                    key={p.id}
                    to={getProjectDetailLink(p)}
                    className="p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition flex items-center justify-between text-xs font-semibold text-slate-800"
                  >
                    <span>{p.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>
          </Card>
        </main>
        <Footer />
        <BackToTop />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-raleway bg-slate-50/60 text-slate-800">
      <Navbar showLogo={true} />
      <BreadcrumbNav />

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#0B2545] via-[#133E68] to-[#005BAC] text-white py-12 md:py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/budget-cadre-vie-infrastructures')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Budget Axe 1</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Accueil</span>
              </button>
            </div>

            {/* Currency selector in hero */}
            <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-xs p-1 border border-white/20">
              <button
                type="button"
                onClick={() => setCurrency('XOF')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full transition cursor-pointer ${
                  currency === 'XOF'
                    ? 'bg-white text-[#005BAC] shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span>FCFA</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrency('EUR')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full transition cursor-pointer ${
                  currency === 'EUR'
                    ? 'bg-white text-[#005BAC] shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Euro className="w-3.5 h-3.5" />
                <span>Euros</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/15 border border-white/25 text-blue-100 flex items-center gap-1.5">
                  <CategoryIcon className="w-3.5 h-3.5" />
                  {catMeta.label}
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {currentProject.isActive !== false ? 'Projet Actif Programmé' : 'Projet Hors Budget Actif'}
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-400/20 text-blue-100 border border-blue-300/30 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {currentProject.period || `${startYear} – ${endYear}`}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 text-white mt-1">
                  {getProjectSpecificIcon(currentProject.id, currentProject.title, 'w-6 h-6')}
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-white tracking-tight leading-tight">
                    {currentProject.title}
                  </h1>
                  <p className="text-sm sm:text-base text-blue-100/90 font-light mt-1">
                    Fiche détaillée d'investissement • Plan Stratégique LFJP Saly
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shrink-0 min-w-[240px] text-right md:text-right">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-200 block">
                Budget prévisionnel total
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-bold text-white block mt-1">
                {formatCurrency(totalCost)}
              </span>
              <span className="text-[11px] text-blue-200/80 block mt-1">
                {currency === 'XOF' ? 'Montant alloué en Francs CFA' : 'Montant converti en Euros (€)'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container mx-auto px-6 py-10 max-w-6xl space-y-8 flex-1">
        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl p-5 bg-white border border-slate-200/80 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Budget total alloué
            </span>
            <p className="text-xl font-bold font-mono text-[#005BAC]">
              {formatCurrency(totalCost)}
            </p>
            <span className="text-[11px] text-slate-500 block">
              Enveloppe d'investissement dédiée
            </span>
          </div>

          <div className="rounded-2xl p-5 bg-white border border-slate-200/80 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Période d'exécution
            </span>
            <p className="text-xl font-bold font-mono text-emerald-700">
              {startYear} {duration > 1 ? `– ${endYear}` : ''}
            </p>
            <span className="text-[11px] text-slate-500 block">
              {duration} exercice{duration > 1 ? 's' : ''} budgétaire{duration > 1 ? 's' : ''}
            </span>
          </div>

          <div className="rounded-2xl p-5 bg-white border border-slate-200/80 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Dépense annuelle moy.
            </span>
            <p className="text-xl font-bold font-mono text-amber-700">
              {formatCurrency(annualAverage)} / an
            </p>
            <span className="text-[11px] text-slate-500 block">
              Lissage budgétaire pluriannuel
            </span>
          </div>

          <div className="rounded-2xl p-5 bg-white border border-slate-200/80 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Axe stratégique
            </span>
            <p className="text-xl font-bold text-slate-800 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-french-blue shrink-0" />
              <span>Axe 1</span>
            </p>
            <span className="text-[11px] text-slate-500 block truncate">
              Cadre de vie & infrastructures
            </span>
          </div>
        </div>

        {/* Section 1 : Contexte et Présentation */}
        <Card className="border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 p-5">
            <CardTitle className="text-base sm:text-lg font-bold font-playfair text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-french-blue" />
              1. Contexte & Justification du Projet
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-sm text-slate-600 leading-relaxed">
            {currentProject.description && currentProject.description.trim() ? (
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-slate-800 text-sm font-medium leading-relaxed">
                {currentProject.description}
              </div>
            ) : null}

            <p>
              Ce projet s'inscrit au cœur de la feuille de route 2026–2030 du Lycée Français Jacques Prévert (LFJP) de Saly.
              Il répond directement aux orientations définies lors des concertations avec l'Association des Parents d'Élèves (APE)
              et l'équipe de direction, visant à moderniser les infrastructures, garantir la sécurité et le bien-être de l'ensemble
              des élèves de la maternelle au lycée.
            </p>
            <p>
              Dans le cadre de l'Axe 1 « Cadre de vie & Infrastructures », cet investissement bénéficie d'un suivi financier
              rigoureux intégrant la capacité d'autofinancement socle de l'établissement, les subventions et concours extérieurs (notamment ANEFE)
              ainsi que les leviers de modulation budgétaire progressifs.
            </p>
          </CardContent>
        </Card>

        {/* Section 2 : Objectifs opérationnels et bénéfices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-slate-200 bg-white rounded-2xl shadow-xs">
            <CardHeader className="border-b border-slate-100 p-5">
              <CardTitle className="text-base font-bold font-playfair text-slate-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                Objectifs opérationnels
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>
                    Réalisation conforme aux normes de sécurité des Établissements Recevant du Public (ERP) homologués AEFE.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>
                    Livraison échelonnée selon le calendrier pluriannuel ({startYear} à {endYear}) sans perturber le temps scolaire.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>
                    Optimisation de l'empreinte environnementale et maîtrise des coûts énergétiques et d'exploitation futurs.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>
                    Validation formelle par la commission travaux et présentation détaillée lors des assemblées générales APE.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white rounded-2xl shadow-xs">
            <CardHeader className="border-b border-slate-100 p-5">
              <CardTitle className="text-base font-bold font-playfair text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-french-blue" />
                Bénéfices pour la communauté
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <span>
                    <strong>Élèves :</strong> Confort d'apprentissage accru, espaces sécurisés et pratiques sportives / périscolaires améliorées.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <span>
                    <strong>Équipes pédagogiques :</strong> Meilleures conditions de travail, modularité des espaces et équipements modernes.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <span>
                    <strong>Familles & APE :</strong> Valorisation du patrimoine scolaire de l'établissement et transparence financière totale.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <span>
                    <strong>Pérennité du site :</strong> Préservation et anticipation des besoins d'extension démographique sur la Petite Côte.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Section 3 : Échéancier pluriannuel des dépenses */}
        <Card className="border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 p-5 flex flex-row items-center justify-between">
            <CardTitle className="text-base sm:text-lg font-bold font-playfair text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-french-blue" />
              Échéancier budgétaire pluriannuel ({startYear} – {endYear})
            </CardTitle>
            <span className="text-xs font-mono font-bold text-[#005BAC]">
              Total : {formatCurrency(totalCost)}
            </span>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-xs sm:text-sm text-slate-600">
              Décomposition prévisionnelle des flux financiers imputés sur les exercices budgétaires du plan stratégique :
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Exercice</th>
                    <th className="py-2.5 px-3">Phase / Travaux</th>
                    <th className="py-2.5 px-3 text-right">Quote-part (%)</th>
                    <th className="py-2.5 px-3 text-right font-bold text-slate-700">Dépense annuelle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {Array.from({ length: duration }, (_, i) => {
                    const yr = startYear + i;
                    const pct = Math.round(100 / duration);
                    return (
                      <tr key={yr} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-3 font-sans font-bold text-slate-800">{yr}</td>
                        <td className="py-3 px-3 font-sans text-slate-600">
                          {duration === 1
                            ? 'Réalisation & mise en service intégrale'
                            : i === 0
                            ? 'Études techniques, marchés & phase 1'
                            : i === duration - 1
                            ? 'Achèvement des travaux & réception finale'
                            : `Déploiement phase ${i + 1}`}
                        </td>
                        <td className="py-3 px-3 text-right text-slate-500">{pct} %</td>
                        <td className="py-3 px-3 text-right font-bold text-[#0A6C74]">
                          {formatCurrency(annualAverage)}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-slate-50 font-bold border-t-2 border-slate-200">
                    <td className="py-3 px-3 font-sans text-slate-900">Total cumulé</td>
                    <td className="py-3 px-3 font-sans text-slate-500">{duration} an(s) d'investissements</td>
                    <td className="py-3 px-3 text-right font-sans text-slate-800">100 %</td>
                    <td className="py-3 px-3 text-right font-mono text-[#005BAC]">
                      {formatCurrency(totalCost)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Visual Progress Bar */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-500 mb-1.5 block">
                Empreinte temporelle dans le calendrier 2026–2035 :
              </span>
              <div className="grid grid-cols-10 gap-1 text-center">
                {Array.from({ length: 10 }, (_, idx) => {
                  const y = 2026 + idx;
                  const isCovered = y >= startYear && y <= endYear;
                  return (
                    <div key={y} className="space-y-1">
                      <div
                        className={`h-3 rounded-sm transition ${
                          isCovered ? 'bg-[#005BAC]' : 'bg-slate-200/80'
                        }`}
                      />
                      <span className={`text-[9px] font-mono ${isCovered ? 'font-bold text-[#005BAC]' : 'text-slate-400'}`}>
                        {y}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4 : Gouvernance & Pilotage */}
        <Card className="border-slate-200 bg-white rounded-2xl shadow-xs">
          <CardHeader className="border-b border-slate-100 p-5">
            <CardTitle className="text-base sm:text-lg font-bold font-playfair text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-french-blue" />
              Gouvernance, Pilotage & Engagements
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Maîtrise d'ouvrage
                </span>
                <p className="font-bold text-slate-800">
                  Association des Parents d'Élèves (APE) & Direction LFJP
                </p>
                <p className="text-slate-500 text-xs">
                  Validation des cahiers des charges et supervision administrative.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Contrôle & Suivi
                </span>
                <p className="font-bold text-slate-800">
                  Commission Travaux & Cadre de Vie
                </p>
                <p className="text-slate-500 text-xs">
                  Réunions de chantier régulières et comptes rendus d'avancement.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Homologation & Qualité
                </span>
                <p className="font-bold text-slate-800">
                  Réseau AEFE & Normes locales
                </p>
                <p className="text-slate-500 text-xs">
                  Garantie décennale et respect des standards éducatifs français.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Navigation Bar */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => navigate('/budget-cadre-vie-infrastructures')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au budget Cadre de Vie
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => navigate('/plan-strategique')}
            >
              Plan Stratégique complet
            </Button>
            <Button
              variant="default"
              className="bg-[#005BAC] hover:bg-blue-700 text-white cursor-pointer"
              onClick={() => navigate('/espace-direction')}
            >
              Espace SuperAdmin
              <ExternalLink className="w-3.5 h-3.5 ml-2" />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default ProjectDetailPage;

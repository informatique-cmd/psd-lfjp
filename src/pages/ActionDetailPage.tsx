import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LocaleNumberInput } from '@/components/ui/locale-number-input';
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Coins,
  Euro,
  Home,
  Layers,
  Plus,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import pageDataFile from '@/content/pageData.json';
import { defaultPsdAxesData, type PsdAxesData } from '@/data/psdAxesData';
import {
  normalizeActionSlug,
  resolveActionPage,
  type ActionDetailPageData,
  type ActionPageIndicator,
  type ActionPagesMap,
} from '@/data/actionPageData';
import { useContentDraft } from '@/lib/contentDraft';
import { usePublishedPageData } from '@/lib/publishedDataSync';
import { usePrivilegedAccess } from '@/lib/authAccess';
import { sanitizeActionPages } from '@/lib/pageDataSanitizer';

const XOF_TO_EUR = 655.957;
const STATUS_OPTIONS: ActionPageIndicator['status'][] = [
  'Planifié',
  'En cours',
  'Avancé',
  'Objectif atteint',
];

const fallbackBundle = {
  ...pageDataFile,
  psdAxesData: (pageDataFile as { psdAxesData?: PsdAxesData }).psdAxesData || defaultPsdAxesData,
  actionPages: (pageDataFile as { actionPages?: ActionPagesMap }).actionPages || {},
};

export interface ActionDetailPageProps {
  overrideSlug?: string;
}

const ActionDetailPage: React.FC<ActionDetailPageProps> = ({ overrideSlug }) => {
  const { slug: routeSlug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [currency, setCurrency] = useState<'XOF' | 'EUR'>('XOF');
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const { isPrivileged, showEditorControls } = usePrivilegedAccess();
  const publishedData = usePublishedPageData(fallbackBundle);
  const pageData = useContentDraft('lfjp-admin-page-data-draft', publishedData);

  const psdAxesData: PsdAxesData = useMemo(
    () => (pageData?.psdAxesData as PsdAxesData) || defaultPsdAxesData,
    [pageData?.psdAxesData]
  );

  const actionPages: ActionPagesMap = useMemo(
    () => (pageData?.actionPages as ActionPagesMap) || {},
    [pageData?.actionPages]
  );

  const effectiveSlug = useMemo(() => {
    if (overrideSlug) return normalizeActionSlug(overrideSlug);
    if (routeSlug) return normalizeActionSlug(`/actions/${routeSlug}`);
    return '/actions/nouvelle-action';
  }, [overrideSlug, routeSlug]);

  const currentPage = useMemo<ActionDetailPageData | null>(
    () => resolveActionPage(actionPages, psdAxesData, effectiveSlug),
    [actionPages, psdAxesData, effectiveSlug]
  );

  const saveActionPage = (updated: ActionDetailPageData) => {
    if (!isPrivileged || !showEditorControls) return;
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem('lfjp-admin-page-data-draft');
      let currentDraft: Record<string, unknown> = {};
      if (raw) {
        try {
          currentDraft = JSON.parse(raw) || {};
        } catch {
          currentDraft = {};
        }
      }
      const prevMap = (currentDraft.actionPages as ActionPagesMap) || actionPages || {};
      const nextMap = sanitizeActionPages({
        ...prevMap,
        [updated.slug]: updated,
      });

      const merged = {
        ...currentDraft,
        actionPages: nextMap,
      };
      window.localStorage.setItem('lfjp-admin-page-data-draft', JSON.stringify(merged));
      window.dispatchEvent(
        new CustomEvent('lfjp_page_data_changed', {
          detail: { actionPages: nextMap },
        })
      );
      window.dispatchEvent(new Event('storage'));
      if (window.parent && window.parent !== window) {
        try {
          window.parent.postMessage(
            { type: 'lfjp_psd_axes_updated', actionPages: nextMap },
            '*'
          );
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error('Failed to save action page draft', err);
    }
  };

  if (!currentPage) {
    return (
      <div className="min-h-screen flex flex-col font-raleway bg-slate-50">
        <Navbar showLogo={true} />
        <main className="container mx-auto px-6 py-16 flex-1 max-w-3xl">
          <Card className="border-slate-200 shadow-md p-8 text-center space-y-5 bg-white rounded-2xl">
            <h1 className="text-2xl font-bold font-playfair text-slate-900">
              Fiche d&apos;action introuvable
            </h1>
            <p className="text-sm text-slate-600">
              La fiche demandée n&apos;existe pas ou a été supprimée du Plan Stratégique.
            </p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => navigate('/plan-strategique')} className="bg-french-blue text-white">
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour au Plan Stratégique
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const budgetXof = Math.round((Number(currentPage.budgetMillions) || 0) * 1_000_000);
  const formatBudget = () => {
    if (currency === 'EUR') {
      const eur = Math.round(budgetXof / XOF_TO_EUR);
      return `${eur.toLocaleString('fr-FR').replace(/\s/g, ' ')} €`;
    }
    if (currentPage.budgetMillions > 0) {
      return `${currentPage.budgetMillions} M FCFA`;
    }
    return 'En cours de chiffrage';
  };

  const chartData = (currentPage.indicators || []).map((ind) => ({
    name: ind.name.length > 26 ? `${ind.name.slice(0, 24)}…` : ind.name,
    actuel: Math.max(0, Number(ind.currentRate) || 0),
    cible: Math.max(1, Number(ind.targetRate) || 100),
  }));

  const averageProgress =
    currentPage.indicators.length > 0
      ? Math.round(
          currentPage.indicators.reduce((acc, ind) => {
            const target = Number(ind.targetRate) > 0 ? Number(ind.targetRate) : 100;
            const cur = Math.max(0, Number(ind.currentRate) || 0);
            return acc + Math.min(100, (cur / target) * 100);
          }, 0) / currentPage.indicators.length
        )
      : 0;

  return (
    <div className="min-h-screen flex flex-col font-raleway bg-slate-50/60 text-slate-800">
      <Navbar showLogo={true} />

      {/* Hero Header (identique au modèle Climatisation durable / ProjectDetailPage) */}
      <section className="bg-gradient-to-br from-[#0B2545] via-[#133E68] to-[#005BAC] text-white py-12 md:py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/plan-strategique')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Retour au plan stratégique</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Accueil PSD</span>
              </button>
            </div>

            {currentPage.budgetMillions > 0 && (
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
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/15 border border-white/25 text-blue-100 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  {currentPage.badge || currentPage.rubriqueTitle}
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {currentPage.period || '2026 – 2030'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-white tracking-tight leading-tight">
                {currentPage.title}
              </h1>
              {currentPage.subtitle && (
                <p className="text-sm sm:text-base text-blue-100/90 font-light">
                  {currentPage.subtitle}
                </p>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shrink-0 min-w-[230px] text-right">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-200 block">
                Budget prévisionnel
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-bold text-white block mt-1">
                {formatBudget()}
              </span>
              <span className="text-[11px] text-blue-200/80 block mt-1">
                Avancement moyen : {averageProgress}%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10 max-w-6xl space-y-8 flex-1">
        {/* Espace Éditeur — strictement réservé à l'Éditeur et au Superadmin */}
        {isPrivileged && showEditorControls && (
          <div
            className="rounded-2xl border border-purple-200 bg-white p-4 sm:p-5 shadow-sm text-slate-800"
            data-interactive="true"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-bold text-purple-950 font-playfair">
                      Espace Éditeur · Fiche Action « {currentPage.title} »
                    </h2>
                    <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-full">
                      Privilège Éditeur
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Modifiez l&apos;ensemble des blocs de cette page dédiée dans l&apos;ordre d&apos;affichage avec synchronisation immédiate.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditorOpen(!isEditorOpen)}
                  className="border-purple-300 text-purple-800 hover:bg-purple-50 text-xs font-semibold cursor-pointer"
                >
                  {isEditorOpen ? (
                    <>
                      <ChevronUp className="mr-1.5 h-3.5 w-3.5" /> Masquer l’éditeur de données
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-1.5 h-3.5 w-3.5" /> Afficher / Ouvrir l’éditeur de données
                    </>
                  )}
                </Button>
              </div>
            </div>

            {isEditorOpen && (
              <div className="mt-4 space-y-5 animate-in fade-in duration-200">
                {/* 1. En-tête */}
                <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/40 p-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-900 block">
                    1. En-tête & Paramètres de l&apos;action
                  </span>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Titre de l&apos;action
                      </label>
                      <Input
                        value={currentPage.title}
                        onChange={(e) => saveActionPage({ ...currentPage, title: e.target.value })}
                        className="h-8 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Rubrique / Badge
                      </label>
                      <Input
                        value={currentPage.badge}
                        onChange={(e) => saveActionPage({ ...currentPage, badge: e.target.value })}
                        className="h-8 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Budget (M FCFA)
                      </label>
                      <LocaleNumberInput
                        min={0}
                        value={currentPage.budgetMillions}
                        onValueChange={(num) =>
                          saveActionPage({ ...currentPage, budgetMillions: Math.max(0, num) })
                        }
                        className="h-8 text-xs bg-white font-bold text-purple-900"
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Sous-titre
                      </label>
                      <Input
                        value={currentPage.subtitle}
                        onChange={(e) => saveActionPage({ ...currentPage, subtitle: e.target.value })}
                        className="h-8 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Période
                      </label>
                      <Input
                        value={currentPage.period}
                        onChange={(e) => saveActionPage({ ...currentPage, period: e.target.value })}
                        className="h-8 text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Chiffres clés (KPIs) */}
                <div className="space-y-2 rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      2. Cartes Chiffres Clés ({currentPage.kpis.length})
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() =>
                        saveActionPage({
                          ...currentPage,
                          kpis: [
                            ...currentPage.kpis,
                            { label: 'Nouveau repère', value: '100 %', subtitle: 'Précision' },
                          ],
                        })
                      }
                      className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Plus className="mr-1 h-3 w-3" /> Ajouter un chiffre clé
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {currentPage.kpis.map((kpi, idx) => (
                      <div key={`kpi-edit-${idx}`} className="grid gap-2 sm:grid-cols-[1fr_140px_1fr_auto] items-center">
                        <Input
                          value={kpi.label}
                          placeholder="Libellé"
                          onChange={(e) => {
                            const next = currentPage.kpis.map((it, i) =>
                              i === idx ? { ...it, label: e.target.value } : it
                            );
                            saveActionPage({ ...currentPage, kpis: next });
                          }}
                          className="h-7 text-xs bg-white"
                        />
                        <Input
                          value={kpi.value}
                          placeholder="Valeur"
                          onChange={(e) => {
                            const next = currentPage.kpis.map((it, i) =>
                              i === idx ? { ...it, value: e.target.value } : it
                            );
                            saveActionPage({ ...currentPage, kpis: next });
                          }}
                          className="h-7 text-xs bg-white font-bold"
                        />
                        <Input
                          value={kpi.subtitle}
                          placeholder="Sous-texte"
                          onChange={(e) => {
                            const next = currentPage.kpis.map((it, i) =>
                              i === idx ? { ...it, subtitle: e.target.value } : it
                            );
                            saveActionPage({ ...currentPage, kpis: next });
                          }}
                          className="h-7 text-xs bg-white"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            saveActionPage({
                              ...currentPage,
                              kpis: currentPage.kpis.filter((_, i) => i !== idx),
                            })
                          }
                          className="h-7 w-7 p-0 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Contexte & Présentation */}
                <div className="space-y-2 rounded-xl border border-slate-200 p-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    3. Contexte & Justification de l&apos;action
                  </span>
                  <textarea
                    value={currentPage.description}
                    onChange={(e) =>
                      saveActionPage({ ...currentPage, description: e.target.value })
                    }
                    rows={3}
                    className="w-full rounded-md border border-slate-200 bg-white p-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                {/* 4. Objectifs & Bénéfices */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        4a. Objectifs opérationnels ({currentPage.objectives.length})
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() =>
                          saveActionPage({
                            ...currentPage,
                            objectives: [...currentPage.objectives, 'Nouvel objectif opérationnel'],
                          })
                        }
                        className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Plus className="mr-1 h-3 w-3" /> Ajouter
                      </Button>
                    </div>
                    <div className="space-y-1.5">
                      {currentPage.objectives.map((obj, idx) => (
                        <div key={`obj-ed-${idx}`} className="flex items-center gap-1.5">
                          <Input
                            value={obj}
                            onChange={(e) => {
                              const next = currentPage.objectives.map((it, i) =>
                                i === idx ? e.target.value : it
                              );
                              saveActionPage({ ...currentPage, objectives: next });
                            }}
                            className="h-7 text-xs bg-white"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              saveActionPage({
                                ...currentPage,
                                objectives: currentPage.objectives.filter((_, i) => i !== idx),
                              })
                            }
                            className="h-7 w-7 p-0 text-red-500 hover:bg-red-50 shrink-0"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        4b. Bénéfices communauté ({currentPage.highlights.length})
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() =>
                          saveActionPage({
                            ...currentPage,
                            highlights: [...currentPage.highlights, 'Nouveau bénéfice attendu'],
                          })
                        }
                        className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Plus className="mr-1 h-3 w-3" /> Ajouter
                      </Button>
                    </div>
                    <div className="space-y-1.5">
                      {currentPage.highlights.map((hl, idx) => (
                        <div key={`hl-ed-${idx}`} className="flex items-center gap-1.5">
                          <Input
                            value={hl}
                            onChange={(e) => {
                              const next = currentPage.highlights.map((it, i) =>
                                i === idx ? e.target.value : it
                              );
                              saveActionPage({ ...currentPage, highlights: next });
                            }}
                            className="h-7 text-xs bg-white"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              saveActionPage({
                                ...currentPage,
                                highlights: currentPage.highlights.filter((_, i) => i !== idx),
                              })
                            }
                            className="h-7 w-7 p-0 text-red-500 hover:bg-red-50 shrink-0"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 5. Phases de déploiement */}
                <div className="space-y-2 rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      5. Étapes de déploiement ({currentPage.steps.length})
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() =>
                        saveActionPage({
                          ...currentPage,
                          steps: [
                            ...currentPage.steps,
                            { period: '2027', phase: 'Nouvelle phase', description: 'Détail de la phase.' },
                          ],
                        })
                      }
                      className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Plus className="mr-1 h-3 w-3" /> Ajouter une étape
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {currentPage.steps.map((st, idx) => (
                      <div key={`st-ed-${idx}`} className="grid gap-2 sm:grid-cols-[120px_180px_1fr_auto] items-center">
                        <Input
                          value={st.period}
                          placeholder="Période"
                          onChange={(e) => {
                            const next = currentPage.steps.map((it, i) =>
                              i === idx ? { ...it, period: e.target.value } : it
                            );
                            saveActionPage({ ...currentPage, steps: next });
                          }}
                          className="h-7 text-xs bg-white font-semibold"
                        />
                        <Input
                          value={st.phase}
                          placeholder="Phase"
                          onChange={(e) => {
                            const next = currentPage.steps.map((it, i) =>
                              i === idx ? { ...it, phase: e.target.value } : it
                            );
                            saveActionPage({ ...currentPage, steps: next });
                          }}
                          className="h-7 text-xs bg-white"
                        />
                        <Input
                          value={st.description}
                          placeholder="Description"
                          onChange={(e) => {
                            const next = currentPage.steps.map((it, i) =>
                              i === idx ? { ...it, description: e.target.value } : it
                            );
                            saveActionPage({ ...currentPage, steps: next });
                          }}
                          className="h-7 text-xs bg-white"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            saveActionPage({
                              ...currentPage,
                              steps: currentPage.steps.filter((_, i) => i !== idx),
                            })
                          }
                          className="h-7 w-7 p-0 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. Indicateurs & Graphique */}
                <div className="space-y-2 rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      6. Indicateurs & Graphique de suivi ({currentPage.indicators.length})
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() =>
                        saveActionPage({
                          ...currentPage,
                          indicators: [
                            ...currentPage.indicators,
                            {
                              name: 'Nouvel indicateur',
                              currentRate: 30,
                              targetRate: 100,
                              unit: '%',
                              status: 'En cours',
                            },
                          ],
                        })
                      }
                      className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Plus className="mr-1 h-3 w-3" /> Ajouter un indicateur
                    </Button>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-left text-xs divide-y divide-slate-200">
                      <thead className="bg-slate-50 font-semibold text-slate-700">
                        <tr>
                          <th className="p-2">Indicateur</th>
                          <th className="p-2 w-24">Actuel</th>
                          <th className="p-2 w-24">Cible</th>
                          <th className="p-2 w-32">Statut</th>
                          <th className="p-2 text-right w-12">Suppr.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentPage.indicators.map((ind, idx) => (
                          <tr key={`ind-ed-${idx}`}>
                            <td className="p-1.5">
                              <Input
                                value={ind.name}
                                onChange={(e) => {
                                  const next = currentPage.indicators.map((it, i) =>
                                    i === idx ? { ...it, name: e.target.value } : it
                                  );
                                  saveActionPage({ ...currentPage, indicators: next });
                                }}
                                className="h-7 text-xs bg-white"
                              />
                            </td>
                            <td className="p-1.5">
                              <LocaleNumberInput
                                min={0}
                                value={ind.currentRate}
                                onValueChange={(num) => {
                                  const next = currentPage.indicators.map((it, i) =>
                                    i === idx ? { ...it, currentRate: Math.max(0, num) } : it
                                  );
                                  saveActionPage({ ...currentPage, indicators: next });
                                }}
                                className="h-7 text-xs font-bold text-french-blue bg-white"
                              />
                            </td>
                            <td className="p-1.5">
                              <LocaleNumberInput
                                min={1}
                                value={ind.targetRate}
                                onValueChange={(num) => {
                                  const next = currentPage.indicators.map((it, i) =>
                                    i === idx ? { ...it, targetRate: Math.max(1, num) } : it
                                  );
                                  saveActionPage({ ...currentPage, indicators: next });
                                }}
                                className="h-7 text-xs font-semibold text-emerald-700 bg-white"
                              />
                            </td>
                            <td className="p-1.5">
                              <select
                                value={ind.status}
                                onChange={(e) => {
                                  const status = e.target.value as ActionPageIndicator['status'];
                                  const next = currentPage.indicators.map((it, i) =>
                                    i === idx ? { ...it, status } : it
                                  );
                                  saveActionPage({ ...currentPage, indicators: next });
                                }}
                                className="h-7 w-full rounded-md border border-slate-200 bg-white px-1.5 text-xs"
                              >
                                {STATUS_OPTIONS.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="p-1.5 text-right">
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  saveActionPage({
                                    ...currentPage,
                                    indicators: currentPage.indicators.filter((_, i) => i !== idx),
                                  })
                                }
                                className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 1. Cartes KPI */}
        {currentPage.kpis.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentPage.kpis.map((kpi, idx) => (
              <div
                key={`kpi-${idx}`}
                className="rounded-2xl p-5 bg-white border border-slate-200/80 shadow-2xs space-y-1"
              >
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {kpi.label}
                </span>
                <p className="text-xl font-bold text-[#005BAC]">{kpi.value}</p>
                {kpi.subtitle && (
                  <span className="text-[11px] text-slate-500 block">{kpi.subtitle}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 2. Contexte & Justification */}
        <Card className="border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 p-5">
            <CardTitle className="text-base sm:text-lg font-bold font-playfair text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-french-blue" />
              Contexte & Présentation de l&apos;action
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
            {currentPage.description}
          </CardContent>
        </Card>

        {/* 3. Objectifs & Bénéfices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-slate-200 bg-white rounded-2xl shadow-xs">
            <CardHeader className="border-b border-slate-100 p-5">
              <CardTitle className="text-base font-bold font-playfair text-slate-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                Objectifs opérationnels
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              {currentPage.objectives.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Aucun objectif défini.</p>
              ) : (
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                  {currentPage.objectives.map((obj, idx) => (
                    <li key={`obj-${idx}`} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white rounded-2xl shadow-xs">
            <CardHeader className="border-b border-slate-100 p-5">
              <CardTitle className="text-base font-bold font-playfair text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-french-blue" />
                Bénéfices pour la communauté
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              {currentPage.highlights.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Aucun bénéfice renseigné.</p>
              ) : (
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                  {currentPage.highlights.map((item, idx) => (
                    <li key={`hl-${idx}`} className="flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 4. Phases de déploiement */}
        {currentPage.steps.length > 0 && (
          <Card className="border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 p-5">
              <CardTitle className="text-base sm:text-lg font-bold font-playfair text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-french-blue" />
                Calendrier & Phases de mise en œuvre
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-3">
                {currentPage.steps.map((step, idx) => (
                  <div
                    key={`step-${idx}`}
                    className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-1.5"
                  >
                    <span className="inline-block rounded-full bg-french-blue/10 text-french-blue px-2.5 py-0.5 text-[11px] font-bold">
                      {step.period}
                    </span>
                    <h3 className="font-semibold text-slate-900 text-sm">{step.phase}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 5. Indicateurs de suivi & Graphique */}
        <ErrorBoundary compact sectionName="Indicateurs de l'action">
          <Card className="border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 p-5 flex flex-row items-center justify-between">
              <CardTitle className="text-base sm:text-lg font-bold font-playfair text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-french-blue" />
                Indicateurs de suivi & Pilotage chiffré
              </CardTitle>
              <span className="text-xs font-semibold text-french-blue bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                Avancement moyen : {averageProgress}%
              </span>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {chartData.length === 0 ? (
                <p className="text-sm text-slate-500 italic text-center py-6">
                  Aucun indicateur de suivi défini pour cette action.
                </p>
              ) : (
                <>
                  <div className="h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#475569' }} />
                        <Tooltip />
                        <Bar dataKey="actuel" name="Actuel (%)" fill="#005BAC" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="cible" name="Cible (%)" fill="#10b981" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {currentPage.indicators.map((ind, idx) => (
                      <div
                        key={`ind-card-${idx}`}
                        className="rounded-xl border border-slate-200 p-4 flex items-center justify-between gap-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{ind.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Actuel : <strong>{ind.currentRate}{ind.unit}</strong> · Cible :{' '}
                            <strong>{ind.targetRate}{ind.unit}</strong>
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-blue-50 border border-blue-200 text-french-blue px-2.5 py-1 text-[11px] font-semibold">
                          {ind.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </ErrorBoundary>
      </main>

      <Footer />
    </div>
  );
};

export default ActionDetailPage;

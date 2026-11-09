import React, { useState, useMemo, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BudgetCadreVieInfrastructures from '../components/BudgetCadreVieInfrastructures';
import { Button } from '../components/ui/button';
import { ArrowLeft, Home, Eye, Sparkles, LayoutGrid, ShieldCheck, BarChart3, Layers } from 'lucide-react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';

const BudgetCadreVieInfrastructuresPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Detect if user accessed from Editor space, CMS, or draft preview
  const isEditorMode = useMemo(() => {
    const isEdit = searchParams.get('edit') === '1';
    const isDraft = searchParams.get('draft') === '1';
    const isEmbedded = searchParams.get('embedded') === '1';
    const urlMode = searchParams.get('mode') || searchParams.get('view');
    if (urlMode === 'admin' || urlMode === 'superadmin') return true;
    if (urlMode === 'public') return false;
    return isEdit || isDraft || isEmbedded;
  }, [searchParams]);

  // Mode state: 'public' (pure Netlify view matching image_a6e0d363.png) or 'admin' (SuperAdmin view matching image_31b925d5.png)
  const [displayMode, setDisplayMode] = useState<'public' | 'admin'>(() =>
    isEditorMode ? 'admin' : 'public'
  );

  useEffect(() => {
    if (isEditorMode) {
      setDisplayMode('admin');
    }
  }, [isEditorMode]);

  const [axe1SubTab, setAxe1SubTab] = useState<'budget' | 'transport' | 'fiches' | 'jalons'>('budget');

  return (
    <div className="min-h-screen flex flex-col font-raleway bg-slate-50">
      <Navbar showLogo={true} />

      <main id="budget-cadre-vie" className="flex-1 py-6 sm:py-8">
        <div className="container mx-auto max-w-7xl px-3 sm:px-6 lg:px-12 space-y-5">
          {/* Top Quick Breadcrumbs & Seamless View Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-500">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="px-0 text-slate-600 hover:text-slate-900 h-auto font-medium cursor-pointer"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                Retour
              </Button>
              <span className="text-slate-300">•</span>
              <Button
                variant="ghost"
                size="sm"
                className="px-0 text-slate-600 hover:text-slate-900 h-auto font-medium cursor-pointer"
                onClick={() => navigate('/')}
              >
                <Home className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                Accueil
              </Button>
              <span className="text-slate-300">•</span>
              <Link to="/plan-strategique" className="hover:text-slate-900 font-medium">
                Plan Stratégique
              </Link>
              <span className="text-slate-300">•</span>
              <span className="font-semibold text-slate-800">Axe 1 · Budget d’amélioration</span>
            </div>

            {/* Mode Switcher: Netlify View vs SuperAdmin Editor View */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/80 border border-slate-300/80 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setDisplayMode('public');
                  const nextParams = new URLSearchParams(searchParams);
                  nextParams.delete('mode');
                  nextParams.delete('view');
                  setSearchParams(nextParams, { replace: true });
                }}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  displayMode === 'public'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Afficher la vue publique originale Netlify"
              >
                <Layers className="w-3.5 h-3.5 text-french-blue" />
                <span>Vue Publique Netlify</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setDisplayMode('admin');
                  const nextParams = new URLSearchParams(searchParams);
                  nextParams.set('mode', 'admin');
                  setSearchParams(nextParams, { replace: true });
                }}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  displayMode === 'admin'
                    ? 'bg-emerald-700 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Afficher la vue SuperAdmin avec modulation des investissements et gestion des projets"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Vue SuperAdmin & Éditeur</span>
              </button>
            </div>
          </div>

          {/* =========================================================================
              VUE SUPERADMIN : Axe 1 Header Banner & Sub-Tabs (image_31b925d5.png)
              Affiché en mode Admin / Éditeur
              ========================================================================= */}
          {displayMode === 'admin' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Axe 1 Header Banner matching SuperAdmin capture */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-emerald-200 bg-emerald-50/70 shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 tracking-wide">
                      AXE 1
                    </span>
                    <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                      Bien-être, Cadre de vie & Infrastructures
                    </h1>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                    Budget d’amélioration (775 M FCFA), mobilités & transport scolaire, confort thermique, cantine, santé et épanouissement des élèves.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setDisplayMode('public')}
                    className="text-xs text-emerald-800 border-emerald-300 bg-white hover:bg-emerald-50 shadow-xs cursor-pointer"
                  >
                    <Eye className="mr-1.5 h-3.5 w-3.5 text-emerald-600" /> Voir page Budget
                  </Button>
                  <Button asChild size="sm" variant="outline" className="text-xs text-sky-800 border-sky-300 bg-white hover:bg-sky-50 shadow-xs">
                    <Link to="/transport-scolaire">
                      <Eye className="mr-1.5 h-3.5 w-3.5 text-sky-600" /> Voir page Transport
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Sub-navigation tabs matching SuperAdmin capture */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
                <button
                  type="button"
                  onClick={() => setAxe1SubTab('budget')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    axe1SubTab === 'budget'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-700 border border-slate-200 bg-white hover:bg-slate-100'
                  }`}
                >
                  <span>💰 Budget & Investissements (775 M FCFA)</span>
                  <span className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
                    axe1SubTab === 'budget' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-600'
                  }`}>
                    Interactif
                  </span>
                </button>

                <Link
                  to="/transport-scolaire"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 border border-slate-200 bg-white hover:bg-slate-100 transition-colors shadow-xs"
                >
                  <span>🚌 Transport Scolaire & Familles</span>
                  <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                    Circuits
                  </span>
                </Link>

                <Link
                  to="/plan-strategique"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 border border-slate-200 bg-white hover:bg-slate-100 transition-colors shadow-xs"
                >
                  <span>📁 Fiches Projets & Sous-pages</span>
                  <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                    15 fiches
                  </span>
                </Link>

                <Link
                  to="/plan-maintenance-strategique"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 border border-slate-200 bg-white hover:bg-slate-100 transition-colors shadow-xs"
                >
                  <span>⏱️ Jalons & Calendrier 2026–2030</span>
                  <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                    Jalons
                  </span>
                </Link>
              </div>
            </div>
          )}

          {/* Main Content Component: renders either Public Netlify or SuperAdmin Modulation */}
          <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xl p-4 sm:p-6 lg:p-7">
            <BudgetCadreVieInfrastructures forceMode={displayMode} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BudgetCadreVieInfrastructuresPage;

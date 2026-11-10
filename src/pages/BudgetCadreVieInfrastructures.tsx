import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BudgetCadreVieInfrastructures from '../components/BudgetCadreVieInfrastructures';
import { AdminBudgetDashboard } from '../components/admin/AdminBudgetDashboard';
import {
  ArrowLeft,
  Home,
  BarChart3,
  Sliders,
  Eye,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import pageDataFile from '@/content/pageData.json';
import { defaultBudgetData, type BudgetData } from '@/data/budgetTransportData';

export const BudgetCadreVieInfrastructuresPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if running inside the editor / admin iframe or edit mode requested
  const isEmbeddedInAdmin = typeof window !== 'undefined' && (
    window.location.search.includes('embedded=1') ||
    window.parent !== window
  );
  const isEditRequested = typeof window !== 'undefined' && (
    window.location.search.includes('edit=1') ||
    window.location.search.includes('draft=1') ||
    window.location.search.includes('mode=editor') ||
    window.location.search.includes('admin=1')
  );

  const [viewMode, setViewMode] = useState<'editor' | 'vitrine'>(() => {
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      if (search.includes('embedded=1') || search.includes('edit=1') || search.includes('mode=editor') || window.parent !== window) {
        return 'editor';
      }
      try {
        const saved = window.sessionStorage.getItem('lfjp_budget_view_mode');
        if (saved === 'editor' || saved === 'vitrine') return saved;
      } catch {
        // ignore
      }
    }
    return isEmbeddedInAdmin || isEditRequested ? 'editor' : 'vitrine';
  });

  const [maxYear, setMaxYear] = useState<number>(() => {
    let budget = (pageDataFile as { budgetData?: BudgetData }).budgetData;
    if (typeof window !== 'undefined') {
      try {
        const draft = window.localStorage.getItem('lfjp-admin-page-data-draft');
        if (draft) {
          const parsed = JSON.parse(draft);
          if (parsed?.budgetData) budget = parsed.budgetData;
        }
      } catch {
        // ignore
      }
    }
    const projects = (budget?.projects || defaultBudgetData.projects).filter((p) => p.isActive !== false);
    return projects.reduce((max, p) => {
      const s = p.startYear || 2026;
      const d = p.durationYears || 1;
      return Math.max(max, s + d - 1);
    }, 2030);
  });

  const computeMaxYear = useCallback(() => {
    try {
      let budget = (pageDataFile as { budgetData?: BudgetData }).budgetData;
      if (typeof window !== 'undefined') {
        const draft = window.localStorage.getItem('lfjp-admin-page-data-draft');
        if (draft) {
          const parsed = JSON.parse(draft);
          if (parsed?.budgetData) budget = parsed.budgetData;
        }
      }
      const projects = (budget?.projects || defaultBudgetData.projects).filter((p) => p.isActive !== false);
      const nextMax = projects.reduce((max, p) => {
        const s = p.startYear || 2026;
        const d = p.durationYears || 1;
        return Math.max(max, s + d - 1);
      }, 2030);
      setMaxYear(nextMax);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    window.addEventListener('storage', computeMaxYear);
    window.addEventListener('lfjp_page_data_changed', computeMaxYear);
    return () => {
      window.removeEventListener('storage', computeMaxYear);
      window.removeEventListener('lfjp_page_data_changed', computeMaxYear);
    };
  }, [computeMaxYear]);

  // Handle data updates from AdminBudgetDashboard and sync to localStorage & events
  const handleBudgetChange = (updatedBudgetData: BudgetData) => {
    try {
      if (typeof window !== 'undefined') {
        const raw = window.localStorage.getItem('lfjp-admin-page-data-draft');
        let currentDraft: Record<string, unknown> = {};
        if (raw) {
          try {
            currentDraft = JSON.parse(raw) || {};
          } catch {
            currentDraft = {};
          }
        }
        const merged = {
          ...currentDraft,
          budgetData: updatedBudgetData,
        };
        window.localStorage.setItem('lfjp-admin-page-data-draft', JSON.stringify(merged));
        window.dispatchEvent(
          new CustomEvent('lfjp_page_data_changed', {
            detail: { budgetData: updatedBudgetData },
          })
        );
        window.dispatchEvent(new Event('storage'));

        if (window.parent && window.parent !== window) {
          try {
            window.parent.postMessage(
              { type: 'lfjp_budget_data_updated', budgetData: updatedBudgetData, mergedDraft: merged },
              '*'
            );
            window.parent.dispatchEvent(
              new CustomEvent('lfjp_page_data_changed', {
                detail: { budgetData: updatedBudgetData },
              })
            );
          } catch {
            // ignore cross-origin/frame errors
          }
        }

        computeMaxYear();
      }
    } catch (err) {
      console.error('Failed to sync budget data', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-raleway bg-slate-100">
      <Navbar showLogo={true} />

      {/* Dark Navy Hero Header Banner matching image_82f55a79.png */}
      <div className="bg-[#1A2536] text-white pt-8 pb-16 md:pb-20 border-b border-slate-800">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Quick Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Retour</span>
            </button>
            <span className="text-slate-500">•</span>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Accueil</span>
            </button>
          </div>

          {/* Title & Period Badge Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <p className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
                AXE 1 · CADRE DE VIE & INFRASTRUCTURES
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-white tracking-tight">
                Budget d’amélioration
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-light">
                Tableau de bord financier et projection 2026–{maxYear} pour les investissements de l'axe « Cadre de vie & infrastructures ».
              </p>
            </div>

            {/* Period Badge Card matching image_82f55a79.png */}
            <div className="flex items-center gap-3.5 p-3.5 px-4.5 rounded-xl bg-slate-800/80 backdrop-blur-xs border border-slate-700/80 text-white shrink-0 self-start md:self-auto shadow-sm">
              <div className="p-2 rounded-lg bg-slate-700/60 text-slate-200">
                <BarChart3 className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  PÉRIODE
                </p>
                <p className="text-sm sm:text-base font-bold text-white tracking-wide">
                  2026 – {maxYear}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: right below the Axe 1 Header */}
      <main id="budget-cadre-vie" className="flex-1 -mt-8 sm:-mt-10 pb-16 relative z-10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Mode Switcher Bar (Espace Éditeur / Vue Site Vitrine) */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200/80">
              <button
                type="button"
                onClick={() => {
                  setViewMode('editor');
                  try {
                    window.sessionStorage.setItem('lfjp_budget_view_mode', 'editor');
                  } catch {
                    // ignore
                  }
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  viewMode === 'editor'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Accéder au tableau de bord complet avec privilèges d'administrateur (ajout, modification, suppression)"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Espace Éditeur & Gestion</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  viewMode === 'editor' ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 text-slate-600'
                }`}>
                  Privilège Administrateur
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode('vitrine');
                  try {
                    window.sessionStorage.setItem('lfjp_budget_view_mode', 'vitrine');
                  } catch {
                    // ignore
                  }
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  viewMode === 'vitrine'
                    ? 'bg-[#005BAC] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Afficher le rendu public du site vitrine"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Vue Site Vitrine</span>
              </button>
            </div>

            {/* Live synchronization indicator */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Synchronisation active en direct</span>
              </span>
            </div>
          </div>

          {/* Conditional View: Editor Full Dashboard (image_0282f093.png) OR Showcase View */}
          {viewMode === 'editor' ? (
            <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-7 shadow-xs space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    <strong>Espace Éditeur Axe 1 activé :</strong> Vous disposez des privilèges d'administrateur pour ajouter (<span className="font-semibold">+ Ajouter</span>), modifier, supprimer et ajuster les investissements. Vos modifications sont synchronisées instantanément avec le site vitrine.
                  </span>
                </div>
              </div>

              {/* Full AdminBudgetDashboard matching image_0282f093.png */}
              <AdminBudgetDashboard onDataChange={handleBudgetChange} />
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-8 shadow-xs">
              <BudgetCadreVieInfrastructures />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BudgetCadreVieInfrastructuresPage;

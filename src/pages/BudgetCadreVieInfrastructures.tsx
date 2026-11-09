import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BudgetCadreVieInfrastructures from '../components/BudgetCadreVieInfrastructures';
import { ArrowLeft, Home, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BudgetCadreVieInfrastructuresPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-raleway bg-slate-100">
      <Navbar showLogo={true} />

      {/* Dark Navy Hero Header Banner matching image_513b0df0.png */}
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
                Tableau de bord financier et projection 2026–2030 pour les investissements de l'axe « Cadre de vie & infrastructures ».
              </p>
            </div>

            {/* Period Badge Card matching image_513b0df0.png */}
            <div className="flex items-center gap-3.5 p-3.5 px-4.5 rounded-xl bg-slate-800/80 backdrop-blur-xs border border-slate-700/80 text-white shrink-0 self-start md:self-auto shadow-sm">
              <div className="p-2 rounded-lg bg-slate-700/60 text-slate-200">
                <BarChart3 className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  PÉRIODE
                </p>
                <p className="text-sm sm:text-base font-bold text-white tracking-wide">
                  2026 – 2030
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Overlapping Content matching image_513b0df0.png */}
      <main id="budget-cadre-vie" className="flex-1 -mt-8 sm:-mt-10 pb-16 relative z-10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-8 shadow-xs">
            <BudgetCadreVieInfrastructures />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BudgetCadreVieInfrastructuresPage;

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BudgetCadreVieInfrastructures from '../components/BudgetCadreVieInfrastructures';
import { Button } from '../components/ui/button';
import { ArrowLeft, Home, Eye } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const BudgetCadreVieInfrastructuresPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-raleway bg-slate-50">
      <Navbar showLogo={true} />

      <main id="budget-cadre-vie" className="flex-1 py-6 sm:py-8">
        <div className="container mx-auto max-w-7xl px-3 sm:px-6 lg:px-12 space-y-5">
          {/* Top Quick Breadcrumbs */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-500">
            <Button
              variant="ghost"
              size="sm"
              className="px-0 text-slate-600 hover:text-slate-900 h-auto font-medium"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Retour
            </Button>
            <span className="text-slate-300">•</span>
            <Button
              variant="ghost"
              size="sm"
              className="px-0 text-slate-600 hover:text-slate-900 h-auto font-medium"
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
              <Button asChild size="sm" variant="outline" className="text-xs text-emerald-800 border-emerald-300 bg-white hover:bg-emerald-50 shadow-xs">
                <Link to="/budget-cadre-vie-infrastructures">
                  <Eye className="mr-1.5 h-3.5 w-3.5 text-emerald-600" /> Page Budget
                </Link>
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-700 text-white shadow-xs">
              <span>💰 Budget & Investissements (775 M FCFA)</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-800 text-emerald-100">
                Interactif
              </span>
            </span>

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

          {/* Main Budget & Investment Dashboard identical to SuperAdmin */}
          <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xl p-4 sm:p-6 lg:p-7">
            <BudgetCadreVieInfrastructures />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BudgetCadreVieInfrastructuresPage;

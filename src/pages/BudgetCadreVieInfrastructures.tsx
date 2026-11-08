import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BudgetCadreVieInfrastructures from '../components/BudgetCadreVieInfrastructures';
import { Button } from '../components/ui/button';
import { ArrowLeft, Home, BarChart3, ShieldCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const BudgetCadreVieInfrastructuresPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-raleway bg-slate-50">
      <Navbar showLogo={true} />

      <header className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 text-white py-16 md:py-20 shadow-lg">
        <div className="container mx-auto max-w-7xl px-6 lg:px-12 flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200/90">
            <Button
              variant="ghost"
              className="px-0 text-slate-200 hover:text-white"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Retour
            </Button>
            <span className="text-slate-400">•</span>
            <Button
              variant="ghost"
              className="px-0 text-slate-200 hover:text-white"
              onClick={() => navigate('/')}
            >
              <Home className="mr-2 h-4 w-4" aria-hidden="true" />
              Accueil
            </Button>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.15em] text-slate-300 font-semibold">Axe 1 · Cadre de vie & infrastructures</p>
              <h1 className="text-3xl md:text-4xl font-playfair font-bold mt-1">Budget d’amélioration</h1>
              <p className="text-lg text-slate-200/90 mt-3 max-w-3xl">
                Tableau de bord financier et projection 2026–2030 pour les investissements de l’axe
                « Cadre de vie & infrastructures ».
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                  <BarChart3 className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-200">Période</p>
                  <p className="text-lg font-semibold">2026 – 2030</p>
                </div>
              </div>

              <Link
                to="/espace-direction"
                className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-xl bg-french-blue hover:bg-blue-600 text-white text-xs font-semibold shadow-md transition-all border border-blue-400/30 cursor-pointer"
                title="Accéder à l'espace de gestion et publication"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>Espace Direction / CMS</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main id="budget-cadre-vie" className="flex-1">
        <div className="container mx-auto max-w-7xl px-3 sm:px-6 lg:px-12 py-8 md:py-12">
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xl p-3 sm:p-5 md:p-6">
            <BudgetCadreVieInfrastructures />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BudgetCadreVieInfrastructuresPage;

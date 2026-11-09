import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BudgetCadreVieInfrastructures from '../components/BudgetCadreVieInfrastructures';
import { Button } from '../components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const BudgetCadreVieInfrastructuresPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-raleway bg-slate-50">
      <Navbar showLogo={true} />

      <main id="budget-cadre-vie" className="flex-1 py-6 sm:py-8">
        <div className="container mx-auto max-w-7xl px-3 sm:px-6 lg:px-12 space-y-6">
          {/* Quick Breadcrumbs matching Netlify original design */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-500">
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

          {/* Main Netlify Budget Content */}
          <BudgetCadreVieInfrastructures />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BudgetCadreVieInfrastructuresPage;

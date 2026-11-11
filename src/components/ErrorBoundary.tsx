import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleClearDraftAndReload = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('lfjp-admin-page-data-draft');
        window.localStorage.removeItem('lfjp-admin-pages-draft');
        window.localStorage.removeItem('lfjp-admin-draft');
      }
    } catch {
      // ignore
    }
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-raleway text-slate-800">
          <div className="max-w-lg w-full bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-5">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <AlertTriangle className="h-7 w-7 text-amber-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-playfair text-slate-900">
                  Affichage temporairement indisponible
                </h1>
                <p className="text-xs text-slate-500">
                  Une erreur inattendue est survenue lors de l’affichage des données.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 overflow-x-auto max-h-36">
              {this.state.error?.message || 'Erreur d’exécution du composant'}
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <p>
                Vos données publiées sur le site sont en sécurité. Vous pouvez recharger la page ou réinitialiser le brouillon local.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              <Button
                type="button"
                onClick={this.handleReload}
                className="bg-french-blue hover:bg-blue-800 text-white text-xs font-semibold"
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Recharger la page
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={this.handleClearDraftAndReload}
                className="text-xs text-slate-700 hover:bg-slate-100"
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5 text-amber-600" /> Réinitialiser le brouillon local
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={this.handleGoHome}
                className="text-xs text-slate-500 hover:text-slate-800 ml-auto"
              >
                <Home className="mr-1.5 h-3.5 w-3.5" /> Accueil
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

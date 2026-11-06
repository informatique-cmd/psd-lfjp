import React from 'react';

interface AppErrorBoundaryState {
  error: Error | null;
}

class AppErrorBoundary extends React.Component<React.PropsWithChildren, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 font-raleway">
        <div className="w-full max-w-xl rounded-lg border bg-white p-8 text-center shadow-lg">
          <h1 className="font-playfair text-3xl font-bold text-french-blue">Cette page n’a pas pu être affichée</h1>
          <p className="mt-4 text-slate-600">Une donnée de brouillon ou de Preview est invalide. Rechargez la page pour réessayer.</p>
          <button
            type="button"
            className="mt-6 rounded-md bg-french-blue px-4 py-2 font-semibold text-white"
            onClick={() => window.location.reload()}
          >
            Recharger la page
          </button>
          <p className="mt-4 text-xs text-slate-400">{this.state.error.message}</p>
        </div>
      </div>
    );
  }
}

export default AppErrorBoundary;

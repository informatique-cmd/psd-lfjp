
import React from 'react';
import DiagnosticCard from './DiagnosticCard';
import MetricCard from './MetricCard';
import DiagnosticSummary from './DiagnosticSummary';
import { useElcsData } from './ElcsDataContext';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const DiagnosticElcsContent = () => {
  const elcsData = useElcsData();

  return (
    <div className="max-w-5xl mx-auto">
      <DiagnosticCard 
        title="Analyse du Climat Scolaire" 
        description="Basée sur les Enquêtes Locales de Climat Scolaire (ELCS) 2024-2025"
        className="mb-8"
      >
        <p className="text-gray-700 mb-4">
          Cette analyse synthétise les perceptions du climat scolaire au LFJP de Saly,
          en croisant les données quantitatives issues des questionnaires élèves, parents et personnels
          avec les éléments qualitatifs extraits des retours écrits (verbatim).
          La comparaison est réalisée avec la moyenne des établissements publics français ;
          le comparatif doit donc être relativisé car notre établissement n'est pas directement comparable.
        </p>
      </DiagnosticCard>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <MetricCard 
          title={elcsData.satisfaction.title}
          primary={elcsData.satisfaction.primary}
          secondary={elcsData.satisfaction.secondary}
        />
        
        <MetricCard 
          title={elcsData.relations.title}
          primary={elcsData.relations.primary}
          secondary={elcsData.relations.secondary}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <MetricCard 
          title={elcsData.travail.title}
          primary={elcsData.travail.primary}
          secondary={elcsData.travail.secondary}
        />
        
        <MetricCard 
          title={elcsData.securite.title}
          primary={elcsData.securite.primary}
          secondary={elcsData.securite.secondary}
          inverse={true}
        />
      </div>
      
      <DiagnosticSummary />
      
      <div className="flex justify-center">
        <Link 
          to="/elcs-analyse-complete"
          className="bg-french-blue text-white px-5 py-3 rounded-lg font-medium flex items-center hover:bg-blue-700 transition-colors"
        >
          Accéder à l'analyse complète <ChevronRight className="ml-1 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default DiagnosticElcsContent;


import React from 'react';
import DiagnosticCard from '../DiagnosticCard';
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle } from 'lucide-react';

const InstallationsEquipements = () => {
  return (
    <DiagnosticCard title="Installations & équipements" className="border-red-200">
      <div className="space-y-6">
        <p className="text-gray-700 mb-4">Moyennes sur 5 - Équipements jugés insuffisants :</p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-medium">Sanitaires</span>
            </div>
            <div className="text-right">
              <span className="text-red-600 font-semibold">1,98/5</span>
              <p className="text-xs text-red-500">Sujet le plus critique</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <span className="font-medium">Salles de classe</span>
            <span className="text-red-600 font-semibold">2,17/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <span className="font-medium">Vestiaires & équipements sportifs</span>
            <span className="text-red-600 font-semibold">2,26/5</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium">CDI-BCD</span>
            </div>
            <div className="text-right">
              <span className="text-green-600 font-semibold">3,49/5</span>
              <p className="text-xs text-green-500">Point fort reconnu</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <h5 className="font-medium text-red-800 mb-2">Mots-clés les plus cités :</h5>
          <div className="flex flex-wrap gap-2">
            <Badge variant="destructive">clim/climatisation (25 occurrences)</Badge>
            <Badge variant="destructive">chaud (13)</Badge>
            <Badge variant="destructive">sanitaires (réparations)</Badge>
            <Badge variant="destructive">foot (espaces de jeu)</Badge>
          </div>
        </div>
      </div>
    </DiagnosticCard>
  );
};

export default InstallationsEquipements;

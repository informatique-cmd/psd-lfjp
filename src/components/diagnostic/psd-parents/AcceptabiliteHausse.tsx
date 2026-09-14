
import React from 'react';
import DiagnosticCard from '../DiagnosticCard';
import { CheckCircle, XCircle } from 'lucide-react';

const AcceptabiliteHausse = () => {
  return (
    <DiagnosticCard title="Acceptabilité d'une hausse des écolages" className="border-amber-200">
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Surcoût accepté pour :
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Climatisation
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Restauration scolaire
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Équipements sportifs
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Numérique éducatif
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Couverture du terrain
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Réticences pour :
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Accueillir plus d'élèves
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-amber-50 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Constat :</strong> Les familles sont prêtes à investir dans le confort et la qualité, et acceptent
            plus volontiers une hausse des écolages quand elle finance la climatisation durable de l’établissement, mais
            s'opposent à l'augmentation des effectifs.
          </p>
        </div>
      </div>
    </DiagnosticCard>
  );
};

export default AcceptabiliteHausse;

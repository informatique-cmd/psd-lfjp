
import React from 'react';
import DiagnosticCard from '../DiagnosticCard';
import AlertItem from '../AlertItem';

const CommentairesLibresParents = () => {
  return (
    <DiagnosticCard title="Analyse des commentaires libres" className="border-amber-200">
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-amber-700 mb-3">Thèmes récurrents :</h4>
            <div className="space-y-3">
              <AlertItem 
                name="Chaleur / climatisation" 
                value="Climatiser les classes est urgent" 
              />
              <AlertItem 
                name="Sécurité & circulation" 
                value="Entrée dangereuse, parking à créer" 
              />
              <AlertItem 
                name="Coût des écolages" 
                value="Tarifs exorbitants" 
              />
              <AlertItem 
                name="Espaces verts & jeux" 
                value="Manque d'ombre, mobilier cassé" 
              />
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-amber-700 mb-3">Problématiques spécifiques :</h4>
            <div className="space-y-3">
              <AlertItem 
                name="Communication délais" 
                value="Examens du samedi annoncés tard" 
              />
              <AlertItem 
                name="Infos voyages" 
                value="Informations trop tardives" 
              />
              <AlertItem 
                name="Qualité des langues" 
                value="Besoin de professeurs natifs" 
              />
              <AlertItem 
                name="Anglais précoce" 
                value="Plus d'anglais dès la maternelle" 
              />
            </div>
          </div>
        </div>
      </div>
    </DiagnosticCard>
  );
};

export default CommentairesLibresParents;


import React from 'react';
import PsdParentsHeader from './psd-parents/PsdParentsHeader';
import MotifChoix from './psd-parents/MotifChoix';
import QualiteInformationParents from './psd-parents/QualiteInformationParents';
import InstallationsEquipementsParents from './psd-parents/InstallationsEquipementsParents';
import OffreScolaireParents from './psd-parents/OffreScolaireParents';
import AccompagnementElevesParents from './psd-parents/AccompagnementElevesParents';
import PointsFortsParents from './psd-parents/PointsFortsParents';
import PrioritesParents from './psd-parents/PrioritesParents';
import AcceptabiliteHausse from './psd-parents/AcceptabiliteHausse';
import CommentairesLibresParents from './psd-parents/CommentairesLibresParents';
import SyntheseActionsParents from './psd-parents/SyntheseActionsParents';

const DiagnosticPsdParentsContent = () => {
  return (
    <div className="space-y-8">
      <PsdParentsHeader />
      <MotifChoix />
      <QualiteInformationParents />
      <InstallationsEquipementsParents />
      <OffreScolaireParents />
      <AccompagnementElevesParents />
      <PointsFortsParents />
      <PrioritesParents />
      <AcceptabiliteHausse />
      <CommentairesLibresParents />
      <SyntheseActionsParents />
    </div>
  );
};

export default DiagnosticPsdParentsContent;

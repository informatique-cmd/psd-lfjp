
import React from 'react';
import PsdElevesHeader from './psd-eleves/PsdElevesHeader';
import QualiteInformation from './psd-eleves/QualiteInformation';
import InstallationsEquipements from './psd-eleves/InstallationsEquipements';
import OffreScolaire from './psd-eleves/OffreScolaire';
import AccompagnementEleves from './psd-eleves/AccompagnementEleves';
import PointsForts from './psd-eleves/PointsForts';
import Priorites from './psd-eleves/Priorites';
import CommentairesLibres from './psd-eleves/CommentairesLibres';
import SyntheseActions from './psd-eleves/SyntheseActions';

const DiagnosticPsdElevesContent = () => {
  return (
    <div className="space-y-8">
      <PsdElevesHeader />
      <QualiteInformation />
      <InstallationsEquipements />
      <OffreScolaire />
      <AccompagnementEleves />
      <PointsForts />
      <Priorites />
      <CommentairesLibres />
      <SyntheseActions />
    </div>
  );
};

export default DiagnosticPsdElevesContent;

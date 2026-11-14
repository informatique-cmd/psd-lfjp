import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import DiagnosticCard from './DiagnosticCard';
import { usePsdSurveyData } from './PsdSurveyDataContext';
import PsdElevesHeader from './psd-eleves/PsdElevesHeader';
import QualiteInformation from './psd-eleves/QualiteInformation';
import InstallationsEquipements from './psd-eleves/InstallationsEquipements';
import OffreScolaire from './psd-eleves/OffreScolaire';
import AccompagnementEleves from './psd-eleves/AccompagnementEleves';
import PointsForts from './psd-eleves/PointsForts';
import Priorites from './psd-eleves/Priorites';
import CommentairesLibres from './psd-eleves/CommentairesLibres';
import SyntheseActions from './psd-eleves/SyntheseActions';

const avg = (items?: { score?: number }[]) => {
  if (!Array.isArray(items) || items.length === 0) return 0;
  const validScores = items
    .map((it) => Number(it?.score))
    .filter((score) => Number.isFinite(score));
  if (validScores.length === 0) return 0;
  return Math.round((validScores.reduce((s, score) => s + score, 0) / validScores.length) * 100) / 100;
};

const DiagnosticPsdElevesContent = () => {
  const { eleves } = usePsdSurveyData();

  const summaryChartData = React.useMemo(
    () => [
      { theme: 'Information', moyenne: avg(eleves?.qualiteInformation), color: '#ef4444' },
      { theme: 'Installations', moyenne: avg(eleves?.installations), color: '#f97316' },
      { theme: 'Offre scolaire', moyenne: avg(eleves?.offreScolaire), color: '#f59e0b' },
      { theme: 'Points forts', moyenne: avg(eleves?.pointsForts), color: '#10b981' },
      { theme: 'Accompagnement', moyenne: avg(eleves?.accompagnement), color: '#005BAC' },
      { theme: 'Priorités', moyenne: avg(eleves?.priorites), color: '#6366f1' },
    ],
    [eleves]
  );

  return (
    <div className="space-y-8">
      <PsdElevesHeader />
      <DiagnosticCard
        title="Synthèse graphique par domaine (Sondage Élèves)"
        description="Moyennes recalculées en temps réel sur une échelle de 0 à 5"
      >
        <div className="h-[260px] w-full">
          {summaryChartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-gray-500">
              Aucune donnée à afficher
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summaryChartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="theme" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(v: number) => {
                    const safeVal = Number.isFinite(Number(v)) ? Number(v) : 0;
                    return [`${safeVal.toFixed(2).replace('.', ',')} / 5`, 'Moyenne'];
                  }}
                />
                <Bar dataKey="moyenne" radius={[6, 6, 0, 0]}>
                  {summaryChartData.map((entry, idx) => (
                    <Cell key={`el-${idx}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </DiagnosticCard>
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

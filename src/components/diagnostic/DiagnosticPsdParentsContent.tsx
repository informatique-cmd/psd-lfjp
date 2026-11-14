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

const avg = (items?: { score?: number }[]) => {
  if (!Array.isArray(items) || items.length === 0) return 0;
  const validScores = items
    .map((it) => Number(it?.score))
    .filter((score) => Number.isFinite(score));
  if (validScores.length === 0) return 0;
  return Math.round((validScores.reduce((s, score) => s + score, 0) / validScores.length) * 100) / 100;
};

const DiagnosticPsdParentsContent = () => {
  const { parents } = usePsdSurveyData();

  const summaryChartData = React.useMemo(
    () => [
      { theme: 'Motifs choix', moyenne: avg(parents?.motifChoix), color: '#2563eb' },
      { theme: 'Information', moyenne: avg(parents?.qualiteInformation), color: '#005BAC' },
      { theme: 'Installations', moyenne: avg(parents?.installations), color: '#f97316' },
      { theme: 'Offre scolaire', moyenne: avg(parents?.offreScolaire), color: '#6366f1' },
      { theme: 'Accompagnement', moyenne: avg(parents?.accompagnement), color: '#16a34a' },
      { theme: 'Points forts', moyenne: avg(parents?.pointsForts), color: '#10b981' },
      { theme: 'Priorités', moyenne: avg(parents?.priorites), color: '#9333ea' },
    ],
    [parents]
  );

  return (
    <div className="space-y-8">
      <PsdParentsHeader />
      <DiagnosticCard
        title="Synthèse graphique par domaine (Sondage Parents)"
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
                    <Cell key={`pa-${idx}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </DiagnosticCard>
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

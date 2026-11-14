
import React, { createContext, useContext } from 'react';
import pageDataFile from '@/content/pageData.json';
import { useContentDraft } from '@/lib/contentDraft';
import { parseLocaleNumber } from '@/lib/pageDataSanitizer';
import { usePublishedPageData } from '@/lib/publishedDataSync';

export interface ElcsMetric {
  name: string;
  value: number | string;
  label?: string;
  average?: number;
  trend?: 'up' | 'down';
}

export interface ElcsCategoryData {
  title: string;
  primary: ElcsMetric[];
  secondary: ElcsMetric[];
}

export interface ElcsDataType {
  satisfaction: ElcsCategoryData;
  relations: ElcsCategoryData;
  travail: ElcsCategoryData;
  securite: ElcsCategoryData;
}

// Create the default data 
export const elcsData: ElcsDataType = {
  satisfaction: {
    title: "Satisfaction des Infrastructures",
    primary: [
      { name: "Lycée", value: 33, label: "Appréciation positive des bâtiments", average: 75, trend: "down" },
      { name: "Élémentaire", value: 84.8, label: "Appréciation positive des bâtiments", average: 75, trend: "up" },
    ],
    secondary: [
      { name: "Demande de climatisation (Collège)", value: 40, label: "des verbatim", trend: "up" },
      { name: "Demande de climatisation (Lycée)", value: 53, label: "des verbatim", trend: "up" },
      { name: "Demande de cantine", value: "Forte", label: "à tous les niveaux", trend: "up" },
    ]
  },
  relations: {
    title: "Relations Humaines",
    primary: [
      { name: "Relations élèves-enseignants", value: 81.7, label: "de satisfaction au lycée", average: 87.5, trend: "down" },
      { name: "Relations avec autres adultes", value: 97.4, label: "de satisfaction au lycée", average: 90, trend: "up" },
      { name: "Relations avec vie scolaire", value: 90.4, label: "de satisfaction au lycée", average: 85, trend: "up" },
    ],
    secondary: [
      { name: "Violence psychologique", value: "Sup", label: "à la moyenne nationale", trend: "up" },
      { name: "Harcèlement", value: "Fort", label: "besoin de prévention", trend: "up" },
    ]
  },
  travail: {
    title: "Charge de Travail",
    primary: [
      { name: "Intérêt des apprentissages", value: 66.1, label: "au lycée", average: 72, trend: "down" },
      { name: "Encouragement des enseignants", value: "Mitigé", label: "au lycée", trend: "down" },
    ],
    secondary: [
      { name: "Critique des emplois du temps", value: "Forte", label: "au lycée", trend: "up" },
    ]
  },
  securite: {
    title: "Sécurité et Violence",
    primary: [
      { name: "Absentéisme lié à la violence", value: 9.6, label: "des élèves", average: 15, trend: "down" },
      { name: "Multivictimation", value: "Sup", label: "à la moyenne nationale", trend: "up" },
    ],
    secondary: [
      { name: "Perception de la violence (Personnel Élémentaire)", value: 6.3, label: "Plutôt souvent", trend: "down" },
      { name: "Perception de la violence (Personnel Lycée)", value: 23.1, label: "Plutôt souvent", trend: "up" },
    ]
  }
};

const normalizeElcsValue = (val: unknown, fallback: number | string): number | string => {
  const parsed = parseLocaleNumber(val);
  if (parsed !== null) return parsed;
  if (typeof val === 'string' && val.trim() !== '') return val;
  return fallback;
};

export const sanitizeElcsData = (raw: unknown): ElcsDataType => {
  if (!raw || typeof raw !== 'object') return elcsData;
  const parsed = raw as Partial<ElcsDataType>;
  const ensureCategory = (catKey: keyof ElcsDataType): ElcsCategoryData => {
    const defaultCat = elcsData[catKey];
    const cat = parsed[catKey];
    if (!cat || typeof cat !== 'object') return defaultCat;
    return {
      title: typeof cat.title === 'string' && cat.title.trim() !== '' ? cat.title : defaultCat.title,
      primary: Array.isArray(cat.primary)
        ? cat.primary
            .filter((m): m is ElcsMetric => Boolean(m && typeof m === 'object'))
            .map((m) => {
              const avgParsed = parseLocaleNumber(m.average);
              return {
                name: typeof m.name === 'string' && m.name.trim() !== '' ? m.name : 'Indicateur',
                value: normalizeElcsValue(m.value, 0),
                label: typeof m.label === 'string' ? m.label : '',
                average: avgParsed !== null ? avgParsed : undefined,
                trend: m.trend === 'down' ? 'down' : 'up',
              };
            })
        : defaultCat.primary,
      secondary: Array.isArray(cat.secondary)
        ? cat.secondary
            .filter((m): m is ElcsMetric => Boolean(m && typeof m === 'object'))
            .map((m) => ({
              name: typeof m.name === 'string' && m.name.trim() !== '' ? m.name : 'Point',
              value: normalizeElcsValue(m.value, ''),
              label: typeof m.label === 'string' ? m.label : '',
              trend: m.trend === 'down' ? 'down' : 'up',
            }))
        : defaultCat.secondary,
    };
  };

  return {
    satisfaction: ensureCategory('satisfaction'),
    relations: ensureCategory('relations'),
    travail: ensureCategory('travail'),
    securite: ensureCategory('securite'),
  };
};

// Create context
const ElcsDataContext = createContext<ElcsDataType>(elcsData);
const elcsDraftFallback = {
  ...pageDataFile,
  elcsData: (pageDataFile as { elcsData?: ElcsDataType }).elcsData || elcsData,
};

// Provider component
export const ElcsDataProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const publishedBase = usePublishedPageData(elcsDraftFallback);
  const pageData = useContentDraft('lfjp-admin-page-data-draft', publishedBase);
  const safeValue = React.useMemo(() => sanitizeElcsData(pageData?.elcsData), [pageData]);
  return (
    <ElcsDataContext.Provider value={safeValue}>
      {children}
    </ElcsDataContext.Provider>
  );
};

// Custom hook to use the context
export const useElcsData = (): ElcsDataType => {
  const context = useContext(ElcsDataContext);
  if (!context) {
    return elcsData;
  }
  return sanitizeElcsData(context);
};

export default ElcsDataContext;

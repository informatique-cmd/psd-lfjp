
import React, { createContext, useContext } from 'react';

interface Metric {
  name: string;
  value: number | string;
  label?: string;
  average?: number;
  trend?: 'up' | 'down';
}

interface CategoryData {
  title: string;
  primary: Metric[];
  secondary: Metric[];
}

interface ElcsDataType {
  satisfaction: CategoryData;
  relations: CategoryData;
  travail: CategoryData;
  securite: CategoryData;
}

// Create the default data 
const elcsData: ElcsDataType = {
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

// Create context
const ElcsDataContext = createContext<ElcsDataType | undefined>(undefined);

// Provider component
export const ElcsDataProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <ElcsDataContext.Provider value={elcsData}>
      {children}
    </ElcsDataContext.Provider>
  );
};

// Custom hook to use the context
export const useElcsData = () => {
  const context = useContext(ElcsDataContext);
  if (context === undefined) {
    throw new Error('useElcsData must be used within an ElcsDataProvider');
  }
  return context;
};

export default ElcsDataContext;

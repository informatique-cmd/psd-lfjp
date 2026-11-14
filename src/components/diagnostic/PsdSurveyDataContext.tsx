import React, { createContext, useContext } from 'react';
import pageDataFile from '@/content/pageData.json';
import { defaultPsdSurveyData, type PsdSurveyData, type PsdScoreItem } from '@/data/psdSurveyData';
import { useContentDraft } from '@/lib/contentDraft';
import { sanitizePsdSurveyData } from '@/lib/pageDataSanitizer';
import { usePublishedPageData } from '@/lib/publishedDataSync';

export function mergeAndSanitizePsdSurveyData(raw: unknown): PsdSurveyData {
  const sanitized = sanitizePsdSurveyData(raw) as Partial<PsdSurveyData> | undefined;
  return {
    eleves: {
      ...defaultPsdSurveyData.eleves,
      ...(sanitized?.eleves || {}),
      topClasses:
        sanitized?.eleves?.topClasses && sanitized.eleves.topClasses.length > 0
          ? sanitized.eleves.topClasses
          : defaultPsdSurveyData.eleves.topClasses,
      qualiteInformation:
        sanitized?.eleves?.qualiteInformation && sanitized.eleves.qualiteInformation.length > 0
          ? (sanitized.eleves.qualiteInformation as PsdScoreItem[])
          : defaultPsdSurveyData.eleves.qualiteInformation,
      installations:
        sanitized?.eleves?.installations && sanitized.eleves.installations.length > 0
          ? (sanitized.eleves.installations as PsdScoreItem[])
          : defaultPsdSurveyData.eleves.installations,
      installationsKeywords:
        sanitized?.eleves?.installationsKeywords && sanitized.eleves.installationsKeywords.length > 0
          ? sanitized.eleves.installationsKeywords
          : defaultPsdSurveyData.eleves.installationsKeywords,
      offreScolaire:
        sanitized?.eleves?.offreScolaire && sanitized.eleves.offreScolaire.length > 0
          ? (sanitized.eleves.offreScolaire as PsdScoreItem[])
          : defaultPsdSurveyData.eleves.offreScolaire,
      accompagnement:
        sanitized?.eleves?.accompagnement && sanitized.eleves.accompagnement.length > 0
          ? (sanitized.eleves.accompagnement as PsdScoreItem[])
          : defaultPsdSurveyData.eleves.accompagnement,
      pointsForts:
        sanitized?.eleves?.pointsForts && sanitized.eleves.pointsForts.length > 0
          ? (sanitized.eleves.pointsForts as PsdScoreItem[])
          : defaultPsdSurveyData.eleves.pointsForts,
      priorites:
        sanitized?.eleves?.priorites && sanitized.eleves.priorites.length > 0
          ? (sanitized.eleves.priorites as PsdScoreItem[])
          : defaultPsdSurveyData.eleves.priorites,
    },
    parents: {
      ...defaultPsdSurveyData.parents,
      ...(sanitized?.parents || {}),
      motifChoix:
        sanitized?.parents?.motifChoix && sanitized.parents.motifChoix.length > 0
          ? (sanitized.parents.motifChoix as PsdScoreItem[])
          : defaultPsdSurveyData.parents.motifChoix,
      qualiteInformation:
        sanitized?.parents?.qualiteInformation && sanitized.parents.qualiteInformation.length > 0
          ? (sanitized.parents.qualiteInformation as PsdScoreItem[])
          : defaultPsdSurveyData.parents.qualiteInformation,
      installations:
        sanitized?.parents?.installations && sanitized.parents.installations.length > 0
          ? (sanitized.parents.installations as PsdScoreItem[])
          : defaultPsdSurveyData.parents.installations,
      offreScolaire:
        sanitized?.parents?.offreScolaire && sanitized.parents.offreScolaire.length > 0
          ? (sanitized.parents.offreScolaire as PsdScoreItem[])
          : defaultPsdSurveyData.parents.offreScolaire,
      accompagnement:
        sanitized?.parents?.accompagnement && sanitized.parents.accompagnement.length > 0
          ? (sanitized.parents.accompagnement as PsdScoreItem[])
          : defaultPsdSurveyData.parents.accompagnement,
      pointsForts:
        sanitized?.parents?.pointsForts && sanitized.parents.pointsForts.length > 0
          ? (sanitized.parents.pointsForts as PsdScoreItem[])
          : defaultPsdSurveyData.parents.pointsForts,
      priorites:
        sanitized?.parents?.priorites && sanitized.parents.priorites.length > 0
          ? (sanitized.parents.priorites as PsdScoreItem[])
          : defaultPsdSurveyData.parents.priorites,
      prioritesSecondaires:
        sanitized?.parents?.prioritesSecondaires && sanitized.parents.prioritesSecondaires.length > 0
          ? (sanitized.parents.prioritesSecondaires as PsdScoreItem[])
          : defaultPsdSurveyData.parents.prioritesSecondaires,
    },
  };
}

const fallbackPageData = {
  ...pageDataFile,
  psdSurveyData:
    (pageDataFile as { psdSurveyData?: PsdSurveyData }).psdSurveyData || defaultPsdSurveyData,
};

const PsdSurveyDataContext = createContext<PsdSurveyData>(
  mergeAndSanitizePsdSurveyData(fallbackPageData.psdSurveyData)
);

export const PsdSurveyDataProvider: React.FC<{
  value?: PsdSurveyData;
  children: React.ReactNode;
}> = ({ value, children }) => {
  const publishedBase = usePublishedPageData(fallbackPageData);
  const pageData = useContentDraft('lfjp-admin-page-data-draft', publishedBase);
  const resolved = React.useMemo(
    () =>
      mergeAndSanitizePsdSurveyData(
        value || pageData?.psdSurveyData || publishedBase?.psdSurveyData || fallbackPageData.psdSurveyData
      ),
    [value, pageData?.psdSurveyData, publishedBase?.psdSurveyData]
  );

  return (
    <PsdSurveyDataContext.Provider value={resolved}>
      {children}
    </PsdSurveyDataContext.Provider>
  );
};

export function usePsdSurveyData(): PsdSurveyData {
  return useContext(PsdSurveyDataContext);
}

export function formatScoreFr(score: number): string {
  const safe = Number.isFinite(score) ? score : 0;
  return `${safe.toFixed(2).replace('.', ',')}/5`;
}

export function getToneClasses(tone?: PsdScoreItem['tone'], score?: number): {
  bg: string;
  text: string;
  subText: string;
  border: string;
} {
  const resolvedTone =
    tone ||
    (typeof score === 'number'
      ? score >= 3.5
        ? 'green'
        : score >= 3.0
          ? 'blue'
          : score >= 2.4
            ? 'amber'
            : 'red'
      : 'blue');

  switch (resolvedTone) {
    case 'red':
      return { bg: 'bg-red-50', text: 'text-red-600', subText: 'text-red-500', border: 'border-red-500' };
    case 'amber':
      return { bg: 'bg-amber-50', text: 'text-amber-600', subText: 'text-amber-500', border: 'border-amber-400' };
    case 'orange':
      return { bg: 'bg-orange-50', text: 'text-orange-600', subText: 'text-orange-500', border: 'border-orange-400' };
    case 'green':
      return { bg: 'bg-green-50', text: 'text-green-600', subText: 'text-green-500', border: 'border-green-400' };
    case 'emerald':
      return { bg: 'bg-emerald-50', text: 'text-emerald-600', subText: 'text-emerald-500', border: 'border-emerald-400' };
    case 'purple':
      return { bg: 'bg-purple-50', text: 'text-purple-600', subText: 'text-purple-500', border: 'border-purple-500' };
    case 'blue':
    default:
      return { bg: 'bg-blue-50', text: 'text-blue-600', subText: 'text-blue-500', border: 'border-blue-500' };
  }
}

import React from 'react';
import PSDTabs from './PSDTabs';
import AdminPlanStrategiqueEditor, {
  type PlanStrategiqueMeta,
  type PsdTimelinesRecord,
} from './AdminPlanStrategiqueEditor';
import pageDataFile from '@/content/pageData.json';
import {
  defaultPsdAxesData,
  type PsdAxesData,
} from '@/data/psdAxesData';
import { psdTimelineData } from '@/data/psdTimelineData';
import { useContentDraft } from '@/lib/contentDraft';
import { usePrivilegedAccess } from '@/lib/authAccess';
import { sanitizePsdAxesData, sanitizePsdTimelines } from '@/lib/pageDataSanitizer';
import { usePublishedPageData } from '@/lib/publishedDataSync';

const fallbackPlanData = {
  ...pageDataFile,
  psdAxesData: (pageDataFile as { psdAxesData?: PsdAxesData }).psdAxesData || defaultPsdAxesData,
  psdTimelines:
    (pageDataFile as { psdTimelines?: PsdTimelinesRecord }).psdTimelines ||
    (psdTimelineData as unknown as PsdTimelinesRecord),
  planStrategique: (pageDataFile as { planStrategique?: PlanStrategiqueMeta }).planStrategique || {
    title: 'PLAN STRATÉGIQUE DE DÉVELOPPEMENT',
    subtitle: 'Lycée Français Jacques Prévert (2026-2030)',
  },
};

function mergeAxes(raw: unknown): PsdAxesData {
  const sanitized = sanitizePsdAxesData(raw) as Partial<PsdAxesData> | undefined;
  return {
    axe1: { ...defaultPsdAxesData.axe1, ...(sanitized?.axe1 || {}) },
    axe2: { ...defaultPsdAxesData.axe2, ...(sanitized?.axe2 || {}) },
    axe3: { ...defaultPsdAxesData.axe3, ...(sanitized?.axe3 || {}) },
    axe4: { ...defaultPsdAxesData.axe4, ...(sanitized?.axe4 || {}) },
  };
}

function mergeTimelines(raw: unknown): PsdTimelinesRecord {
  const sanitized = sanitizePsdTimelines(raw) as Partial<PsdTimelinesRecord> | undefined;
  return {
    axe1: sanitized?.axe1 || psdTimelineData.axe1,
    axe2: sanitized?.axe2 || psdTimelineData.axe2,
    axe3: sanitized?.axe3 || psdTimelineData.axe3,
    axe4: sanitized?.axe4 || psdTimelineData.axe4,
  };
}

const PSD = () => {
  const publishedData = usePublishedPageData(fallbackPlanData);
  const pageData = useContentDraft('lfjp-admin-page-data-draft', publishedData);
  const { isPrivileged, showEditorControls } = usePrivilegedAccess();

  const psdAxesData = React.useMemo(
    () => mergeAxes(pageData?.psdAxesData || fallbackPlanData.psdAxesData),
    [pageData?.psdAxesData]
  );
  const psdTimelines = React.useMemo(
    () => mergeTimelines(pageData?.psdTimelines || fallbackPlanData.psdTimelines),
    [pageData?.psdTimelines]
  );
  const planStrategique = React.useMemo<PlanStrategiqueMeta>(
    () => pageData?.planStrategique || fallbackPlanData.planStrategique,
    [pageData?.planStrategique]
  );

  const handlePlanDataChange = (next: {
    psdAxesData: PsdAxesData;
    psdTimelines: PsdTimelinesRecord;
    planStrategique: PlanStrategiqueMeta;
  }) => {
    if (!isPrivileged || !showEditorControls) return;
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem('lfjp-admin-page-data-draft');
      let currentDraft: Record<string, unknown> = {};
      if (raw) {
        try {
          currentDraft = JSON.parse(raw) || {};
        } catch {
          currentDraft = {};
        }
      }
      const merged = {
        ...currentDraft,
        psdAxesData: next.psdAxesData,
        psdTimelines: next.psdTimelines,
        planStrategique: next.planStrategique,
      };
      window.localStorage.setItem('lfjp-admin-page-data-draft', JSON.stringify(merged));
      window.dispatchEvent(
        new CustomEvent('lfjp_page_data_changed', {
          detail: {
            psdAxesData: next.psdAxesData,
            psdTimelines: next.psdTimelines,
            planStrategique: next.planStrategique,
          },
        })
      );
      window.dispatchEvent(new Event('storage'));

      if (window.parent && window.parent !== window) {
        try {
          window.parent.postMessage(
            {
              type: 'lfjp_psd_axes_updated',
              psdAxesData: next.psdAxesData,
              psdTimelines: next.psdTimelines,
              planStrategique: next.planStrategique,
            },
            '*'
          );
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error('Failed to save Plan Stratégique draft', err);
    }
  };

  return (
    <section id="psd" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          {isPrivileged && showEditorControls && (
            <AdminPlanStrategiqueEditor
              psdAxesData={psdAxesData}
              psdTimelines={psdTimelines}
              planStrategique={planStrategique}
              onChange={handlePlanDataChange}
            />
          )}
          <PSDTabs />
        </div>
      </div>
    </section>
  );
};

export default PSD;

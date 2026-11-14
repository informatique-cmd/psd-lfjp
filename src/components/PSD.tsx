import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import PSDTabs from './PSDTabs';
import AdminPlanStrategiqueEditor, {
  type PlanStrategiqueMeta,
  type PsdTimelinesRecord,
} from './AdminPlanStrategiqueEditor';
import pageDataFile from '@/content/pageData.json';
import {
  defaultPsdAxesData,
  computeAxisProgressRate,
  type PsdAxesData,
  type PsdAxisKey,
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

const AXIS_KEYS: PsdAxisKey[] = ['axe1', 'axe2', 'axe3', 'axe4'];

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

  const summary = React.useMemo(() => {
    const progressRates = AXIS_KEYS.map((k) => computeAxisProgressRate(psdAxesData[k]));
    const globalProgress =
      Math.round((progressRates.reduce((s, v) => s + v, 0) / AXIS_KEYS.length) * 10) / 10;
    const totalBudget = AXIS_KEYS.reduce(
      (s, k) => s + (Number(psdAxesData[k].budgetMillions) || 0),
      0
    );
    const totalActions = AXIS_KEYS.reduce(
      (s, k) => s + (psdTimelines[k]?.actions?.length || 0),
      0
    );
    const totalIndicators = AXIS_KEYS.reduce(
      (s, k) => s + (psdAxesData[k]?.indicators?.length || 0),
      0
    );

    const chartData = AXIS_KEYS.map((k, idx) => ({
      name: `Axe ${idx + 1}`,
      avancement: computeAxisProgressRate(psdAxesData[k]),
      budget: Number(psdAxesData[k].budgetMillions) || 0,
    }));

    return { globalProgress, totalBudget, totalActions, totalIndicators, chartData };
  }, [psdAxesData, psdTimelines]);

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

          {/* Reactive Consolidated Dashboard across Axes 1 to 4 */}
          <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-playfair font-bold text-french-blue">
                  Tableau de bord synthétique des 4 Axes (2026–2030)
                </h2>
                <p className="text-sm text-slate-600">
                  Suivi consolidé de l&apos;avancement des indicateurs, des enveloppes budgétaires et des actions structurantes.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                  Avancement global
                </span>
                <div className="mt-1 text-2xl font-bold text-french-blue">
                  {summary.globalProgress}%
                </div>
                <p className="text-xs text-slate-600 mt-0.5">Moyenne des 4 axes</p>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Budget consolidé
                </span>
                <div className="mt-1 text-2xl font-bold text-emerald-700">
                  {summary.totalBudget} M FCFA
                </div>
                <p className="text-xs text-slate-600 mt-0.5">Investissements 2026–2030</p>
              </div>
              <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                  Actions structurantes
                </span>
                <div className="mt-1 text-2xl font-bold text-amber-700">
                  {summary.totalActions}
                </div>
                <p className="text-xs text-slate-600 mt-0.5">Jalons planifiés</p>
              </div>
              <div className="rounded-xl border border-purple-100 bg-purple-50/60 p-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-purple-700">
                  Indicateurs suivis
                </span>
                <div className="mt-1 text-2xl font-bold text-purple-700">
                  {summary.totalIndicators}
                </div>
                <p className="text-xs text-slate-600 mt-0.5">Cibles mesurées</p>
              </div>
            </div>

            <div className="h-[250px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar
                    yAxisId="left"
                    dataKey="avancement"
                    name="Avancement (%)"
                    fill="#005BAC"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="budget"
                    name="Budget (M FCFA)"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <PSDTabs />
        </div>
      </div>
    </section>
  );
};

export default PSD;

import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import AdminMethodeEditor from '../components/AdminMethodeEditor';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightCircle, CheckCircle, RefreshCw, Users } from "lucide-react";
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import pageDataFile from '@/content/pageData.json';
import { defaultMethodeData, type MethodeData } from '@/data/methodeData';
import { useContentDraft } from '@/lib/contentDraft';
import { usePublishedPageData } from '@/lib/publishedDataSync';
import { usePrivilegedAccess } from '@/lib/authAccess';
import { sanitizeMethodeData } from '@/lib/pageDataSanitizer';

const fallbackMethodePageData = {
  ...pageDataFile,
  methodeData:
    (pageDataFile as { methodeData?: MethodeData }).methodeData || defaultMethodeData,
};

const Methode = () => {
  const publishedData = usePublishedPageData(fallbackMethodePageData);
  const pageData = useContentDraft('lfjp-admin-page-data-draft', publishedData);
  const { isPrivileged, showEditorControls } = usePrivilegedAccess();

  const methodeData = React.useMemo<MethodeData>(() => {
    const raw = (pageData as { methodeData?: unknown })?.methodeData || defaultMethodeData;
    const sanitized = sanitizeMethodeData(raw) as Partial<MethodeData> | undefined;
    return {
      ...defaultMethodeData,
      ...(sanitized || {}),
      steps: sanitized?.steps ?? defaultMethodeData.steps,
      commissionCard: {
        ...defaultMethodeData.commissionCard,
        ...(sanitized?.commissionCard || {}),
      },
      validationCard: {
        ...defaultMethodeData.validationCard,
        ...(sanitized?.validationCard || {}),
      },
    };
  }, [pageData]);

  const handleMethodeChange = (nextMethodeData: MethodeData) => {
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
        methodeData: nextMethodeData,
      };
      window.localStorage.setItem('lfjp-admin-page-data-draft', JSON.stringify(merged));
      window.dispatchEvent(
        new CustomEvent('lfjp_page_data_changed', {
          detail: { methodeData: nextMethodeData },
        })
      );
      window.dispatchEvent(new Event('storage'));
      if (window.parent && window.parent !== window) {
        try {
          window.parent.postMessage(
            { type: 'lfjp_methode_data_updated', methodeData: nextMethodeData },
            '*'
          );
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error('Failed to save Methode draft', err);
    }
  };

  const keyMetrics = Array.isArray(methodeData.keyMetrics) ? methodeData.keyMetrics : [];
  const chartItems = Array.isArray(methodeData.chartItems) ? methodeData.chartItems : [];

  return (
    <div className="min-h-screen flex flex-col font-raleway bg-white">
      <Navbar showLogo={true} />
      <Hero
        title={methodeData.heroTitle}
        subtitle={methodeData.heroSubtitle}
      />

      {isPrivileged && showEditorControls && (
        <AdminMethodeEditor methodeData={methodeData} onChange={handleMethodeChange} />
      )}

      <main className="flex-1">
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6 space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <p className="text-sm uppercase tracking-[0.2em] text-french-blue font-semibold">
                {methodeData.stepsEyebrow}
              </p>
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-slate-900">
                {methodeData.stepsTitle}
              </h2>
              <p className="text-lg text-gray-600">
                {methodeData.stepsSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {methodeData.steps.map((step, index) => (
                <Card key={`${step.title}-${index}`} className="h-full border border-slate-100 shadow-sm">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-french-blue font-semibold">
                      <ArrowRightCircle className="h-5 w-5" />
                      <span>Étape {index + 1}</span>
                    </div>
                    <h3 className="text-xl font-playfair font-bold text-slate-900">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <Card className="border-none shadow-lg">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-3 text-french-blue">
                  <Users className="h-6 w-6" />
                  <p className="text-sm uppercase tracking-wide font-semibold">{methodeData.commissionCard.eyebrow}</p>
                </div>
                <h3 className="text-3xl font-playfair font-bold text-slate-900">
                  {methodeData.commissionCard.title}
                </h3>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  {methodeData.commissionCard.paragraphs.map((paragraph, pIdx) => (
                    <p key={`comm-par-${pIdx}`}>{paragraph}</p>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-lg bg-blue-50 text-french-blue border border-blue-100 space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-wide">{methodeData.commissionCard.roleBoxTitle}</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-french-blue/90">
                      {methodeData.commissionCard.roleItems.map((item, rIdx) => (
                        <li key={`role-item-${rIdx}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 text-emerald-800 border border-green-100 space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-wide">{methodeData.commissionCard.validationBoxTitle}</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-emerald-700">
                      {methodeData.commissionCard.validationItems.map((item, vIdx) => (
                        <li key={`val-item-${vIdx}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="p-8 space-y-6 h-full flex flex-col">
                <div className="flex items-center gap-3 text-french-blue">
                  <RefreshCw className="h-6 w-6" />
                  <p className="text-sm uppercase tracking-wide font-semibold">{methodeData.validationCard.eyebrow}</p>
                </div>
                <h3 className="text-3xl font-playfair font-bold text-slate-900">{methodeData.validationCard.title}</h3>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  {methodeData.validationCard.paragraphs.map((paragraph, pIdx) => (
                    <p key={`val-par-${pIdx}`}>{paragraph}</p>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
                  {methodeData.validationCard.highlights.map((hl, hIdx) => (
                    <div key={`hl-item-${hIdx}`} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mt-1 shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900">{hl.title}</p>
                        <p className="text-sm text-gray-600">{hl.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {methodeData.showMetricsOnPage && (keyMetrics.length > 0 || chartItems.length > 0) && (
          <ErrorBoundary compact sectionName="Indicateurs Méthode">
            <section className="py-12 bg-gray-50 border-t border-slate-100">
              <div className="container mx-auto px-6 space-y-8">
                <h2 className="text-3xl font-playfair font-bold text-slate-900 text-center">
                  {methodeData.metricsSectionTitle || 'Indicateurs clés de la démarche'}
                </h2>
                {keyMetrics.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {keyMetrics.map((km, idx) => (
                      <Card key={`meth-pub-km-${idx}`} className="border border-slate-100 shadow-sm">
                        <CardContent className="p-6">
                          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{km.label}</p>
                          <p className="text-3xl font-playfair font-bold text-french-blue mt-1">{km.value}</p>
                          {km.note && <p className="text-sm text-gray-600 mt-1">{km.note}</p>}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                {chartItems.length > 0 && (
                  <Card className="border border-slate-100 shadow-sm">
                    <CardContent className="p-6">
                      {methodeData.chartTitle && (
                        <h3 className="text-lg font-playfair font-bold text-slate-900 mb-4">{methodeData.chartTitle}</h3>
                      )}
                      <div className="h-[260px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartItems} margin={{ top: 10, right: 20, left: 0, bottom: 8 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="value" name="Avancement (%)" fill="#005BAC" radius={[6, 6, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </section>
          </ErrorBoundary>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Methode;

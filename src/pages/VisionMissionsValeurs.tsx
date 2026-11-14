import React from 'react';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Vision from '../components/Vision';
import Missions from '../components/Missions';
import Valeurs from '../components/Valeurs';
import Footer from '../components/Footer';
import AdminVisionValeursEditor, { type VisionMissionsValeursContent } from '../components/AdminVisionValeursEditor';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Card, CardContent } from '@/components/ui/card';
import siteContent from '@/content/siteContent.json';
import { useContentDraft } from '@/lib/contentDraft';
import { usePublishedSiteContent } from '@/lib/publishedDataSync';
import { usePrivilegedAccess } from '@/lib/authAccess';

const VisionMissionsValeurs = () => {
  const publishedSiteContent = usePublishedSiteContent(siteContent as unknown as Record<string, unknown>);
  const currentContent = useContentDraft('lfjp-admin-draft', publishedSiteContent) as typeof siteContent & {
    visionMissionsValeurs: VisionMissionsValeursContent;
  };
  const vmv = (currentContent?.visionMissionsValeurs || siteContent.visionMissionsValeurs) as VisionMissionsValeursContent;
  const { isPrivileged, showEditorControls } = usePrivilegedAccess();

  const handleVmvChange = (nextVmv: VisionMissionsValeursContent) => {
    if (!isPrivileged || !showEditorControls) return;
    if (typeof window === 'undefined') return;
    try {
      const nextContent = {
        ...currentContent,
        visionMissionsValeurs: nextVmv,
      };
      window.localStorage.setItem('lfjp-admin-draft', JSON.stringify(nextContent, null, 2));
      window.dispatchEvent(new CustomEvent('lfjp_site_content_changed', { detail: nextContent }));
      window.dispatchEvent(new Event('storage'));
      if (window.parent && window.parent !== window) {
        try {
          window.parent.postMessage(
            { type: 'lfjp_site_content_updated', siteContent: nextContent },
            '*'
          );
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error('Failed to save Vision, Missions & Valeurs draft', err);
    }
  };

  const keyMetrics = Array.isArray(vmv.keyMetrics) ? vmv.keyMetrics : [];
  const chartItems = Array.isArray(vmv.chartItems) ? vmv.chartItems : [];

  return (
    <div className="min-h-screen flex flex-col font-raleway">
      <Navbar showLogo={true} />
      <Hero
        title={vmv.heroTitle || 'NOTRE VISION, NOS MISSIONS, NOS VALEURS'}
        subtitle={vmv.heroSubtitle || 'Lycée Français Jacques Prévert - Sénégal'}
      />

      {isPrivileged && showEditorControls && (
        <AdminVisionValeursEditor data={vmv} onChange={handleVmvChange} />
      )}

      <Vision />
      <Missions />
      <Valeurs />

      {vmv.showMetricsOnPage && (keyMetrics.length > 0 || chartItems.length > 0) && (
        <ErrorBoundary compact sectionName="Indicateurs Vision & Valeurs">
          <section className="py-12 md:py-16 bg-gray-50 border-t border-slate-100">
            <div className="container mx-auto px-6 space-y-8">
              <h2 className="text-3xl font-playfair font-bold text-french-blue text-center">
                {vmv.metricsSectionTitle || 'Indicateurs clés — Vision, Missions & Valeurs'}
              </h2>
              {keyMetrics.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {keyMetrics.map((km, idx) => (
                    <Card key={`vmv-pub-km-${idx}`} className="border border-slate-100 shadow-sm bg-white">
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
                <Card className="border border-slate-100 shadow-sm bg-white">
                  <CardContent className="p-6">
                    {vmv.chartTitle && (
                      <h3 className="text-lg font-playfair font-bold text-slate-900 mb-4">{vmv.chartTitle}</h3>
                    )}
                    <div className="h-[260px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartItems} margin={{ top: 10, right: 20, left: 0, bottom: 8 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Bar dataKey="value" name="Nombre / Valeur" fill="#005BAC" radius={[6, 6, 0, 0]} />
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

      <Footer />
    </div>
  );
};

export default VisionMissionsValeurs;

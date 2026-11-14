import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import AdminHomeEditor, { type HomeSectionContent } from '../components/AdminHomeEditor';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Card, CardContent } from '@/components/ui/card';
import siteContent from '@/content/siteContent.json';
import { normalizeMediaUrl } from '@/lib/media';
import { useContentDraft } from '@/lib/contentDraft';
import { usePublishedSiteContent } from '@/lib/publishedDataSync';
import { usePrivilegedAccess } from '@/lib/authAccess';
import type { TextStyle } from '@/content/pageTypes';

const cardTextStyle = (style?: TextStyle): React.CSSProperties => ({
  fontFamily: style?.fontFamily === 'serif' ? 'Georgia, serif' : style?.fontFamily === 'playfair' ? 'Playfair Display, serif' : style?.fontFamily === 'mono' ? 'ui-monospace, monospace' : style?.fontFamily === 'raleway' ? 'Raleway, sans-serif' : undefined,
  fontSize: style?.fontSize === 'small' ? '0.9rem' : style?.fontSize === 'large' ? '1.2rem' : style?.fontSize === 'xlarge' ? '1.5rem' : undefined,
  textAlign: style?.align,
  color: style?.color || undefined,
  backgroundColor: style?.backgroundColor || undefined,
  fontWeight: style?.bold ? 700 : undefined,
  fontStyle: style?.italic ? 'italic' : undefined,
  textDecoration: style?.underline ? 'underline' : undefined,
  lineHeight: style?.lineHeight === 'loose' ? 2 : style?.lineHeight === 'normal' ? 1.5 : 1.75,
});

const Index = () => {
  const publishedSiteContent = usePublishedSiteContent(siteContent as unknown as Record<string, unknown>);
  const currentContent = useContentDraft('lfjp-admin-draft', publishedSiteContent) as typeof siteContent & {
    home: HomeSectionContent;
  };
  const home = (currentContent?.home || siteContent.home) as HomeSectionContent;
  const { isPrivileged, showEditorControls } = usePrivilegedAccess();

  const handleHomeChange = (nextHome: HomeSectionContent) => {
    if (!isPrivileged || !showEditorControls) return;
    if (typeof window === 'undefined') return;
    try {
      const nextContent = {
        ...currentContent,
        home: nextHome,
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
      console.error('Failed to save home draft', err);
    }
  };

  const cards = Array.isArray(home.cards) ? home.cards : siteContent.home.cards;
  const messages = Array.isArray(home.messages) ? home.messages : siteContent.home.messages;
  const keyMetrics = Array.isArray(home.keyMetrics) ? home.keyMetrics : [];
  const chartItems = Array.isArray(home.chartItems) ? home.chartItems : [];

  return (
    <div className="min-h-screen flex flex-col font-raleway">
      <Navbar showLogo={true} />
      <Hero title={home.heroTitle} subtitle={home.heroSubtitle} />

      {isPrivileged && showEditorControls && (
        <AdminHomeEditor home={home} onChange={handleHomeChange} />
      )}

      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-playfair font-bold text-french-blue mb-12 text-center animate-fade-in">
            {home.sectionTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {cards.map((card, index) => (
              <Card
                key={`${card.path}-${index}`}
                className={`border-none shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:-rotate-[0.35deg] transition-all duration-300 animate-fade-in${index ? `-delay-${index}` : ''} bg-white h-full`}
              >
                <CardContent className="p-8 flex flex-col h-full">
                  {card.image && <img src={normalizeMediaUrl(card.image)} alt="" className="mb-6 h-40 w-full rounded-lg object-cover" />}
                  <div style={cardTextStyle(card.style)}>
                    <h3 className="text-2xl font-playfair font-bold mb-4 text-french-blue">{card.title}</h3>
                    <p className="text-gray-600 mb-6">{card.description}</p>
                  </div>
                  <Link to={card.path} className="inline-flex items-center text-french-blue font-medium hover:underline group mt-auto pt-4">
                    {card.linkLabel}
                    <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-french-blue/5">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {messages.map((message, mIdx) => (
            <Card key={`${message.title}-${mIdx}`} className={`border-none shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in${message.wide ? ' lg:col-span-2' : ''}`}>
              <CardContent className="p-8 space-y-6">
                <div className="flex">
                  <div className={message.wide
                    ? 'w-full h-[240px] bg-gradient-to-br from-french-blue/10 via-white to-french-blue/10 border border-french-blue/20 rounded-lg flex items-center justify-center p-6'
                    : 'w-full'
                  }>
                    <img src={normalizeMediaUrl(message.image)} alt={message.imageAlt} className={message.wide ? 'max-h-full object-contain' : 'w-full rounded-lg shadow-md'} />
                  </div>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-wide text-french-blue font-semibold">{message.eyebrow}</p>
                  <h3 className="text-2xl font-playfair font-bold text-french-blue">{message.title}</h3>
                </div>
                <div className="space-y-4 text-gray-700 leading-relaxed text-justify">
                  {(message.paragraphs || []).map((paragraph, index) => <p key={`paragraph-${index}`}>{paragraph}</p>)}
                  <div className="pt-2 space-y-2">
                    {(message.signature || []).map((line, index) => <p key={`signature-${index}`} className="font-semibold text-gray-900">{line}</p>)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {home.showMetricsOnPage && (keyMetrics.length > 0 || chartItems.length > 0) && (
        <ErrorBoundary compact sectionName="Indicateurs Accueil">
          <section className="py-12 md:py-16 bg-white border-t border-slate-100">
            <div className="container mx-auto px-6 space-y-8">
              <h2 className="text-3xl font-playfair font-bold text-french-blue text-center">
                {home.metricsSectionTitle || 'Indicateurs clés du LFJP'}
              </h2>
              {keyMetrics.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {keyMetrics.map((km, idx) => (
                    <Card key={`home-pub-km-${idx}`} className="border border-slate-100 shadow-sm">
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
                    {home.chartTitle && (
                      <h3 className="text-lg font-playfair font-bold text-slate-900 mb-4">{home.chartTitle}</h3>
                    )}
                    <div className="h-[260px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartItems} margin={{ top: 10, right: 20, left: 0, bottom: 8 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Bar dataKey="value" name="Valeur" fill="#005BAC" radius={[6, 6, 0, 0]} />
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
      <BackToTop />
    </div>
  );
};

export default Index;

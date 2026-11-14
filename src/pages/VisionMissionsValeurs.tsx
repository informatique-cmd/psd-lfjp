import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Vision from '../components/Vision';
import Missions from '../components/Missions';
import Valeurs from '../components/Valeurs';
import Footer from '../components/Footer';
import AdminVisionValeursEditor, { type VisionMissionsValeursContent } from '../components/AdminVisionValeursEditor';
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

      <Footer />
    </div>
  );
};

export default VisionMissionsValeurs;

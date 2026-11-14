import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DiagnosticPsdElevesContent from './DiagnosticPsdElevesContent';
import DiagnosticPsdParentsContent from './DiagnosticPsdParentsContent';
import AdminPsdSurveyEditor from './AdminPsdSurveyEditor';
import { PsdSurveyDataProvider, mergeAndSanitizePsdSurveyData } from './PsdSurveyDataContext';
import { defaultPsdSurveyData, type PsdSurveyData } from '@/data/psdSurveyData';
import pageDataFile from '@/content/pageData.json';
import { usePrivilegedAccess, isPrivilegedUser, shouldShowEditorControls } from '@/lib/authAccess';
import { usePublishedPageData } from '@/lib/publishedDataSync';

const defaultFallbackBundle = {
  ...pageDataFile,
  psdSurveyData: (pageDataFile as { psdSurveyData?: PsdSurveyData }).psdSurveyData || defaultPsdSurveyData,
};

const getInitialPsdSurvey = (publishedBase: PsdSurveyData): PsdSurveyData => {
  if (typeof window !== 'undefined' && isPrivilegedUser() && shouldShowEditorControls()) {
    try {
      const saved = window.localStorage.getItem('lfjp-admin-page-data-draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.psdSurveyData) {
          return mergeAndSanitizePsdSurveyData(parsed.psdSurveyData);
        }
      }
    } catch {
      // fallback
    }
  }
  return mergeAndSanitizePsdSurveyData(publishedBase);
};

const DiagnosticPsdContent = () => {
  const publishedBundle = usePublishedPageData(defaultFallbackBundle);
  const publishedSurvey = React.useMemo(
    () => mergeAndSanitizePsdSurveyData(publishedBundle?.psdSurveyData || defaultPsdSurveyData),
    [publishedBundle]
  );

  const [psdSurveyData, setPsdSurveyData] = React.useState<PsdSurveyData>(() =>
    getInitialPsdSurvey(publishedSurvey)
  );
  const { isPrivileged, showEditorControls } = usePrivilegedAccess();

  React.useEffect(() => {
    if (!isPrivileged || !showEditorControls) {
      setPsdSurveyData(publishedSurvey);
    }
  }, [publishedSurvey, isPrivileged, showEditorControls]);

  React.useEffect(() => {
    const handleSync = (e: Event) => {
      const custom = e as CustomEvent<{ psdSurveyData?: PsdSurveyData; source?: string }>;
      if (custom.detail?.source === 'psd_survey_editor') return;
      if (custom.detail?.psdSurveyData) {
        setPsdSurveyData(mergeAndSanitizePsdSurveyData(custom.detail.psdSurveyData));
      }
    };
    const handleStorage = () => {
      setPsdSurveyData(getInitialPsdSurvey(publishedSurvey));
    };
    const handleRecover = () => {
      setPsdSurveyData(mergeAndSanitizePsdSurveyData(defaultPsdSurveyData));
    };
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'lfjp-page-data-update' && e.data?.data?.psdSurveyData) {
        setPsdSurveyData(mergeAndSanitizePsdSurveyData(e.data.data.psdSurveyData));
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('message', handleMessage);
    window.addEventListener('lfjp_page_data_changed', handleSync);
    window.addEventListener('lfjp_draft_cleared', handleStorage);
    window.addEventListener('lfjp_section_recovered_psd', handleRecover);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('lfjp_page_data_changed', handleSync);
      window.removeEventListener('lfjp_draft_cleared', handleStorage);
      window.removeEventListener('lfjp_section_recovered_psd', handleRecover);
    };
  }, [publishedSurvey]);

  const handleSurveyChange = (updated: PsdSurveyData) => {
    if (!isPrivileged || !showEditorControls) {
      return;
    }
    const sanitized = mergeAndSanitizePsdSurveyData(updated);
    setPsdSurveyData(sanitized);
    if (typeof window !== 'undefined') {
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
          psdSurveyData: sanitized,
        };
        window.localStorage.setItem('lfjp-admin-page-data-draft', JSON.stringify(merged));
        window.dispatchEvent(
          new CustomEvent('lfjp_page_data_changed', {
            detail: { psdSurveyData: sanitized, source: 'psd_survey_editor' },
          })
        );
        window.dispatchEvent(new Event('storage'));

        if (window.parent && window.parent !== window) {
          try {
            window.parent.postMessage(
              { type: 'lfjp_psd_survey_data_updated', psdSurveyData: sanitized },
              '*'
            );
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.error('Failed to save psd survey draft', err);
      }
    }
  };

  return (
    <PsdSurveyDataProvider value={psdSurveyData}>
      <div className="max-w-5xl mx-auto">
        {isPrivileged && showEditorControls && (
          <AdminPsdSurveyEditor
            psdSurveyData={psdSurveyData}
            onChange={handleSurveyChange}
          />
        )}
        <Tabs defaultValue="eleves" className="w-full">
          <TabsList className="mb-8 w-full max-w-md mx-auto grid grid-cols-2">
            <TabsTrigger value="eleves" className="text-sm md:text-base font-medium">
              Sondage Élèves
            </TabsTrigger>
            <TabsTrigger value="parents" className="text-sm md:text-base font-medium">
              Sondage Parents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="eleves">
            <DiagnosticPsdElevesContent />
          </TabsContent>

          <TabsContent value="parents">
            <DiagnosticPsdParentsContent />
          </TabsContent>
        </Tabs>
      </div>
    </PsdSurveyDataProvider>
  );
};

export default DiagnosticPsdContent;

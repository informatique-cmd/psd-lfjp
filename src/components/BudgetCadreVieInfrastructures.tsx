import React, { useCallback } from 'react';
import { AdminBudgetDashboard } from '@/components/admin/AdminBudgetDashboard';
import type { BudgetData } from '@/data/budgetTransportData';
import pageDataFile from '@/content/pageData.json';

export interface BudgetCadreVieInfrastructuresProps {
  onDataChange?: (data: BudgetData) => void;
}

export const BudgetCadreVieInfrastructures: React.FC<BudgetCadreVieInfrastructuresProps> = ({
  onDataChange,
}) => {
  const handleDataChange = useCallback(
    (updated: BudgetData) => {
      if (typeof window !== 'undefined') {
        try {
          const raw = window.localStorage.getItem('lfjp-admin-page-data-draft');
          const current = raw ? JSON.parse(raw) : (pageDataFile as Record<string, unknown>);
          const merged = {
            ...current,
            budgetData: updated,
          };
          window.localStorage.setItem('lfjp-admin-page-data-draft', JSON.stringify(merged));
          window.dispatchEvent(
            new CustomEvent('lfjp_page_data_changed', {
              detail: { budgetData: updated, source: 'budget_cadre_vie_page' },
            })
          );
        } catch (err) {
          console.error('Error saving budget page data:', err);
        }
      }
      if (onDataChange) {
        onDataChange(updated);
      }
    },
    [onDataChange]
  );

  return (
    <div className="w-full">
      <AdminBudgetDashboard onDataChange={handleDataChange} />
    </div>
  );
};

export default BudgetCadreVieInfrastructures;

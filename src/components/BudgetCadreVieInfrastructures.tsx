import React from 'react';
import { AdminBudgetDashboard } from '@/components/admin/AdminBudgetDashboard';
import type { BudgetData } from '@/data/budgetTransportData';

export interface BudgetCadreVieInfrastructuresProps {
  onDataChange?: (data: BudgetData) => void;
}

export const BudgetCadreVieInfrastructures: React.FC<BudgetCadreVieInfrastructuresProps> = ({
  onDataChange,
}) => {
  return (
    <div className="w-full rounded-2xl border border-slate-200/90 bg-white shadow-xl p-4 sm:p-6 lg:p-7">
      <AdminBudgetDashboard onDataChange={onDataChange} />
    </div>
  );
};

export default BudgetCadreVieInfrastructures;

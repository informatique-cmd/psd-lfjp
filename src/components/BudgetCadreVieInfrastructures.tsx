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
    <div className="w-full">
      <AdminBudgetDashboard onDataChange={onDataChange} />
    </div>
  );
};

export default BudgetCadreVieInfrastructures;

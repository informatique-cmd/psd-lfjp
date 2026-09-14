
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MobileNavItemProps {
  to: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const MobileNavItem = ({ to, isActive, onClick, children, className }: MobileNavItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "py-3 px-4 mb-1 rounded-md font-medium transition-colors",
        isActive ? "bg-french-blue text-white" : "hover:bg-blue-50 text-french-blue",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default MobileNavItem;

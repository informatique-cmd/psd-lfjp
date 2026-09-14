
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DiagnosticCardProps {
  title: string;
  description?: string;
  className?: string;
  headerClassName?: string;
  children: React.ReactNode;
}

const DiagnosticCard = ({ 
  title, 
  description, 
  className = "", 
  headerClassName = "",
  children 
}: DiagnosticCardProps) => {
  return (
    <Card className={`border-french-blue/10 shadow-md ${className}`}>
      <CardHeader className={headerClassName}>
        <CardTitle className="text-2xl text-french-blue">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default DiagnosticCard;

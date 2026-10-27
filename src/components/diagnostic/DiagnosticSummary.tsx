
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, AlertTriangle } from "lucide-react";

const DiagnosticSummary = () => {
  return (
    <Card className="mb-8 border-french-blue/10 shadow-md bg-gray-50">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
        <CardTitle className="text-xl text-french-blue">Bilan Global de l'ELCS</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-french-blue mb-3">Points Forts</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <ThumbsUp className="h-4 w-4 text-green-600 mr-2 mt-1" />
                <span className="text-sm">Relations avec les Adultes et la Vie Scolaire (Lycée)</span>
              </li>
              <li className="flex items-start">
                <ThumbsUp className="h-4 w-4 text-green-600 mr-2 mt-1" />
                <span className="text-sm">Ambiance entre Élèves (Lycée)</span>
              </li>
              <li className="flex items-start">
                <ThumbsUp className="h-4 w-4 text-green-600 mr-2 mt-1" />
                <span className="text-sm">Faible Absentéisme lié à la Violence</span>
              </li>
              <li className="flex items-start">
                <ThumbsUp className="h-4 w-4 text-green-600 mr-2 mt-1" />
                <span className="text-sm">Perception Positive des Relations par les Personnels</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-french-blue mb-3">Axes d'Amélioration</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-1" />
                <span className="text-sm">Confort Matériel (climatisation, cantine, bâtiments)</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-1" />
                <span className="text-sm">Prévention du Harcèlement et Violence Psychologique</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-1" />
                <span className="text-sm">Sécurité et Surveillance (zones sensibles)</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-1" />
                <span className="text-sm">Équilibre Charge de Travail et Organisation Scolaire</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiagnosticSummary;

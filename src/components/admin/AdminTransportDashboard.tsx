import React, { useState, useEffect, useCallback } from 'react';
import {
  BusFront,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  defaultTransportData,
  type TransportData,
  type TransportCommune,
  type TransportCircuit
} from '@/data/budgetTransportData';
import pageDataFile from '@/content/pageData.json';

export interface AdminTransportDashboardProps {
  onDataChange?: (data: TransportData) => void;
}

export const AdminTransportDashboard: React.FC<AdminTransportDashboardProps> = ({
  onDataChange,
}) => {
  // Helper to load current transport data prioritizing localStorage draft then pageData.json then defaults
  const loadCurrentTransport = (): TransportData => {
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem('lfjp-admin-page-data-draft');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.transportData?.communes && parsed.transportData.communes.length > 0) {
            return parsed.transportData as TransportData;
          }
        }
      } catch {
        // fallback
      }
    }
    const fileTransport = (pageDataFile as { transportData?: TransportData }).transportData;
    if (fileTransport?.communes && fileTransport.communes.length > 0) {
      return fileTransport;
    }
    return defaultTransportData;
  };

  const [transport, setTransport] = useState<TransportData>(loadCurrentTransport);
  const [, setSaveStatus] = useState<'saved' | 'saving' | 'synced'>('synced');

  // Sync state if draft changes in another tab/window
  useEffect(() => {
    const handleStorage = () => {
      setTransport(loadCurrentTransport());
    };
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ transportData?: TransportData }>;
      if (customEvent.detail?.transportData) {
        setTransport(customEvent.detail.transportData);
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('lfjp_page_data_changed', handleSync);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('lfjp_page_data_changed', handleSync);
    };
  }, []);

  // Broadcast and persist changes
  const persistChanges = useCallback(
    (nextTransport: TransportData) => {
      setTransport(nextTransport);
      setSaveStatus('saving');
      try {
        if (typeof window !== 'undefined') {
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
            transportData: nextTransport,
          };
          window.localStorage.setItem('lfjp-admin-page-data-draft', JSON.stringify(merged));
          window.dispatchEvent(
            new CustomEvent('lfjp_page_data_changed', {
              detail: { transportData: nextTransport },
            })
          );
          window.dispatchEvent(new Event('storage'));

          if (window.parent && window.parent !== window) {
            try {
              window.parent.postMessage(
                { type: 'lfjp_transport_data_updated', transportData: nextTransport },
                '*'
              );
              window.parent.dispatchEvent(
                new CustomEvent('lfjp_page_data_changed', {
                  detail: { transportData: nextTransport },
                })
              );
            } catch {
              // ignore cross-origin error
            }
          }
        }
      } catch (err) {
        console.error('Failed to persist transport draft', err);
      }
      onDataChange?.(nextTransport);
      setTimeout(() => setSaveStatus('saved'), 250);
    },
    [onDataChange]
  );

  // KPI updates
  const handleStatChange = (field: keyof TransportData['stats'], value: string | number) => {
    const nextStats = {
      ...transport.stats,
      [field]: field === 'totalEleves' ? Number(value) || 0 : value,
    };
    persistChanges({
      ...transport,
      stats: nextStats,
    });
  };

  // Communes updates
  const handleCommuneChange = (index: number, field: keyof TransportCommune, value: string | number) => {
    const nextCommunes = transport.communes.map((c, i) =>
      i === index ? { ...c, [field]: field === 'total' ? Number(value) || 0 : value } : c
    );
    persistChanges({
      ...transport,
      communes: nextCommunes,
    });
  };

  const handleAddCommune = () => {
    const newCommune: TransportCommune = {
      ville: 'Nouvelle commune',
      total: 10,
      part: '2 %',
    };
    persistChanges({
      ...transport,
      communes: [...transport.communes, newCommune],
    });
  };

  const handleDeleteCommune = (index: number) => {
    persistChanges({
      ...transport,
      communes: transport.communes.filter((_, i) => i !== index),
    });
  };

  // Circuits updates
  const handleCircuitChange = (index: number, field: keyof TransportCircuit, value: string | number) => {
    const nextCircuits = transport.circuits.map((c, i) =>
      i === index ? { ...c, [field]: field === 'eleves' ? Number(value) || 0 : value } : c
    );
    persistChanges({
      ...transport,
      circuits: nextCircuits,
    });
  };

  const handleAddCircuit = () => {
    const nextIndex = (transport.circuits?.length || 0) + 1;
    const newCircuit: TransportCircuit = {
      name: `Ligne ${nextIndex} : Nouvelle ligne → LFJP`,
      eleves: 25,
      arrets: 'Arrêt 1, Arrêt 2, Lycée',
      horaireDepart: '07h20',
    };
    persistChanges({
      ...transport,
      circuits: [...(transport.circuits || []), newCircuit],
    });
  };

  const handleDeleteCircuit = (index: number) => {
    persistChanges({
      ...transport,
      circuits: transport.circuits.filter((_, i) => i !== index),
    });
  };

  // Tarifs updates
  const handleTarifChange = (
    index: number,
    field: 'zone' | 'description' | 'mensuel' | 'annuel',
    value: string | number
  ) => {
    const currentTarifs = transport.tarifs || defaultTransportData.tarifs;
    const nextTarifs = currentTarifs.map((t, i) =>
      i === index
        ? {
            ...t,
            [field]: field === 'mensuel' || field === 'annuel' ? Number(value) || 0 : value,
          }
        : t
    );
    persistChanges({
      ...transport,
      tarifs: nextTarifs,
    });
  };

  const handleAddTarif = () => {
    const currentTarifs = transport.tarifs || defaultTransportData.tarifs;
    const nextIndex = currentTarifs.length + 1;
    const newTarif = {
      zone: `Zone ${nextIndex} (Nouvelle zone)`,
      description: 'Trajets spécifiques',
      mensuel: 35000,
      annuel: 350000,
    };
    persistChanges({
      ...transport,
      tarifs: [...currentTarifs, newTarif],
    });
  };

  const handleDeleteTarif = (index: number) => {
    const currentTarifs = transport.tarifs || defaultTransportData.tarifs;
    persistChanges({
      ...transport,
      tarifs: currentTarifs.filter((_, i) => i !== index),
    });
  };

  const tarifsList = transport.tarifs && transport.tarifs.length > 0 ? transport.tarifs : defaultTransportData.tarifs;

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header matching image_5ded3f36.png */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Transport Scolaire & Distribution Géographique des Familles
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Effectifs par commune (Saly, Ngaparou, Somone, Mbour), circuits de navettes et grille tarifaire.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={handleAddCommune}
            className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" /> + Ajouter une commune
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleAddCircuit}
            className="bg-[#003366] hover:bg-sky-900 text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" /> + Ajouter une ligne / circuit
          </Button>
        </div>
      </div>

      {/* 4 KPIs Cards matching image_5ded3f36.png */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-3.5">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-sky-800">
            TOTAL ÉLÈVES (R1+R2)
          </Label>
          <Input
            type="number"
            value={transport.stats?.totalEleves || 0}
            onChange={(e) => handleStatChange('totalEleves', e.target.value)}
            className="mt-1 font-bold text-lg text-sky-900 bg-white h-9"
          />
        </div>

        {/* KPI 2 */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-3.5">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
            PART RÉSIDANT À SALY
          </Label>
          <Input
            value={transport.stats?.partSaly || ''}
            onChange={(e) => handleStatChange('partSaly', e.target.value)}
            className="mt-1 font-bold text-lg text-blue-900 bg-white h-9"
            placeholder="49 %"
          />
        </div>

        {/* KPI 3 */}
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-3.5">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-indigo-800">
            PÉRIPHÉRIE IMMÉDIATE
          </Label>
          <Input
            value={transport.stats?.partPeripherie || ''}
            onChange={(e) => handleStatChange('partPeripherie', e.target.value)}
            className="mt-1 font-bold text-lg text-indigo-900 bg-white h-9"
            placeholder="42 %"
          />
        </div>

        {/* KPI 4 */}
        <div className="rounded-xl border border-amber-300 bg-amber-50/40 p-3.5">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
            ÉLOIGNÉS (&gt; 30 KM)
          </Label>
          <Input
            value={transport.stats?.partEloignee || ''}
            onChange={(e) => handleStatChange('partEloignee', e.target.value)}
            className="mt-1 font-bold text-lg text-amber-900 bg-white h-9"
            placeholder="9 %"
          />
        </div>
      </div>

      {/* Communes Distribution Table matching image_5ded3f36.png */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            RÉPARTITION DES FAMILLES PAR COMMUNE ({transport.communes.length})
          </h3>
          <span className="text-xs text-slate-500 font-light">
            Effectifs constatés d’après les adresses de rentrée
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 font-semibold text-slate-700">
              <tr>
                <th className="p-2.5 w-44">Ville / Commune</th>
                <th className="p-2.5 w-28">Total Élèves</th>
                <th className="p-2.5 w-24">Part estimée</th>
                <th className="p-2.5">Jauge de représentation</th>
                <th className="p-2.5 text-right w-16">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {transport.communes.map((commune, index) => {
                const numericPart = parseInt(commune.part, 10) || (commune.total ? Math.round((commune.total / (transport.stats?.totalEleves || 593)) * 100) : 0);
                return (
                  <tr key={`commune-row-${index}`} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-2">
                      <Input
                        value={commune.ville}
                        onChange={(e) => handleCommuneChange(index, 'ville', e.target.value)}
                        className="h-8 text-xs font-medium bg-white"
                        placeholder="Nom de la commune"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={commune.total}
                        onChange={(e) => handleCommuneChange(index, 'total', e.target.value)}
                        className="h-8 text-xs font-bold text-sky-900 bg-white"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        value={commune.part}
                        onChange={(e) => handleCommuneChange(index, 'part', e.target.value)}
                        className="h-8 text-xs bg-white"
                        placeholder="ex: 15 %"
                      />
                    </td>
                    <td className="p-2">
                      <div className="h-2 w-full max-w-xs rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-sky-600 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.max(2, numericPart))}%` }}
                        />
                      </div>
                    </td>
                    <td className="p-2 text-right">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteCommune(index)}
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer rounded-lg"
                        title="Supprimer cette commune"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Circuits & Lines matching image_5ded3f36.png */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            CIRCUITS ET LIGNES DE RAMASSAGE PRÉCONISÉS ({transport.circuits?.length || 0})
          </h3>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleAddCircuit}
            className="text-xs text-french-blue hover:text-blue-800 p-0 h-auto cursor-pointer font-semibold"
          >
            + Ajouter une ligne
          </Button>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {(transport.circuits || []).map((circuit, cirIdx) => (
            <div
              key={`circuit-card-${cirIdx}`}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <BusFront className="h-4 w-4 text-sky-600" />
                  <span className="font-bold text-xs text-sky-900">Ligne {cirIdx + 1}</span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteCircuit(cirIdx)}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer rounded-md"
                  title="Supprimer cette ligne"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <Label className="text-[10px] text-slate-500 font-semibold uppercase">Nom de la ligne</Label>
                  <Input
                    value={circuit.name}
                    onChange={(e) => handleCircuitChange(cirIdx, 'name', e.target.value)}
                    className="mt-0.5 text-xs h-7.5 font-medium bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[10px] text-slate-500 font-semibold uppercase">Élèves transportés</Label>
                    <Input
                      type="number"
                      value={circuit.eleves}
                      onChange={(e) => handleCircuitChange(cirIdx, 'eleves', e.target.value)}
                      className="mt-0.5 text-xs h-7.5 font-bold text-sky-800 bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-slate-500 font-semibold uppercase">Départ</Label>
                    <Input
                      value={circuit.horaireDepart}
                      onChange={(e) => handleCircuitChange(cirIdx, 'horaireDepart', e.target.value)}
                      className="mt-0.5 text-xs h-7.5 bg-white"
                      placeholder="07h15"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-[10px] text-slate-500 font-semibold uppercase">Arrêts desservis</Label>
                  <Input
                    value={circuit.arrets}
                    onChange={(e) => handleCircuitChange(cirIdx, 'arrets', e.target.value)}
                    className="mt-0.5 text-xs h-7.5 text-slate-700 bg-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tariffs Grid matching image_5ded3f36.png */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            GRILLE TARIFAIRE INDICATIVE PAR ZONE ({tarifsList.length})
          </h3>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleAddTarif}
            className="text-xs text-sky-800 hover:text-sky-950 p-0 h-auto cursor-pointer font-semibold"
          >
            + Ajouter une zone tarifaire
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tarifsList.map((tarif, tIdx) => (
            <div
              key={`tarif-card-${tIdx}`}
              className="p-3.5 rounded-xl border border-slate-200 bg-white text-xs space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between gap-1">
                <Input
                  value={tarif.zone}
                  onChange={(e) => handleTarifChange(tIdx, 'zone', e.target.value)}
                  className="font-bold text-xs text-french-blue h-7 bg-white"
                  placeholder="Nom de la zone"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteTarif(tIdx)}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0 cursor-pointer"
                  title="Supprimer cette zone tarifaire"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

              <div>
                <Label className="text-[10px] text-slate-400 font-semibold uppercase">Description / Distance</Label>
                <Input
                  value={tarif.description}
                  onChange={(e) => handleTarifChange(tIdx, 'description', e.target.value)}
                  className="text-[11px] text-slate-600 h-6.5 bg-white"
                  placeholder="ex: Trajets inférieurs à 5 km"
                />
              </div>

              <div className="pt-2 border-t mt-1 grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[10px] text-slate-500 font-semibold uppercase">FCFA / mois</Label>
                  <Input
                    type="number"
                    value={tarif.mensuel}
                    onChange={(e) => handleTarifChange(tIdx, 'mensuel', e.target.value)}
                    className="text-xs font-bold text-slate-800 h-7 bg-white"
                  />
                </div>
                <div>
                  <Label className="text-[10px] text-slate-500 font-semibold uppercase">FCFA / an</Label>
                  <Input
                    type="number"
                    value={tarif.annuel}
                    onChange={(e) => handleTarifChange(tIdx, 'annuel', e.target.value)}
                    className="text-xs text-slate-600 h-7 bg-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

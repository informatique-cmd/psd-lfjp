import React, { useState, useEffect, useCallback } from 'react';
import {
  BusFront,
  Plus,
  Trash2,
  Eye,
  CheckCircle2,
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

/**
 * Automatically calculates integer percentages that sum to EXACTLY 100%
 * using the Hare-Niemeyer / Largest Remainder algorithm.
 */
export function calculateDynamicCommunesPercentages(
  communes: TransportCommune[]
): TransportCommune[] {
  if (!communes || !Array.isArray(communes) || communes.length === 0) return [];
  const safe = communes.map((c) => ({
    ville: c?.ville || 'Commune',
    total: Math.max(0, Number(c?.total) || 0),
    part: c?.part || '0 %',
  }));
  const totals = safe.map((c) => c.total);
  const totalSum = totals.reduce((sum, val) => sum + val, 0);

  if (totalSum === 0) {
    const basePct = Math.floor(100 / safe.length);
    const rem = 100 - basePct * safe.length;
    return safe.map((c, i) => ({
      ...c,
      part: `${i === 0 ? basePct + rem : basePct} %`,
    }));
  }

  const rawPcts = totals.map((t) => (t / totalSum) * 100);
  const floorPcts = rawPcts.map((p) => Math.floor(p));
  const remainders = rawPcts.map((p, i) => ({ index: i, rem: p - floorPcts[i] }));
  const diff = 100 - floorPcts.reduce((sum, v) => sum + v, 0);

  // Give 1 extra point to items with largest decimal parts
  remainders.sort((a, b) => b.rem - a.rem);
  for (let i = 0; i < diff && i < remainders.length; i++) {
    floorPcts[remainders[i].index] += 1;
  }

  return safe.map((c, i) => ({
    ...c,
    part: `${floorPcts[i]} %`,
  }));
}

/**
 * Dynamically derives high-level KPIs based on communes distribution
 */
export function deriveStatsFromCommunes(
  communes: TransportCommune[]
): TransportData['stats'] {
  const safeCommunes = Array.isArray(communes) ? communes : [];
  const totalEleves = safeCommunes.reduce((sum, c) => sum + (Math.max(0, Number(c?.total)) || 0), 0);

  const getNumPart = (c?: TransportCommune) => {
    if (!c) return 0;
    return parseInt(String(c.part || '0'), 10) || 0;
  };

  const saly = safeCommunes.find((c) => (c?.ville || '').toLowerCase().includes('saly'));
  const partSalyNum = getNumPart(saly);

  // Peripherie: Ngaparou, Somone, Mbour, Malicounda, Nguerigne
  const peripherieList = safeCommunes.filter((c) => {
    const v = (c?.ville || '').toLowerCase();
    return (
      v.includes('ngaparou') ||
      v.includes('somone') ||
      v.includes('mbour') ||
      v.includes('malicounda') ||
      v.includes('nguerigne')
    );
  });
  const partPeripherieNum = peripherieList.reduce((acc, c) => acc + getNumPart(c), 0);

  // Distant: all other communes (Autres > 30 km, Dakar, Thiès, etc.)
  const partEloigneeNum = Math.max(0, 100 - partSalyNum - partPeripherieNum);

  return {
    totalEleves,
    partSaly: `${partSalyNum} %`,
    partPeripherie: `${partPeripherieNum} %`,
    partEloignee: `${partEloigneeNum} %`,
  };
}

export interface AdminTransportDashboardProps {
  onDataChange?: (data: TransportData) => void;
  onSwitchToVitrine?: () => void;
}

export const AdminTransportDashboard: React.FC<AdminTransportDashboardProps> = ({
  onDataChange,
  onSwitchToVitrine,
}) => {
  // Helper to load current transport data prioritizing localStorage draft then pageData.json then defaults
  const loadCurrentTransport = (): TransportData => {
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem('lfjp-admin-page-data-draft');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.transportData?.communes && Array.isArray(parsed.transportData.communes) && parsed.transportData.communes.length > 0) {
            const balancedCommunes = calculateDynamicCommunesPercentages(parsed.transportData.communes);
            const dynamicStats = deriveStatsFromCommunes(balancedCommunes);
            return {
              ...defaultTransportData,
              ...parsed.transportData,
              communes: balancedCommunes,
              stats: {
                ...(parsed.transportData.stats || {}),
                ...dynamicStats,
              },
              circuits: Array.isArray(parsed.transportData.circuits) && parsed.transportData.circuits.length > 0 ? parsed.transportData.circuits : defaultTransportData.circuits,
              tarifs: Array.isArray(parsed.transportData.tarifs) && parsed.transportData.tarifs.length > 0 ? parsed.transportData.tarifs : defaultTransportData.tarifs,
            } as TransportData;
          }
        }
      } catch {
        // fallback
      }
    }
    const fileTransport = (pageDataFile as { transportData?: TransportData }).transportData;
    if (fileTransport?.communes && Array.isArray(fileTransport.communes) && fileTransport.communes.length > 0) {
      const balanced = calculateDynamicCommunesPercentages(fileTransport.communes);
      return {
        ...defaultTransportData,
        ...fileTransport,
        communes: balanced,
        stats: deriveStatsFromCommunes(balanced),
        circuits: Array.isArray(fileTransport.circuits) && fileTransport.circuits.length > 0 ? fileTransport.circuits : defaultTransportData.circuits,
        tarifs: Array.isArray(fileTransport.tarifs) && fileTransport.tarifs.length > 0 ? fileTransport.tarifs : defaultTransportData.tarifs,
      };
    }
    const balancedDefault = calculateDynamicCommunesPercentages(defaultTransportData.communes);
    return {
      ...defaultTransportData,
      communes: balancedDefault,
      stats: deriveStatsFromCommunes(balancedDefault),
    };
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
        const incoming = customEvent.detail.transportData;
        const balanced = calculateDynamicCommunesPercentages(incoming.communes || []);
        setTransport({
          ...incoming,
          communes: balanced,
          stats: deriveStatsFromCommunes(balanced),
        });
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

  // KPI manual override
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

  // Communes updates with dynamic recalculation (sum always 100%)
  const handleCommuneChange = (
    index: number,
    field: keyof TransportCommune,
    value: string | number
  ) => {
    let updatedCommunes: TransportCommune[];

    if (field === 'total') {
      const newTotal = Math.max(0, Number(value) || 0);
      const tempCommunes = transport.communes.map((c, i) =>
        i === index ? { ...c, total: newTotal } : c
      );
      // Automatically re-distribute percentages so sum = 100%
      updatedCommunes = calculateDynamicCommunesPercentages(tempCommunes);
    } else if (field === 'part') {
      // User typed a specific percentage directly
      const targetPct = Math.min(99, Math.max(1, parseInt(String(value), 10) || 1));
      const otherStudents = transport.communes
        .filter((_, i) => i !== index)
        .reduce((sum, c) => sum + (Math.max(0, Number(c.total)) || 0), 0);

      // Derive corresponding total students to match this target percentage
      const derivedTotal = otherStudents > 0
        ? Math.max(1, Math.round((otherStudents * targetPct) / (100 - targetPct)))
        : 10;

      const tempCommunes = transport.communes.map((c, i) =>
        i === index ? { ...c, total: derivedTotal } : c
      );
      updatedCommunes = calculateDynamicCommunesPercentages(tempCommunes);
    } else {
      updatedCommunes = transport.communes.map((c, i) =>
        i === index ? { ...c, [field]: value } : c
      );
    }

    const updatedStats = deriveStatsFromCommunes(updatedCommunes);
    persistChanges({
      ...transport,
      communes: updatedCommunes,
      stats: {
        ...transport.stats,
        ...updatedStats,
      },
    });
  };

  const handleAddCommune = () => {
    // Default effectif for new commune
    const currentTotal = transport.communes.reduce((s, c) => s + (Number(c.total) || 0), 0);
    const avgEffectif = currentTotal > 0 ? Math.max(5, Math.round(currentTotal / (transport.communes.length * 4))) : 15;
    const newCommune: TransportCommune = {
      ville: 'Nouvelle commune',
      total: avgEffectif,
      part: '0 %',
    };
    const nextCommunes = [...transport.communes, newCommune];
    const balancedCommunes = calculateDynamicCommunesPercentages(nextCommunes);
    const updatedStats = deriveStatsFromCommunes(balancedCommunes);

    persistChanges({
      ...transport,
      communes: balancedCommunes,
      stats: {
        ...transport.stats,
        ...updatedStats,
      },
    });
  };

  const handleDeleteCommune = (index: number) => {
    const filteredCommunes = transport.communes.filter((_, i) => i !== index);
    const balancedCommunes = calculateDynamicCommunesPercentages(filteredCommunes);
    const updatedStats = deriveStatsFromCommunes(balancedCommunes);

    persistChanges({
      ...transport,
      communes: balancedCommunes,
      stats: {
        ...transport.stats,
        ...updatedStats,
      },
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

  const handleSwitchToVitrine = () => {
    if (onSwitchToVitrine) {
      onSwitchToVitrine();
    } else {
      window.open('/transport-scolaire', '_blank');
    }
  };

  const tarifsList = transport.tarifs && transport.tarifs.length > 0 ? transport.tarifs : defaultTransportData.tarifs;
  const totalCommunesEleves = transport.communes.reduce((s, c) => s + (Number(c.total) || 0), 0);
  const totalCommunesPercent = transport.communes.reduce((s, c) => s + (parseInt(c.part, 10) || 0), 0);

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header matching image_5ded3f36.png + requested button right after ajouter circuit */}
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
          {/* Bouton demandé : Basculer en Vue Vitrine tout juste après ajouter une ligne/circuit */}
          <Button
            type="button"
            size="sm"
            onClick={handleSwitchToVitrine}
            className="border border-emerald-500 bg-white hover:bg-emerald-50 text-emerald-700 text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Eye className="mr-1.5 h-3.5 w-3.5 text-emerald-600" /> Basculer en Vue Vitrine
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
            value={transport.stats?.totalEleves || totalCommunesEleves}
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
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              RÉPARTITION DES FAMILLES PAR COMMUNE ({transport.communes.length})
            </h3>
            <span className="text-[11px] text-slate-500 font-light">
              Effectifs constatés d’après les adresses de rentrée • Pourcentages dynamiques recalculés à 100 %
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Total : {totalCommunesPercent} % ({totalCommunesEleves} élèves)</span>
          </div>
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
                const numericPart = parseInt(commune.part, 10) || 0;
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
                        className="h-8 text-xs bg-white font-semibold text-sky-800"
                        title="Pourcentage automatique recalculé sur le total de 100%"
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
            <tfoot className="bg-slate-50/70 border-t font-semibold text-slate-700">
              <tr>
                <td className="p-2.5">Total cumulé</td>
                <td className="p-2.5 font-bold text-sky-900">{totalCommunesEleves}</td>
                <td className="p-2.5 font-bold text-emerald-700">{totalCommunesPercent} %</td>
                <td className="p-2.5 text-xs text-slate-500 font-normal">
                  Somme calibrée à 100 % (ajustement automatique)
                </td>
                <td className="p-2.5 text-right font-medium text-emerald-600">100%</td>
              </tr>
            </tfoot>
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

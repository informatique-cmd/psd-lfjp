import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  LayoutGrid,
  Lock,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { usePrivilegedAccess } from '@/lib/authAccess';
import type { ManagedPage, TextStyle } from '@/content/pageTypes';
import {
  buildDefaultRubriquePage,
  generateUniqueNavPath,
  normalizeNavPath,
  resolveNavRubriques,
  type NavRubriqueItem,
} from '@/data/navRubriques';

export interface HomeCardItem {
  title: string;
  description: string;
  linkLabel: string;
  path: string;
  image?: string;
  style?: TextStyle;
}

export interface HomeMessageItem {
  eyebrow: string;
  title: string;
  image: string;
  imageAlt: string;
  paragraphs: string[];
  signature: string[];
  wide?: boolean;
}

export interface HomeSectionContent {
  heroTitle: string;
  heroSubtitle: string;
  sectionTitle: string;
  navItems?: NavRubriqueItem[];
  cards: HomeCardItem[];
  messages: HomeMessageItem[];
}

export interface AdminHomeEditorProps {
  home: HomeSectionContent;
  pages?: ManagedPage[];
  onChange: (nextHome: HomeSectionContent) => void;
  onPagesChange?: (nextPages: ManagedPage[]) => void;
  onSaveDraft?: () => void;
}

export const AdminHomeEditor: React.FC<AdminHomeEditorProps> = ({
  home,
  pages = [],
  onChange,
  onPagesChange,
  onSaveDraft,
}) => {
  const { isPrivileged, showEditorControls } = usePrivilegedAccess();
  const [isOpen, setIsOpen] = useState(false);

  if (!isPrivileged || !showEditorControls) {
    return null;
  }

  const navItems = resolveNavRubriques(home.navItems);

  const moveItem = <T,>(list: T[], index: number, dir: -1 | 1): T[] => {
    const target = index + dir;
    if (target < 0 || target >= list.length) return list;
    const copy = [...list];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    return copy;
  };

  const handleSaveDraftClick = () => {
    if (onSaveDraft) {
      onSaveDraft();
      return;
    }
    toast.success('Brouillon enregistré localement', {
      description: 'Vos modifications restent privées jusqu’à la publication.',
    });
  };

  const handleAddRubrique = () => {
    const baseLabel = 'Nouvelle rubrique';
    const uniquePath = generateUniqueNavPath(baseLabel, navItems, pages);
    const nextNavItem: NavRubriqueItem = {
      id: `rubrique-${Date.now().toString(36)}`,
      label: baseLabel,
      path: uniquePath,
      isProtected: false,
    };
    const nextNavItems = [...navItems, nextNavItem];
    onChange({
      ...home,
      navItems: nextNavItems,
    });

    if (onPagesChange) {
      const normalized = normalizeNavPath(uniquePath);
      const alreadyExists = pages.some((p) => normalizeNavPath(p.slug) === normalized);
      if (!alreadyExists) {
        const nextPage = buildDefaultRubriquePage(baseLabel, normalized, pages.length + 1);
        onPagesChange([...pages, nextPage]);
      }
    }

    toast.success('Nouvelle rubrique ajoutée au menu', {
      description: `Page dédiée créée à l’adresse ${uniquePath}.`,
    });
  };

  const handleRenameRubrique = (index: number, nextLabel: string) => {
    const targetItem = navItems[index];
    if (!targetItem) return;
    const nextNavItems = navItems.map((item, idx) =>
      idx === index ? { ...item, label: nextLabel } : item
    );
    onChange({
      ...home,
      navItems: nextNavItems,
    });

    if (onPagesChange && nextLabel.trim()) {
      const targetPath = normalizeNavPath(targetItem.path);
      const hasManaged = pages.some((p) => normalizeNavPath(p.slug) === targetPath);
      if (hasManaged) {
        onPagesChange(
          pages.map((p) =>
            normalizeNavPath(p.slug) === targetPath
              ? { ...p, menuLabel: nextLabel, title: p.title || nextLabel }
              : p
          )
        );
      }
    }
  };

  const handleMoveRubrique = (index: number, dir: -1 | 1) => {
    const nextNavItems = moveItem(navItems, index, dir);
    onChange({
      ...home,
      navItems: nextNavItems,
    });
  };

  const handleDeleteRubrique = (index: number) => {
    const targetItem = navItems[index];
    if (!targetItem) return;
    const normalizedPath = normalizeNavPath(targetItem.path);
    // Strict protection: Accueil (/) can NEVER be deleted
    if (targetItem.isProtected || normalizedPath === '/') {
      return;
    }

    const nextNavItems = navItems.filter((_, idx) => idx !== index);
    onChange({
      ...home,
      navItems: nextNavItems,
    });

    if (onPagesChange) {
      const nextPages = pages.filter((p) => normalizeNavPath(p.slug) !== normalizedPath);
      if (nextPages.length !== pages.length) {
        onPagesChange(nextPages);
      }
    }
  };

  return (
    <div className="container mx-auto px-6 pt-6" data-interactive="true">
      <div className="rounded-2xl border border-purple-200 bg-white p-4 sm:p-5 shadow-sm text-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-purple-950 font-playfair">
                  Espace Éditeur · Page Accueil & Menu Supérieur
                </h3>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-full">
                  Privilège Éditeur
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Gérez les rubriques du menu supérieur, la bannière d&apos;ouverture, les cartes du PSD et les mots officiels.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleSaveDraftClick}
              className="bg-french-blue hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
            >
              <Save className="mr-1.5 h-3.5 w-3.5" /> Enregistrer le brouillon
            </Button>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setIsOpen(!isOpen)}
              className="border-purple-300 text-purple-800 hover:bg-purple-50 text-xs font-semibold cursor-pointer"
            >
              {isOpen ? (
                <>
                  <ChevronUp className="mr-1.5 h-3.5 w-3.5" /> Masquer l&apos;éditeur de données
                </>
              ) : (
                <>
                  <ChevronDown className="mr-1.5 h-3.5 w-3.5" /> Afficher l&apos;éditeur de données
                </>
              )}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="mt-4 space-y-6 animate-in fade-in duration-200">
            {/* 1. Rubriques du menu de navigation supérieur */}
            <div className="space-y-3 rounded-xl border border-blue-200 bg-blue-50/30 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-french-blue block">
                    1. Rubriques du menu de navigation supérieur ({navItems.length})
                  </span>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Renommez, réorganisez ou créez de nouvelles rubriques dans la barre supérieure. Chaque nouvelle rubrique génère automatiquement sa propre page éditable.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddRubrique}
                  className="h-8 text-xs bg-french-blue hover:bg-blue-700 text-white font-semibold cursor-pointer"
                >
                  <Plus className="mr-1 h-3.5 w-3.5" /> Ajouter une rubrique
                </Button>
              </div>

              <div className="space-y-2">
                {navItems.map((item, idx) => {
                  const normalizedPath = normalizeNavPath(item.path);
                  const isAccueil = Boolean(item.isProtected) || normalizedPath === '/';
                  const hasCustomPage = pages.some((p) => normalizeNavPath(p.slug) === normalizedPath);

                  return (
                    <div
                      key={`${item.id}-${normalizedPath}`}
                      className="grid gap-2 sm:grid-cols-[1fr_auto_auto] items-center rounded-lg border border-slate-200 bg-white p-2.5"
                    >
                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 min-w-0">
                        <span className="text-[11px] font-bold text-slate-400 w-5 text-center shrink-0">
                          {idx + 1}.
                        </span>
                        <Input
                          value={item.label}
                          aria-label={`Libellé de la rubrique ${idx + 1}`}
                          onChange={(e) => handleRenameRubrique(idx, e.target.value)}
                          className="h-8 text-xs bg-white font-semibold max-w-xs"
                        />
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded truncate">
                          {normalizedPath}
                        </span>
                        {isAccueil && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full shrink-0">
                            <Lock className="h-3 w-3" /> Protégée (Accueil)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 justify-end">
                        <Link
                          to={normalizedPath}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-french-blue hover:underline px-2 py-1 rounded hover:bg-blue-50"
                          title={
                            hasCustomPage
                              ? 'Ouvrir et éditer cette page rubrique'
                              : 'Consulter cette rubrique'
                          }
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>{hasCustomPage ? 'Éditer la page' : 'Ouvrir'}</span>
                        </Link>

                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={idx === 0}
                          onClick={() => handleMoveRubrique(idx, -1)}
                          className="h-7 w-7 p-0"
                          title="Monter dans le menu"
                          aria-label="Monter dans le menu"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={idx === navItems.length - 1}
                          onClick={() => handleMoveRubrique(idx, 1)}
                          className="h-7 w-7 p-0"
                          title="Descendre dans le menu"
                          aria-label="Descendre dans le menu"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>

                        {!isAccueil && (
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteRubrique(idx)}
                            className="h-7 w-7 p-0 text-red-500 hover:bg-red-50"
                            title="Supprimer cette rubrique du menu"
                            aria-label={`Supprimer ${item.label}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. En-tête Hero */}
            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/40 p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-900 block">
                2. En-tête & Bannière d&apos;accueil (Hero)
              </span>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Titre principal
                  </label>
                  <Input
                    value={home.heroTitle}
                    onChange={(e) => onChange({ ...home, heroTitle: e.target.value })}
                    className="h-8 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Sous-titre / Devise
                  </label>
                  <Input
                    value={home.heroSubtitle}
                    onChange={(e) => onChange({ ...home, heroSubtitle: e.target.value })}
                    className="h-8 text-xs bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 3. Section Cartes du PSD */}
            <div className="space-y-3 rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  3. Cartes de présentation du Plan Stratégique ({home.cards.length})
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    onChange({
                      ...home,
                      cards: [
                        ...home.cards,
                        {
                          title: 'Nouvelle rubrique',
                          description: 'Description synthétique de la rubrique.',
                          linkLabel: 'Découvrir',
                          path: '/plan-strategique',
                          style: {
                            fontFamily: 'default',
                            fontSize: 'normal',
                            align: 'left',
                            lineHeight: 'relaxed',
                          },
                        },
                      ],
                    })
                  }
                  className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="mr-1 h-3 w-3" /> Ajouter une carte
                </Button>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Titre de la section des cartes
                </label>
                <Input
                  value={home.sectionTitle}
                  onChange={(e) => onChange({ ...home, sectionTitle: e.target.value })}
                  className="h-8 text-xs bg-white"
                />
              </div>

              <div className="space-y-2.5">
                {home.cards.map((card, idx) => (
                  <div
                    key={`home-card-ed-${idx}`}
                    className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-french-blue">Carte {idx + 1}</span>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={idx === 0}
                          onClick={() => onChange({ ...home, cards: moveItem(home.cards, idx, -1) })}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={idx === home.cards.length - 1}
                          onClick={() => onChange({ ...home, cards: moveItem(home.cards, idx, 1) })}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            onChange({
                              ...home,
                              cards: home.cards.filter((_, i) => i !== idx),
                            })
                          }
                          className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-3">
                      <Input
                        value={card.title}
                        placeholder="Titre"
                        onChange={(e) =>
                          onChange({
                            ...home,
                            cards: home.cards.map((c, i) =>
                              i === idx ? { ...c, title: e.target.value } : c
                            ),
                          })
                        }
                        className="h-7 text-xs bg-white font-semibold"
                      />
                      <Input
                        value={card.linkLabel}
                        placeholder="Libellé du bouton"
                        onChange={(e) =>
                          onChange({
                            ...home,
                            cards: home.cards.map((c, i) =>
                              i === idx ? { ...c, linkLabel: e.target.value } : c
                            ),
                          })
                        }
                        className="h-7 text-xs bg-white"
                      />
                      <Input
                        value={card.path}
                        placeholder="/route"
                        onChange={(e) =>
                          onChange({
                            ...home,
                            cards: home.cards.map((c, i) =>
                              i === idx ? { ...c, path: e.target.value } : c
                            ),
                          })
                        }
                        className="h-7 text-xs bg-white"
                      />
                    </div>
                    <Input
                      value={card.description}
                      placeholder="Description"
                      onChange={(e) =>
                        onChange({
                          ...home,
                          cards: home.cards.map((c, i) =>
                            i === idx ? { ...c, description: e.target.value } : c
                          ),
                        })
                      }
                      className="h-7 text-xs bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Section Mots officiels & Communications */}
            <div className="space-y-3 rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  4. Mots officiels & Communications ({home.messages.length})
                </span>
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    onChange({
                      ...home,
                      messages: [
                        ...home.messages,
                        {
                          eyebrow: 'Nouvelle communication',
                          title: 'Titre du message',
                          image: 'https://i.imgur.com/0YmGlXO.png',
                          imageAlt: 'Illustration LFJP',
                          paragraphs: ['Texte du message officiel.'],
                          signature: ['Direction du LFJP'],
                          wide: false,
                        },
                      ],
                    })
                  }
                  className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="mr-1 h-3 w-3" /> Ajouter un message
                </Button>
              </div>

              <div className="space-y-3">
                {home.messages.map((msg, mIdx) => (
                  <div
                    key={`home-msg-ed-${mIdx}`}
                    className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-french-blue">
                        Message {mIdx + 1} · {msg.title}
                      </span>
                      <div className="flex items-center gap-1">
                        <label className="text-[11px] flex items-center gap-1 mr-2 text-slate-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(msg.wide)}
                            onChange={(e) =>
                              onChange({
                                ...home,
                                messages: home.messages.map((m, i) =>
                                  i === mIdx ? { ...m, wide: e.target.checked } : m
                                ),
                              })
                            }
                          />
                          Pleine largeur
                        </label>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={mIdx === 0}
                          onClick={() =>
                            onChange({ ...home, messages: moveItem(home.messages, mIdx, -1) })
                          }
                          className="h-6 w-6 p-0"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={mIdx === home.messages.length - 1}
                          onClick={() =>
                            onChange({ ...home, messages: moveItem(home.messages, mIdx, 1) })
                          }
                          className="h-6 w-6 p-0"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            onChange({
                              ...home,
                              messages: home.messages.filter((_, i) => i !== mIdx),
                            })
                          }
                          className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-3">
                      <Input
                        value={msg.eyebrow}
                        placeholder="Surtitre"
                        onChange={(e) =>
                          onChange({
                            ...home,
                            messages: home.messages.map((m, i) =>
                              i === mIdx ? { ...m, eyebrow: e.target.value } : m
                            ),
                          })
                        }
                        className="h-7 text-xs bg-white"
                      />
                      <Input
                        value={msg.title}
                        placeholder="Titre"
                        onChange={(e) =>
                          onChange({
                            ...home,
                            messages: home.messages.map((m, i) =>
                              i === mIdx ? { ...m, title: e.target.value } : m
                            ),
                          })
                        }
                        className="h-7 text-xs bg-white font-semibold"
                      />
                      <Input
                        value={msg.image}
                        placeholder="URL image"
                        onChange={(e) =>
                          onChange({
                            ...home,
                            messages: home.messages.map((m, i) =>
                              i === mIdx ? { ...m, image: e.target.value } : m
                            ),
                          })
                        }
                        className="h-7 text-xs bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-600">
                          Paragraphes ({msg.paragraphs.length})
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            onChange({
                              ...home,
                              messages: home.messages.map((m, i) =>
                                i === mIdx
                                  ? { ...m, paragraphs: [...m.paragraphs, 'Nouveau paragraphe.'] }
                                  : m
                              ),
                            })
                          }
                          className="h-6 text-[11px]"
                        >
                          <Plus className="mr-1 h-3 w-3" /> Ajouter un paragraphe
                        </Button>
                      </div>
                      {msg.paragraphs.map((p, pIdx) => (
                        <div key={`msg-${mIdx}-p-${pIdx}`} className="flex items-start gap-1.5">
                          <textarea
                            value={p}
                            rows={2}
                            onChange={(e) =>
                              onChange({
                                ...home,
                                messages: home.messages.map((m, i) =>
                                  i === mIdx
                                    ? {
                                        ...m,
                                        paragraphs: m.paragraphs.map((it, pi) =>
                                          pi === pIdx ? e.target.value : it
                                        ),
                                      }
                                    : m
                                ),
                              })
                            }
                            className="w-full rounded-md border border-slate-200 bg-white p-1.5 text-xs"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              onChange({
                                ...home,
                                messages: home.messages.map((m, i) =>
                                  i === mIdx
                                    ? {
                                        ...m,
                                        paragraphs: m.paragraphs.filter((_, pi) => pi !== pIdx),
                                      }
                                    : m
                                ),
                              })
                            }
                            className="h-7 w-7 p-0 text-red-500 hover:bg-red-50 shrink-0"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-600">
                          Signataires ({msg.signature.length})
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            onChange({
                              ...home,
                              messages: home.messages.map((m, i) =>
                                i === mIdx
                                  ? { ...m, signature: [...m.signature, 'Nouveau signataire'] }
                                  : m
                              ),
                            })
                          }
                          className="h-6 text-[11px]"
                        >
                          <Plus className="mr-1 h-3 w-3" /> Ajouter une ligne
                        </Button>
                      </div>
                      {msg.signature.map((sig, sIdx) => (
                        <div key={`msg-${mIdx}-s-${sIdx}`} className="flex items-center gap-1.5">
                          <Input
                            value={sig}
                            onChange={(e) =>
                              onChange({
                                ...home,
                                messages: home.messages.map((m, i) =>
                                  i === mIdx
                                    ? {
                                        ...m,
                                        signature: m.signature.map((it, si) =>
                                          si === sIdx ? e.target.value : it
                                        ),
                                      }
                                    : m
                                ),
                              })
                            }
                            className="h-7 text-xs bg-white"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              onChange({
                                ...home,
                                messages: home.messages.map((m, i) =>
                                  i === mIdx
                                    ? {
                                        ...m,
                                        signature: m.signature.filter((_, si) => si !== sIdx),
                                      }
                                    : m
                                ),
                              })
                            }
                            className="h-6 w-6 p-0 text-red-500 hover:bg-red-50 shrink-0"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHomeEditor;

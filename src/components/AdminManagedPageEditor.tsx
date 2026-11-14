import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  FileEdit,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { usePrivilegedAccess } from '@/lib/authAccess';
import type { ContentBlock, ManagedPage } from '@/content/pageTypes';

export interface AdminManagedPageEditorProps {
  page: ManagedPage;
  onChange: (nextPage: ManagedPage) => void;
  onSaveDraft?: () => void;
}

const blockTypeLabels: Record<ContentBlock['type'], string> = {
  heading: 'Titre de section',
  paragraph: 'Paragraphe',
  list: 'Liste à puces',
  callout: 'Encadré informatif',
  quote: 'Citation',
  divider: 'Séparateur',
  image: 'Image',
  gallery: 'Galerie',
  video: 'Vidéo',
  embed: 'Contenu intégré',
  table: 'Tableau',
  chart: 'Graphique',
  button: 'Bouton',
};

export const AdminManagedPageEditor: React.FC<AdminManagedPageEditorProps> = ({
  page,
  onChange,
  onSaveDraft,
}) => {
  const { isPrivileged, showEditorControls } = usePrivilegedAccess();
  const [isOpen, setIsOpen] = useState(false);

  if (!isPrivileged || !showEditorControls) {
    return null;
  }

  const moveBlock = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= page.blocks.length) return;
    const copy = [...page.blocks];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    onChange({ ...page, blocks: copy });
  };

  const addBlock = (type: 'heading' | 'paragraph' | 'list' | 'callout' | 'quote') => {
    let nextBlock: ContentBlock;
    switch (type) {
      case 'heading':
        nextBlock = { type: 'heading', level: 2, text: 'Nouveau titre de section' };
        break;
      case 'list':
        nextBlock = { type: 'list', items: ['Premier point clé', 'Deuxième point clé'] };
        break;
      case 'callout':
        nextBlock = {
          type: 'callout',
          title: 'Information clé',
          text: 'Texte de mise en avant pour cette rubrique.',
          tone: 'blue',
        };
        break;
      case 'quote':
        nextBlock = {
          type: 'quote',
          text: 'Citation ou orientation stratégique.',
          author: 'Équipe LFJP',
        };
        break;
      case 'paragraph':
      default:
        nextBlock = {
          type: 'paragraph',
          text: 'Nouveau paragraphe de contenu pour cette rubrique.',
        };
        break;
    }
    onChange({
      ...page,
      blocks: [...page.blocks, nextBlock],
    });
  };

  const updateBlock = (index: number, nextBlock: ContentBlock) => {
    onChange({
      ...page,
      blocks: page.blocks.map((block, idx) => (idx === index ? nextBlock : block)),
    });
  };

  const deleteBlock = (index: number) => {
    const nextBlocks = page.blocks.filter((_, idx) => idx !== index);
    onChange({
      ...page,
      blocks: nextBlocks.length > 0 ? nextBlocks : [{ type: 'paragraph', text: 'Contenu de la rubrique.' }],
    });
  };

  const handleSaveDraftClick = () => {
    if (onSaveDraft) {
      onSaveDraft();
      return;
    }
    onChange(page);
    toast.success('Brouillon enregistré localement', {
      description: 'Les modifications de cette rubrique restent privées jusqu’à la publication.',
    });
  };

  return (
    <div className="container mx-auto px-6 pt-6" data-interactive="true">
      <div className="mx-auto max-w-4xl rounded-2xl border border-purple-200 bg-white p-4 sm:p-5 shadow-sm text-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-purple-950 font-playfair">
                  Espace Éditeur · Page « {page.title} »
                </h2>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-full">
                  Privilège Éditeur
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Personnalisez le titre, l&apos;introduction et les blocs de contenu de cette rubrique ({page.slug}).
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
          <div className="mt-4 space-y-5 animate-in fade-in duration-200">
            {/* 1. Informations principales */}
            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/40 p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-900 block">
                1. En-tête de la page rubrique
              </span>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Titre affiché sur la page
                  </label>
                  <Input
                    value={page.title}
                    onChange={(e) => onChange({ ...page, title: e.target.value })}
                    className="h-8 text-xs bg-white font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Libellé dans le menu supérieur
                  </label>
                  <Input
                    value={page.menuLabel || page.title}
                    onChange={(e) => onChange({ ...page, menuLabel: e.target.value })}
                    className="h-8 text-xs bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Sous-titre / Introduction
                </label>
                <Input
                  value={page.description || ''}
                  onChange={(e) => onChange({ ...page, description: e.target.value })}
                  className="h-8 text-xs bg-white"
                />
              </div>
            </div>

            {/* 2. Blocs de contenu */}
            <div className="space-y-3 rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  2. Blocs de contenu ({page.blocks.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addBlock('heading')}
                    className="h-7 text-[11px] bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="mr-1 h-3 w-3" /> Titre
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addBlock('paragraph')}
                    className="h-7 text-[11px] bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="mr-1 h-3 w-3" /> Paragraphe
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addBlock('list')}
                    className="h-7 text-[11px] bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="mr-1 h-3 w-3" /> Liste
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addBlock('callout')}
                    className="h-7 text-[11px] bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="mr-1 h-3 w-3" /> Encadré
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addBlock('quote')}
                    className="h-7 text-[11px] bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="mr-1 h-3 w-3" /> Citation
                  </Button>
                </div>
              </div>

              <div className="space-y-2.5">
                {page.blocks.map((block, bIdx) => (
                  <div
                    key={`mp-blk-${bIdx}`}
                    className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-french-blue">
                        Bloc {bIdx + 1} · {blockTypeLabels[block.type] || block.type}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={bIdx === 0}
                          onClick={() => moveBlock(bIdx, -1)}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={bIdx === page.blocks.length - 1}
                          onClick={() => moveBlock(bIdx, 1)}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteBlock(bIdx)}
                          className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {block.type === 'heading' && (
                      <Input
                        value={block.text}
                        onChange={(e) => updateBlock(bIdx, { ...block, text: e.target.value })}
                        className="h-8 text-xs bg-white font-semibold"
                      />
                    )}

                    {block.type === 'paragraph' && (
                      <textarea
                        rows={3}
                        value={block.text}
                        onChange={(e) => updateBlock(bIdx, { ...block, text: e.target.value })}
                        className="w-full rounded-md border border-slate-200 bg-white p-2 text-xs"
                      />
                    )}

                    {block.type === 'quote' && (
                      <div className="grid gap-2 sm:grid-cols-[2fr_1fr]">
                        <Input
                          value={block.text}
                          placeholder="Citation"
                          onChange={(e) => updateBlock(bIdx, { ...block, text: e.target.value })}
                          className="h-8 text-xs bg-white"
                        />
                        <Input
                          value={block.author || ''}
                          placeholder="Auteur"
                          onChange={(e) => updateBlock(bIdx, { ...block, author: e.target.value })}
                          className="h-8 text-xs bg-white"
                        />
                      </div>
                    )}

                    {block.type === 'callout' && (
                      <div className="space-y-2">
                        <div className="grid gap-2 sm:grid-cols-[1fr_140px]">
                          <Input
                            value={block.title}
                            placeholder="Titre de l'encadré"
                            onChange={(e) => updateBlock(bIdx, { ...block, title: e.target.value })}
                            className="h-8 text-xs bg-white font-semibold"
                          />
                          <select
                            value={block.tone || 'blue'}
                            onChange={(e) =>
                              updateBlock(bIdx, {
                                ...block,
                                tone: e.target.value as 'blue' | 'gold' | 'green',
                              })
                            }
                            className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs"
                          >
                            <option value="blue">Bleu LFJP</option>
                            <option value="gold">Or</option>
                            <option value="green">Émeraude</option>
                          </select>
                        </div>
                        <textarea
                          rows={2}
                          value={block.text}
                          onChange={(e) => updateBlock(bIdx, { ...block, text: e.target.value })}
                          className="w-full rounded-md border border-slate-200 bg-white p-2 text-xs"
                        />
                      </div>
                    )}

                    {block.type === 'list' && (
                      <div className="space-y-1.5">
                        {block.items.map((item, iIdx) => (
                          <div key={`mp-list-${bIdx}-${iIdx}`} className="flex items-center gap-1.5">
                            <Input
                              value={item}
                              onChange={(e) =>
                                updateBlock(bIdx, {
                                  ...block,
                                  items: block.items.map((it, idx) =>
                                    idx === iIdx ? e.target.value : it
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
                                updateBlock(bIdx, {
                                  ...block,
                                  items: block.items.filter((_, idx) => idx !== iIdx),
                                })
                              }
                              className="h-6 w-6 p-0 text-red-500"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateBlock(bIdx, {
                              ...block,
                              items: [...block.items, 'Nouvel élément'],
                            })
                          }
                          className="h-6 text-[11px]"
                        >
                          <Plus className="mr-1 h-3 w-3" /> Ajouter un élément
                        </Button>
                      </div>
                    )}

                    {block.type !== 'heading' &&
                      block.type !== 'paragraph' &&
                      block.type !== 'quote' &&
                      block.type !== 'callout' &&
                      block.type !== 'list' && (
                        <p className="text-[11px] text-slate-500 italic">
                          Bloc avancé ({block.type}) conservé tel quel sur la page.
                        </p>
                      )}
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

export default AdminManagedPageEditor;

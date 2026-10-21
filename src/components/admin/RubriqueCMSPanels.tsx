import React, { useState } from 'react';
import {
  ArrowDown, ArrowUp, BarChart3, CheckCircle2, Copy, CornerDownRight,
  ExternalLink, Eye, FileText, FolderTree, Heart, Layers3, MessageSquareText,
  Pencil, Plus, Save, Sliders, Sparkles, Target, Trash2, Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type siteContent from '@/content/siteContent.json';
import { normalizeMediaUrl } from '@/lib/media';
import { SITE_PILLARS } from '@/data/siteHierarchy';
import type { ManagedPage, TextStyle } from '@/content/pageTypes';
import type { restaurantPageData } from '@/data/restaurantPageData';

type Content = typeof siteContent;

// Helper media preview component
const MediaPreview = ({ src, type = 'image' }: { src?: string; type?: 'image' | 'video' }) => {
  if (!src) return null;
  const normalized = normalizeMediaUrl(src, type);
  if (type === 'video') {
    return (
      <div className="mt-2 overflow-hidden rounded-md border bg-black/5 p-1">
        <video src={normalized} controls preload="metadata" className="max-h-48 w-full rounded" />
      </div>
    );
  }
  return (
    <div className="mt-2 overflow-hidden rounded-md border bg-slate-50 p-1">
      <img src={normalized} alt="Aperçu" className="max-h-48 w-full rounded object-contain" />
    </div>
  );
};

// =========================================================================
// 1. RUBRIQUE 1 : ACCUEIL (/)
// =========================================================================
export interface RubriqueAccueilPanelProps {
  content: Content;
  updateHome: (field: keyof Content['home'], value: string) => void;
  updateCard: (index: number, field: keyof Content['home']['cards'][number], value: string) => void;
  updateCardStyle: (index: number, patch: Partial<TextStyle>) => void;
  addCard: () => void;
  removeCard: (index: number) => void;
  moveCard: (index: number, direction: -1 | 1) => void;
  duplicateCard: (index: number) => void;
  importContentImage: (file: File | undefined, onLoad: (dataUrl: string) => void) => void;
  updateMessage: (index: number, field: 'title' | 'eyebrow' | 'image' | 'imageAlt' | 'wide', value: string | boolean) => void;
  updateMessageArray: (index: number, field: 'paragraphs' | 'signature', itemIndex: number, value: string) => void;
  addMessageArrayItem: (index: number, field: 'paragraphs' | 'signature') => void;
  removeMessageArrayItem: (index: number, field: 'paragraphs' | 'signature', itemIndex: number) => void;
  addMessage: () => void;
  removeMessage: (index: number) => void;
  moveMessage: (index: number, direction: -1 | 1) => void;
  duplicateMessage: (index: number) => void;
  pages: ManagedPage[];
  openRubriqueEditor: (path: string, name: string, parentPath?: string, returnRubrique?: string) => void;
  addSubPage: (parentSlug?: string) => void;
  deletePage: (pageIndex?: number) => void;
  saveDraft: () => boolean;
  TextStyleToolbar: React.FC<{ style?: TextStyle; onChange: (patch: Partial<TextStyle>) => void }>;
}

export const RubriqueAccueilPanel: React.FC<RubriqueAccueilPanelProps> = ({
  content, updateHome, updateCard, updateCardStyle, addCard, removeCard, moveCard, duplicateCard,
  importContentImage, updateMessage, updateMessageArray, addMessageArrayItem, removeMessageArrayItem,
  addMessage, removeMessage, moveMessage, duplicateMessage, pages, openRubriqueEditor,
  addSubPage, deletePage, saveDraft, TextStyleToolbar
}) => {
  const [subTab, setSubTab] = useState<'cards' | 'messages' | 'hero' | 'subpages'>('cards');
  const accueilCustomPages = pages.filter((p) => !p.parent || p.parent === '/');

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50/80 via-white to-blue-50/40 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-french-blue text-white shadow-sm">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl text-french-blue font-playfair">1. Rubrique Accueil</CardTitle>
                <span className="rounded bg-blue-100 text-french-blue text-xs font-bold px-2 py-0.5 font-mono">/ (Racine)</span>
              </div>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Gérez tous les contenus de la page d’accueil : Hero, cartes interactives, messages officiels et pages rattachées.
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline" className="h-8 text-xs">
              <a href="/?draft=1" target="_blank" rel="noreferrer">
                <Eye className="mr-1.5 h-3.5 w-3.5" /> Voir la page d’accueil
              </a>
            </Button>
            <Button type="button" size="sm" onClick={() => saveDraft()} className="bg-french-blue hover:bg-blue-700 h-8 text-xs">
              <Save className="mr-1.5 h-3.5 w-3.5" /> Enregistrer le brouillon
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-5">
        {/* Navigation des sous-onglets de l'accueil */}
        <div className="flex flex-wrap gap-2 border-b pb-3">
          <Button
            type="button"
            size="sm"
            variant={subTab === 'cards' ? 'default' : 'outline'}
            onClick={() => setSubTab('cards')}
            className={subTab === 'cards' ? 'bg-french-blue text-white shadow-sm' : ''}
          >
            <Layers3 className="mr-1.5 h-4 w-4" /> Cartes de Rubriques ({content.home.cards.length})
          </Button>
          <Button
            type="button"
            size="sm"
            variant={subTab === 'messages' ? 'default' : 'outline'}
            onClick={() => setSubTab('messages')}
            className={subTab === 'messages' ? 'bg-french-blue text-white shadow-sm' : ''}
          >
            <MessageSquareText className="mr-1.5 h-4 w-4" /> Mots Officiels & Actualités ({content.home.messages.length})
          </Button>
          <Button
            type="button"
            size="sm"
            variant={subTab === 'hero' ? 'default' : 'outline'}
            onClick={() => setSubTab('hero')}
            className={subTab === 'hero' ? 'bg-french-blue text-white shadow-sm' : ''}
          >
            <Sparkles className="mr-1.5 h-4 w-4" /> Bannière Hero & Accroches
          </Button>
          <Button
            type="button"
            size="sm"
            variant={subTab === 'subpages' ? 'default' : 'outline'}
            onClick={() => setSubTab('subpages')}
            className={subTab === 'subpages' ? 'bg-french-blue text-white shadow-sm' : ''}
          >
            <FolderTree className="mr-1.5 h-4 w-4" /> Sous-pages attachées ({accueilCustomPages.length})
          </Button>
        </div>

        {/* 1. CARTES DE RUBRIQUES */}
        {subTab === 'cards' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-2">
              <div>
                <h3 className="text-sm font-bold text-french-blue">Cartes interactives de la page d’accueil</h3>
                <p className="text-xs text-slate-500">Ces cartes présentent les grandes sections du site avec liens, images et descriptions.</p>
              </div>
              <Button type="button" size="sm" onClick={addCard} className="bg-french-blue hover:bg-blue-700 text-xs">
                <Plus className="mr-1.5 h-3.5 w-3.5" /> Ajouter une rubrique
              </Button>
            </div>

            {content.home.cards.map((card, index) => (
              <div key={`card-${index}`} className="grid gap-3 rounded-lg border bg-white p-4 shadow-sm md:grid-cols-2">
                <div className="flex items-center justify-between gap-2 md:col-span-2 border-b pb-2">
                  <span className="font-semibold text-french-blue">Rubrique {index + 1} : {card.title || 'Sans titre'}</span>
                  <div className="flex items-center gap-1">
                    <Button type="button" size="sm" variant="ghost" title="Monter" onClick={() => moveCard(index, -1)} disabled={index === 0}>
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button type="button" size="sm" variant="ghost" title="Descendre" onClick={() => moveCard(index, 1)} disabled={index === content.home.cards.length - 1}>
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button type="button" size="sm" variant="outline" title="Dupliquer" onClick={() => duplicateCard(index)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button type="button" size="sm" variant="destructive" title="Supprimer" onClick={() => {
                      if (window.confirm(`Supprimer la rubrique « ${card.title} » ?`)) removeCard(index);
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2"><Label>Titre de la carte</Label><Input value={card.title} onChange={(event) => updateCard(index, 'title', event.target.value)} /></div>
                <div className="grid gap-2"><Label>Chemin URL interne</Label><Input value={card.path} onChange={(event) => updateCard(index, 'path', event.target.value)} /></div>
                <div className="grid gap-2 md:col-span-2"><Label>Description résumée</Label><Textarea value={card.description} onChange={(event) => updateCard(index, 'description', event.target.value)} /></div>
                <div className="grid gap-2"><Label>Texte du bouton / lien</Label><Input value={card.linkLabel} onChange={(event) => updateCard(index, 'linkLabel', event.target.value)} /></div>
                <div className="grid gap-2">
                  <Label>Image de la rubrique</Label>
                  <Input value={card.image || ''} onChange={(event) => updateCard(index, 'image', event.target.value)} placeholder="https://..." />
                  <MediaPreview src={card.image || ''} />
                  <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold text-french-blue hover:bg-blue-50">
                    <Upload size={14} /> Importer une image
                    <input className="sr-only" type="file" accept="image/*" onChange={(event) => importContentImage(event.target.files?.[0], (src) => updateCard(index, 'image', src))} />
                  </label>
                </div>
                <div className="md:col-span-2"><TextStyleToolbar style={card.style} onChange={(patch) => updateCardStyle(index, patch)} /></div>
              </div>
            ))}
          </div>
        )}

        {/* 2. MOTS OFFICIELS & ACTUALITÉS */}
        {subTab === 'messages' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-2">
              <div>
                <h3 className="text-sm font-bold text-french-blue">Communications et mots officiels</h3>
                <p className="text-xs text-slate-500">Mot de la direction, actualités et déclarations affichées en page d’accueil.</p>
              </div>
              <Button type="button" size="sm" onClick={addMessage} className="bg-french-blue hover:bg-blue-700 text-xs">
                <Plus className="mr-1.5 h-3.5 w-3.5" /> Nouveau message
              </Button>
            </div>

            {content.home.messages.map((message, index) => (
              <div key={`message-${index}`} className="space-y-4 rounded-lg border bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                  <div className="flex items-center gap-2 text-french-blue font-bold">
                    <MessageSquareText size={18} />
                    <h3>{message.title || `Message ${index + 1}`}</h3>
                    {message.eyebrow && <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-french-blue">{message.eyebrow}</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button type="button" size="sm" variant="ghost" title="Monter" onClick={() => moveMessage(index, -1)} disabled={index === 0}>
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button type="button" size="sm" variant="ghost" title="Descendre" onClick={() => moveMessage(index, 1)} disabled={index === content.home.messages.length - 1}>
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button type="button" size="sm" variant="outline" title="Dupliquer" onClick={() => duplicateMessage(index)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button type="button" size="sm" variant="destructive" title="Supprimer" onClick={() => removeMessage(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2"><Label>Surtitre (eyebrow)</Label><Input value={message.eyebrow} onChange={(event) => updateMessage(index, 'eyebrow', event.target.value)} placeholder="Ex: Mot du proviseur" /></div>
                  <div className="grid gap-2"><Label>Titre principal</Label><Input value={message.title} onChange={(event) => updateMessage(index, 'title', event.target.value)} /></div>
                </div>

                <div className="grid gap-3">
                  <Label>Image d’illustration</Label>
                  <Input value={message.image} onChange={(event) => updateMessage(index, 'image', event.target.value)} placeholder="https://..." />
                  <MediaPreview src={message.image} />
                  <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold text-french-blue hover:bg-blue-50">
                    <Upload size={14} /> Importer une image
                    <input className="sr-only" type="file" accept="image/*" onChange={(event) => importContentImage(event.target.files?.[0], (src) => updateMessage(index, 'image', src))} />
                  </label>
                </div>

                <div className="grid gap-2">
                  <Label>Texte alternatif de l’image</Label>
                  <Input value={message.imageAlt} onChange={(event) => updateMessage(index, 'imageAlt', event.target.value)} />
                </div>

                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input type="checkbox" checked={Boolean(message.wide)} onChange={(event) => updateMessage(index, 'wide', event.target.checked)} className="rounded border-slate-300" />
                  Format pleine largeur sur la page d’accueil
                </label>

                <div className="space-y-3 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold text-slate-900">Paragraphes ({message.paragraphs.length})</Label>
                    <Button type="button" size="sm" variant="outline" onClick={() => addMessageArrayItem(index, 'paragraphs')}>+ Ajouter un paragraphe</Button>
                  </div>
                  {message.paragraphs.map((paragraph, paragraphIndex) => (
                    <div key={`paragraph-${paragraphIndex}`} className="flex gap-2">
                      <Textarea className="min-h-[80px]" value={paragraph} onChange={(event) => updateMessageArray(index, 'paragraphs', paragraphIndex, event.target.value)} />
                      <Button type="button" size="sm" variant="ghost" onClick={() => removeMessageArrayItem(index, 'paragraphs', paragraphIndex)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold text-slate-900">Signatures / Émetteurs</Label>
                    <Button type="button" size="sm" variant="outline" onClick={() => addMessageArrayItem(index, 'signature')}>+ Ajouter une ligne de signature</Button>
                  </div>
                  {message.signature.map((line, lineIndex) => (
                    <div key={`signature-${lineIndex}`} className="flex gap-2">
                      <Input value={line} onChange={(event) => updateMessageArray(index, 'signature', lineIndex, event.target.value)} />
                      <Button type="button" size="sm" variant="ghost" onClick={() => removeMessageArrayItem(index, 'signature', lineIndex)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. HERO & BANNIÈRE */}
        {subTab === 'hero' && (
          <div className="space-y-4">
            <div className="rounded-lg border bg-white p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-french-blue text-sm border-b pb-2">Bannière principale (Hero Banner)</h3>
              <div className="grid gap-2">
                <Label htmlFor="hero-title">Titre principal (Hero Title)</Label>
                <Input id="hero-title" value={content.home.heroTitle} onChange={(event) => updateHome('heroTitle', event.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hero-subtitle">Sous-titre (Hero Subtitle)</Label>
                <Input id="hero-subtitle" value={content.home.heroSubtitle} onChange={(event) => updateHome('heroSubtitle', event.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hero-tagline">Slogan institutionnel</Label>
                <Input id="hero-tagline" value={content.home.heroTagline || ''} onChange={(event) => updateHome('heroTagline', event.target.value)} placeholder="Ex: Excellence et bienveillance au service de chaque élève" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="section-title">Titre de la section des rubriques</Label>
                <Input id="section-title" value={content.home.sectionTitle} onChange={(event) => updateHome('sectionTitle', event.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="messages-title">Titre de la section des communications</Label>
                <Input id="messages-title" value={content.home.messagesTitle || ''} onChange={(event) => updateHome('messagesTitle', event.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* 4. SOUS-PAGES DE L'ACCUEIL */}
        {subTab === 'subpages' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h3 className="text-sm font-bold text-french-blue">Sous-pages rattachées à la racine (/)</h3>
                <p className="text-xs text-slate-500">Pages personnalisées et sections complémentaires reliées à l’accueil.</p>
              </div>
              <Button type="button" size="sm" onClick={() => addSubPage('/')} className="bg-french-blue hover:bg-blue-700 text-xs">
                <Plus className="mr-1 h-3.5 w-3.5" /> + Nouvelle sous-page
              </Button>
            </div>

            {accueilCustomPages.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed p-6 text-center text-slate-500 bg-slate-50">
                <p className="text-xs">Aucune sous-page personnalisée sous l’accueil pour l’instant.</p>
                <Button type="button" size="sm" variant="outline" onClick={() => addSubPage('/')} className="mt-3 text-xs">
                  <Plus className="mr-1 h-3.5 w-3.5" /> Créer une page sous /
                </Button>
              </div>
            ) : (
              <div className="divide-y rounded-lg border bg-white shadow-sm overflow-hidden">
                {accueilCustomPages.map((page) => {
                  const pageIndex = pages.findIndex((p) => p.slug === page.slug);
                  return (
                    <div key={page.slug} className="p-3.5 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50">
                      <div>
                        <div className="flex items-center gap-2">
                          <CornerDownRight className="h-4 w-4 text-french-blue" />
                          <span className="font-bold text-sm text-french-blue">{page.title}</span>
                          <code className="text-xs font-mono text-slate-400 bg-slate-100 px-1 py-0.2 rounded">{page.slug}</code>
                        </div>
                        <p className="text-xs text-slate-500 ml-6 mt-0.5">{page.description || `${page.blocks.length} bloc(s) de contenu`}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => openRubriqueEditor(page.slug, page.title, '/', 'rubrique-accueil')}
                          className="h-8 text-xs text-french-blue hover:bg-blue-50"
                        >
                          <Pencil className="mr-1 h-3 w-3" /> Modifier les blocs
                        </Button>
                        <Button asChild size="sm" variant="ghost" className="h-8 text-xs">
                          <a href={`${page.slug}?draft=1`} target="_blank" rel="noreferrer">
                            <Eye className="mr-1 h-3 w-3" /> Voir
                          </a>
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => deletePage(pageIndex)}
                          className="h-8 text-xs text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// =========================================================================
// 2. RUBRIQUE 2 : MÉTHODE (/methode)
// =========================================================================
export interface RubriqueMethodePanelProps {
  pages: ManagedPage[];
  openRubriqueEditor: (path: string, name: string, parentPath?: string, returnRubrique?: string) => void;
  addSubPage: (parentSlug?: string) => void;
  deletePage: (pageIndex?: number) => void;
  saveDraft: () => boolean;
}

export const RubriqueMethodePanel: React.FC<RubriqueMethodePanelProps> = ({
  pages, openRubriqueEditor, addSubPage, deletePage, saveDraft
}) => {
  const [subTab, setSubTab] = useState<'content' | 'subpages'>('content');
  const methodeCustomPages = pages.filter((p) => p.parent === '/methode');
  const methodeManagedPage = pages.find((p) => p.slug === '/methode');

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="border-b bg-gradient-to-r from-sky-50/80 via-white to-sky-50/40 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-600 text-white shadow-sm">
              <Sliders className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl text-sky-900 font-playfair">2. Rubrique Méthode</CardTitle>
                <span className="rounded bg-sky-100 text-sky-800 text-xs font-bold px-2 py-0.5 font-mono">/methode (Pilier 2)</span>
              </div>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Démarche participative, calendrier de concertation, comités de travail et sous-pages méthodologiques.
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline" className="h-8 text-xs">
              <a href="/methode?draft=1" target="_blank" rel="noreferrer">
                <Eye className="mr-1.5 h-3.5 w-3.5" /> Voir la page Méthode
              </a>
            </Button>
            <Button type="button" size="sm" onClick={() => saveDraft()} className="bg-sky-600 hover:bg-sky-700 text-white h-8 text-xs">
              <Save className="mr-1.5 h-3.5 w-3.5" /> Enregistrer le brouillon
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-5">
        <div className="flex flex-wrap gap-2 border-b pb-3">
          <Button
            type="button"
            size="sm"
            variant={subTab === 'content' ? 'default' : 'outline'}
            onClick={() => setSubTab('content')}
            className={subTab === 'content' ? 'bg-sky-600 text-white shadow-sm' : ''}
          >
            <FileText className="mr-1.5 h-4 w-4" /> 📝 Contenus & Blocs de la Méthode
          </Button>
          <Button
            type="button"
            size="sm"
            variant={subTab === 'subpages' ? 'default' : 'outline'}
            onClick={() => setSubTab('subpages')}
            className={subTab === 'subpages' ? 'bg-sky-600 text-white shadow-sm' : ''}
          >
            <FolderTree className="mr-1.5 h-4 w-4" /> ↳ Sous-pages de la Méthode ({methodeCustomPages.length})
          </Button>
        </div>

        {subTab === 'content' && (
          <div className="space-y-5">
            <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-base text-sky-950 font-playfair">Page officielle : /methode</h4>
                  <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                    Cette page structure la démarche de co-construction du Plan Stratégique : ateliers de travail, calendrier des 4 phases de concertation et comités de pilotage.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => openRubriqueEditor('/methode', 'Méthode & Concertation', '/', 'rubrique-methode')}
                  className="bg-sky-600 hover:bg-sky-700 text-white text-xs h-9 shadow-sm"
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5" /> Modifier les contenus & blocs de la Méthode
                </Button>
              </div>

              {methodeManagedPage && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-sky-100 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">
                    Version personnalisée active : <strong>{methodeManagedPage.blocks.length} bloc(s) de contenu</strong> enregistrés.
                  </span>
                  <Button asChild size="sm" variant="ghost" className="h-7 text-xs text-sky-700">
                    <a href="/methode?draft=1" target="_blank" rel="noreferrer">
                      <ExternalLink className="mr-1 h-3 w-3" /> Ouvrir en direct
                    </a>
                  </Button>
                </div>
              )}
            </div>

            {/* Aperçu des 3 composantes majeures */}
            <div className="grid gap-4 sm:grid-cols-3 text-xs">
              <div className="p-4 rounded-xl border bg-white shadow-sm space-y-2">
                <span className="font-bold text-sky-800 text-sm">1. Démarche participative</span>
                <p className="text-slate-500">Consultation des enseignants, élèves, familles et personnels pour bâtir un projet partagé.</p>
              </div>
              <div className="p-4 rounded-xl border bg-white shadow-sm space-y-2">
                <span className="font-bold text-sky-800 text-sm">2. Calendrier de déploiement</span>
                <p className="text-slate-500">Jalons trimestriels, groupes de travail et validation en Conseil d’établissement.</p>
              </div>
              <div className="p-4 rounded-xl border bg-white shadow-sm space-y-2">
                <span className="font-bold text-sky-800 text-sm">3. Comités et gouvernance</span>
                <p className="text-slate-500">Rôle du COPIL, des commissions thématiques et suivi des engagements.</p>
              </div>
            </div>
          </div>
        )}

        {subTab === 'subpages' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h3 className="text-sm font-bold text-sky-900">Sous-pages rattachées à la Méthode (/methode)</h3>
                <p className="text-xs text-slate-500">Comptes-rendus, plannings détaillés et annexes méthodologiques.</p>
              </div>
              <Button type="button" size="sm" onClick={() => addSubPage('/methode')} className="bg-sky-600 hover:bg-sky-700 text-white text-xs">
                <Plus className="mr-1 h-3.5 w-3.5" /> + Nouvelle sous-page
              </Button>
            </div>

            {methodeCustomPages.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed p-6 text-center text-slate-500 bg-slate-50">
                <p className="text-xs">Aucune sous-page créée sous la Méthode pour le moment.</p>
                <Button type="button" size="sm" variant="outline" onClick={() => addSubPage('/methode')} className="mt-3 text-xs">
                  <Plus className="mr-1 h-3.5 w-3.5" /> Ajouter une sous-page
                </Button>
              </div>
            ) : (
              <div className="divide-y rounded-lg border bg-white shadow-sm overflow-hidden">
                {methodeCustomPages.map((page) => {
                  const pageIndex = pages.findIndex((p) => p.slug === page.slug);
                  return (
                    <div key={page.slug} className="p-3.5 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50">
                      <div>
                        <div className="flex items-center gap-2">
                          <CornerDownRight className="h-4 w-4 text-sky-600" />
                          <span className="font-bold text-sm text-sky-950">{page.title}</span>
                          <code className="text-xs font-mono text-slate-400 bg-slate-100 px-1 py-0.2 rounded">{page.slug}</code>
                        </div>
                        <p className="text-xs text-slate-500 ml-6 mt-0.5">{page.description || `${page.blocks.length} bloc(s) de contenu`}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => openRubriqueEditor(page.slug, page.title, '/methode', 'rubrique-methode')}
                          className="h-8 text-xs text-sky-700 hover:bg-sky-50"
                        >
                          <Pencil className="mr-1 h-3 w-3" /> Modifier les blocs
                        </Button>
                        <Button asChild size="sm" variant="ghost" className="h-8 text-xs">
                          <a href={`${page.slug}?draft=1`} target="_blank" rel="noreferrer">
                            <Eye className="mr-1 h-3 w-3" /> Voir
                          </a>
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => deletePage(pageIndex)}
                          className="h-8 text-xs text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// =========================================================================
// 3. RUBRIQUE 3 : VISION, MISSIONS & VALEURS (/vision-missions-valeurs)
// =========================================================================
export interface RubriqueVisionPanelProps {
  content: Content;
  updateVisionParagraph: (index: number, value: string) => void;
  updateMission: (index: number, value: string) => void;
  updateValue: (index: number, field: 'name' | 'description', value: string) => void;
  moveVisionParagraph: (index: number, direction: -1 | 1) => void;
  moveMission: (index: number, direction: -1 | 1) => void;
  moveValue: (index: number, direction: -1 | 1) => void;
  duplicateMission: (index: number) => void;
  duplicateValue: (index: number) => void;
  setContent: React.Dispatch<React.SetStateAction<Content>>;
  pages: ManagedPage[];
  openRubriqueEditor: (path: string, name: string, parentPath?: string, returnRubrique?: string) => void;
  addSubPage: (parentSlug?: string) => void;
  deletePage: (pageIndex?: number) => void;
  saveDraft: () => boolean;
}

export const RubriqueVisionPanel: React.FC<RubriqueVisionPanelProps> = ({
  content, updateVisionParagraph, updateMission, updateValue,
  moveVisionParagraph, moveMission, moveValue, duplicateMission, duplicateValue,
  setContent, pages, openRubriqueEditor, addSubPage, deletePage, saveDraft
}) => {
  const [subTab, setSubTab] = useState<'vision' | 'missions' | 'valeurs' | 'subpages'>('vision');
  const visionCustomPages = pages.filter((p) => p.parent === '/vision-missions-valeurs');

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="border-b bg-gradient-to-r from-rose-50/80 via-white to-rose-50/40 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-600 text-white shadow-sm">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl text-rose-950 font-playfair">3. Rubrique Vision, Missions & Valeurs</CardTitle>
                <span className="rounded bg-rose-100 text-rose-800 text-xs font-bold px-2 py-0.5 font-mono">/vision-missions-valeurs (Pilier 3)</span>
              </div>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Piliers directeurs, missions prioritaires et valeurs fondamentales portées par la communauté du LFJP.
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline" className="h-8 text-xs">
              <a href="/vision-missions-valeurs?draft=1" target="_blank" rel="noreferrer">
                <Eye className="mr-1.5 h-3.5 w-3.5" /> Voir la page
              </a>
            </Button>
            <Button type="button" size="sm" onClick={() => saveDraft()} className="bg-rose-600 hover:bg-rose-700 text-white h-8 text-xs">
              <Save className="mr-1.5 h-3.5 w-3.5" /> Enregistrer le brouillon
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-5">
        <div className="flex flex-wrap gap-2 border-b pb-3">
          <Button
            type="button"
            size="sm"
            variant={subTab === 'vision' ? 'default' : 'outline'}
            onClick={() => setSubTab('vision')}
            className={subTab === 'vision' ? 'bg-rose-600 text-white shadow-sm' : ''}
          >
            <Target className="mr-1.5 h-4 w-4" /> 1. Notre Vision ({content.visionMissionsValeurs.vision.length})
          </Button>
          <Button
            type="button"
            size="sm"
            variant={subTab === 'missions' ? 'default' : 'outline'}
            onClick={() => setSubTab('missions')}
            className={subTab === 'missions' ? 'bg-rose-600 text-white shadow-sm' : ''}
          >
            <CheckCircle2 className="mr-1.5 h-4 w-4" /> 2. Nos Missions ({content.visionMissionsValeurs.missions.length})
          </Button>
          <Button
            type="button"
            size="sm"
            variant={subTab === 'valeurs' ? 'default' : 'outline'}
            onClick={() => setSubTab('valeurs')}
            className={subTab === 'valeurs' ? 'bg-rose-600 text-white shadow-sm' : ''}
          >
            <Sparkles className="mr-1.5 h-4 w-4" /> 3. Nos Valeurs ({content.visionMissionsValeurs.values.length})
          </Button>
          <Button
            type="button"
            size="sm"
            variant={subTab === 'subpages' ? 'default' : 'outline'}
            onClick={() => setSubTab('subpages')}
            className={subTab === 'subpages' ? 'bg-rose-600 text-white shadow-sm' : ''}
          >
            <FolderTree className="mr-1.5 h-4 w-4" /> ↳ Sous-pages attachées ({visionCustomPages.length})
          </Button>
        </div>

        {/* 1. VISION */}
        {subTab === 'vision' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <Label className="font-semibold text-rose-950 text-base">1. Paragraphes de Vision</Label>
                <p className="text-xs text-slate-500">Paragraphes décrivant l’ambition globale du LFJP à l’horizon 2030.</p>
              </div>
              <Button type="button" size="sm" variant="outline" onClick={() => setContent((current) => ({ ...current, visionMissionsValeurs: { ...current.visionMissionsValeurs, vision: [...current.visionMissionsValeurs.vision, 'Nouveau paragraphe de vision.'] } }))}>
                <Plus className="mr-1 h-3.5 w-3.5" /> Ajouter un paragraphe
              </Button>
            </div>
            {content.visionMissionsValeurs.vision.map((paragraph, index) => (
              <div key={`vision-${index}`} className="flex items-start gap-2 rounded-lg border bg-slate-50 p-3 shadow-sm">
                <div className="flex-1">
                  <Label className="text-xs text-slate-500 mb-1 block">Paragraphe {index + 1}</Label>
                  <Textarea className="bg-white min-h-[90px]" value={paragraph} onChange={(event) => updateVisionParagraph(index, event.target.value)} />
                </div>
                <div className="flex flex-col gap-1 pt-5">
                  <Button type="button" size="sm" variant="ghost" title="Monter" onClick={() => moveVisionParagraph(index, -1)} disabled={index === 0}>
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button type="button" size="sm" variant="ghost" title="Descendre" onClick={() => moveVisionParagraph(index, 1)} disabled={index === content.visionMissionsValeurs.vision.length - 1}>
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button type="button" size="sm" variant="destructive" title="Supprimer" onClick={() => setContent((current) => ({ ...current, visionMissionsValeurs: { ...current.visionMissionsValeurs, vision: current.visionMissionsValeurs.vision.filter((_, itemIndex) => itemIndex !== index) } }))}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. MISSIONS */}
        {subTab === 'missions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <Label className="font-semibold text-rose-950 text-base">2. Nos Missions prioritaires ({content.visionMissionsValeurs.missions.length})</Label>
                <p className="text-xs text-slate-500">Missions éducatives, pédagogiques et institutionnelles.</p>
              </div>
              <Button type="button" size="sm" variant="outline" onClick={() => setContent((current) => ({ ...current, visionMissionsValeurs: { ...current.visionMissionsValeurs, missions: [...current.visionMissionsValeurs.missions, 'Nouvelle mission.'] } }))}>
                <Plus className="mr-1 h-3.5 w-3.5" /> Ajouter une mission
              </Button>
            </div>
            {content.visionMissionsValeurs.missions.map((mission, index) => (
              <div key={`mission-${index}`} className="flex items-start gap-3 rounded-lg border bg-slate-50 p-3 shadow-sm">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-600 text-xs font-bold text-white mt-1">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <Textarea className="bg-white min-h-[60px]" value={mission} onChange={(event) => updateMission(index, event.target.value)} />
                </div>
                <div className="flex items-center gap-1 pt-1">
                  <Button type="button" size="sm" variant="ghost" title="Monter" onClick={() => moveMission(index, -1)} disabled={index === 0}>
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button type="button" size="sm" variant="ghost" title="Descendre" onClick={() => moveMission(index, 1)} disabled={index === content.visionMissionsValeurs.missions.length - 1}>
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button type="button" size="sm" variant="outline" title="Dupliquer" onClick={() => duplicateMission(index)}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button type="button" size="sm" variant="destructive" title="Supprimer" onClick={() => setContent((current) => ({ ...current, visionMissionsValeurs: { ...current.visionMissionsValeurs, missions: current.visionMissionsValeurs.missions.filter((_, itemIndex) => itemIndex !== index) } }))}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. VALEURS */}
        {subTab === 'valeurs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <Label className="font-semibold text-rose-950 text-base">3. Nos Valeurs ({content.visionMissionsValeurs.values.length})</Label>
                <p className="text-xs text-slate-500">Valeurs fondamentales portées par la communauté éducative.</p>
              </div>
              <Button type="button" size="sm" variant="outline" onClick={() => setContent((current) => ({ ...current, visionMissionsValeurs: { ...current.visionMissionsValeurs, values: [...current.visionMissionsValeurs.values, { name: 'Nouvelle valeur', description: 'Description de la valeur.' }] } }))}>
                <Plus className="mr-1 h-3.5 w-3.5" /> Ajouter une valeur
              </Button>
            </div>
            {content.visionMissionsValeurs.values.map((value, index) => (
              <div key={`value-${index}`} className="space-y-3 rounded-lg border bg-slate-50 p-4 shadow-sm">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-semibold text-rose-900 text-sm">Valeur {index + 1} : {value.name || 'Sans nom'}</span>
                  <div className="flex items-center gap-1">
                    <Button type="button" size="sm" variant="ghost" title="Monter" onClick={() => moveValue(index, -1)} disabled={index === 0}>
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button type="button" size="sm" variant="ghost" title="Descendre" onClick={() => moveValue(index, 1)} disabled={index === content.visionMissionsValeurs.values.length - 1}>
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button type="button" size="sm" variant="outline" title="Dupliquer" onClick={() => duplicateValue(index)}>
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button type="button" size="sm" variant="destructive" title="Supprimer" onClick={() => setContent((current) => ({ ...current, visionMissionsValeurs: { ...current.visionMissionsValeurs, values: current.visionMissionsValeurs.values.filter((_, itemIndex) => itemIndex !== index) } }))}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-[200px_minmax(0,1fr)]">
                  <div>
                    <Label className="text-xs">Nom de la valeur</Label>
                    <Input className="bg-white mt-1" value={value.name} onChange={(event) => updateValue(index, 'name', event.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs">Description</Label>
                    <Textarea className="bg-white mt-1" value={value.description} onChange={(event) => updateValue(index, 'description', event.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. SOUS-PAGES */}
        {subTab === 'subpages' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h3 className="text-sm font-bold text-rose-950">Sous-pages rattachées à la Vision (/vision-missions-valeurs)</h3>
                <p className="text-xs text-slate-500">Annexes éthiques, charte citoyenne et sous-rubriques associées.</p>
              </div>
              <Button type="button" size="sm" onClick={() => addSubPage('/vision-missions-valeurs')} className="bg-rose-600 hover:bg-rose-700 text-white text-xs">
                <Plus className="mr-1 h-3.5 w-3.5" /> + Nouvelle sous-page
              </Button>
            </div>

            {visionCustomPages.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed p-6 text-center text-slate-500 bg-slate-50">
                <p className="text-xs">Aucune sous-page créée sous la Vision pour le moment.</p>
                <Button type="button" size="sm" variant="outline" onClick={() => addSubPage('/vision-missions-valeurs')} className="mt-3 text-xs">
                  <Plus className="mr-1 h-3.5 w-3.5" /> Ajouter une sous-page
                </Button>
              </div>
            ) : (
              <div className="divide-y rounded-lg border bg-white shadow-sm overflow-hidden">
                {visionCustomPages.map((page) => {
                  const pageIndex = pages.findIndex((p) => p.slug === page.slug);
                  return (
                    <div key={page.slug} className="p-3.5 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50">
                      <div>
                        <div className="flex items-center gap-2">
                          <CornerDownRight className="h-4 w-4 text-rose-600" />
                          <span className="font-bold text-sm text-rose-950">{page.title}</span>
                          <code className="text-xs font-mono text-slate-400 bg-slate-100 px-1 py-0.2 rounded">{page.slug}</code>
                        </div>
                        <p className="text-xs text-slate-500 ml-6 mt-0.5">{page.description || `${page.blocks.length} bloc(s) de contenu`}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => openRubriqueEditor(page.slug, page.title, '/vision-missions-valeurs', 'rubrique-vision')}
                          className="h-8 text-xs text-rose-700 hover:bg-rose-50"
                        >
                          <Pencil className="mr-1 h-3 w-3" /> Modifier les blocs
                        </Button>
                        <Button asChild size="sm" variant="ghost" className="h-8 text-xs">
                          <a href={`${page.slug}?draft=1`} target="_blank" rel="noreferrer">
                            <Eye className="mr-1 h-3 w-3" /> Voir
                          </a>
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => deletePage(pageIndex)}
                          className="h-8 text-xs text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// =========================================================================
// 4. RUBRIQUE 4 : DIAGNOSTIC (/diagnostic)
// =========================================================================
export interface RubriqueDiagnosticPanelProps {
  pageDataJson: string;
  getEditablePageData: () => Record<string, unknown>;
  updateElcsTitle: (categoryKey: string, title: string) => void;
  updateElcsMetric: (categoryKey: string, group: 'primary' | 'secondary', rowIndex: number, field: string, value: string) => void;
  addElcsMetric: (categoryKey: string, group: 'primary' | 'secondary') => void;
  removeElcsMetric: (categoryKey: string, group: 'primary' | 'secondary', rowIndex: number) => void;
  restaurantEditorGroups: { title: string; datasets: { key: keyof typeof restaurantPageData; label: string; fields: { key: string; label: string; type?: 'number' | 'text' }[] }[] }[];
  getRestaurantRows: (dataset: keyof typeof restaurantPageData) => Record<string, unknown>[];
  addRestaurantRow: (dataset: keyof typeof restaurantPageData) => void;
  removeRestaurantRow: (dataset: keyof typeof restaurantPageData, rowIndex: number) => void;
  updateRestaurantRow: (dataset: keyof typeof restaurantPageData, rowIndex: number, field: string, value: string) => void;
  pages: ManagedPage[];
  openRubriqueEditor: (path: string, name: string, parentPath?: string, returnRubrique?: string) => void;
  addSubPage: (parentSlug?: string) => void;
  deletePage: (pageIndex?: number) => void;
  saveDraft: () => boolean;
}

export const RubriqueDiagnosticPanel: React.FC<RubriqueDiagnosticPanelProps> = ({
  getEditablePageData, updateElcsTitle, updateElcsMetric, addElcsMetric, removeElcsMetric,
  restaurantEditorGroups, getRestaurantRows, addRestaurantRow, removeRestaurantRow, updateRestaurantRow,
  pages, openRubriqueEditor, addSubPage, deletePage, saveDraft
}) => {
  const [subTab, setSubTab] = useState<'elcs' | 'restaurant' | 'rapports'>('elcs');
  const diagnosticCustomPages = pages.filter((p) => p.parent === '/diagnostic');

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="border-b bg-gradient-to-r from-purple-50/80 via-white to-purple-50/40 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-sm">
              <ChartNoAxesCombined className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl text-purple-900 font-playfair">4. Rubrique Diagnostic de l’Établissement</CardTitle>
                <span className="rounded bg-purple-100 text-purple-800 text-xs font-bold px-2 py-0.5 font-mono">/diagnostic (Pilier 4)</span>
              </div>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Toutes les données de l’Enquête Climat Scolaire (ELCS), la restauration/cantine et les rapports sont regroupés ici.
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline" className="h-8 text-xs">
              <a href="/diagnostic?draft=1" target="_blank" rel="noreferrer">
                <Eye className="mr-1.5 h-3.5 w-3.5" /> Voir la page Diagnostic
              </a>
            </Button>
            <Button type="button" size="sm" onClick={() => saveDraft()} className="bg-purple-600 hover:bg-purple-700 text-white h-8 text-xs">
              <Save className="mr-1.5 h-3.5 w-3.5" /> Enregistrer le brouillon
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-5">
        <div className="flex flex-wrap gap-2 border-b pb-3">
          <Button
            type="button"
            size="sm"
            variant={subTab === 'elcs' ? 'default' : 'outline'}
            onClick={() => setSubTab('elcs')}
            className={subTab === 'elcs' ? 'bg-purple-600 text-white shadow-sm' : ''}
          >
            <ChartNoAxesCombined className="mr-1.5 h-4 w-4" /> 🏫 Climat Scolaire (ELCS & Graphiques)
          </Button>
          <Button
            type="button"
            size="sm"
            variant={subTab === 'restaurant' ? 'default' : 'outline'}
            onClick={() => setSubTab('restaurant')}
            className={subTab === 'restaurant' ? 'bg-purple-600 text-white shadow-sm' : ''}
          >
            <BarChart3 className="mr-1.5 h-4 w-4" /> 🍽️ Restauration & Cantine
          </Button>
          <Button
            type="button"
            size="sm"
            variant={subTab === 'rapports' ? 'default' : 'outline'}
            onClick={() => setSubTab('rapports')}
            className={subTab === 'rapports' ? 'bg-purple-600 text-white shadow-sm' : ''}
          >
            <FolderTree className="mr-1.5 h-4 w-4" /> 📑 Rapport ELCS & Sous-pages ({diagnosticCustomPages.length + 1})
          </Button>
        </div>

        {/* 1. CLIMAT SCOLAIRE ELCS */}
        {subTab === 'elcs' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 flex items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-sm text-purple-900">Enquête Climat Scolaire (ELCS)</h4>
                <p className="text-xs text-purple-800 mt-0.5">
                  Chaque modification des pourcentages et moyennes actualise instantanément les jauges et graphiques en direct.
                </p>
              </div>
            </div>

            {Object.entries(getEditablePageData().elcsData as Record<string, Record<string, unknown>>).map(([categoryKey, category]) => (
              <div key={categoryKey} className="space-y-4 rounded-xl border bg-white p-5 shadow-sm">
                <div className="grid gap-1.5 border-b pb-3">
                  <Label className="font-bold text-sm text-slate-800">Titre de la catégorie</Label>
                  <Input
                    value={String(category.title || '')}
                    onChange={(event) => updateElcsTitle(categoryKey, event.target.value)}
                    className="font-semibold text-french-blue"
                  />
                </div>

                {(['primary', 'secondary'] as const).map((group) => (
                  <div key={group} className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        {group === 'primary' ? 'Indicateurs principaux (barres de progression)' : 'Points d’attention / Alertes'}
                      </h4>
                      <Button type="button" size="sm" variant="outline" onClick={() => addElcsMetric(categoryKey, group)} className="text-xs h-8">
                        <Plus className="mr-1 h-3 w-3" /> Ajouter un indicateur
                      </Button>
                    </div>

                    {(category[group] as Record<string, unknown>[]).map((metric, rowIndex) => (
                      <div key={`${group}-${rowIndex}`} className="space-y-2 rounded-lg border bg-slate-50 p-3">
                        <div className="grid gap-2 sm:grid-cols-[1.5fr_110px_1fr_100px_110px_auto]">
                          <Input
                            aria-label="Nom de l’indicateur"
                            value={String(metric.name || '')}
                            onChange={(event) => updateElcsMetric(categoryKey, group, rowIndex, 'name', event.target.value)}
                            placeholder="Indicateur"
                            className="bg-white text-xs h-8"
                          />
                          <Input
                            aria-label="Valeur de l’indicateur"
                            value={String(metric.value ?? '')}
                            onChange={(event) => updateElcsMetric(categoryKey, group, rowIndex, 'value', event.target.value)}
                            placeholder="Valeur %"
                            className="bg-white text-xs h-8"
                          />
                          <Input
                            aria-label="Précision de l’indicateur"
                            value={String(metric.label || '')}
                            onChange={(event) => updateElcsMetric(categoryKey, group, rowIndex, 'label', event.target.value)}
                            placeholder="Précision"
                            className="bg-white text-xs h-8"
                          />
                          <Input
                            aria-label="Moyenne comparée"
                            type="number"
                            step="any"
                            value={metric.average === undefined ? '' : Number(metric.average)}
                            onChange={(event) => updateElcsMetric(categoryKey, group, rowIndex, 'average', event.target.value)}
                            placeholder="Moyenne"
                            className="bg-white text-xs h-8"
                          />
                          <select
                            className="h-8 rounded-md border bg-white px-2 text-xs"
                            aria-label="Tendance"
                            value={String(metric.trend || 'up')}
                            onChange={(event) => updateElcsMetric(categoryKey, group, rowIndex, 'trend', event.target.value)}
                          >
                            <option value="up">Progression ↑</option>
                            <option value="down">Baisse ↓</option>
                          </select>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => removeElcsMetric(categoryKey, group, rowIndex)}
                            aria-label="Supprimer l’indicateur"
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        {metric.value !== undefined && Number(metric.value) > 0 && (
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-[10px] font-semibold text-slate-500">Jauge en direct :</span>
                            <div className="h-2 flex-1 rounded-full bg-slate-200 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-purple-600 transition-all duration-300"
                                style={{ width: `${Math.min(100, Math.max(0, Number(metric.value)))}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-bold text-purple-700">{Number(metric.value)}%</span>
                            {metric.average !== undefined && (
                              <span className="text-[10px] text-slate-500">(Moyenne : {Number(metric.average)}%)</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* 2. RESTAURATION SCOLAIRE & CANTINE */}
        {subTab === 'restaurant' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 flex items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-sm text-french-blue">Données Restauration Scolaire & Cantine</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Menus, tarifs, fréquentation et retours de satisfaction modifiables en direct.
                </p>
              </div>
            </div>

            {restaurantEditorGroups.map((group) => (
              <section key={group.title} className="space-y-4 rounded-xl border bg-white p-5 shadow-sm">
                <h3 className="border-b pb-2 text-base font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-french-blue" /> {group.title}
                </h3>
                {group.datasets.map((dataset) => {
                  const rows = getRestaurantRows(dataset.key);
                  return (
                    <div key={dataset.key} className="space-y-3 pt-2">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                          {dataset.label} ({rows.length} lignes)
                        </h4>
                        <Button type="button" size="sm" variant="outline" onClick={() => addRestaurantRow(dataset.key)} className="text-xs h-8">
                          <Plus className="mr-1 h-3 w-3" /> Ajouter une ligne
                        </Button>
                      </div>
                      <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full min-w-[640px] text-left text-sm">
                          <thead className="bg-slate-50 text-xs text-slate-600 border-b">
                            <tr>
                              {dataset.fields.map((field) => (
                                <th key={field.key} className="px-3 py-2.5 font-semibold">
                                  {field.label}
                                </th>
                              ))}
                              <th className="px-3 py-2.5 font-semibold w-36">Jauge visuelle</th>
                              <th className="w-16 px-3 py-2.5 text-right font-semibold">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {rows.map((row, rowIndex) => {
                              const percentVal = typeof row.percentage === 'number'
                                ? Number(row.percentage)
                                : typeof row.value === 'number'
                                ? Number(row.value)
                                : null;

                              return (
                                <tr key={`${dataset.key}-${rowIndex}`} className="hover:bg-slate-50/70 transition-colors">
                                  {dataset.fields.map((field) => (
                                    <td key={field.key} className="px-3 py-2">
                                      <Input
                                        type={field.type || 'text'}
                                        value={row[field.key] === undefined ? '' : String(row[field.key])}
                                        onChange={(event) => updateRestaurantRow(dataset.key, rowIndex, field.key, event.target.value)}
                                        className="h-8 text-xs bg-white"
                                      />
                                    </td>
                                  ))}
                                  <td className="px-3 py-2">
                                    {percentVal !== null && (
                                      <div className="flex items-center gap-2">
                                        <div className="h-2 flex-1 rounded-full bg-slate-200 overflow-hidden">
                                          <div className="h-full rounded-full bg-french-blue" style={{ width: `${Math.min(100, Math.max(0, percentVal))}%` }} />
                                        </div>
                                        <span className="text-xs font-semibold text-french-blue">{percentVal}%</span>
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-2 py-2 text-right">
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => removeRestaurantRow(dataset.key, rowIndex)}
                                      className="h-8 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </section>
            ))}
          </div>
        )}

        {/* 3. RAPPORTS & SOUS-PAGES DU DIAGNOSTIC */}
        {subTab === 'rapports' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h3 className="text-sm font-bold text-purple-900">Rapport complet et sous-pages du Diagnostic</h3>
                <p className="text-xs text-slate-500">Rapports thématiques et analyses détaillées rattachées à /diagnostic.</p>
              </div>
              <Button type="button" size="sm" onClick={() => addSubPage('/diagnostic')} className="bg-purple-600 hover:bg-purple-700 text-white text-xs">
                <Plus className="mr-1 h-3.5 w-3.5" /> + Nouvelle sous-page
              </Button>
            </div>

            {/* Official Report Card: /elcs-analyse-complete */}
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/30 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-purple-100 text-purple-800 text-[11px] font-bold px-2 py-0.5">Rapport Officiel</span>
                  <span className="font-bold text-sm text-purple-950">Analyse Complète de l’ELCS</span>
                  <code className="text-xs font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border">/elcs-analyse-complete</code>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Résultats détaillés de l’enquête climat scolaire auprès des élèves, parents et personnels.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => openRubriqueEditor('/elcs-analyse-complete', 'Analyse Complète ELCS', '/diagnostic', 'rubrique-diagnostic')}
                  className="h-8 text-xs text-purple-700 border-purple-300 hover:bg-purple-50"
                >
                  <Pencil className="mr-1 h-3 w-3" /> Modifier les contenus
                </Button>
                <Button asChild size="sm" variant="ghost" className="h-8 text-xs">
                  <a href="/elcs-analyse-complete?draft=1" target="_blank" rel="noreferrer">
                    <Eye className="mr-1 h-3 w-3" /> Voir
                  </a>
                </Button>
              </div>
            </div>

            {/* Custom Subpages */}
            {diagnosticCustomPages.map((page) => {
              const pageIndex = pages.findIndex((p) => p.slug === page.slug);
              return (
                <div key={page.slug} className="p-3.5 rounded-lg border bg-white flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50">
                  <div>
                    <div className="flex items-center gap-2">
                      <CornerDownRight className="h-4 w-4 text-purple-600" />
                      <span className="font-bold text-sm text-purple-950">{page.title}</span>
                      <code className="text-xs font-mono text-slate-400 bg-slate-100 px-1 py-0.2 rounded">{page.slug}</code>
                    </div>
                    <p className="text-xs text-slate-500 ml-6 mt-0.5">{page.description || `${page.blocks.length} bloc(s) de contenu`}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => openRubriqueEditor(page.slug, page.title, '/diagnostic', 'rubrique-diagnostic')}
                      className="h-8 text-xs text-purple-700 hover:bg-purple-50"
                    >
                      <Pencil className="mr-1 h-3 w-3" /> Modifier les blocs
                    </Button>
                    <Button asChild size="sm" variant="ghost" className="h-8 text-xs">
                      <a href={`${page.slug}?draft=1`} target="_blank" rel="noreferrer">
                        <Eye className="mr-1 h-3 w-3" /> Voir
                      </a>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => deletePage(pageIndex)}
                      className="h-8 text-xs text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// =========================================================================
// 5. RUBRIQUE 5 : PLAN STRATÉGIQUE (/plan-strategique - 4 AXES)
// =========================================================================
export interface RubriquePlanStrategiquePanelProps {
  pageDataJson: string;
  getEditablePageData: () => Record<string, unknown>;
  updatePlanStrategiqueGeneral: (field: 'title' | 'subtitle', value: string) => void;
  updateTimelineRange: (axis: string, field: 'startYear' | 'endYear', value: number) => void;
  updateTimelineAction: (axis: string, actionIndex: number, field: string, value: string | number) => void;
  addTimelineAction: (axis: string) => void;
  removeTimelineAction: (axis: string, actionIndex: number) => void;
  moveTimelineAction: (axis: string, actionIndex: number, direction: -1 | 1) => void;
  duplicateTimelineAction: (axis: string, actionIndex: number) => void;
  updateScheduleDay: (dayIndex: number, field: string, value: string) => void;
  updateScheduleRoom: (dayIndex: number, roomIndex: number, field: string, value: string) => void;
  addScheduleDay: () => void;
  removeScheduleDay: (dayIndex: number) => void;
  addScheduleRoom: (dayIndex: number) => void;
  removeScheduleRoom: (dayIndex: number, roomIndex: number) => void;
  updateFilmLevel: (levelKey: string, field: 'level' | 'subtitle', value: string) => void;
  updateFilmAction: (levelKey: string, actionIndex: number, field: string, value: string) => void;
  addFilmAction: (levelKey: string) => void;
  removeFilmAction: (levelKey: string, actionIndex: number) => void;
  removeFilmLevel: (levelKey: string) => void;
  addFilmLevel: () => void;
  pages: ManagedPage[];
  openRubriqueEditor: (path: string, name: string, parentPath?: string, returnRubrique?: string) => void;
  addSubPage: (parentSlug?: string) => void;
  deletePage: (pageIndex?: number) => void;
  saveDraft: () => boolean;
}

export const RubriquePlanStrategiquePanel: React.FC<RubriquePlanStrategiquePanelProps> = ({
  getEditablePageData, updatePlanStrategiqueGeneral,
  updateTimelineRange, updateTimelineAction, addTimelineAction, removeTimelineAction,
  moveTimelineAction, duplicateTimelineAction, updateScheduleDay, updateScheduleRoom,
  addScheduleDay, removeScheduleDay, addScheduleRoom, removeScheduleRoom, updateFilmLevel,
  updateFilmAction, addFilmAction, removeFilmAction, removeFilmLevel, addFilmLevel,
  pages, openRubriqueEditor, addSubPage, deletePage, saveDraft
}) => {
  const [subTab, setSubTab] = useState<'overview' | 'axe1' | 'axe2' | 'axe3' | 'axe4'>('overview');
  const [axe3InnerTab, setAxe3InnerTab] = useState<'timeline' | 'bac-blanc' | 'film-annuel' | 'subpages'>('timeline');

  const currentData = getEditablePageData();
  const psGeneral = (currentData.planStrategique as Record<string, string>) || { title: 'PLAN STRATÉGIQUE DE DÉVELOPPEMENT', subtitle: 'Lycée Français Jacques Prévert (2026-2030)' };
  const timelines = currentData.psdTimelines as Record<string, { title?: string; startYear: number; endYear: number; actions: { title: string; description: string; start: number; end: number; color?: string }[] }>;

  // Find official pillar for Plan Stratégique
  const psPillar = SITE_PILLARS.find((p) => p.id === 'plan-strategique');
  const axes = psPillar?.axes || [];

  // Helper for rendering an axis timeline and its specific subpages
  const renderAxisSection = (axisKey: 'axe1' | 'axe2' | 'axe3' | 'axe4', axisIndex: number) => {
    const axisMeta = axes[axisIndex];
    const axisData = timelines[axisKey] || { title: `Axe ${axisIndex + 1}`, startYear: 2026, endYear: 2030, actions: [] };
    const axisSubpages = axisMeta?.subpages || [];
    const axisCustomPages = pages.filter((p) => p.parent === `/plan-strategique/axe-${axisIndex + 1}` || axisSubpages.some((sub) => sub.path === p.parent));

    return (
      <div className="space-y-6">
        {/* Axis description banner */}
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5">Axe {axisIndex + 1}</span>
              <h4 className="font-bold text-sm text-emerald-950">{axisMeta?.name || `Axe ${axisIndex + 1}`}</h4>
            </div>
            <p className="text-xs text-emerald-800 mt-1 max-w-2xl">{axisMeta?.description}</p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => addSubPage(`/plan-strategique/axe-${axisIndex + 1}`)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
          >
            <Plus className="mr-1 h-3.5 w-3.5" /> + Sous-page sur cet axe
          </Button>
        </div>

        {/* Frise chronologique (2026-2030) */}
        <div className="space-y-4 rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
            <div>
              <h4 className="font-bold text-sm text-french-blue flex items-center gap-2">
                <Target className="h-4 w-4" /> Frise chronologique & Jalons de l’Axe {axisIndex + 1}
              </h4>
              <p className="text-xs text-slate-500">Planification des actions prioritaires dans le temps.</p>
            </div>
            <Button type="button" size="sm" onClick={() => addTimelineAction(axisKey)} variant="outline" className="text-xs h-8">
              <Plus className="mr-1 h-3 w-3" /> Nouvelle action sur la frise
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 bg-slate-50 p-3 rounded-lg border">
            <div>
              <Label className="text-xs">Année de début</Label>
              <Input
                type="number"
                value={axisData.startYear}
                onChange={(e) => updateTimelineRange(axisKey, 'startYear', Number(e.target.value) || 2026)}
                className="bg-white text-xs mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Année de fin</Label>
              <Input
                type="number"
                value={axisData.endYear}
                onChange={(e) => updateTimelineRange(axisKey, 'endYear', Number(e.target.value) || 2030)}
                className="bg-white text-xs mt-1"
              />
            </div>
          </div>

          <div className="space-y-3">
            {axisData.actions.map((action, actionIndex) => (
              <div key={`action-${actionIndex}`} className="space-y-3 rounded-lg border bg-white p-3.5 shadow-xs">
                <div className="flex items-center justify-between gap-2 border-b pb-2">
                  <span className="font-semibold text-xs text-french-blue">Action {actionIndex + 1} : {action.title || 'Nouvelle action'}</span>
                  <div className="flex items-center gap-1">
                    <Button type="button" size="sm" variant="ghost" title="Monter" onClick={() => moveTimelineAction(axisKey, actionIndex, -1)} disabled={actionIndex === 0}>
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button type="button" size="sm" variant="ghost" title="Descendre" onClick={() => moveTimelineAction(axisKey, actionIndex, 1)} disabled={actionIndex === axisData.actions.length - 1}>
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button type="button" size="sm" variant="outline" title="Dupliquer" onClick={() => duplicateTimelineAction(axisKey, actionIndex)}>
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button type="button" size="sm" variant="destructive" title="Supprimer" onClick={() => removeTimelineAction(axisKey, actionIndex)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label className="text-xs">Titre de l’action</Label>
                    <Input
                      value={action.title}
                      onChange={(e) => updateTimelineAction(axisKey, actionIndex, 'title', e.target.value)}
                      className="text-xs mt-0.5"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="text-xs">Description</Label>
                    <Textarea
                      value={action.description}
                      onChange={(e) => updateTimelineAction(axisKey, actionIndex, 'description', e.target.value)}
                      className="text-xs min-h-[50px] mt-0.5"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Année de lancement</Label>
                    <Input
                      type="number"
                      value={action.start}
                      onChange={(e) => updateTimelineAction(axisKey, actionIndex, 'start', Number(e.target.value) || axisData.startYear)}
                      className="text-xs mt-0.5"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Année d’aboutissement</Label>
                    <Input
                      type="number"
                      value={action.end}
                      onChange={(e) => updateTimelineAction(axisKey, actionIndex, 'end', Number(e.target.value) || axisData.endYear)}
                      className="text-xs mt-0.5"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sous-pages de cet Axe */}
        <div className="space-y-4 rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h4 className="font-bold text-sm text-french-blue">Sous-pages thématiques de l’Axe {axisIndex + 1} ({axisSubpages.length + axisCustomPages.length})</h4>
              <p className="text-xs text-slate-500">Chaque fiche projet dispose de ses contenus, sections et blocs modifiables.</p>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() => addSubPage(`/plan-strategique/axe-${axisIndex + 1}`)}
              className="bg-french-blue hover:bg-blue-700 text-xs"
            >
              <Plus className="mr-1 h-3.5 w-3.5" /> + Nouvelle sous-page
            </Button>
          </div>

          <div className="divide-y rounded-lg border bg-white shadow-xs overflow-hidden">
            {axisSubpages.map((sub) => (
              <div key={sub.path} className="p-3.5 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <CornerDownRight className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="font-bold text-sm text-slate-900">{sub.name}</span>
                    <code className="text-[11px] font-mono text-slate-400 bg-slate-100 px-1 py-0.2 rounded">{sub.path}</code>
                  </div>
                  {sub.description && <p className="text-xs text-slate-500 ml-6 mt-0.5">{sub.description}</p>}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => openRubriqueEditor(sub.path, sub.name, `/plan-strategique/axe-${axisIndex + 1}`, 'rubrique-plan-strategique')}
                    className="h-8 text-xs text-french-blue hover:bg-blue-50"
                  >
                    <Pencil className="mr-1 h-3 w-3" /> Modifier les blocs
                  </Button>
                  <Button asChild size="sm" variant="ghost" className="h-8 text-xs">
                    <a href={`${sub.path}?draft=1`} target="_blank" rel="noreferrer">
                      <Eye className="mr-1 h-3 w-3" /> Voir
                    </a>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => addSubPage(sub.path)}
                    className="h-8 text-xs text-amber-600 hover:bg-amber-50"
                    title="Ajouter une sous-page à cette fiche"
                  >
                    <CornerDownRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}

            {axisCustomPages.map((cp) => {
              const pageIndex = pages.findIndex((p) => p.slug === cp.slug);
              return (
                <div key={cp.slug} className="p-3.5 bg-amber-50/20 flex flex-wrap items-center justify-between gap-3 hover:bg-amber-50/40">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <CornerDownRight className="h-4 w-4 text-amber-600 shrink-0" />
                      <span className="font-bold text-sm text-french-blue">{cp.title}</span>
                      <span className="rounded bg-amber-100 text-amber-800 text-[10px] font-semibold px-1.5 py-0.2">Personnalisée</span>
                      <code className="text-[11px] font-mono text-slate-400 bg-white px-1 py-0.2 rounded border">{cp.slug}</code>
                    </div>
                    <p className="text-xs text-slate-500 ml-6 mt-0.5">{cp.description || `${cp.blocks.length} bloc(s) de contenu`}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => openRubriqueEditor(cp.slug, cp.title, `/plan-strategique/axe-${axisIndex + 1}`, 'rubrique-plan-strategique')}
                      className="h-8 text-xs text-french-blue hover:bg-blue-50"
                    >
                      <Pencil className="mr-1 h-3 w-3" /> Modifier les blocs
                    </Button>
                    <Button asChild size="sm" variant="ghost" className="h-8 text-xs">
                      <a href={`${cp.slug}?draft=1`} target="_blank" rel="noreferrer">
                        <Eye className="mr-1 h-3 w-3" /> Voir
                      </a>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => deletePage(pageIndex)}
                      className="h-8 text-xs text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="border-b bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/40 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-sm">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl text-emerald-950 font-playfair">5. Rubrique Plan Stratégique (2026–2030)</CardTitle>
                <span className="rounded bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 font-mono">/plan-strategique (Pilier 5)</span>
              </div>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Les 4 grands axes prioritaires, frises chronologiques, planning Bac Blanc, Film Annuel et toutes les sous-pages de développement.
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline" className="h-8 text-xs">
              <a href="/plan-strategique?draft=1" target="_blank" rel="noreferrer">
                <Eye className="mr-1.5 h-3.5 w-3.5" /> Voir le Plan Stratégique
              </a>
            </Button>
            <Button type="button" size="sm" onClick={() => saveDraft()} className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs">
              <Save className="mr-1.5 h-3.5 w-3.5" /> Enregistrer le brouillon
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-5">
        <div className="flex flex-wrap gap-2 border-b pb-3">
          <Button
            type="button"
            size="sm"
            variant={subTab === 'overview' ? 'default' : 'outline'}
            onClick={() => setSubTab('overview')}
            className={subTab === 'overview' ? 'bg-emerald-600 text-white shadow-sm' : ''}
          >
            <Target className="mr-1.5 h-4 w-4" /> 🎯 Vue Générale & Titres
          </Button>
          <Button
            type="button"
            size="sm"
            variant={subTab === 'axe1' ? 'default' : 'outline'}
            onClick={() => setSubTab('axe1')}
            className={subTab === 'axe1' ? 'bg-emerald-600 text-white shadow-sm' : ''}
          >
            🥇 Axe 1 : Réussite Académique
          </Button>
          <Button
            type="button"
            size="sm"
            variant={subTab === 'axe2' ? 'default' : 'outline'}
            onClick={() => setSubTab('axe2')}
            className={subTab === 'axe2' ? 'bg-emerald-600 text-white shadow-sm' : ''}
          >
            🌱 Axe 2 : Bien-être & Climat
          </Button>
          <Button
            type="button"
            size="sm"
            variant={subTab === 'axe3' ? 'default' : 'outline'}
            onClick={() => setSubTab('axe3')}
            className={subTab === 'axe3' ? 'bg-emerald-600 text-white shadow-sm' : ''}
          >
            🌍 Axe 3 : Rayonnement & Avenir
          </Button>
          <Button
            type="button"
            size="sm"
            variant={subTab === 'axe4' ? 'default' : 'outline'}
            onClick={() => setSubTab('axe4')}
            className={subTab === 'axe4' ? 'bg-emerald-600 text-white shadow-sm' : ''}
          >
            💻 Axe 4 : Numérique & Modernisation
          </Button>
        </div>

        {/* 1. OVERVIEW */}
        {subTab === 'overview' && (
          <div className="space-y-5">
            <div className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
              <h4 className="font-bold text-french-blue text-sm border-b pb-2">Titres officiels du Plan Stratégique</h4>
              <div className="grid gap-2">
                <Label>Titre général du document PSD</Label>
                <Input
                  value={psGeneral.title}
                  onChange={(e) => updatePlanStrategiqueGeneral('title', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Sous-titre et période</Label>
                <Input
                  value={psGeneral.subtitle}
                  onChange={(e) => updatePlanStrategiqueGeneral('subtitle', e.target.value)}
                />
              </div>
            </div>

            {/* Grid of the 4 axes */}
            <div className="grid gap-4 sm:grid-cols-2">
              {axes.map((axis, index) => (
                <div key={axis.id} className="p-4 rounded-xl border bg-white shadow-sm space-y-2 hover:border-emerald-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5">Axe {index + 1}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="link"
                      onClick={() => setSubTab(`axe${index + 1}` as typeof subTab)}
                      className="p-0 h-auto text-xs text-emerald-700 font-semibold"
                    >
                      Accéder à cet axe →
                    </Button>
                  </div>
                  <h5 className="font-bold text-sm text-slate-900">{axis.name}</h5>
                  <p className="text-xs text-slate-500 line-clamp-2">{axis.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. AXE 1 */}
        {subTab === 'axe1' && renderAxisSection('axe1', 0)}

        {/* 3. AXE 2 */}
        {subTab === 'axe2' && renderAxisSection('axe2', 1)}

        {/* 4. AXE 3 : WITH SPECIAL SUBTABS FOR BAC BLANC & FILM ANNUEL */}
        {subTab === 'axe3' && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 border-b pb-2">
              <Button
                type="button"
                size="sm"
                variant={axe3InnerTab === 'timeline' ? 'default' : 'outline'}
                onClick={() => setAxe3InnerTab('timeline')}
                className={axe3InnerTab === 'timeline' ? 'bg-french-blue text-white' : ''}
              >
                Frise & Sous-pages de l’Axe 3
              </Button>
              <Button
                type="button"
                size="sm"
                variant={axe3InnerTab === 'bac-blanc' ? 'default' : 'outline'}
                onClick={() => setAxe3InnerTab('bac-blanc')}
                className={axe3InnerTab === 'bac-blanc' ? 'bg-french-blue text-white' : ''}
              >
                🎓 Planning du Bac Blanc
              </Button>
              <Button
                type="button"
                size="sm"
                variant={axe3InnerTab === 'film-annuel' ? 'default' : 'outline'}
                onClick={() => setAxe3InnerTab('film-annuel')}
                className={axe3InnerTab === 'film-annuel' ? 'bg-french-blue text-white' : ''}
              >
                📅 Films Annuels (Orientation 3e–Terminale)
              </Button>
            </div>

            {axe3InnerTab === 'timeline' && renderAxisSection('axe3', 2)}

            {/* BAC BLANC PLANNING */}
            {axe3InnerTab === 'bac-blanc' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b pb-2">
                  <div>
                    <h3 className="text-sm font-bold text-french-blue">Organisation du Bac Blanc (Axe 3)</h3>
                    <p className="text-xs text-slate-500">Gérez les journées, épreuves, salles et affectations de surveillance.</p>
                  </div>
                  <Button type="button" size="sm" onClick={addScheduleDay} className="bg-french-blue hover:bg-blue-700 text-xs">
                    <Plus className="mr-1 h-3.5 w-3.5" /> Ajouter une journée d’examen
                  </Button>
                </div>
                {(currentData.bacBlancSchedule as Record<string, unknown>[]).map((day, dayIndex) => (
                  <div key={`exam-day-${dayIndex}`} className="space-y-4 rounded-xl border bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="font-bold text-sm text-french-blue">
                        Journée {dayIndex + 1} : {String(day.label || 'Nouvelle date')}
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeScheduleDay(dayIndex)}
                        className="h-8 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" /> Supprimer la journée
                      </Button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <Label className="text-xs font-semibold">Date</Label>
                        <Input
                          type="date"
                          value={String(day.date || '')}
                          onChange={(event) => updateScheduleDay(dayIndex, 'date', event.target.value)}
                          className="text-xs mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold">Libellé affiché</Label>
                        <Input
                          value={String(day.label || '')}
                          onChange={(event) => updateScheduleDay(dayIndex, 'label', event.target.value)}
                          className="text-xs mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold">Épreuve / Thématique</Label>
                        <Input
                          value={String(day.focus || '')}
                          onChange={(event) => updateScheduleDay(dayIndex, 'focus', event.target.value)}
                          className="text-xs mt-1"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <Label className="text-xs font-semibold">Note / Consignes logistiques</Label>
                        <Textarea
                          value={String(day.note || '')}
                          onChange={(event) => updateScheduleDay(dayIndex, 'note', event.target.value)}
                          className="text-xs min-h-[60px] mt-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Salles & Horaires ({((day.rooms as Record<string, unknown>[]) || []).length})
                        </h4>
                        <Button type="button" size="sm" variant="outline" onClick={() => addScheduleRoom(dayIndex)} className="text-xs h-7">
                          <Plus className="mr-1 h-3 w-3" /> Ajouter une salle
                        </Button>
                      </div>
                      {((day.rooms as Record<string, unknown>[]) || []).map((room, roomIndex) => (
                        <div key={`room-${roomIndex}`} className="grid gap-2.5 rounded-lg bg-slate-50 p-3 sm:grid-cols-2">
                          {([
                            ['room', 'Salle'], ['examTitle', 'Épreuve'], ['examTime', 'Horaire'], ['leadExaminer', 'Responsable'],
                            ['surveillanceTeam', 'Surveillance (noms séparés par virgules)'], ['notes', 'Note particulière'],
                          ] as const).map(([field, label]) => (
                            <div key={field} className="grid gap-1">
                              <Label className="text-[11px] font-semibold text-slate-600">{label}</Label>
                              <Input
                                value={field === 'surveillanceTeam' ? ((room.surveillanceTeam as string[]) || []).join(', ') : String(room[field] || '')}
                                onChange={(event) => updateScheduleRoom(dayIndex, roomIndex, field, event.target.value)}
                                className="bg-white text-xs h-8"
                              />
                            </div>
                          ))}
                          <div className="sm:col-span-2 flex justify-end pt-1">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => removeScheduleRoom(dayIndex, roomIndex)}
                              className="h-7 text-xs text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="mr-1 h-3 w-3" /> Retirer cette salle
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* FILM ANNUEL */}
            {axe3InnerTab === 'film-annuel' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b pb-2">
                  <div>
                    <h3 className="text-sm font-bold text-french-blue">Films annuels d’orientation par cycle (Axe 3)</h3>
                    <p className="text-xs text-slate-500">Maternelle, Élémentaire, Collège, Lycée et actions d’orientation.</p>
                  </div>
                  <Button type="button" size="sm" onClick={addFilmLevel} className="bg-french-blue hover:bg-blue-700 text-xs">
                    <Plus className="mr-1 h-3.5 w-3.5" /> Ajouter un niveau / cycle
                  </Button>
                </div>
                {Object.entries(currentData.filmAnnuelData as Record<string, Record<string, unknown>>).map(([levelKey, level]) => (
                  <div key={levelKey} className="space-y-4 rounded-xl border bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="font-bold text-sm text-french-blue">Niveau : {String(level.level || levelKey)}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFilmLevel(levelKey)}
                        className="h-8 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" /> Supprimer ce niveau
                      </Button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <Label className="text-xs font-semibold">Nom du cycle</Label>
                        <Input
                          value={String(level.level || '')}
                          onChange={(event) => updateFilmLevel(levelKey, 'level', event.target.value)}
                          className="text-xs mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold">Chapeau introductif</Label>
                        <Input
                          value={String(level.subtitle || '')}
                          onChange={(event) => updateFilmLevel(levelKey, 'subtitle', event.target.value)}
                          className="text-xs mt-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Actions d’orientation ({((level.actions as Record<string, unknown>[]) || []).length})
                        </h4>
                        <Button type="button" size="sm" variant="outline" onClick={() => addFilmAction(levelKey)} className="text-xs h-7">
                          <Plus className="mr-1 h-3 w-3" /> Ajouter une action
                        </Button>
                      </div>
                      {((level.actions as Record<string, unknown>[]) || []).map((action, actionIndex) => (
                        <div key={`action-${actionIndex}`} className="grid gap-2.5 rounded-lg bg-slate-50 p-3 sm:grid-cols-2">
                          {(['title', 'period', 'description', 'actors'] as const).map((field) => (
                            <div key={field} className="grid gap-1">
                              <Label className="text-[11px] font-semibold text-slate-600">
                                {field === 'title' ? 'Intitulé' : field === 'period' ? 'Période' : field === 'description' ? 'Description' : 'Acteurs / Intervenants'}
                              </Label>
                              {field === 'description' ? (
                                <Textarea
                                  value={String(action[field] || '')}
                                  onChange={(event) => updateFilmAction(levelKey, actionIndex, field, event.target.value)}
                                  className="bg-white text-xs min-h-[50px]"
                                />
                              ) : (
                                <Input
                                  value={String(action[field] || '')}
                                  onChange={(event) => updateFilmAction(levelKey, actionIndex, field, event.target.value)}
                                  className="bg-white text-xs h-8"
                                />
                              )}
                            </div>
                          ))}
                          <div className="grid gap-1">
                            <Label className="text-[11px] font-semibold text-slate-600">Phase du parcours</Label>
                            <select
                              className="h-8 rounded-md border bg-white px-2 text-xs"
                              value={String(action.phase || 'Mieux se connaître')}
                              onChange={(event) => updateFilmAction(levelKey, actionIndex, 'phase', event.target.value)}
                            >
                              <option>Mieux se connaître</option>
                              <option>Plonger dans le monde professionnel</option>
                              <option>Finaliser les projets</option>
                            </select>
                          </div>
                          <div className="flex items-end justify-end">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFilmAction(levelKey, actionIndex)}
                              className="h-7 text-xs text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="mr-1 h-3 w-3" /> Supprimer l’action
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. AXE 4 */}
        {subTab === 'axe4' && renderAxisSection('axe4', 3)}
      </CardContent>
    </Card>
  );
};

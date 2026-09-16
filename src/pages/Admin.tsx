import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Copy, ExternalLink, Eye, Github, Image, Save, Send, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import siteContent from '@/content/siteContent.json';
import pagesFile from '@/content/pages.json';
import breadcrumbRoutes from '@/data/breadcrumbRoutes.json';
import { isValidManagedPage, normalizePageSlug, validateManagedPages, type ContentBlock, type ManagedPage } from '@/content/pageTypes';
import { normalizeMediaUrl } from '@/lib/media';

type Content = typeof siteContent;
const draftStorageKey = 'lfjp-admin-draft';
const pagesDraftStorageKey = 'lfjp-admin-pages-draft';

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const loadContentDraft = (): Content => {
  const savedDraft = window.localStorage.getItem(draftStorageKey);
  if (!savedDraft) return siteContent;
  try {
    const parsed: unknown = JSON.parse(savedDraft);
    if (!isRecord(parsed) || !isRecord(parsed.site) || typeof parsed.site.name !== 'string' || typeof parsed.site.tagline !== 'string' || typeof parsed.site.logoUrl !== 'string' || typeof parsed.site.logoAlt !== 'string' || typeof parsed.site.footerPlan !== 'string' || typeof parsed.site.footerCopyright !== 'string' || !isRecord(parsed.visionMissionsValeurs) || !Array.isArray(parsed.visionMissionsValeurs.vision) || !Array.isArray(parsed.visionMissionsValeurs.missions) || !Array.isArray(parsed.visionMissionsValeurs.values) || !isRecord(parsed.home) || !Array.isArray(parsed.home.cards) || !Array.isArray(parsed.home.messages)) {
      throw new Error('Structure de brouillon invalide.');
    }
    return parsed as Content;
  } catch {
    window.localStorage.removeItem(draftStorageKey);
    return siteContent;
  }
};

const loadPagesDraft = (): ManagedPage[] => {
  const savedPages = window.localStorage.getItem(pagesDraftStorageKey);
  if (!savedPages) return pagesFile.pages as ManagedPage[];
  try {
    const parsed: unknown = JSON.parse(savedPages);
    if (!isRecord(parsed) || !Array.isArray(parsed.pages) || !parsed.pages.every(isValidManagedPage)) {
      throw new Error('Structure de pages invalide.');
    }
    return parsed.pages as ManagedPage[];
  } catch {
    window.localStorage.removeItem(pagesDraftStorageKey);
    return pagesFile.pages as ManagedPage[];
  }
};

const MediaPreview = ({ src, type = 'image' }: { src: string; type?: 'image' | 'video' }) => {
  const [failed, setFailed] = useState(false);
  const normalized = normalizeMediaUrl(src, type);
  if (!normalized) return null;
  if (failed) return <p className="text-xs text-red-600">Aperçu impossible. Vérifiez que le fichier est public et que le lien est accessible sans connexion.</p>;
  return type === 'video'
    ? <video className="max-h-40 w-full rounded-md border bg-slate-100 object-contain" controls src={normalized} onError={() => setFailed(true)} />
    : <img className="max-h-40 w-full rounded-md border bg-slate-100 object-contain" src={normalized} alt="Aperçu du média" onError={() => setFailed(true)} />;
};

const Admin = () => {
  const [content, setContent] = useState<Content>(loadContentDraft);
  const [pages, setPages] = useState<ManagedPage[]>(loadPagesDraft);
  const [selectedPage, setSelectedPage] = useState(0);
  const [user, setUser] = useState<{ login: string; avatar_url?: string } | null>(null);
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [pullRequest, setPullRequest] = useState<{ number: number; url: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(async (response) => response.ok ? response.json() : null)
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    const knownPaths = new Set(Object.keys(breadcrumbRoutes));
    setPages((current) => {
      const existingPaths = new Set(current.map((page) => normalizePageSlug(page.slug)));
      const recoveredPages = content.home.cards
        .map((card) => ({ ...card, path: normalizePageSlug(card.path) }))
        .filter((card) => card.path !== '/' && !knownPaths.has(card.path) && !existingPaths.has(card.path))
        .map((card): ManagedPage => ({
          slug: card.path,
          title: card.title,
          description: card.description,
          showInNavigation: true,
          blocks: [{ type: 'paragraph', text: card.description }],
        }));
      return recoveredPages.length ? [...current, ...recoveredPages] : current;
    });
  }, [content.home.cards]);

  const serializedContent = useMemo(() => JSON.stringify(content, null, 2), [content]);
  const serializedPages = useMemo(() => JSON.stringify({ pages }, null, 2), [pages]);

  const updateHome = (field: keyof Content['home'], value: string) => {
    setContent((current) => ({ ...current, home: { ...current.home, [field]: value } }));
  };

  const updateSite = (field: keyof Content['site'], value: string) => {
    setContent((current) => ({ ...current, site: { ...current.site, [field]: field === 'logoUrl' ? normalizeMediaUrl(value) : value } }));
  };

  const updateVisionParagraph = (index: number, value: string) => {
    setContent((current) => ({
      ...current,
      visionMissionsValeurs: {
        ...current.visionMissionsValeurs,
        vision: current.visionMissionsValeurs.vision.map((item, itemIndex) => itemIndex === index ? value : item),
      },
    }));
  };

  const updateMission = (index: number, value: string) => {
    setContent((current) => ({
      ...current,
      visionMissionsValeurs: {
        ...current.visionMissionsValeurs,
        missions: current.visionMissionsValeurs.missions.map((item, itemIndex) => itemIndex === index ? value : item),
      },
    }));
  };

  const updateValue = (index: number, field: 'name' | 'description', value: string) => {
    setContent((current) => ({
      ...current,
      visionMissionsValeurs: {
        ...current.visionMissionsValeurs,
        values: current.visionMissionsValeurs.values.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item),
      },
    }));
  };

  const updateCard = (index: number, field: keyof Content['home']['cards'][number], value: string) => {
    setContent((current) => ({
      ...current,
      home: {
        ...current.home,
        cards: current.home.cards.map((card, cardIndex) => cardIndex === index ? { ...card, [field]: field === 'image' ? normalizeMediaUrl(value) : value } : card),
      },
    }));
  };

  const addCard = () => {
    const baseSlug = '/nouvelle-rubrique';
    let slug = baseSlug;
    let suffix = 2;
    while (pages.some((page) => normalizePageSlug(page.slug) === slug)) slug = `${baseSlug}-${suffix++}`;
    const page: ManagedPage = {
      slug,
      title: 'Nouvelle rubrique',
      description: 'Décrivez cette rubrique.',
      showInNavigation: true,
      blocks: [{ type: 'paragraph', text: 'Écrivez votre contenu ici.' }],
    };
    setContent((current) => ({
      ...current,
      home: {
        ...current.home,
        cards: [...current.home.cards, {
          title: 'Nouvelle rubrique',
          description: 'Décrivez cette rubrique.',
          linkLabel: 'Découvrir',
          path: slug,
          image: '',
        }],
      },
    }));
    setPages((current) => [...current, page]);
    setSelectedPage(pages.length);
    setStatus(`Rubrique et page créées : ${slug}. Modifiez la page dans la section Pages personnalisées.`);
  };

  const removeCard = (index: number) => {
    setContent((current) => ({
      ...current,
      home: { ...current.home, cards: current.home.cards.filter((_, cardIndex) => cardIndex !== index) },
    }));
  };

  const updateMessage = (index: number, field: 'title' | 'eyebrow' | 'image' | 'imageAlt', value: string) => {
    setContent((current) => ({
      ...current,
      home: {
        ...current.home,
        messages: current.home.messages.map((message, messageIndex) =>
          messageIndex === index ? { ...message, [field]: field === 'image' ? normalizeMediaUrl(value) : value } : message
        ),
      },
    }));
  };

  const updateMessageArray = (index: number, field: 'paragraphs' | 'signature', itemIndex: number, value: string) => {
    setContent((current) => ({
      ...current,
      home: {
        ...current.home,
        messages: current.home.messages.map((message, messageIndex) => (
          messageIndex === index
            ? { ...message, [field]: message[field].map((item, currentIndex) => currentIndex === itemIndex ? value : item) }
            : message
        )),
      },
    }));
  };

  const addMessageArrayItem = (index: number, field: 'paragraphs' | 'signature') => {
    setContent((current) => ({
      ...current,
      home: {
        ...current.home,
        messages: current.home.messages.map((message, messageIndex) => (
          messageIndex === index ? { ...message, [field]: [...message[field], ''] } : message
        )),
      },
    }));
  };

  const removeMessageArrayItem = (index: number, field: 'paragraphs' | 'signature', itemIndex: number) => {
    setContent((current) => ({
      ...current,
      home: {
        ...current.home,
        messages: current.home.messages.map((message, messageIndex) => (
          messageIndex === index
            ? { ...message, [field]: message[field].filter((_, currentIndex) => currentIndex !== itemIndex) }
            : message
        )),
      },
    }));
  };

  const createPullRequest = async () => {
    setIsSaving(true);
    setStatus('');
    try {
      const validationErrors = validateManagedPages(pages);
      if (validationErrors.length) throw new Error(`Corrigez les erreurs CMS :\n${validationErrors.join('\n')}`);
      const managedPaths = new Set(pages.map((page) => normalizePageSlug(page.slug)));
      const knownPaths = new Set(Object.keys(breadcrumbRoutes));
      const invalidCard = content.home.cards.find((card) => {
        const path = normalizePageSlug(card.path);
        return !managedPaths.has(path) && !knownPaths.has(path);
      });
      if (invalidCard) throw new Error(`La rubrique « ${invalidCard.title} » pointe vers une page inexistante (${invalidCard.path}). Créez ou rattachez cette page avant la Preview.`);
      const response = await fetch('/api/github/pull-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: {
          'src/content/siteContent.json': serializedContent,
          'src/content/pages.json': serializedPages,
        } }),
      });
      const responseText = await response.text();
      let result: { error?: string; url?: string; number?: number };
      try {
        result = responseText ? JSON.parse(responseText) as { error?: string; url?: string; number?: number } : {};
      } catch {
        throw new Error(
          `L’API Vercel a renvoyé une réponse non JSON (HTTP ${response.status}). Vérifie les variables d’environnement Vercel et redéploie.`
        );
      }
      if (!response.ok) throw new Error(result.error || 'La Pull Request n’a pas pu être créée.');
      if (result.url && result.number) setPullRequest({ url: result.url, number: result.number });
      setStatus(`Preview demandée : ${result.url || 'Pull Request créée'}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Une erreur inattendue est survenue.');
    } finally {
      setIsSaving(false);
    }
  };

  const publishPullRequest = async () => {
    if (!pullRequest || !window.confirm('Publier cette Preview en production en fusionnant la Pull Request ?')) return;
    setIsSaving(true);
    setStatus('');
    try {
      const response = await fetch('/api/github/merge-pull-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pullNumber: pullRequest.number }),
      });
      const text = await response.text();
      const result = text ? JSON.parse(text) as { error?: string; message?: string } : {};
      if (!response.ok) throw new Error(result.error || 'La publication a échoué.');
      setStatus(result.message || 'Publication effectuée.');
      setPullRequest(null);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Une erreur inattendue est survenue.');
    } finally {
      setIsSaving(false);
    }
  };

  const saveDraft = () => {
    window.localStorage.setItem(draftStorageKey, serializedContent);
    window.localStorage.setItem(pagesDraftStorageKey, serializedPages);
    setStatus('Brouillon enregistré dans ce navigateur. Il n’est pas encore public.');
  };

  const resetDraft = () => {
    window.localStorage.removeItem(draftStorageKey);
    setContent(siteContent);
    setPages(pagesFile.pages as ManagedPage[]);
    setStatus('Brouillon réinitialisé avec le contenu versionné.');
  };

  const addPage = () => {
    const page: ManagedPage = {
      slug: `/nouvelle-page-${pages.length + 1}`,
      title: 'Nouvelle page',
      description: '',
      blocks: [{ type: 'paragraph', text: 'Écrivez votre contenu ici.' }],
    };

    setPages((current) => [...current, page]);
    setSelectedPage(pages.length);
  };

  const deletePage = () => {
    const page = pages[selectedPage];
    if (!page || !window.confirm(`Supprimer la page « ${page.title} » et son contenu ?`)) return;
    const nextPages = pages.filter((_, index) => index !== selectedPage);
    setPages(nextPages);
    setSelectedPage(Math.max(0, Math.min(selectedPage, nextPages.length - 1)));
    setStatus('Page supprimée du brouillon. Enregistrez puis créez une Preview pour la publier.');
  };

  const duplicatePage = () => {
    const source = pages[selectedPage];
    if (!source) return;
    const copyIndex = pages.length + 1;
    const copy: ManagedPage = {
      ...source,
      slug: `${normalizePageSlug(source.slug)}-copie-${copyIndex}`,
      title: `${source.title} (copie)`,
      menuLabel: source.menuLabel ? `${source.menuLabel} (copie)` : undefined,
      blocks: source.blocks.map((block) => ({ ...block })),
    };
    setPages((current) => [...current, copy]);
    setSelectedPage(pages.length);
    setStatus('Page dupliquée dans le brouillon.');
  };

  const updatePage = (field: keyof ManagedPage, value: string) => {
    setPages((current) => current.map((page, index) => index === selectedPage ? { ...page, [field]: value } : page));
  };

  const updateBlock = (blockIndex: number, patch: Partial<ContentBlock>) => {
    setPages((current) => current.map((page, pageIndex) => pageIndex === selectedPage
      ? { ...page, blocks: page.blocks.map((block, index) => index === blockIndex ? { ...block, ...patch } as ContentBlock : block) }
      : page));
  };

  const addBlock = (type: ContentBlock['type']) => {
    const defaults: Record<ContentBlock['type'], ContentBlock> = {
      heading: { type: 'heading', level: 2, text: 'Nouveau titre' },
      paragraph: { type: 'paragraph', text: 'Écrivez votre texte ici.' },
      image: { type: 'image', src: '', alt: '', caption: '' },
      gallery: { type: 'gallery', images: [{ src: '', alt: '' }] },
      video: { type: 'video', src: '', title: '' },
      embed: { type: 'embed', src: '', title: 'Contenu intégré', height: 420 },
      quote: { type: 'quote', text: 'Citation', author: '' },
      list: { type: 'list', items: ['Élément de liste'] },
      callout: { type: 'callout', title: 'À retenir', text: '', tone: 'blue' },
      table: { type: 'table', headers: ['Colonne 1', 'Colonne 2'], rows: [['', '']] },
      chart: { type: 'chart', title: 'Graphique', labels: ['Valeur'], values: [50] },
      button: { type: 'button', label: 'En savoir plus', href: '/' },
      divider: { type: 'divider' },
    };
    setPages((current) => current.map((page, index) => index === selectedPage ? { ...page, blocks: [...page.blocks, defaults[type]] } : page));
  };

  const removeBlock = (blockIndex: number) => {
    setPages((current) => current.map((page, index) => index === selectedPage ? { ...page, blocks: page.blocks.filter((_, blockIndexValue) => blockIndexValue !== blockIndex) } : page));
  };

  const moveBlock = (blockIndex: number, direction: -1 | 1) => {
    setPages((current) => current.map((page, index) => {
      if (index !== selectedPage) return page;
      const target = blockIndex + direction;
      if (target < 0 || target >= page.blocks.length) return page;
      const blocks = [...page.blocks];
      [blocks[blockIndex], blocks[target]] = [blocks[target], blocks[blockIndex]];
      return { ...page, blocks };
    }));
  };

  const updateBlockText = (blockIndex: number, field: 'text' | 'title' | 'src' | 'alt' | 'caption' | 'author' | 'label' | 'href' | 'tone', value: string) => {
    const block = pages[selectedPage]?.blocks[blockIndex];
    const mediaField = field === 'src' && (block?.type === 'image' || block?.type === 'video');
    updateBlock(blockIndex, { [field]: mediaField ? normalizeMediaUrl(value, block.type) : value });
  };

  const importMedia = (file: File | undefined, onLoad: (dataUrl: string) => void) => {
    if (!file) return;
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setStatus('Sélectionnez une image ou une vidéo.');
      return;
    }
    if (file.size > 350000) {
      setStatus('Le fichier doit faire moins de 350 Ko pour rester publiable dans le fichier JSON.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') onLoad(reader.result);
    };
    reader.onerror = () => setStatus('Le fichier média n’a pas pu être importé.');
    reader.readAsDataURL(file);
  };

  const importContentImage = (file: File | undefined, onLoad: (dataUrl: string) => void) => {
    if (!file || !file.type.startsWith('image/')) {
      if (file) setStatus('Sélectionnez une image.');
      return;
    }
    if (file.size > 350000) {
      setStatus('L’image doit faire moins de 350 Ko pour rester publiable dans le fichier JSON.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') onLoad(reader.result);
    };
    reader.onerror = () => setStatus('L’image n’a pas pu être importée.');
    reader.readAsDataURL(file);
  };

  const renderBlockEditor = (block: ContentBlock, blockIndex: number) => {
    const textField = (field: Parameters<typeof updateBlockText>[1], label: string, value: string, multiline = false) => (
      <div className="grid gap-2">
        <Label>{label}</Label>
        {multiline
          ? <Textarea value={value} onChange={(event) => updateBlockText(blockIndex, field, event.target.value)} />
          : <Input value={value} onChange={(event) => updateBlockText(blockIndex, field, event.target.value)} />}
      </div>
    );
    switch (block.type) {
      case 'heading':
        return <>{textField('text', 'Titre', block.text)}<div className="grid gap-2"><Label>Niveau</Label><select className="h-10 rounded-md border px-3" value={block.level || 2} onChange={(event) => updateBlock(blockIndex, { level: Number(event.target.value) as 2 | 3 })}><option value="2">Titre 2</option><option value="3">Titre 3</option></select></div></>;
      case 'paragraph':
        return textField('text', 'Texte', block.text, true);
      case 'quote':
        return <>{textField('text', 'Citation', block.text, true)}{textField('author', 'Auteur', block.author || '')}</>;
      case 'button':
        return <>{textField('label', 'Libellé', block.label)}{textField('href', 'Lien', block.href)}</>;
      case 'image':
        return <>{textField('src', 'URL de l’image ou lien Google Drive public', block.src)}<MediaPreview src={block.src} /><label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold text-french-blue"><Upload size={16} /> Importer une image<input className="sr-only" type="file" accept="image/*" onChange={(event) => importMedia(event.target.files?.[0], (src) => updateBlock(blockIndex, { src }))} /></label>{textField('alt', 'Texte alternatif', block.alt)}{textField('caption', 'Légende', block.caption || '')}</>;
      case 'video':
        return <>{textField('src', 'URL de la vidéo ou lien Google Drive public', block.src)}<MediaPreview src={block.src} type="video" /><label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold text-french-blue"><Upload size={16} /> Importer une vidéo<input className="sr-only" type="file" accept="video/*" onChange={(event) => importMedia(event.target.files?.[0], (src) => updateBlock(blockIndex, { src }))} /></label>{textField('title', 'Titre de la vidéo', block.title || '')}</>;
      case 'embed':
        return <>{textField('src', 'URL intégrée', block.src)}{textField('title', 'Titre accessible', block.title)}<div className="grid gap-2"><Label>Hauteur (pixels)</Label><Input type="number" value={block.height || 420} onChange={(event) => updateBlock(blockIndex, { height: Number(event.target.value) || 420 })} /></div></>;
      case 'callout':
        return <>{textField('title', 'Titre', block.title)}{textField('text', 'Contenu', block.text, true)}<div className="grid gap-2"><Label>Style</Label><select className="h-10 rounded-md border px-3" value={block.tone || 'blue'} onChange={(event) => updateBlockText(blockIndex, 'tone', event.target.value)}><option value="blue">Bleu</option><option value="gold">Or</option><option value="green">Vert</option></select></div></>;
      case 'list':
      case 'gallery':
      case 'table':
      case 'chart':
        return <div className="grid gap-2"><Label>Données du bloc</Label><Textarea className="min-h-[140px] font-mono text-xs" value={JSON.stringify(block, null, 2)} onChange={(event) => {
          try {
            const parsed = JSON.parse(event.target.value);
            if (parsed.type === block.type) updateBlock(blockIndex, parsed);
          } catch {
            // Keep the editor usable while the JSON is being typed.
          }
        }} /><p className="text-xs text-slate-500">Vous pouvez modifier les éléments, URLs et valeurs dans ce JSON.</p></div>;
      case 'divider':
        return <p className="text-sm text-slate-500">Séparateur visuel sans contenu.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-raleway">
      <header className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-french-blue">Administration</p>
            <h1 className="font-playfair text-2xl font-bold text-french-blue">Contenus du site LFJP</h1>
          </div>
          <div className="flex items-center gap-3">
            {user ? <span className="text-sm text-slate-600">Connecté : {user.login}</span> : <Button asChild variant="outline"><a href="/api/auth/github"><Github /> Se connecter avec GitHub</a></Button>}
            <Button asChild variant="ghost"><Link to="/"><ArrowLeft /> Retour au site</Link></Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto grid gap-6 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <nav className="sticky top-2 z-10 flex flex-wrap gap-2 rounded-lg border bg-white/95 p-3 shadow-sm backdrop-blur" aria-label="Sections de l’administration">
            <a className="rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-french-blue" href="#identite">Identité du site</a>
            <a className="rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-french-blue" href="#vision">Vision & valeurs</a>
            <a className="rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-french-blue" href="#accueil">Accueil</a>
            <a className="rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-french-blue" href="#rubriques">Rubriques de l’accueil</a>
            <a className="rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-french-blue" href="#pages">Pages & hiérarchie</a>
            <a className="rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-french-blue" href="#messages">Messages & médias</a>
            <a className="rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-french-blue" href="#publication">Enregistrer & publier</a>
          </nav>
          <Card id="identite">
            <CardHeader>
              <CardTitle>Identité, en-tête et pied de page</CardTitle>
              <CardDescription>Ces informations sont partagées par toutes les pages et conservent la mise en forme actuelle du site.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2"><Label>Nom du site</Label><Input value={content.site.name} onChange={(event) => updateSite('name', event.target.value)} /></div>
              <div className="grid gap-2"><Label>Sous-titre</Label><Input value={content.site.tagline} onChange={(event) => updateSite('tagline', event.target.value)} /></div>
              <div className="grid gap-2"><Label>URL du logo ou lien Google Drive public</Label><Input value={content.site.logoUrl} onChange={(event) => updateSite('logoUrl', event.target.value)} /><MediaPreview src={content.site.logoUrl} /><label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold text-french-blue"><Upload size={16} /> Importer le logo<input className="sr-only" type="file" accept="image/*" onChange={(event) => importContentImage(event.target.files?.[0], (src) => updateSite('logoUrl', src))} /></label></div>
              <div className="grid gap-2"><Label>Texte alternatif du logo</Label><Input value={content.site.logoAlt} onChange={(event) => updateSite('logoAlt', event.target.value)} /></div>
              <div className="grid gap-2"><Label>Texte du copyright</Label><Input value={content.site.footerCopyright} onChange={(event) => updateSite('footerCopyright', event.target.value)} /></div>
              <div className="grid gap-2"><Label>Texte complémentaire du pied de page</Label><Input value={content.site.footerPlan} onChange={(event) => updateSite('footerPlan', event.target.value)} /></div>
            </CardContent>
          </Card>

          <Card id="vision">
            <CardHeader>
              <CardTitle>Vision, missions et valeurs</CardTitle>
              <CardDescription>Modifiez cette page spécialisée sans modifier son design, ses icônes ou ses animations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Notre vision</Label>
                {content.visionMissionsValeurs.vision.map((paragraph, index) => (
                  <div key={`vision-${index}`} className="flex gap-2">
                    <Textarea value={paragraph} onChange={(event) => updateVisionParagraph(index, event.target.value)} />
                    <Button type="button" size="sm" variant="ghost" onClick={() => setContent((current) => ({ ...current, visionMissionsValeurs: { ...current.visionMissionsValeurs, vision: current.visionMissionsValeurs.vision.filter((_, itemIndex) => itemIndex !== index) } }))}>Supprimer</Button>
                  </div>
                ))}
                <Button type="button" size="sm" variant="outline" onClick={() => setContent((current) => ({ ...current, visionMissionsValeurs: { ...current.visionMissionsValeurs, vision: [...current.visionMissionsValeurs.vision, 'Nouveau paragraphe de vision.'] } }))}>Ajouter un paragraphe</Button>
              </div>
              <div className="space-y-3">
                <Label>Nos missions</Label>
                {content.visionMissionsValeurs.missions.map((mission, index) => (
                  <div key={`mission-${index}`} className="flex gap-2">
                    <Textarea value={mission} onChange={(event) => updateMission(index, event.target.value)} />
                    <Button type="button" size="sm" variant="ghost" onClick={() => setContent((current) => ({ ...current, visionMissionsValeurs: { ...current.visionMissionsValeurs, missions: current.visionMissionsValeurs.missions.filter((_, itemIndex) => itemIndex !== index) } }))}>Supprimer</Button>
                  </div>
                ))}
                <Button type="button" size="sm" variant="outline" onClick={() => setContent((current) => ({ ...current, visionMissionsValeurs: { ...current.visionMissionsValeurs, missions: [...current.visionMissionsValeurs.missions, 'Nouvelle mission.'] } }))}>Ajouter une mission</Button>
              </div>
              <div className="space-y-3">
                <Label>Nos valeurs</Label>
                {content.visionMissionsValeurs.values.map((value, index) => (
                  <div key={`value-${index}`} className="grid gap-2 rounded-lg border p-4 md:grid-cols-[minmax(0,1fr)_2fr_auto]">
                    <Input value={value.name} onChange={(event) => updateValue(index, 'name', event.target.value)} aria-label={`Nom de la valeur ${index + 1}`} />
                    <Textarea value={value.description} onChange={(event) => updateValue(index, 'description', event.target.value)} aria-label={`Description de la valeur ${index + 1}`} />
                    <Button type="button" size="sm" variant="ghost" onClick={() => setContent((current) => ({ ...current, visionMissionsValeurs: { ...current.visionMissionsValeurs, values: current.visionMissionsValeurs.values.filter((_, itemIndex) => itemIndex !== index) } }))}>Supprimer</Button>
                  </div>
                ))}
                <Button type="button" size="sm" variant="outline" onClick={() => setContent((current) => ({ ...current, visionMissionsValeurs: { ...current.visionMissionsValeurs, values: [...current.visionMissionsValeurs.values, { name: 'Nouvelle valeur', description: 'Description de la valeur.' }] } }))}>Ajouter une valeur</Button>
              </div>
            </CardContent>
          </Card>

          <Card id="accueil">
            <CardHeader>
              <CardTitle>Accueil</CardTitle>
              <CardDescription>Ces champs alimentent le contenu public sans modifier sa mise en page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="hero-title">Titre principal</Label>
                <Input id="hero-title" value={content.home.heroTitle} onChange={(event) => updateHome('heroTitle', event.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hero-subtitle">Sous-titre</Label>
                <Input id="hero-subtitle" value={content.home.heroSubtitle} onChange={(event) => updateHome('heroSubtitle', event.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="section-title">Titre de la section</Label>
                <Input id="section-title" value={content.home.sectionTitle} onChange={(event) => updateHome('sectionTitle', event.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card id="rubriques">
            <CardHeader className="flex-row items-center justify-between">
              <div><CardTitle>Rubriques de l’accueil</CardTitle><CardDescription>Gérez les cartes affichées sous le titre principal.</CardDescription></div>
              <Button type="button" size="sm" variant="outline" onClick={addCard}>Ajouter une rubrique</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.home.cards.map((card, index) => (
                <div key={`card-${index}`} className="grid gap-3 rounded-lg border p-4 md:grid-cols-2">
                  <div className="grid gap-2"><Label>Titre</Label><Input value={card.title} onChange={(event) => updateCard(index, 'title', event.target.value)} /></div>
                  <div className="grid gap-2"><Label>Chemin interne</Label><Input value={card.path} onChange={(event) => updateCard(index, 'path', event.target.value)} /></div>
                  <div className="grid gap-2 md:col-span-2"><Label>Description</Label><Textarea value={card.description} onChange={(event) => updateCard(index, 'description', event.target.value)} /></div>
                  <div className="grid gap-2"><Label>Texte du lien</Label><Input value={card.linkLabel} onChange={(event) => updateCard(index, 'linkLabel', event.target.value)} /></div>
                  <div className="grid gap-2"><Label>Image de la rubrique</Label><Input value={card.image || ''} onChange={(event) => updateCard(index, 'image', event.target.value)} /><MediaPreview src={card.image || ''} /><label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold text-french-blue"><Upload size={16} /> Importer une image<input className="sr-only" type="file" accept="image/*" onChange={(event) => importContentImage(event.target.files?.[0], (src) => updateCard(index, 'image', src))} /></label></div>
                  <div className="flex items-end justify-end"><Button type="button" size="sm" variant="ghost" onClick={() => removeCard(index)}>Supprimer cette rubrique</Button></div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card id="pages">
            <CardHeader className="flex-row items-center justify-between">
              <div><CardTitle>Pages & hiérarchie</CardTitle><CardDescription>Créez des pages, sous-pages et sous-sous-pages avec des blocs de contenu.</CardDescription></div>
              <Button onClick={addPage} size="sm">Nouvelle page</Button>
            </CardHeader>
            <CardContent className="space-y-5">
              {pages.length === 0 ? <p className="text-sm text-slate-600">Aucune page personnalisée pour le moment.</p> : (
                <>
                  <div className="flex flex-wrap gap-2">
                    {pages.map((page, index) => <Button key={`${page.slug}-${index}`} variant={selectedPage === index ? 'default' : 'outline'} size="sm" onClick={() => setSelectedPage(index)}>{page.title}</Button>)}
                  </div>
                  {pages[selectedPage] && (
                    <div className="space-y-4 rounded-lg border p-4">
                      <div className="grid gap-2"><Label>Chemin URL</Label><Input value={pages[selectedPage].slug} onChange={(event) => updatePage('slug', normalizePageSlug(event.target.value))} placeholder="/mon-chemin" /><p className="text-xs text-slate-500">Adresse publique : <a className="text-french-blue underline" href={`${pages[selectedPage].slug}?draft=1`} target="_blank" rel="noreferrer"><Eye className="mr-1 inline h-3 w-3" />prévisualiser le brouillon</a></p></div>
                      <div className="grid gap-2">
                        <Label>Page parente (optionnel)</Label>
                        <select
                          className="h-10 rounded-md border px-3"
                          value={pages[selectedPage].parent || ''}
                          onChange={(event) => updatePage('parent', event.target.value)}
                        >
                          <option value="">Aucune (page racine)</option>
                          {pages.filter((_, index) => index !== selectedPage).map((candidate) => (
                            <option key={candidate.slug} value={normalizePageSlug(candidate.slug)}>
                              {candidate.title} — {candidate.slug}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-slate-500">Vous pouvez rattacher cette page à n’importe quelle autre page pour créer plusieurs niveaux de sous-rubriques.</p>
                      </div>
                      <div className="grid gap-2"><Label>Titre</Label><Input value={pages[selectedPage].title} onChange={(event) => updatePage('title', event.target.value)} /></div>
                      <div className="grid gap-2"><Label>Description</Label><Textarea value={pages[selectedPage].description || ''} onChange={(event) => updatePage('description', event.target.value)} /></div>
                      <div className="grid gap-2"><Label>Nom dans le menu</Label><Input value={pages[selectedPage].menuLabel || ''} onChange={(event) => updatePage('menuLabel', event.target.value)} placeholder="Laisser vide pour utiliser le titre" /></div>
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={pages[selectedPage].showInNavigation !== false} onChange={(event) => setPages((current) => current.map((page, index) => index === selectedPage ? { ...page, showInNavigation: event.target.checked } : page))} /> Afficher cette page dans la navigation</label>
                      <div className="flex flex-wrap gap-2"><Button type="button" size="sm" variant="outline" onClick={duplicatePage}><Copy className="mr-1 h-4 w-4" /> Dupliquer</Button><Button type="button" size="sm" variant="destructive" onClick={deletePage}><Trash2 className="mr-1 h-4 w-4" /> Supprimer</Button></div>
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2"><div><Label>Contenu de la page</Label><p className="text-xs text-slate-500">Ajoutez les blocs dans l’ordre souhaité, sans écrire de JSON.</p></div><div className="flex flex-wrap gap-2">{(['heading', 'paragraph', 'image', 'gallery', 'video', 'embed', 'quote', 'list', 'callout', 'table', 'chart', 'button', 'divider'] as ContentBlock['type'][]).map((type) => <Button key={type} type="button" size="sm" variant="outline" onClick={() => addBlock(type)}>+ {type}</Button>)}</div></div>
                        {pages[selectedPage].blocks.map((block, blockIndex) => (
                          <div key={`block-${blockIndex}`} className="space-y-3 rounded-lg border bg-slate-50 p-4">
                            <div className="flex items-center justify-between gap-2"><p className="font-semibold capitalize text-french-blue">{block.type}</p><div className="flex gap-1"><Button type="button" size="sm" variant="ghost" onClick={() => moveBlock(blockIndex, -1)} disabled={blockIndex === 0}>↑</Button><Button type="button" size="sm" variant="ghost" onClick={() => moveBlock(blockIndex, 1)} disabled={blockIndex === pages[selectedPage].blocks.length - 1}>↓</Button><Button type="button" size="sm" variant="ghost" onClick={() => removeBlock(blockIndex)}>Supprimer</Button></div></div>
                            {renderBlockEditor(block, blockIndex)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card id="messages">
            <CardHeader>
              <CardTitle>Messages et images</CardTitle>
              <CardDescription>Les images doivent être publiquement accessibles par URL. L’ajout de fichiers dans Git sera ajouté dans l’étape suivante.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.home.messages.map((message, index) => (
                <div key={message.title} className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center gap-2 text-french-blue"><Image size={18} /><h3 className="font-semibold">{message.title}</h3></div>
                  <div className="grid gap-2"><Label>Rubrique</Label><Input value={message.eyebrow} onChange={(event) => updateMessage(index, 'eyebrow', event.target.value)} /></div>
                  <div className="grid gap-2"><Label>Titre</Label><Input value={message.title} onChange={(event) => updateMessage(index, 'title', event.target.value)} /></div>
                  <div className="grid gap-2"><Label>URL de l’image ou lien Google Drive public</Label><Input value={message.image} onChange={(event) => updateMessage(index, 'image', event.target.value)} /><MediaPreview src={message.image} /><label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold text-french-blue"><Upload size={16} /> Importer une image<input className="sr-only" type="file" accept="image/*" onChange={(event) => importContentImage(event.target.files?.[0], (src) => updateMessage(index, 'image', src))} /></label></div>
                  <div className="grid gap-2"><Label>Description de l’image</Label><Input value={message.imageAlt} onChange={(event) => updateMessage(index, 'imageAlt', event.target.value)} /></div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between"><Label>Texte du message</Label><Button type="button" size="sm" variant="outline" onClick={() => addMessageArrayItem(index, 'paragraphs')}>Ajouter un paragraphe</Button></div>
                    {message.paragraphs.map((paragraph, paragraphIndex) => (
                      <div key={`paragraph-${paragraphIndex}`} className="flex gap-2">
                        <Textarea className="min-h-[120px]" value={paragraph} onChange={(event) => updateMessageArray(index, 'paragraphs', paragraphIndex, event.target.value)} aria-label={`Paragraphe ${paragraphIndex + 1}`} />
                        <Button type="button" size="sm" variant="ghost" onClick={() => removeMessageArrayItem(index, 'paragraphs', paragraphIndex)} aria-label={`Supprimer le paragraphe ${paragraphIndex + 1}`}>Supprimer</Button>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between"><Label>Signature</Label><Button type="button" size="sm" variant="outline" onClick={() => addMessageArrayItem(index, 'signature')}>Ajouter une ligne</Button></div>
                    {message.signature.map((line, lineIndex) => (
                      <div key={`signature-${lineIndex}`} className="flex gap-2">
                        <Input value={line} onChange={(event) => updateMessageArray(index, 'signature', lineIndex, event.target.value)} aria-label={`Ligne de signature ${lineIndex + 1}`} />
                        <Button type="button" size="sm" variant="ghost" onClick={() => removeMessageArrayItem(index, 'signature', lineIndex)} aria-label={`Supprimer la ligne ${lineIndex + 1}`}>Supprimer</Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div id="publication" className="flex scroll-mt-24 flex-wrap items-center gap-3">
            <Button onClick={saveDraft} variant="outline"><Save /> Enregistrer le brouillon</Button>
            <Button onClick={resetDraft} variant="ghost">Réinitialiser</Button>
            <Button onClick={createPullRequest} disabled={isSaving}><Send /> {isSaving ? 'Préparation…' : 'Créer une Preview GitHub'}</Button>
            {pullRequest && <Button onClick={publishPullRequest} disabled={isSaving} variant="secondary">Publier après validation</Button>}
            {status && <p className="text-sm text-slate-600"><Check className="mr-1 inline h-4 w-4 text-green-600" />{status}</p>}
          </div>
          {pullRequest && <p className="text-sm text-slate-600">Vérifie la <a className="font-semibold text-french-blue underline" href={pullRequest.url} target="_blank" rel="noreferrer">Pull Request et sa Preview Vercel</a> avant de publier.</p>}
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Processus sécurisé</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p>1. Tu modifies un brouillon sans toucher à la production.</p>
              <p>2. GitHub crée une branche et une Pull Request.</p>
              <p>3. Vercel génère une URL Preview.</p>
              <p>4. La production ne change qu’après fusion validée.</p>
              <a className="inline-flex items-center gap-2 text-french-blue hover:underline" href="https://vercel.com/docs/deployments/preview-deployments" target="_blank" rel="noreferrer">Comprendre les previews Vercel <ExternalLink size={14} /></a>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Aperçu du brouillon</CardTitle></CardHeader>
            <CardContent>
              <div className="rounded-lg bg-gradient-to-r from-french-blue to-blue-700 p-5 text-white">
                <h2 className="font-playfair text-2xl font-bold">{content.home.heroTitle}</h2>
                <p className="mt-2 text-sm">{content.home.heroSubtitle}</p>
              </div>
              <Textarea className="mt-4 font-mono text-xs" value={serializedContent} readOnly aria-label="Contenu JSON du brouillon" />
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  );
};

export default Admin;

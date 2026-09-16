import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, ExternalLink, Github, Image, Save, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import siteContent from '@/content/siteContent.json';
import pagesFile from '@/content/pages.json';
import type { ContentBlock, ManagedPage } from '@/content/pageTypes';

type Content = typeof siteContent;
const draftStorageKey = 'lfjp-admin-draft';
const pagesDraftStorageKey = 'lfjp-admin-pages-draft';

const Admin = () => {
  const [content, setContent] = useState<Content>(() => {
    const savedDraft = window.localStorage.getItem(draftStorageKey);
    if (!savedDraft) return siteContent;
    try {
      return JSON.parse(savedDraft) as Content;
    } catch {
      window.localStorage.removeItem(draftStorageKey);
      return siteContent;
    }
  });
  const [pages, setPages] = useState<ManagedPage[]>(() => {
    const savedPages = window.localStorage.getItem(pagesDraftStorageKey);
    if (!savedPages) return pagesFile.pages as ManagedPage[];
    try {
      return JSON.parse(savedPages) as ManagedPage[];
    } catch {
      window.localStorage.removeItem(pagesDraftStorageKey);
      return pagesFile.pages as ManagedPage[];
    }
  });
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

  const serializedContent = useMemo(() => JSON.stringify(content, null, 2), [content]);
  const serializedPages = useMemo(() => JSON.stringify({ pages }, null, 2), [pages]);

  const updateHome = (field: keyof Content['home'], value: string) => {
    setContent((current) => ({ ...current, home: { ...current.home, [field]: value } }));
  };

  const updateMessage = (index: number, field: 'title' | 'eyebrow' | 'image' | 'imageAlt', value: string) => {
    setContent((current) => ({
      ...current,
      home: {
        ...current.home,
        messages: current.home.messages.map((message, messageIndex) =>
          messageIndex === index ? { ...message, [field]: value } : message
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
    updateBlock(blockIndex, { [field]: value });
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
        return <>{textField('src', 'URL de l’image', block.src)}{textField('alt', 'Texte alternatif', block.alt)}{textField('caption', 'Légende', block.caption || '')}</>;
      case 'video':
        return <>{textField('src', 'URL de la vidéo', block.src)}{textField('title', 'Titre de la vidéo', block.title || '')}</>;
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
          <Card>
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

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div><CardTitle>Pages personnalisées</CardTitle><CardDescription>Crée des pages et sous-pages avec des blocs de contenu.</CardDescription></div>
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
                      <div className="grid gap-2"><Label>Chemin URL</Label><Input value={pages[selectedPage].slug} onChange={(event) => updatePage('slug', event.target.value)} placeholder="/mon-chemin" /></div>
                      <div className="grid gap-2"><Label>Page parente (optionnel)</Label><Input value={pages[selectedPage].parent || ''} onChange={(event) => updatePage('parent', event.target.value)} placeholder="/plan-strategique" /></div>
                      <div className="grid gap-2"><Label>Titre</Label><Input value={pages[selectedPage].title} onChange={(event) => updatePage('title', event.target.value)} /></div>
                      <div className="grid gap-2"><Label>Description</Label><Textarea value={pages[selectedPage].description || ''} onChange={(event) => updatePage('description', event.target.value)} /></div>
                      <div className="grid gap-2"><Label>Nom dans le menu</Label><Input value={pages[selectedPage].menuLabel || ''} onChange={(event) => updatePage('menuLabel', event.target.value)} placeholder="Laisser vide pour utiliser le titre" /></div>
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={pages[selectedPage].showInNavigation !== false} onChange={(event) => setPages((current) => current.map((page, index) => index === selectedPage ? { ...page, showInNavigation: event.target.checked } : page))} /> Afficher cette page dans la navigation</label>
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

          <Card>
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
                  <div className="grid gap-2"><Label>URL de l’image</Label><Input value={message.image} onChange={(event) => updateMessage(index, 'image', event.target.value)} /></div>
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

          <div className="flex flex-wrap items-center gap-3">
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

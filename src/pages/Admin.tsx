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
import type { ManagedPage } from '@/content/pageTypes';

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
        result = responseText ? JSON.parse(responseText) as { error?: string; url?: string } : {};
      } catch {
        throw new Error(
          'Le serveur API n’est pas actif. Lance « npx vercel dev --listen 3000 », puis ouvre http://localhost:3000/admin.'
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

  const updatePageBlocks = (value: string) => {
    try {
      const blocks = JSON.parse(value);
      if (!Array.isArray(blocks)) throw new Error('Les blocs doivent être un tableau JSON.');
      setPages((current) => current.map((page, index) => index === selectedPage ? { ...page, blocks } : page));
      setStatus('');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Blocs JSON invalides.');
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
                      <div className="grid gap-2"><Label>Blocs de contenu (JSON)</Label><Textarea className="min-h-[260px] font-mono text-xs" value={JSON.stringify(pages[selectedPage].blocks, null, 2)} onChange={(event) => updatePageBlocks(event.target.value)} /></div>
                      <p className="text-xs text-slate-500">Types disponibles : heading, paragraph, image, gallery, quote, list, button, divider.</p>
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

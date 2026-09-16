import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BreadcrumbNav from '@/components/Breadcrumb';
import BackToTop from '@/components/BackToTop';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NotFound from '@/pages/NotFound';
import pagesData from '@/content/pages.json';
import { isValidContentBlock, isValidManagedPage, type ContentBlock, type ManagedPage as ManagedPageData } from '@/content/pageTypes';
import { normalizeMediaUrl } from '@/lib/media';

const pages = pagesData.pages as ManagedPageData[];

const Block = ({ block }: { block: ContentBlock }) => {
  switch (block.type) {
    case 'heading':
      return block.level === 3
        ? <h3 className="mt-8 text-2xl font-playfair font-bold text-french-blue">{block.text}</h3>
        : <h2 className="mt-8 text-3xl font-playfair font-bold text-french-blue">{block.text}</h2>;
    case 'paragraph':
      return <p className="whitespace-pre-line leading-relaxed text-gray-700">{block.text}</p>;
    case 'image':
      return <figure><img src={normalizeMediaUrl(block.src)} alt={block.alt} className="max-h-[520px] w-full rounded-lg object-cover shadow-md" />{block.caption && <figcaption className="mt-2 text-center text-sm text-gray-500">{block.caption}</figcaption>}</figure>;
    case 'gallery':
      return <div className="grid gap-4 sm:grid-cols-2">{block.images.map((image) => <img key={`${image.src}-${image.alt}`} src={normalizeMediaUrl(image.src)} alt={image.alt} className="h-56 w-full rounded-lg object-cover shadow-md" />)}</div>;
    case 'video':
      return <figure><video className="w-full rounded-lg shadow-md" controls preload="metadata" src={normalizeMediaUrl(block.src, 'video')}>{block.title && <track kind="captions" label={block.title} srcLang="fr" />}</video>{block.title && <figcaption className="mt-2 text-center text-sm text-gray-500">{block.title}</figcaption>}</figure>;
    case 'embed':
      return <iframe className="w-full rounded-lg border-0 shadow-md" style={{ height: block.height || 420 }} src={block.src} title={block.title} loading="lazy" />;
    case 'quote':
      return <blockquote className="border-l-4 border-french-blue pl-5 text-xl italic text-gray-700">{block.text}{block.author && <cite className="mt-2 block text-sm not-italic font-semibold text-french-blue">— {block.author}</cite>}</blockquote>;
    case 'list':
      return <ul className="list-disc space-y-2 pl-6 text-gray-700">{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
    case 'callout':
      return <aside className={`rounded-lg border-l-4 p-5 ${block.tone === 'gold' ? 'border-amber-500 bg-amber-50' : block.tone === 'green' ? 'border-emerald-600 bg-emerald-50' : 'border-french-blue bg-blue-50'}`}><h3 className="font-semibold text-french-blue">{block.title}</h3><p className="mt-2 text-gray-700">{block.text}</p></aside>;
    case 'table':
      return <div className="overflow-x-auto"><table className="w-full border-collapse text-left text-sm"><thead><tr>{block.headers.map((header) => <th key={header} className="border bg-french-blue px-3 py-2 text-white">{header}</th>)}</tr></thead><tbody>{block.rows.map((row, rowIndex) => <tr key={`row-${rowIndex}`}>{row.map((cell, cellIndex) => <td key={`cell-${rowIndex}-${cellIndex}`} className="border px-3 py-2 text-gray-700">{cell}</td>)}</tr>)}</tbody></table></div>;
    case 'chart':
      return <div className="space-y-3"><h3 className="font-semibold text-french-blue">{block.title}</h3>{block.labels.map((label, index) => <div key={label} className="grid grid-cols-[minmax(7rem,10rem)_1fr_auto] items-center gap-3 text-sm"><span>{label}</span><div className="h-3 rounded-full bg-blue-100"><div className="h-3 rounded-full bg-french-blue" style={{ width: `${Math.min(100, Math.max(0, block.values[index] || 0))}%` }} /></div><span>{block.values[index] || 0}%</span></div>)}</div>;
    case 'button':
      return block.href.startsWith('/') ? <Button asChild><Link to={block.href}>{block.label}</Link></Button> : <Button asChild><a href={block.href} target="_blank" rel="noreferrer">{block.label}<ExternalLink /></a></Button>;
    case 'divider':
      return <hr className="my-8 border-gray-200" />;
    default:
      return null;
  }
};

const ManagedPage = () => {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const draftPages = useMemo(() => {
    if (new URLSearchParams(window.location.search).get('draft') !== '1') return pages;
    const savedDraft = window.localStorage.getItem('lfjp-admin-pages-draft');
    if (!savedDraft) return pages;
    try {
      const parsed: unknown = JSON.parse(savedDraft);
      if (typeof parsed !== 'object' || parsed === null || !('pages' in parsed) || !Array.isArray(parsed.pages)) return pages;
      return parsed.pages.filter(isValidManagedPage);
    } catch {
      return pages;
    }
  }, []);
  const page = draftPages.find((item) => item.slug === pathname);
  if (!page) return <NotFound />;

  return (
    <div className="min-h-screen font-raleway">
      <Navbar showLogo={true} />
      <BreadcrumbNav />
      <main className="container mx-auto px-6 py-12">
        <Card className="mx-auto max-w-4xl border-none shadow-lg">
          <CardContent className="space-y-6 p-8 md:p-12">
            <h1 className="text-4xl font-playfair font-bold text-french-blue md:text-5xl">{page.title}</h1>
            {page.description && <p className="text-xl text-gray-600">{page.description}</p>}
            {page.blocks.filter(isValidContentBlock).map((block, index) => <Block key={`${block.type}-${index}`} block={block} />)}
          </CardContent>
        </Card>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export const hasManagedPage = (pathname: string) => pages.some((page) => page.slug === pathname.replace(/\/+$/, '') || pathname === page.slug);
export default ManagedPage;

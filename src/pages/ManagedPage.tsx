import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BreadcrumbNav from '@/components/Breadcrumb';
import BackToTop from '@/components/BackToTop';
import NotFound from '@/pages/NotFound';
import pagesData from '@/content/pages.json';
import type { ContentBlock, ManagedPage as ManagedPageData } from '@/content/pageTypes';

const pages = pagesData.pages as ManagedPageData[];

const Block = ({ block }: { block: ContentBlock }) => {
  switch (block.type) {
    case 'heading':
      return block.level === 3
        ? <h3 className="mt-8 text-2xl font-playfair font-bold text-french-blue">{block.text}</h3>
        : <h2 className="mt-8 text-3xl font-playfair font-bold text-french-blue">{block.text}</h2>;
    case 'paragraph':
      return <p className="leading-relaxed text-gray-700">{block.text}</p>;
    case 'image':
      return <figure><img src={block.src} alt={block.alt} className="max-h-[520px] w-full rounded-lg object-cover shadow-md" />{block.caption && <figcaption className="mt-2 text-center text-sm text-gray-500">{block.caption}</figcaption>}</figure>;
    case 'gallery':
      return <div className="grid gap-4 sm:grid-cols-2">{block.images.map((image) => <img key={`${image.src}-${image.alt}`} src={image.src} alt={image.alt} className="h-56 w-full rounded-lg object-cover shadow-md" />)}</div>;
    case 'quote':
      return <blockquote className="border-l-4 border-french-blue pl-5 text-xl italic text-gray-700">{block.text}{block.author && <cite className="mt-2 block text-sm not-italic font-semibold text-french-blue">— {block.author}</cite>}</blockquote>;
    case 'list':
      return <ul className="list-disc space-y-2 pl-6 text-gray-700">{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
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
  const page = pages.find((item) => item.slug === pathname);
  if (!page) return <NotFound />;

  return (
    <div className="min-h-screen font-raleway">
      <BreadcrumbNav />
      <main className="container mx-auto px-6 py-12">
        <Card className="mx-auto max-w-4xl border-none shadow-lg">
          <CardContent className="space-y-6 p-8 md:p-12">
            <h1 className="text-4xl font-playfair font-bold text-french-blue md:text-5xl">{page.title}</h1>
            {page.description && <p className="text-xl text-gray-600">{page.description}</p>}
            {page.blocks.map((block, index) => <Block key={`${block.type}-${index}`} block={block} />)}
          </CardContent>
        </Card>
      </main>
      <BackToTop />
    </div>
  );
};

export const hasManagedPage = (pathname: string) => pages.some((page) => page.slug === pathname.replace(/\/+$/, '') || pathname === page.slug);
export default ManagedPage;

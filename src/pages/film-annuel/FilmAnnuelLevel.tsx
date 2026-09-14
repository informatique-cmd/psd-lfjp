import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { filmAnnuelData, FilmAction, FilmPhase } from '@/data/filmAnnuelData';
import { ArrowLeft, Home, Filter, Search, Printer, Clock, Users, Layers } from 'lucide-react';

const phases: FilmPhase[] = [
  'Mieux se connaître',
  'Plonger dans le monde professionnel',
  'Finaliser les projets',
];

const phaseColors: Record<FilmPhase, string> = {
  'Mieux se connaître': 'bg-emerald-100 text-emerald-800',
  'Plonger dans le monde professionnel': 'bg-blue-100 text-blue-800',
  'Finaliser les projets': 'bg-violet-100 text-violet-800',
};

const FilmAnnuelLevel = () => {
  const { niveau } = useParams<{ niveau: string }>();
  const data = (niveau && filmAnnuelData[niveau]) || undefined;
  const [phaseFilter, setPhaseFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredActions = useMemo(() => {
    if (!data) return [];

    return data.actions.filter((action) => {
      const matchesPhase = phaseFilter === 'all' || action.phase === phaseFilter;
      const matchesSearch = searchTerm.trim().length === 0
        || [action.title, action.description, action.actors, action.period]
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      return matchesPhase && matchesSearch;
    });
  }, [data, phaseFilter, searchTerm]);

  const handleExport = () => {
    window.print();
  };

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar showLogo={true} />
        <main className="flex-1 flex items-center justify-center px-6 py-20">
          <Card className="max-w-xl p-10 text-center">
            <h1 className="text-2xl font-playfair font-semibold text-french-blue">Film annuel introuvable</h1>
            <p className="mt-4 text-slate-600">
              Le niveau demandé n&apos;existe pas. Retournez vers le Parcours Avenir pour choisir un film annuel disponible.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link to="/parcours-avenir">
                  <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
                  Retour au Parcours Avenir
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" aria-hidden />
                  Accueil
                </Link>
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-raleway">
      <Navbar showLogo={true} />

      <div className="container mx-auto px-6 py-6 flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <Link to="/parcours-avenir">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
            Parcours Avenir
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/">
            <Home className="mr-2 h-4 w-4" aria-hidden />
            Accueil
          </Link>
        </Button>
      </div>

      <header className="bg-gradient-to-r from-french-blue via-blue-700 to-blue-900 text-white">
        <div className="container mx-auto px-6 py-16 md:py-20">
          <p className="uppercase tracking-[0.35em] text-xs md:text-sm text-white/70">Film annuel</p>
          <h1 className="mt-3 text-3xl md:text-5xl font-playfair font-bold">Film annuel de l&apos;orientation</h1>
          <p className="mt-4 max-w-3xl text-base md:text-lg text-white/85">
            {data.subtitle}
          </p>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-10">
          <div className="container mx-auto px-6 space-y-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-playfair font-semibold text-french-blue">
                  {`Parcours des élèves de ${data.level}`}
                </h2>
                <p className="mt-2 text-slate-700">
                  Filtrez les actions par phase du Parcours Avenir ou recherchez un mot-clé pour trouver rapidement l&apos;information souhaitée.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-500" aria-hidden />
                  <Select value={phaseFilter} onValueChange={setPhaseFilter}>
                    <SelectTrigger className="w-[220px] bg-white">
                      <SelectValue placeholder="Toutes les phases" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les phases</SelectItem>
                      {phases.map((phase) => (
                        <SelectItem key={phase} value={phase}>
                          {phase}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden />
                  <Input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Rechercher une action"
                    className="pl-9 w-full sm:w-72 bg-white"
                  />
                </div>
                <Button onClick={handleExport} variant="secondary" className="whitespace-nowrap">
                  <Printer className="mr-2 h-4 w-4" aria-hidden />
                  Imprimer / PDF
                </Button>
              </div>
            </div>

            <Tabs defaultValue="timeline" className="space-y-6">
              <TabsList className="bg-white">
                <TabsTrigger value="timeline">Vue frise chronologique</TabsTrigger>
                <TabsTrigger value="table">Vue tableau</TabsTrigger>
              </TabsList>

              <TabsContent value="timeline" className="space-y-6">
                <div className="relative">
                  <div className="absolute left-5 top-0 bottom-0 w-px bg-blue-100" aria-hidden />
                  <div className="space-y-6">
                    {filteredActions.length === 0 && (
                      <p className="text-sm text-slate-600">
                        Aucune action ne correspond à vos critères pour le moment.
                      </p>
                    )}

                    {filteredActions.map((action: FilmAction, index: number) => (
                      <article
                        key={`${action.title}-${index}`}
                        className="relative rounded-3xl bg-white p-6 shadow-sm border border-blue-100"
                      >
                        <div className="absolute -left-7 top-6 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-french-blue shadow" aria-hidden />
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="space-y-3 md:max-w-3xl">
                            <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-wider">
                              <Clock className="h-4 w-4" aria-hidden />
                              {action.period}
                            </p>
                            <h3 className="text-xl font-semibold text-french-blue">
                              {action.title}
                            </h3>
                            <p className="text-sm text-slate-700">
                              {action.description}
                            </p>
                          </div>
                          <div className="flex flex-col gap-3 md:w-60">
                            <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${phaseColors[action.phase]}`}>
                              {action.phase}
                            </span>
                            <div className="rounded-2xl bg-blue-50/60 p-4 text-sm text-french-blue flex items-start gap-2">
                              <Users className="h-4 w-4 mt-0.5" aria-hidden />
                              <span>{action.actors}</span>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="table">
                <div className="rounded-3xl border border-blue-100 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <Table className="min-w-[640px]">
                      <TableHeader>
                        <TableRow className="bg-blue-50/80">
                          <TableHead className="text-slate-600">Période</TableHead>
                          <TableHead className="text-slate-600">Titre</TableHead>
                          <TableHead className="text-slate-600">Description</TableHead>
                          <TableHead className="text-slate-600">Acteurs</TableHead>
                          <TableHead className="text-slate-600">Phase</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredActions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="py-10 text-center text-slate-500">
                              Aucune action ne correspond à vos critères pour le moment.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredActions.map((action: FilmAction, index: number) => (
                            <TableRow key={`${action.title}-${index}`}>
                              <TableCell className="font-semibold text-slate-700">{action.period}</TableCell>
                              <TableCell className="font-semibold text-french-blue">{action.title}</TableCell>
                              <TableCell className="text-sm text-slate-700">{action.description}</TableCell>
                              <TableCell className="text-sm text-slate-600">{action.actors}</TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${phaseColors[action.phase]}`}>
                                  {action.phase}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="rounded-3xl border border-blue-200 bg-blue-50/70 p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-french-blue flex items-center gap-2">
                  <Layers className="h-5 w-5" aria-hidden />
                  Besoin d&apos;aide pour prioriser ?
                </h3>
                <p className="text-sm text-slate-700">
                  Partagez cette frise avec votre famille et votre professeur principal pour identifier les prochaines étapes.
                </p>
              </div>
              <Button asChild variant="outline" className="whitespace-nowrap">
                <Link to="/parcours-avenir">
                  Retour au Parcours Avenir
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FilmAnnuelLevel;

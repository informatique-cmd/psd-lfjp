import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, Info, LifeBuoy, Users } from 'lucide-react';
import { bacBlancSchedule } from '@/data/bacBlancSchedule';

const PlanificationBacBlanc = () => {
  return (
    <div className="min-h-screen flex flex-col font-raleway bg-gradient-to-b from-[#f5f7fb] via-white to-white">
      <Navbar showLogo={true} />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-[#0f2b5b] via-[#1f4d8f] to-[#0f2b5b] text-white">
          <div className="container mx-auto px-6 py-16 md:py-24">
            <div className="max-w-3xl space-y-6">
              <Badge className="bg-white/15 text-white backdrop-blur-sm border border-white/30">
                Planification des épreuves
              </Badge>
              <h1 className="text-3xl md:text-5xl font-playfair font-bold leading-tight">
                Organisation du bac blanc – session de décembre
              </h1>
              <p className="text-base md:text-lg text-white/80 leading-relaxed">
                Vue synthétique de l&apos;organisation de la journée du 10 décembre. Chaque carte détaille la
                surveillance principale, le support dédié et les consignes logistiques pour garantir une couverture complète
                des salles.
              </p>
            </div>
          </div>
        </section>

        {bacBlancSchedule.map((day) => (
          <section key={day.date} className="py-12 md:py-16">
            <div className="container mx-auto px-6 space-y-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="space-y-3">
                  <Badge variant="secondary" className="w-fit bg-[#e4edff] text-[#0f2b5b] border border-[#cfe0ff]">
                    <span className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {day.label}
                    </span>
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-playfair text-[#0f2b5b]">{day.focus}</h2>
                  {day.note && (
                    <p className="text-sm md:text-base text-slate-600 leading-relaxed flex items-start gap-2">
                      <Info size={18} className="mt-0.5 text-[#0f2b5b]" />
                      <span>{day.note}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {day.rooms.map((room) => (
                  <Card
                    key={`${day.date}-${room.room}`}
                    className="h-full border border-[#dbe5f5] shadow-[0_10px_30px_rgba(15,43,91,0.08)] hover:shadow-[0_16px_36px_rgba(15,43,91,0.12)] transition-all duration-300"
                  >
                    <CardHeader className="space-y-4 pb-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="border-[#0f2b5b] text-[#0f2b5b]">
                          Salle {room.room}
                        </Badge>
                        <Badge className="bg-[#0f2b5b] text-white">{room.examTitle}</Badge>
                      </div>
                      <CardTitle className="text-xl text-[#0f2b5b]">{room.leadExaminer}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-slate-600">
                        <Clock size={16} className="text-[#0f2b5b]" />
                        {room.examTime}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Surveillance</p>
                        <ul className="mt-3 space-y-2 text-sm text-slate-700">
                          {room.surveillanceTeam.map((name) => (
                            <li key={name} className="flex items-center gap-2">
                              <Users size={16} className="text-[#0f2b5b]" />
                              <span>{name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {room.supportTeam && (
                        <div className="rounded-2xl border border-[#cfe2ff] bg-[#f3f7ff] p-4">
                          <div className="flex items-center gap-2 text-sm font-semibold text-[#0f2b5b] uppercase tracking-wide">
                            <LifeBuoy size={16} />
                            Support
                          </div>
                          <p className="mt-2 text-sm text-slate-700 leading-relaxed">{room.supportTeam.mission}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {room.supportTeam.names.map((name) => (
                              <Badge
                                key={name}
                                variant="secondary"
                                className="border border-[#cfe2ff] bg-white text-[#0f2b5b]"
                              >
                                {name}
                              </Badge>
                            ))}
                          </div>
                          {room.supportTeam.presence && (
                            <p className="mt-3 text-xs text-slate-500 leading-relaxed">{room.supportTeam.presence}</p>
                          )}
                        </div>
                      )}

                      {room.notes && (
                        <div className="rounded-xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600">
                          <span className="font-semibold text-[#0f2b5b]">Note :</span> {room.notes}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>

      <Footer />
    </div>
  );
};

export default PlanificationBacBlanc;

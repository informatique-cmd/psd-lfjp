import React from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { BarChart3, GraduationCap, Target } from 'lucide-react';

interface ObjectifItem {
  content: React.ReactNode;
}

interface ActionItem {
  content: React.ReactNode;
  link?: string;
  linkAriaLabel?: string;
  linkIcon?: LucideIcon;
}

interface IndicatorItem {
  content: React.ReactNode;
}

interface ActionSection {
  title: string;
  items: ActionItem[];
}

interface SummaryObjectiveItem {
  icon: string;
  label: string;
}

interface SummaryIndicatorItem {
  label: string;
  value: string;
}

interface SummaryData {
  objectives?: SummaryObjectiveItem[];
  indicators?: SummaryIndicatorItem[];
}

interface PSDAxeLayoutProps {
  axeId?: number;
  title: string;
  subtitle: string;
  summary?: SummaryData;
  timeline?: React.ReactNode;
  objectifs: ObjectifItem[];
  actions?: ActionItem[];
  actionSections?: ActionSection[];
  indicators: IndicatorItem[];
}

const PSDAxeLayout: React.FC<PSDAxeLayoutProps> = ({
  axeId,
  title,
  subtitle,
  summary,
  timeline,
  objectifs,
  actions,
  actionSections,
  indicators
}) => {
  const sectionId = axeId ? `axe-${axeId}` : undefined;

  return (
    <section id={sectionId} className="space-y-10">
      <header className="space-y-3">
        <h3 className="text-xl font-playfair font-bold text-french-blue md:text-2xl">
          {title}
        </h3>
        <p className="text-lg font-medium font-raleway text-gray-800">
          {subtitle}
        </p>
      </header>

      {summary && (
        <div className="grid gap-6 md:grid-cols-3">
          {summary.objectives?.length ? (
            <article className="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-french-blue/10">
              <div className="mb-4 flex items-center gap-3">
                <span className="rounded-full bg-french-blue/10 p-2 text-french-blue">
                  <Target className="h-6 w-6" aria-hidden="true" />
                </span>
                <h4 className="text-lg font-semibold text-slate-900">Objectifs clés</h4>
              </div>
              <ul className="grid gap-2">
                {summary.objectives.map((item) => (
                  <li
                    key={item.label}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </article>
          ) : null}

          {summary.indicators?.length ? (
            <article className="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-french-blue/10">
              <div className="mb-4 flex items-center gap-3">
                <span className="rounded-full bg-french-blue/10 p-2 text-french-blue">
                  <BarChart3 className="h-6 w-6" aria-hidden="true" />
                </span>
                <h4 className="text-lg font-semibold text-slate-900">Indicateurs clés</h4>
              </div>
              <dl className="grid gap-3">
                {summary.indicators.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl bg-slate-100 px-3 py-2"
                  >
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {item.label}
                    </dt>
                    <dd className="text-base font-semibold text-slate-900">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ) : null}
        </div>
      )}

      {timeline}

      <section className="space-y-8">
        <div
          id={sectionId ? `${sectionId}-objectifs` : undefined}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h4 className="mb-3 text-lg font-semibold text-slate-900">Objectifs détaillés</h4>
          <ul className="list-disc space-y-2 pl-5 text-gray-700 font-raleway">
            {objectifs.map((item, index) => (
              <li key={index}>{item.content}</li>
            ))}
          </ul>
        </div>

        {(actionSections?.length ?? 0) > 0 ? (
          <div
            id={sectionId ? `${sectionId}-actions` : undefined}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h4 className="mb-3 text-lg font-semibold text-slate-900">Rubriques détaillées</h4>
            <ul className="space-y-6 font-raleway">
              {actionSections!.map((section, sectionIndex) => (
                <li key={sectionIndex} className="space-y-2">
                  <h5 className="text-base font-semibold text-french-blue">{section.title}</h5>
                  <ul className="space-y-2 list-disc list-outside pl-6 marker:text-slate-400">
                    {section.items.map((item, itemIndex) => {
                      if (!item.link) {
                        return (
                          <li key={itemIndex} className="text-gray-700">
                            {item.content}
                          </li>
                        );
                      }

                      const LinkIcon = item.linkIcon ?? GraduationCap;
                      const ariaLabel = item.linkAriaLabel ?? 'En savoir plus';
                      const isExternal = item.link.startsWith('http');
                      const linkClassName =
                        'ml-auto inline-flex shrink-0 items-center gap-2 rounded-full bg-french-blue px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-french-blue/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-french-blue/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:ml-0 sm:self-center';
                      const linkContent = (
                        <>
                          <LinkIcon className="h-4 w-4" aria-hidden="true" />
                          <span>En savoir plus</span>
                        </>
                      );

                      return (
                        <li key={itemIndex}>
                          <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                              <span className="text-gray-700 font-semibold">{item.content}</span>
                              <span
                                aria-hidden="true"
                                className="hidden h-1 flex-1 rounded-full bg-gradient-to-r from-french-blue via-french-blue/80 to-french-blue sm:block"
                              />
                            </div>
                            {isExternal ? (
                              <a
                                href={item.link}
                                className={linkClassName}
                                aria-label={ariaLabel}
                                target="_blank"
                                rel="noreferrer noopener"
                              >
                                {linkContent}
                              </a>
                            ) : (
                              <Link to={item.link} className={linkClassName} aria-label={ariaLabel}>
                                {linkContent}
                              </Link>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        ) : (actions?.length ?? 0) > 0 ? (
          <div
            id={sectionId ? `${sectionId}-actions` : undefined}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h4 className="mb-3 text-lg font-semibold text-slate-900">Rubriques détaillées</h4>
            <ul className="space-y-3 font-raleway list-disc list-outside pl-6 marker:text-slate-400">
              {actions!.map((item, index) => {
                if (!item.link) {
                  return (
                    <li key={index} className="text-gray-700">
                      {item.content}
                    </li>
                  );
                }

                const LinkIcon = item.linkIcon ?? GraduationCap;
                const ariaLabel = item.linkAriaLabel ?? 'En savoir plus';
                const isExternal = item.link.startsWith('http');
                const linkClassName =
                  'ml-auto inline-flex shrink-0 items-center gap-2 rounded-full bg-french-blue px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-french-blue/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-french-blue/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:ml-0 sm:self-center';
                const linkContent = (
                  <>
                    <LinkIcon className="h-4 w-4" aria-hidden="true" />
                    <span>En savoir plus</span>
                  </>
                );

                return (
                  <li key={index}>
                    <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <span className="text-gray-700 font-semibold">{item.content}</span>
                        <span
                          aria-hidden="true"
                          className="hidden h-1 flex-1 rounded-full bg-gradient-to-r from-french-blue via-french-blue/80 to-french-blue sm:block"
                        />
                      </div>
                      {isExternal ? (
                        <a
                          href={item.link}
                          className={linkClassName}
                          aria-label={ariaLabel}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          {linkContent}
                        </a>
                      ) : (
                        <Link to={item.link} className={linkClassName} aria-label={ariaLabel}>
                          {linkContent}
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        <div
          id={sectionId ? `${sectionId}-indicateurs` : undefined}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h4 className="mb-3 text-lg font-semibold text-slate-900">Indicateurs détaillés</h4>
          <ul className="list-disc space-y-2 pl-5 text-gray-700 font-raleway">
            {indicators.map((item, index) => (
              <li key={index}>{item.content}</li>
            ))}
          </ul>
        </div>
      </section>
    </section>
  );
};

export default PSDAxeLayout;

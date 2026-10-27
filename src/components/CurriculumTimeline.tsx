import React from 'react';

export interface TimelineStage {
  id: string;
  cycle: string;
  title: string;
  subtitle: string;
  pillLabel: string;
  dispositifs: string[];
}

interface CurriculumTimelineProps {
  stages: TimelineStage[];
  activeStageId: string;
  onStageSelect: (stageId: string) => void;
  onStageKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => void;
}

const CurriculumTimeline: React.FC<CurriculumTimelineProps> = ({
  stages,
  activeStageId,
  onStageSelect,
  onStageKeyDown
}) => {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="hidden md:block absolute left-0 right-0 top-10 h-px bg-slate-200"
      />

      <div
        role="list"
        className="flex flex-col gap-5 md:flex-row md:items-start md:gap-6 md:overflow-x-auto md:pb-6"
      >
        {stages.map((stage, index) => {
          const isActive = stage.id === activeStageId;

          return (
            <article
              key={stage.id}
              role="listitem"
              className="relative flex flex-col rounded-2xl bg-white shadow-md ring-1 ring-slate-200 transition-transform duration-300 ease-out focus-within:ring-2 focus-within:ring-french-blue md:flex-shrink-0 md:w-72"
            >
              <span
                aria-hidden
                className={`hidden md:block absolute left-1/2 top-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 transition-colors ${
                  isActive ? 'border-french-blue bg-french-blue' : 'border-slate-300 bg-white'
                }`}
              />

              <button
                id={`${stage.id}-trigger`}
                type="button"
                className={`flex flex-col gap-2 rounded-2xl px-5 py-6 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-french-blue focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                  isActive ? 'bg-blue-50 text-french-blue' : 'bg-white text-slate-800'
                }`}
                onClick={() => onStageSelect(stage.id)}
                onKeyDown={(event) => onStageKeyDown?.(event, index)}
                aria-expanded={isActive}
                aria-controls={`${stage.id}-details`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    {stage.cycle}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      isActive ? 'bg-french-blue text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {stage.pillLabel}
                  </span>
                </div>
                <p className="text-base font-semibold leading-snug">{stage.title}</p>
                <p className="text-sm text-slate-600">{stage.subtitle}</p>
              </button>

              <div
                id={`${stage.id}-details`}
                role="region"
                aria-labelledby={`${stage.id}-trigger`}
                aria-hidden={!isActive}
                className={`overflow-hidden px-5 transition-all duration-500 ease-in-out ${
                  isActive ? 'max-h-72 pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0'
                }`}
              >
                <div className="pt-2 text-sm text-slate-600">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Dispositifs phares
                  </h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {stage.dispositifs.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default CurriculumTimeline;

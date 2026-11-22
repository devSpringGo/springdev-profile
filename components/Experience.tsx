import React from 'react';
import { ChevronDown, GraduationCap } from 'lucide-react';
import { SectionId } from '../types';
import { JOURNEY } from '../data/profile';
import { Section, TagList } from './ui';

/** "Hành trình": các chặng nằm ngang theo thời gian (dọc trên điện thoại). */
const Experience: React.FC = () => {
  return (
    <Section id={SectionId.EXPERIENCE} eyebrow="Hành trình" title="Từ giảng đường tới bây giờ">
      <ol className="relative grid gap-10 border-l border-line pl-8 lg:grid-cols-4 lg:gap-6 lg:border-l-0 lg:pl-0">
        {/* Trục ngang trên màn hình lớn */}
        <span aria-hidden="true" className="absolute left-0 right-0 top-[7px] hidden h-px bg-line lg:block" />

        {JOURNEY.map((c) => (
          <li key={c.when} className="relative lg:pt-10">
            {/* Mốc trên trục */}
            <span
              aria-hidden="true"
              className={`absolute -left-[39px] top-1 h-3.5 w-3.5 rounded-full border-2 lg:left-0 lg:top-0 ${
                c.current ? 'border-accent bg-accent' : 'border-line bg-paper'
              }`}
            >
              {c.current && <span className="absolute inset-0 animate-ping rounded-full bg-accent/40" />}
            </span>

            <p className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted">
              {c.when}
              {c.current && (
                <span className="rounded-full bg-accent/10 px-2 py-0.5 normal-case tracking-normal text-accent">Bây giờ</span>
              )}
            </p>
            <h3 className="mt-2 text-lg font-semibold leading-snug">{c.title}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-accent">
              {c.kind === 'study' && <GraduationCap size={15} aria-hidden="true" />}
              {c.place}
            </p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{c.story}</p>

            {c.tags && <TagList items={c.tags} className="mt-4" />}

            {c.details && (
              <details className="group mt-4">
                <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-ink/80 hover:text-accent transition-colors [&::-webkit-details-marker]:hidden">
                  Chi tiết công việc
                  <ChevronDown size={15} className="transition-transform group-open:rotate-180" />
                </summary>
                <ul className="mt-3 space-y-1.5 rounded-2xl border border-line bg-surface p-4 text-sm leading-relaxed text-muted">
                  {c.details.map((d) => (
                    <li key={d} className="flex gap-2.5">
                      <span aria-hidden="true" className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-muted/60" />
                      {d}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </li>
        ))}
      </ol>
    </Section>
  );
};

export default Experience;

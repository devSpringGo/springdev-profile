import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SectionId } from '../types';
import { WORKS, Work } from '../data/profile';
import { Section, TagList } from './ui';

/* ---------- Hình minh hoạ thu nhỏ cho từng loại dự án (vẽ bằng CSS) ---------- */

const Bar: React.FC<{ w: string; tone?: 'line' | 'accent' | 'ink'; h?: string }> = ({ w, tone = 'line', h = 'h-1.5' }) => (
  <div
    className={`${h} rounded-full ${tone === 'accent' ? 'bg-accent/70' : tone === 'ink' ? 'bg-ink/25' : 'bg-line'}`}
    style={{ width: w }}
  />
);

const Frame: React.FC<{ children: React.ReactNode; chrome?: 'dots' | 'classic' | 'browser' }> = ({
  children,
  chrome = 'dots',
}) => (
  <div className="absolute inset-x-6 bottom-0 top-6 overflow-hidden rounded-t-lg border border-b-0 border-line bg-surface shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
    {chrome === 'classic' ? (
      <div className="flex h-5 items-center justify-between bg-accent/75 px-2">
        <Bar w="38%" tone="ink" h="h-1" />
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2 w-2 rounded-[2px] bg-surface/80" />
          ))}
        </div>
      </div>
    ) : (
      <div className="flex h-5 items-center gap-1 border-b border-line px-2">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-line" />
        ))}
        {chrome === 'browser' && <span className="ml-2 h-2.5 w-1/2 rounded-full bg-raised" />}
      </div>
    )}
    <div className="p-3">{children}</div>
  </div>
);

const Cover: React.FC<{ type: Work['cover'] }> = ({ type }) => {
  switch (type) {
    case 'modules':
      return (
        <Frame>
          <div className="flex gap-3">
            <div className="w-1/5 space-y-2 border-r border-line pr-3">
              <Bar w="100%" tone="accent" />
              <Bar w="80%" />
              <Bar w="90%" />
              <Bar w="70%" />
            </div>
            <div className="grid flex-1 grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-1.5 rounded-md border border-line p-2">
                  <span className={`block h-3 w-3 rounded ${i % 3 === 0 ? 'bg-accent/60' : 'bg-raised'}`} />
                  <Bar w="80%" />
                  <Bar w="55%" />
                </div>
              ))}
            </div>
          </div>
        </Frame>
      );
    case 'contract':
      return (
        <Frame>
          <div className="mx-auto w-4/5 space-y-1.5">
            <div className="mx-auto"><Bar w="45%" tone="ink" h="h-2" /></div>
            <Bar w="100%" />
            <Bar w="94%" />
            <Bar w="60%" />
            <div className="flex items-end justify-between pt-1">
              <Bar w="30%" />
              <svg viewBox="0 0 60 18" className="h-4 w-14 text-accent" fill="none" aria-hidden="true">
                <path d="M2 14 C 10 2, 14 18, 22 8 S 34 4, 38 12 S 50 6, 58 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </Frame>
      );
    case 'ledger':
      return (
        <Frame>
          <div className="flex gap-4">
            <div className="flex-1 space-y-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={`flex items-center gap-2 rounded px-1.5 py-1 ${i === 0 ? 'bg-raised' : ''}`}>
                  <Bar w="30%" tone={i === 0 ? 'ink' : 'line'} />
                  <Bar w="25%" />
                  <div className="ml-auto"><Bar w="2.2rem" tone={i === 0 ? 'ink' : i === 3 ? 'accent' : 'line'} /></div>
                </div>
              ))}
            </div>
            <div className="flex w-1/4 items-end gap-1.5 border-b border-l border-line pb-0.5 pl-1.5">
              {[45, 70, 55, 85].map((h, i) => (
                <span key={i} className={`flex-1 rounded-t-sm ${i === 3 ? 'bg-accent/70' : 'bg-line'}`} style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </Frame>
      );
    case 'desktop':
      return (
        <Frame chrome="classic">
          <div className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2">
            {[0, 1, 2].map((i) => (
              <React.Fragment key={i}>
                <Bar w="2.5rem" />
                <div className="h-3.5 rounded-sm border border-line bg-paper/60" />
              </React.Fragment>
            ))}
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <span className="h-4 w-12 rounded-sm border border-line" />
            <span className="h-4 w-12 rounded-sm bg-accent/70" />
          </div>
        </Frame>
      );
    case 'web':
    default:
      return (
        <Frame chrome="browser">
          <div className="flex gap-3">
            <span className="h-8 w-8 shrink-0 rounded-full bg-accent/50" />
            <div className="flex-1 space-y-1.5 pt-0.5">
              <Bar w="55%" tone="ink" h="h-2" />
              <Bar w="80%" />
              <Bar w="70%" />
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-6 rounded border border-line" />
            ))}
          </div>
        </Frame>
      );
  }
};

/* ---------- Thẻ dự án ---------- */

const Card: React.FC<{ w: Work; featured?: boolean }> = ({ w, featured }) => {
  const body = (
    <>
      <div
        className={`relative overflow-hidden bg-raised/70 bg-[radial-gradient(rgb(var(--ink)/0.07)_1px,transparent_1px)] [background-size:14px_14px] ${
          featured ? 'h-56 border-b border-line md:h-auto md:min-h-[17rem] md:w-3/5 md:border-b-0 md:border-r' : 'h-40 border-b border-line'
        }`}
      >
        <Cover type={w.cover} />
      </div>
      <div className={`flex flex-1 flex-col ${featured ? 'p-6 sm:p-8 md:justify-center' : 'p-5'}`}>
        {featured && (
          <span className="mb-3 w-fit rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">Đang làm</span>
        )}
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{w.org}</p>
        <h3
          className={`mt-1.5 flex items-center gap-1.5 font-semibold leading-snug group-hover:text-accent transition-colors ${
            featured ? 'text-2xl font-bold tracking-tight' : ''
          }`}
        >
          {w.title}
          {w.url && <ArrowUpRight size={16} className="shrink-0" aria-hidden="true" />}
        </h3>
        <p className={`mt-2 flex-1 leading-relaxed text-muted ${featured ? 'md:flex-none' : 'text-sm'}`}>{w.description}</p>
        <TagList items={w.stack} className="mt-4" />
      </div>
    </>
  );

  const cls = `group flex h-full overflow-hidden rounded-3xl border border-line bg-surface transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg hover:shadow-black/5 ${
    featured ? 'flex-col md:flex-row' : 'flex-col'
  }`;

  return w.url ? (
    <a href={w.url} target="_blank" rel="noreferrer" className={cls}>
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
};

const Projects: React.FC = () => {
  const [featured, ...rest] = WORKS;
  return (
    <Section
      id={SectionId.PROJECTS}
      eyebrow="Dự án"
      title="Những thứ mình đã làm"
      intro="Phần lớn là phần mềm nội bộ nên không có bản demo công khai. Nếu bạn tò mò, cứ hỏi, mình rất sẵn lòng kể chi tiết."
    >
      {featured && <Card w={featured} featured />}
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {rest.map((w) => (
          <li key={w.title}>
            <Card w={w} />
          </li>
        ))}
      </ul>
    </Section>
  );
};

export default Projects;

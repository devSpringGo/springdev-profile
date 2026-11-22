import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { SectionId } from '../types';
import { WORKS, Work } from '../data/profile';
import { Section, TagList } from './ui';

/* ---------- Hình minh hoạ thu nhỏ cho từng dự án (vẽ bằng CSS) ---------- */

const Bar: React.FC<{ w: string; tone?: 'line' | 'accent' | 'ink'; h?: string }> = ({ w, tone = 'line', h = 'h-1.5' }) => (
  <div
    className={`${h} shrink-0 rounded-full ${tone === 'accent' ? 'bg-accent/70' : tone === 'ink' ? 'bg-ink/25' : 'bg-line'}`}
    style={{ width: w }}
  />
);

const Frame: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({ children, dark }) => (
  <div
    className={`absolute inset-x-6 bottom-0 top-6 overflow-hidden rounded-t-lg border border-b-0 shadow-sm transition-transform duration-300 group-hover:-translate-y-1 ${
      dark ? 'border-slate-700 bg-slate-900' : 'border-line bg-surface'
    }`}
  >
    <div className={`flex h-5 items-center gap-1 border-b px-2 ${dark ? 'border-slate-700' : 'border-line'}`}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={`h-1.5 w-1.5 rounded-full ${dark ? 'bg-slate-600' : 'bg-line'}`} />
      ))}
    </div>
    <div className="p-3">{children}</div>
  </div>
);

const Pill: React.FC<{ tone: 'ok' | 'warn' | 'off' }> = ({ tone }) => (
  <span
    className={`ml-auto h-2.5 w-9 shrink-0 rounded-full ${
      tone === 'ok' ? 'bg-emerald-500/60' : tone === 'warn' ? 'bg-amber-400/70' : 'bg-line'
    }`}
  />
);

const Cover: React.FC<{ type: Work['cover'] }> = ({ type }) => {
  switch (type) {
    /* Danh sách thiết bị + trạng thái */
    case 'devices':
      return (
        <Frame>
          <div className="mb-2.5 flex items-center gap-2">
            <Bar w="28%" tone="ink" h="h-2" />
            <span className="ml-auto h-4 w-14 rounded bg-accent/70" />
          </div>
          <div className="space-y-1.5">
            {(['ok', 'ok', 'warn', 'ok', 'off', 'ok'] as const).map((t, i) => (
              <div key={i} className={`flex items-center gap-2.5 rounded-md px-1.5 py-1 ${i === 2 ? 'bg-raised' : ''}`}>
                <span className={`h-4 w-4 shrink-0 rounded ${i % 3 === 0 ? 'bg-accent/40' : 'bg-raised ring-1 ring-line'}`} />
                <Bar w={`${30 + ((i * 13) % 25)}%`} />
                <Bar w="14%" />
                <Pill tone={t} />
              </div>
            ))}
          </div>
        </Frame>
      );

    /* Bảng công việc + vòng điểm KPI */
    case 'kpi':
      return (
        <Frame>
          <div className="flex gap-3">
            <div className="grid flex-1 grid-cols-3 gap-2">
              {[3, 2, 2].map((n, col) => (
                <div key={col} className="space-y-1.5 rounded-md bg-raised p-1.5">
                  <Bar w="60%" tone={col === 2 ? 'accent' : 'ink'} h="h-1" />
                  {Array.from({ length: n }).map((_, i) => (
                    <div key={i} className="space-y-1 rounded border border-line bg-surface p-1.5">
                      <Bar w="85%" />
                      <Bar w="50%" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="flex w-[30%] flex-col items-center justify-center gap-2">
              <div
                className="grid h-16 w-16 place-items-center rounded-full"
                style={{ background: 'conic-gradient(rgb(var(--accent)) 0 82%, rgb(var(--line)) 82% 100%)' }}
              >
                <span className="grid h-12 w-12 place-items-center rounded-full bg-surface text-sm font-bold text-accent">
                  82
                </span>
              </div>
              <Bar w="70%" />
            </div>
          </div>
        </Frame>
      );

    /* Phễu khách hàng tiềm năng + trăng Trung thu */
    case 'leads':
      return (
        <Frame>
          <div className="relative flex gap-3">
            <div className="flex flex-1 flex-col items-center gap-1.5 pt-1">
              {[100, 80, 58, 38].map((w, i) => (
                <div
                  key={i}
                  className="flex h-5 items-center justify-center rounded"
                  style={{ width: `${w}%`, background: `rgb(var(--accent) / ${0.25 + i * 0.18})` }}
                >
                  <Bar w="30%" tone="ink" h="h-1" />
                </div>
              ))}
            </div>
            <div className="w-[34%] space-y-1.5 pt-1">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="h-3.5 w-3.5 shrink-0 rounded-full bg-raised ring-1 ring-line" />
                  <Bar w={`${55 + ((i * 17) % 35)}%`} />
                </div>
              ))}
            </div>
            {/* Trăng và đèn lồng */}
            <span className="absolute -right-1 -top-1 h-6 w-6 rounded-full bg-amber-300/80 shadow-[0_0_14px_rgba(252,211,77,0.7)]" />
            <span className="absolute right-7 top-0 flex flex-col items-center">
              <span className="h-2 w-px bg-line" />
              <span className="h-3 w-2.5 rounded-sm bg-red-500/70" />
            </span>
          </div>
        </Frame>
      );

    /* Lưới màn hình camera */
    case 'camera':
      return (
        <Frame dark>
          <div className="grid grid-cols-3 gap-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`relative h-12 overflow-hidden rounded-sm ${i === 1 ? 'ring-1 ring-accent' : ''}`}
                style={{
                  background: `linear-gradient(${135 + i * 20}deg, rgb(51 65 85), rgb(${30 + i * 4} ${41 + i * 3} 59))`,
                }}
              >
                <span className="absolute left-1 top-1 h-1 w-1 animate-pulse rounded-full bg-red-500" />
                <span className="absolute bottom-1 left-1 h-1 w-6 rounded-full bg-slate-400/50" />
                <span className="absolute bottom-0 right-2 h-4 w-5 rounded-t bg-slate-500/40" />
              </div>
            ))}
          </div>
        </Frame>
      );

    /* Văn bản → sóng âm, chọn giọng */
    case 'tts':
    default:
      return (
        <Frame>
          <div className="space-y-1.5">
            <Bar w="92%" />
            <Bar w="80%" />
            <Bar w="55%" />
          </div>
          <div className="mt-3 flex h-10 items-center gap-[3px]">
            {Array.from({ length: 44 }).map((_, i) => {
              const h = 18 + Math.abs(Math.sin(i * 0.55) * 60 + Math.sin(i * 1.7) * 22);
              return (
                <span
                  key={i}
                  className={`w-[3px] shrink-0 rounded-full ${i < 26 ? 'bg-accent/80' : 'bg-line'}`}
                  style={{ height: `${Math.min(h, 100)}%` }}
                />
              );
            })}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-accent">
              <span className="ml-0.5 h-0 w-0 border-y-[4px] border-l-[6px] border-y-transparent border-l-white" />
            </span>
            <span className="flex h-5 items-center gap-1.5 rounded-full border border-line px-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <Bar w="2.5rem" h="h-1" tone="ink" />
            </span>
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
        <p className="text-xs font-medium uppercase tracking-wide text-accent">{w.category}</p>
        <h3
          className={`mt-1.5 flex items-start gap-1.5 font-semibold leading-snug group-hover:text-accent transition-colors ${
            featured ? 'text-2xl font-bold tracking-tight' : ''
          }`}
        >
          {w.title}
          {w.url && <ArrowUpRight size={16} className="mt-1 shrink-0" aria-hidden="true" />}
        </h3>
        {w.org && <p className="mt-1 text-sm text-muted">{w.org}</p>}
        <p className={`mt-2 leading-relaxed text-muted ${featured ? '' : 'flex-1 text-sm'}`}>{w.description}</p>
        {w.highlight && (
          <p className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            <Sparkles size={13} aria-hidden="true" /> {w.highlight}
          </p>
        )}
        {w.stack.length > 0 && <TagList items={w.stack} className="mt-4" />}
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

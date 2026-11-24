import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../lib/theme';

export const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">{children}</li>
);

export const TagList: React.FC<{ items: string[]; className?: string }> = ({ items, className = '' }) => (
  <ul className={`flex flex-wrap gap-1.5 ${className}`} aria-label="Công nghệ">
    {items.map((t) => (
      <Tag key={t}>{t}</Tag>
    ))}
  </ul>
);

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
      title={dark ? 'Giao diện sáng' : 'Giao diện tối'}
      className={`grid h-9 w-9 place-items-center rounded-full border border-line bg-surface/70 backdrop-blur text-muted hover:text-ink hover:bg-raised transition-colors ${className}`}
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};

/** Ô (card) dùng chung cho lưới "Về mình". */
export const Tile: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`rounded-3xl border border-line bg-surface p-6 sm:p-7 ${className}`}>{children}</div>
);

type SectionProps = {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
};

/**
 * Khung chiều rộng chung của trang chủ (menu, màn hình mở đầu, các mục, chân trang).
 * Rộng dần theo màn hình: 1152px → 1280px (màn ≥ 1280px) → 1440px (màn ≥ 1536px).
 * Muốn rộng / hẹp hơn: sửa ở đây.
 */
export const CONTAINER = 'mx-auto w-full max-w-6xl px-6 sm:px-10 xl:max-w-7xl 2xl:max-w-[90rem] 2xl:px-14';

/** Một mục toàn chiều rộng ở trang chủ. */
export const Section: React.FC<SectionProps> = ({ id, eyebrow, title, intro, action, children }) => (
  <section id={id} className="scroll-mt-16 py-20 md:py-24">
    <div className={CONTAINER}>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-accent">{eyebrow}</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
          {intro && <p className="mt-4 text-lg leading-relaxed text-muted">{intro}</p>}
        </div>
        {action}
      </div>
      <div className="mt-10 md:mt-12">{children}</div>
    </div>
  </section>
);

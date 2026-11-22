import React from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { SectionId } from '../types';
import { PROFILE } from '../data/profile';

/** Màn hình mở đầu toàn chiều rộng, nằm trên tranh phong cảnh nền. */
const Hero: React.FC = () => {
  return (
    <section id="home" className="on-photo relative flex min-h-[92vh] items-center">
      <div className="mx-auto w-full max-w-6xl px-6 pb-36 pt-32 sm:px-10">
        <div className="flex items-center gap-3">
          <img
            src={PROFILE.avatar}
            alt={`Ảnh chân dung ${PROFILE.name}`}
            className="h-14 w-14 rounded-full object-cover object-top ring-4 ring-surface/80 shadow-md"
          />
          <div className="leading-tight">
            <p className="font-semibold">{PROFILE.name}</p>
            <p className="text-sm text-muted">{PROFILE.role} · Đà Nẵng</p>
          </div>
        </div>

        <h1 className="mt-10 max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          Xin chào, mình là <span className="text-accent">{PROFILE.shortName}</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/80 sm:text-xl">{PROFILE.tagline}</p>

        <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1.5 text-sm text-muted backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          {PROFILE.status}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href={`#${SectionId.PROJECTS}`}
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper hover:bg-ink/85 transition-colors"
          >
            Xem dự án <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#/blog"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-6 py-3 text-sm font-semibold backdrop-blur hover:border-muted/50 transition-colors"
          >
            Đọc blog
          </a>
        </div>
      </div>

      <a
        href={`#${SectionId.ABOUT}`}
        aria-label="Cuộn xuống"
        className="absolute bottom-16 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-muted hover:text-ink transition-colors sm:flex"
      >
        Cuộn xuống
        <ArrowDown size={16} className="animate-bounce" />
      </a>
    </section>
  );
};

export default Hero;

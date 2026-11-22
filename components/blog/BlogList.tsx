import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { allTags, formatDate, posts } from '../../data/posts';

const BlogList: React.FC = () => {
  const [tag, setTag] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(
      (p) =>
        (!tag || p.tags.includes(tag)) &&
        (!q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q))
    );
  }, [tag, query]);

  const byYear = useMemo(() => {
    const groups: { year: string; items: typeof posts }[] = [];
    filtered.forEach((p) => {
      const year = p.date.slice(0, 4);
      const g = groups.find((x) => x.year === year);
      if (g) g.items.push(p);
      else groups.push({ year, items: [p] });
    });
    return groups;
  }, [filtered]);

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
      active ? 'border-ink bg-ink text-paper' : 'border-line bg-surface text-muted hover:text-ink hover:border-muted/50'
    }`;

  return (
    <div className="mx-auto max-w-3xl px-6 py-14 sm:px-10 sm:py-20">
      <header>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Bài viết</h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
          Nơi mình ghi lại chuyện .NET, SQL Server và những điều học được khi làm phần mềm cho doanh nghiệp.
        </p>
      </header>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Lọc theo chủ đề">
          <button type="button" onClick={() => setTag(null)} className={chip(tag === null)} aria-pressed={tag === null}>
            Tất cả
          </button>
          {allTags.map((t) => (
            <button key={t} type="button" onClick={() => setTag(t)} className={chip(tag === t)} aria-pressed={tag === t}>
              {t}
            </button>
          ))}
        </div>
        <label className="relative sm:w-56">
          <span className="sr-only">Tìm bài viết</span>
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm bài viết..."
            className="field !py-2 !pl-9 text-sm"
          />
        </label>
      </div>

      {byYear.length === 0 ? (
        <p className="mt-16 text-center text-muted">Không tìm thấy bài viết phù hợp.</p>
      ) : (
        byYear.map((g) => (
          <section key={g.year} className="mt-14">
            <h2 className="border-b border-line pb-3 font-mono text-sm text-muted">{g.year}</h2>
            <ul>
              {g.items.map((p) => (
                <li key={p.slug} className="border-b border-line">
                  <a href={`#/blog/${p.slug}`} className="group grid gap-1 py-7 sm:grid-cols-[7.5rem_1fr] sm:gap-6">
                    <time dateTime={p.date} className="pt-1 text-sm text-muted">
                      {formatDate(p.date)}
                    </time>
                    <div>
                      <h3 className="text-lg font-semibold leading-snug group-hover:text-accent transition-colors">
                        {p.title}
                      </h3>
                      <p className="mt-2 leading-relaxed text-muted">{p.excerpt}</p>
                      <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                        <span>{p.readingMinutes} phút đọc</span>
                        {p.tags.map((t) => (
                          <span key={t} className="font-medium text-accent">
                            #{t}
                          </span>
                        ))}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
};

export default BlogList;

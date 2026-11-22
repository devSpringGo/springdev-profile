import React from 'react';
import { ArrowRight } from 'lucide-react';
import { formatDate, postPath, posts } from '../data/posts';
import { Section } from './ui';

const BlogPreview: React.FC = () => {
  const latest = posts.slice(0, 3);

  return (
    <Section
      id="blog"
      eyebrow="Blog"
      title="Ghi chép gần đây"
      action={
        <a
          href="/blog"
          className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-accent/50 hover:text-accent transition-colors"
        >
          Tất cả bài viết <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </a>
      }
    >
      {latest.length === 0 ? (
        <p className="text-muted">Bài viết đầu tiên đang được viết.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-3">
          {latest.map((p, i) => (
            <li key={p.slug}>
              <a
                href={postPath(p.slug)}
                className="group flex h-full flex-col rounded-3xl border border-line bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg hover:shadow-black/5 sm:p-7"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {i === 0 && (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-surface">Mới nhất</span>
                  )}
                  {p.tags.slice(0, 2).map((t) => (
                    <span key={t} className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="mt-4 text-lg font-bold leading-snug tracking-tight group-hover:text-accent transition-colors">
                  {p.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{p.excerpt}</p>
                <p className="mt-6 flex items-center justify-between text-xs text-muted">
                  <span>
                    {formatDate(p.date)} · {p.readingMinutes} phút đọc
                  </span>
                  <ArrowRight size={15} className="text-accent transition-transform group-hover:translate-x-1" />
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
};

export default BlogPreview;

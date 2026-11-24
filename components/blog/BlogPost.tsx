import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Clock, ListTree } from 'lucide-react';
import { formatDate, postPath, posts } from '../../data/posts';
import { PROFILE } from '../../data/profile';
import { SITE } from '../../lib/blog';
import { parseBlocks, tableOfContents, type TocItem } from '../../lib/markdown';
import Markdown from './Markdown';

/* ---------------- Thanh tiến độ đọc ---------------- */

const ReadingProgress: React.FC<{ target: React.RefObject<HTMLElement> }> = ({ target }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = target.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      setProgress(total <= 0 ? 1 : Math.min(1, Math.max(0, -rect.top / total)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [target]);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[3px]" role="progressbar" aria-label="Tiến độ đọc" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
      <div className="h-full origin-left bg-accent transition-transform duration-75" style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
};

/* ---------------- Mục lục ---------------- */

/** Mục đang đọc: tiêu đề cuối cùng đã cuộn qua mép trên màn hình. */
const useActiveHeading = (ids: string[]) => {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!ids.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [ids]);

  return active;
};

const TocList: React.FC<{ items: TocItem[]; active: string | null; onPick?: () => void }> = ({ items, active, onPick }) => (
  <ol className="space-y-1 text-sm">
    {items.map((it) => (
      <li key={it.id} className={it.level === 3 ? 'pl-4' : ''}>
        <a
          href={`#${it.id}`}
          onClick={onPick}
          aria-current={active === it.id ? 'location' : undefined}
          className={`block border-l-2 py-1 pl-3 leading-snug transition-colors ${
            active === it.id ? 'border-accent font-medium text-accent' : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          {it.text}
        </a>
      </li>
    ))}
  </ol>
);

/* ---------------- Thẻ meta (cho lúc chuyển trang trong ứng dụng) ---------------- */

const setMeta = (selector: string, attr: 'content' | 'href', value: string) =>
  document.head.querySelector(selector)?.setAttribute(attr, value);

const applyMeta = (title: string, description: string, url: string) => {
  document.title = title;
  setMeta('meta[name="description"]', 'content', description);
  setMeta('link[rel="canonical"]', 'href', url);
  setMeta('meta[property="og:url"]', 'content', url);
  setMeta('meta[property="og:title"]', 'content', title);
  setMeta('meta[property="og:description"]', 'content', description);
};

/** Đặt tiêu đề / mô tả trang khi đang mở; rời trang thì trả về thông tin của trang chủ. */
export const usePageMeta = (title: string | null, description: string, url: string) => {
  useEffect(() => {
    if (!title) return;
    applyMeta(title, description, url);
    return () => applyMeta(SITE.title, SITE.description, `${SITE.url}/`);
  }, [title, description, url]);
};

/* ---------------- Trang bài viết ---------------- */

const BlogPost: React.FC<{ slug: string }> = ({ slug }) => {
  const index = posts.findIndex((p) => p.slug === slug);
  const post = posts[index];
  const articleRef = useRef<HTMLElement>(null);

  const blocks = useMemo(() => (post ? parseBlocks(post.content) : []), [post]);
  const toc = useMemo(() => tableOfContents(blocks), [blocks]);
  const showToc = toc.length >= 3;
  const ids = useMemo(() => (showToc ? toc.map((t) => t.id) : []), [toc, showToc]);
  const active = useActiveHeading(ids);
  const [tocOpen, setTocOpen] = useState(false);

  usePageMeta(
    post ? `${post.title} — ${SITE.brand}` : null,
    post?.excerpt || SITE.description,
    SITE.url + postPath(slug)
  );

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center sm:px-10">
        <h1 className="text-2xl font-bold">Không tìm thấy bài viết</h1>
        <p className="mt-3 text-muted">Bài viết có thể đã được đổi tên hoặc gỡ xuống.</p>
        <a href="/blog" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent">
          <ArrowLeft size={16} /> Về danh sách bài viết
        </a>
      </div>
    );
  }

  const newer = posts[index - 1];
  const older = posts[index + 1];

  return (
    <article ref={articleRef} className="mx-auto max-w-3xl px-6 py-12 sm:px-10 sm:py-16">
      <ReadingProgress target={articleRef} />

      <a href="/blog" className="group inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink transition-colors">
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" /> Tất cả bài viết
      </a>

      <header className="mt-10 border-b border-line pb-10">
        <ul className="flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <li key={t} className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
              {t}
            </li>
          ))}
        </ul>
        <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-[2.75rem]">{post.title}</h1>
        {post.excerpt && <p className="mt-5 text-lg leading-relaxed text-muted">{post.excerpt}</p>}
        <div className="mt-8 flex items-center gap-3">
          <img src={PROFILE.avatar} alt="" className="h-10 w-10 rounded-full object-cover object-top" />
          <div className="text-sm">
            <p className="font-semibold">{PROFILE.name}</p>
            <p className="flex items-center gap-2 text-muted">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock size={13} /> {post.readingMinutes} phút đọc
              </span>
            </p>
          </div>
        </div>
      </header>

      {showToc && (
        // Màn hình nhỏ: mục lục thu gọn ở đầu bài
        <details
          open={tocOpen}
          onToggle={(e) => setTocOpen((e.currentTarget as HTMLDetailsElement).open)}
          className="mt-8 rounded-xl border border-line bg-surface xl:hidden"
        >
          <summary className="flex cursor-pointer select-none items-center gap-2 px-5 py-3.5 text-sm font-semibold">
            <ListTree size={16} className="text-muted" /> Mục lục
            <span className="ml-auto text-xs font-normal text-muted">{toc.length} mục</span>
          </summary>
          <nav aria-label="Mục lục" className="border-t border-line px-3 py-3">
            <TocList items={toc} active={active} onPick={() => setTocOpen(false)} />
          </nav>
        </details>
      )}

      <div className="relative mt-10">
        <Markdown blocks={blocks} />

        {showToc && (
          // Màn hình rộng: mục lục dính bên phải bài
          <aside className="absolute inset-y-0 left-full ml-10 hidden w-56 xl:block">
            <nav aria-label="Mục lục" className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
                <ListTree size={14} /> Mục lục
              </p>
              <TocList items={toc} active={active} />
            </nav>
          </aside>
        )}
      </div>

      <aside className="mt-16 flex flex-col gap-5 rounded-2xl border border-line bg-surface p-6 sm:flex-row sm:items-center">
        <img src={PROFILE.avatar} alt="" className="h-14 w-14 rounded-full object-cover object-top" />
        <div className="flex-1">
          <p className="font-semibold">{PROFILE.name}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Lập trình viên ở Đà Nẵng, làm phần mềm nội bộ với .NET và SQL Server. Có câu hỏi về bài viết? Cứ nhắn mình.
          </p>
        </div>
        <a
          href="/#contact"
          className="shrink-0 rounded-lg bg-ink px-4 py-2.5 text-center text-sm font-medium text-paper hover:bg-ink/85 transition-colors"
        >
          Liên hệ
        </a>
      </aside>

      {(newer || older) && (
        <nav aria-label="Bài viết khác" className="mt-10 grid gap-4 sm:grid-cols-2">
          {older ? (
            <a href={postPath(older.slug)} className="group rounded-xl border border-line p-5 hover:border-accent/50 transition-colors">
              <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                <ArrowLeft size={13} /> Bài trước
              </span>
              <span className="mt-2 block font-semibold leading-snug group-hover:text-accent transition-colors">{older.title}</span>
            </a>
          ) : (
            <span />
          )}
          {newer && (
            <a href={postPath(newer.slug)} className="group rounded-xl border border-line p-5 text-right hover:border-accent/50 transition-colors">
              <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                Bài tiếp theo <ArrowRight size={13} />
              </span>
              <span className="mt-2 block font-semibold leading-snug group-hover:text-accent transition-colors">{newer.title}</span>
            </a>
          )}
        </nav>
      )}
    </article>
  );
};

export default BlogPost;

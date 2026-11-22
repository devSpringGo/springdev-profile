import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { formatDate, posts } from '../../data/posts';
import { PROFILE } from '../../data/profile';
import Markdown from './Markdown';

const BlogPost: React.FC<{ slug: string }> = ({ slug }) => {
  const index = posts.findIndex((p) => p.slug === slug);
  const post = posts[index];

  useEffect(() => {
    const prev = document.title;
    if (post) document.title = `${post.title} — ${PROFILE.name}`;
    return () => {
      document.title = prev;
    };
  }, [post]);

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center sm:px-10">
        <h1 className="text-2xl font-bold">Không tìm thấy bài viết</h1>
        <p className="mt-3 text-muted">Bài viết có thể đã được đổi tên hoặc gỡ xuống.</p>
        <a href="#/blog" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent">
          <ArrowLeft size={16} /> Về danh sách bài viết
        </a>
      </div>
    );
  }

  const newer = posts[index - 1];
  const older = posts[index + 1];

  return (
    <article className="mx-auto max-w-3xl px-6 py-12 sm:px-10 sm:py-16">
      <a href="#/blog" className="group inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink transition-colors">
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

      <div className="mt-10">
        <Markdown source={post.content} />
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
          href="#contact"
          className="shrink-0 rounded-lg bg-ink px-4 py-2.5 text-center text-sm font-medium text-paper hover:bg-ink/85 transition-colors"
        >
          Liên hệ
        </a>
      </aside>

      {(newer || older) && (
        <nav aria-label="Bài viết khác" className="mt-10 grid gap-4 sm:grid-cols-2">
          {older ? (
            <a href={`#/blog/${older.slug}`} className="group rounded-xl border border-line p-5 hover:border-accent/50 transition-colors">
              <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                <ArrowLeft size={13} /> Bài trước
              </span>
              <span className="mt-2 block font-semibold leading-snug group-hover:text-accent transition-colors">{older.title}</span>
            </a>
          ) : (
            <span />
          )}
          {newer && (
            <a href={`#/blog/${newer.slug}`} className="group rounded-xl border border-line p-5 text-right hover:border-accent/50 transition-colors">
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

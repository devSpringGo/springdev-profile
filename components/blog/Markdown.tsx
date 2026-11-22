import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { type Block, parseBlocks, parseInline, safeUrl } from '../../lib/markdown';

/**
 * Hiển thị bài viết Markdown. Quy tắc cú pháp nằm ở lib/markdown.ts.
 * Có thể truyền sẵn `blocks` (đã phân tích) để khỏi phân tích lại.
 */

const inline = (text: string, keyBase: string): React.ReactNode[] =>
  parseInline(text).map((t, i) => {
    const key = `${keyBase}-${i}`;
    switch (t.type) {
      case 'text':
        return t.text;
      case 'code':
        return (
          <code key={key} className="rounded-md border border-line bg-raised px-1.5 py-0.5 font-mono text-[0.85em] text-ink">
            {t.text}
          </code>
        );
      case 'strong':
        return (
          <strong key={key} className="font-semibold text-ink">
            {t.text}
          </strong>
        );
      case 'image': {
        const src = safeUrl(t.src);
        return src ? <img key={key} src={src} alt={t.alt} loading="lazy" className="inline-block max-h-[1.5em] align-middle" /> : null;
      }
      case 'link': {
        const href = safeUrl(t.href);
        if (!href) return t.text;
        const external = /^https?:/.test(href);
        return (
          <a
            key={key}
            href={href}
            {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
            className="font-medium text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
          >
            {t.text}
          </a>
        );
      }
    }
  });

/* ---------------- Khối code: tô màu + nút chép ---------------- */

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Trình duyệt cũ / trang không chạy https: dùng cách cũ
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
};

const CodeBlock: React.FC<{ code: string; lang: string }> = ({ code, lang }) => {
  const [html, setHtml] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>();

  useEffect(() => {
    let alive = true;
    if (lang) {
      import('../../lib/highlight')
        .then(({ highlight }) => alive && setHtml(highlight(code, lang)))
        .catch(() => undefined);
    }
    return () => {
      alive = false;
    };
  }, [code, lang]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onCopy = async () => {
    await copyText(code);
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-raised">
      <figcaption className="flex items-center justify-between border-b border-line py-1.5 pl-4 pr-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted">{lang || 'code'}</span>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted hover:bg-paper hover:text-ink transition-colors"
          aria-label={copied ? 'Đã chép code' : 'Chép code'}
        >
          {copied ? <Check size={13} className="text-accent" /> : <Copy size={13} />}
          <span aria-live="polite">{copied ? 'Đã chép' : 'Chép'}</span>
        </button>
      </figcaption>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        {html ? (
          <code className="hljs font-mono text-ink" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <code className="font-mono text-ink">{code}</code>
        )}
      </pre>
    </figure>
  );
};

/* ---------------- Bảng, ảnh ---------------- */

const alignCls = { left: 'text-left', center: 'text-center', right: 'text-right' } as const;

const Table: React.FC<{ block: Extract<Block, { type: 'table' }>; k: number }> = ({ block, k }) => (
  <div className="overflow-x-auto rounded-xl border border-line">
    <table className="w-full border-collapse text-left text-[0.9375rem] leading-relaxed">
      <thead className="bg-raised">
        <tr>
          {block.header.map((h, c) => (
            <th key={c} scope="col" className={`border-b border-line px-4 py-2.5 font-semibold text-ink ${alignCls[block.align[c] ?? 'left']}`}>
              {inline(h, `th${k}-${c}`)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {block.rows.map((row, r) => (
          <tr key={r} className="border-b border-line last:border-0">
            {row.map((cell, c) => (
              <td key={c} className={`px-4 py-2.5 align-top ${alignCls[block.align[c] ?? 'left']}`}>
                {inline(cell, `td${k}-${r}-${c}`)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Figure: React.FC<{ block: Extract<Block, { type: 'image' }> }> = ({ block }) => {
  const src = safeUrl(block.src);
  if (!src) return null;
  const caption = block.title || block.alt;
  return (
    <figure className="my-8">
      <img src={src} alt={block.alt} loading="lazy" decoding="async" className="mx-auto max-h-[70vh] w-auto max-w-full rounded-xl border border-line" />
      {caption && <figcaption className="mt-3 text-center text-sm text-muted">{caption}</figcaption>}
    </figure>
  );
};

/* ---------------- Toàn bài ---------------- */

const renderBlock = (b: Block, k: number): React.ReactNode => {
  switch (b.type) {
    case 'code':
      return <CodeBlock key={k} code={b.code} lang={b.lang} />;
    case 'heading':
      return b.level === 2 ? (
        <h2 key={k} id={b.id} className="scroll-mt-24 pt-6 text-xl font-bold tracking-tight text-ink sm:text-2xl">
          {inline(b.text, `h${k}`)}
        </h2>
      ) : (
        <h3 key={k} id={b.id} className="scroll-mt-24 pt-2 text-lg font-semibold tracking-tight text-ink">
          {inline(b.text, `h${k}`)}
        </h3>
      );
    case 'quote':
      return (
        <blockquote key={k} className="border-l-2 border-accent pl-5 text-lg font-medium italic text-ink">
          {inline(b.text, `q${k}`)}
        </blockquote>
      );
    case 'list': {
      const List = b.ordered ? 'ol' : 'ul';
      return (
        <List key={k} className={`space-y-2 pl-5 ${b.ordered ? 'list-decimal' : 'list-disc'} marker:text-muted`}>
          {b.items.map((it, j) => (
            <li key={j} className="pl-1">
              {inline(it, `l${k}-${j}`)}
            </li>
          ))}
        </List>
      );
    }
    case 'table':
      return <Table key={k} block={b} k={k} />;
    case 'image':
      return <Figure key={k} block={b} />;
    case 'paragraph':
      return <p key={k}>{inline(b.text, `p${k}`)}</p>;
  }
};

const Markdown: React.FC<{ source?: string; blocks?: Block[] }> = ({ source = '', blocks }) => {
  const list = blocks ?? parseBlocks(source);
  return <div className="space-y-5 text-[1.0625rem] leading-[1.8] text-ink/80">{list.map(renderBlock)}</div>;
};

export default Markdown;

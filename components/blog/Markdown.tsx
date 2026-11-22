import React from 'react';

/**
 * Bộ hiển thị Markdown tối giản cho bài viết (không cần thư viện ngoài).
 * Hỗ trợ: ## / ### tiêu đề, đoạn văn, danh sách - và 1., > trích dẫn,
 * khối ```code```, `code` trong dòng, **đậm**, [liên kết](url).
 */

const inline = (text: string, keyBase: string): React.ReactNode[] => {
  const out: React.ReactNode[] = [];
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)\s]+\))/g;
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    const key = `${keyBase}-${i++}`;

    if (tok.startsWith('`')) {
      out.push(
        <code key={key} className="rounded-md border border-line bg-raised px-1.5 py-0.5 font-mono text-[0.85em] text-ink">
          {tok.slice(1, -1)}
        </code>
      );
    } else if (tok.startsWith('**')) {
      out.push(
        <strong key={key} className="font-semibold text-ink">
          {tok.slice(2, -2)}
        </strong>
      );
    } else {
      const link = tok.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)!;
      const external = /^https?:/.test(link[2]);
      out.push(
        <a
          key={key}
          href={link[2]}
          {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
          className="font-medium text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
        >
          {link[1]}
        </a>
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
};

const isSpecial = (line: string) => /^(```|#{2,3} |> |- |\d+\. )/.test(line);

const Markdown: React.FC<{ source: string }> = ({ source }) => {
  const lines = source.replace(/\r/g, '').split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let k = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++]);
      i++; // bỏ dòng ``` đóng
      blocks.push(
        <figure key={k++} className="overflow-hidden rounded-xl border border-line bg-raised">
          {lang && (
            <figcaption className="border-b border-line px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-muted">
              {lang}
            </figcaption>
          )}
          <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
            <code className="font-mono text-ink">{buf.join('\n')}</code>
          </pre>
        </figure>
      );
      continue;
    }

    if (line.startsWith('### ')) {
      blocks.push(
        <h3 key={k++} className="pt-2 text-lg font-semibold tracking-tight text-ink">
          {inline(line.slice(4), `h${k}`)}
        </h3>
      );
      i++;
      continue;
    }

    if (line.startsWith('## ')) {
      blocks.push(
        <h2 key={k++} className="pt-6 text-xl font-bold tracking-tight text-ink sm:text-2xl">
          {inline(line.slice(3), `h${k}`)}
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith('> ')) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) buf.push(lines[i++].slice(2));
      blocks.push(
        <blockquote key={k++} className="border-l-2 border-accent pl-5 text-lg font-medium italic text-ink">
          {inline(buf.join(' '), `q${k}`)}
        </blockquote>
      );
      continue;
    }

    if (/^- /.test(line) || /^\d+\. /.test(line)) {
      const ordered = /^\d+\. /.test(line);
      const re = ordered ? /^\d+\. / : /^- /;
      const items: string[] = [];
      while (i < lines.length && re.test(lines[i])) items.push(lines[i++].replace(re, ''));
      const List = ordered ? 'ol' : 'ul';
      blocks.push(
        <List key={k++} className={`space-y-2 pl-5 ${ordered ? 'list-decimal' : 'list-disc'} marker:text-muted`}>
          {items.map((it, j) => (
            <li key={j} className="pl-1">
              {inline(it, `l${k}-${j}`)}
            </li>
          ))}
        </List>
      );
      continue;
    }

    const buf = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !isSpecial(lines[i])) buf.push(lines[i++]);
    blocks.push(<p key={k++}>{inline(buf.join(' '), `p${k}`)}</p>);
  }

  return <div className="space-y-5 text-[1.0625rem] leading-[1.8] text-ink/80">{blocks}</div>;
};

export default Markdown;

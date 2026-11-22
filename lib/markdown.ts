/**
 * Bộ đọc Markdown tối giản cho bài viết (không cần thư viện ngoài, không phụ thuộc React).
 * Dùng chung cho: trang đọc bài (components/blog/Markdown.tsx) và lúc build ra HTML tĩnh / RSS (vite-plugin-blog.ts).
 *
 * Hỗ trợ:
 *   ## / ### tiêu đề, đoạn văn, danh sách - và 1., > trích dẫn, khối ```code```,
 *   bảng | a | b |, ảnh ![mô tả](/images/blog/anh.jpg "chú thích"),
 *   `code` trong dòng, **đậm**, [liên kết](url).
 */

/* ---------------- Kiểu dữ liệu ---------------- */

export type Inline =
  | { type: 'text'; text: string }
  | { type: 'code'; text: string }
  | { type: 'strong'; text: string }
  | { type: 'link'; text: string; href: string }
  | { type: 'image'; alt: string; src: string };

export type Align = 'left' | 'center' | 'right' | null;

export type Block =
  | { type: 'heading'; level: 2 | 3; text: string; id: string }
  | { type: 'paragraph'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'code'; lang: string; code: string }
  | { type: 'table'; align: Align[]; header: string[]; rows: string[][] }
  | { type: 'image'; alt: string; src: string; title: string };

export type TocItem = { level: 2 | 3; text: string; id: string };

/* ---------------- Tiện ích ---------------- */

/** "Phân trang dữ liệu lớn" -> "phan-trang-du-lieu-lon" */
export const slugify = (input: string): string =>
  input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Chỉ cho phép liên kết / ảnh an toàn: http(s), mailto, tel, đường dẫn trong trang. */
export const safeUrl = (url: string): string | null =>
  /^(https?:|mailto:|tel:|\/|#)/i.test(url) || !/^[a-z][a-z0-9+.-]*:/i.test(url) ? url : null;

/** Bỏ ký hiệu Markdown trong dòng, giữ lại chữ (dùng cho mục lục, mô tả ảnh...). */
export const plainText = (text: string): string =>
  parseInline(text)
    .map((t) => (t.type === 'image' ? t.alt : t.text))
    .join('');

/* ---------------- Trong dòng ---------------- */

const INLINE_RE = /(`[^`]+`)|(\*\*[^*]+\*\*)|(!\[[^\]]*\]\([^)\s]+\))|(\[[^\]]+\]\([^)\s]+\))/g;

export const parseInline = (text: string): Inline[] => {
  const out: Inline[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  INLINE_RE.lastIndex = 0;

  while ((m = INLINE_RE.exec(text))) {
    if (m.index > last) out.push({ type: 'text', text: text.slice(last, m.index) });
    const tok = m[0];
    if (m[1]) out.push({ type: 'code', text: tok.slice(1, -1) });
    else if (m[2]) out.push({ type: 'strong', text: tok.slice(2, -2) });
    else if (m[3]) {
      const [, alt, src] = tok.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/)!;
      out.push({ type: 'image', alt, src });
    } else {
      const [, label, href] = tok.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)!;
      out.push({ type: 'link', text: label, href });
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push({ type: 'text', text: text.slice(last) });
  return out;
};

/* ---------------- Khối ---------------- */

const IMAGE_LINE = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)\s*$/;
const TABLE_SEP = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;

const isTableStart = (lines: string[], i: number) =>
  lines[i].includes('|') && i + 1 < lines.length && lines[i + 1].includes('-') && TABLE_SEP.test(lines[i + 1]);

/** Tách một dòng bảng thành các ô: bỏ | ở hai đầu, hỗ trợ \| để viết ký tự | trong ô. */
const splitRow = (line: string): string[] => {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|') && !s.endsWith('\\|')) s = s.slice(0, -1);
  return s.split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, '|'));
};

const isSpecial = (lines: string[], i: number) =>
  /^(```|#{2,3} |> |- |\d+\. )/.test(lines[i]) || IMAGE_LINE.test(lines[i]) || isTableStart(lines, i);

export const parseBlocks = (source: string): Block[] => {
  const lines = source.replace(/\r/g, '').split('\n');
  const blocks: Block[] = [];
  const usedIds = new Map<string, number>();
  let i = 0;

  const uniqueId = (text: string) => {
    const base = slugify(plainText(text)) || 'muc';
    const n = (usedIds.get(base) ?? 0) + 1;
    usedIds.set(base, n);
    return n === 1 ? base : `${base}-${n}`;
  };

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
      blocks.push({ type: 'code', lang, code: buf.join('\n') });
      continue;
    }

    const h = line.match(/^(#{2,3}) (.+)$/);
    if (h) {
      const text = h[2].trim();
      blocks.push({ type: 'heading', level: h[1].length as 2 | 3, text, id: uniqueId(text) });
      i++;
      continue;
    }

    const img = line.match(IMAGE_LINE);
    if (img) {
      blocks.push({ type: 'image', alt: img[1], src: img[2], title: img[3] ?? '' });
      i++;
      continue;
    }

    if (isTableStart(lines, i)) {
      const header = splitRow(line);
      const align: Align[] = splitRow(lines[i + 1]).map((c) =>
        c.startsWith(':') && c.endsWith(':') ? 'center' : c.endsWith(':') ? 'right' : c.startsWith(':') ? 'left' : null
      );
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim() && lines[i].includes('|')) {
        const cells = splitRow(lines[i++]);
        // Hàng thiếu / thừa ô: cắt hoặc bù cho bằng số cột tiêu đề
        rows.push(header.map((_, c) => cells[c] ?? ''));
      }
      blocks.push({ type: 'table', align: header.map((_, c) => align[c] ?? null), header, rows });
      continue;
    }

    if (line.startsWith('> ') || line === '>') {
      const buf: string[] = [];
      while (i < lines.length && (lines[i].startsWith('> ') || lines[i] === '>')) buf.push(lines[i++].slice(2));
      blocks.push({ type: 'quote', text: buf.join(' ').trim() });
      continue;
    }

    if (/^- /.test(line) || /^\d+\. /.test(line)) {
      const ordered = /^\d+\. /.test(line);
      const re = ordered ? /^\d+\. / : /^- /;
      const items: string[] = [];
      while (i < lines.length && re.test(lines[i])) items.push(lines[i++].replace(re, ''));
      blocks.push({ type: 'list', ordered, items });
      continue;
    }

    const buf = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !isSpecial(lines, i)) buf.push(lines[i++]);
    blocks.push({ type: 'paragraph', text: buf.join(' ') });
  }

  return blocks;
};

export const tableOfContents = (blocks: Block[]): TocItem[] =>
  blocks.flatMap((b) => (b.type === 'heading' ? [{ level: b.level, text: plainText(b.text), id: b.id }] : []));

/** Ảnh đầu tiên trong bài (dùng làm ảnh xem trước khi chia sẻ link). */
export const firstImage = (blocks: Block[]): string | null => {
  for (const b of blocks) {
    if (b.type === 'image') return b.src;
    if (b.type === 'paragraph') {
      const img = parseInline(b.text).find((t) => t.type === 'image');
      if (img && img.type === 'image') return img.src;
    }
  }
  return null;
};

/* ---------------- Xuất HTML (cho trang tĩnh và RSS) ---------------- */

export const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** `base`: tiền tố cho đường dẫn bắt đầu bằng "/" (RSS cần đường dẫn đầy đủ https://...). */
const inlineHtml = (text: string, base: string) =>
  parseInline(text)
    .map((t) => {
      switch (t.type) {
        case 'text':
          return escapeHtml(t.text);
        case 'code':
          return `<code>${escapeHtml(t.text)}</code>`;
        case 'strong':
          return `<strong>${escapeHtml(t.text)}</strong>`;
        case 'image': {
          const src = safeUrl(t.src);
          return src ? `<img src="${escapeHtml(absolute(src, base))}" alt="${escapeHtml(t.alt)}" loading="lazy">` : '';
        }
        case 'link': {
          const href = safeUrl(t.href);
          return href ? `<a href="${escapeHtml(absolute(href, base))}">${escapeHtml(t.text)}</a>` : escapeHtml(t.text);
        }
      }
    })
    .join('');

const absolute = (url: string, base: string) => (base && url.startsWith('/') ? base + url : url);

export const blocksToHtml = (blocks: Block[], base = ''): string =>
  blocks
    .map((b) => {
      switch (b.type) {
        case 'heading':
          return `<h${b.level} id="${b.id}">${inlineHtml(b.text, base)}</h${b.level}>`;
        case 'paragraph':
          return `<p>${inlineHtml(b.text, base)}</p>`;
        case 'quote':
          return `<blockquote><p>${inlineHtml(b.text, base)}</p></blockquote>`;
        case 'list': {
          const tag = b.ordered ? 'ol' : 'ul';
          return `<${tag}>${b.items.map((it) => `<li>${inlineHtml(it, base)}</li>`).join('')}</${tag}>`;
        }
        case 'code':
          return `<pre><code${b.lang ? ` class="language-${escapeHtml(b.lang)}"` : ''}>${escapeHtml(b.code)}</code></pre>`;
        case 'image': {
          const src = safeUrl(b.src);
          if (!src) return '';
          const caption = b.title || b.alt;
          return `<figure><img src="${escapeHtml(absolute(src, base))}" alt="${escapeHtml(b.alt)}" loading="lazy">${
            caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ''
          }</figure>`;
        }
        case 'table': {
          const style = (c: number) => (b.align[c] ? ` style="text-align:${b.align[c]}"` : '');
          const head = b.header.map((h, c) => `<th${style(c)}>${inlineHtml(h, base)}</th>`).join('');
          const body = b.rows
            .map((r) => `<tr>${r.map((cell, c) => `<td${style(c)}>${inlineHtml(cell, base)}</td>`).join('')}</tr>`)
            .join('');
          return `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
        }
      }
    })
    .join('\n');

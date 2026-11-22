import type { Draft } from './types.ts';

/** Chuyển tiêu đề tiếng Việt thành đường dẫn: "Phân trang dữ liệu lớn" -> "phan-trang-du-lieu-lon". */
export const slugify = (input: string, maxLength = 60): string => {
  const s = input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const cut = s.length > maxLength ? s.slice(0, maxLength).replace(/-[^-]*$/, '') : s;
  return cut || 'bai-viet';
};

/** Ngày hôm nay theo giờ Việt Nam, dạng YYYY-MM-DD. */
export const todayVN = (now = new Date()): string =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(now);

/** "2026-10-28" -> "28/10/2026" */
export const formatDate = (iso: string): string => {
  const [y, m, d] = iso.split('-');
  return y && m && d ? `${d}/${m}/${y}` : iso;
};

/** Giá trị trong phần đầu file chỉ được nằm trên một dòng. */
const oneLine = (s: string) => s.replace(/\s+/g, ' ').trim();

const KNOWN_META = ['title', 'date', 'tags', 'excerpt'];

/**
 * Tạo nội dung file .md đúng định dạng blog đang dùng (xem data/posts.ts của trang).
 * `extra` giữ lại các trường khác trong phần đầu file cũ (ví dụ draft: true) khi sửa bài.
 */
export const buildMarkdown = (d: Draft, date: string, extra: Record<string, string> = {}): string => {
  const tags = d.tags.map(oneLine).filter(Boolean).join(', ');
  const body = d.content
    .replace(/\r/g, '')
    // AI đôi khi lặp lại tiêu đề bằng "# ..." ở đầu bài: bỏ đi vì trang đã hiển thị tiêu đề
    .replace(/^#\s+.*\n+/, '')
    .trim();
  const extraLines = Object.entries(extra)
    .filter(([k]) => !KNOWN_META.includes(k))
    .map(([k, v]) => `${k}: ${oneLine(v)}\n`)
    .join('');
  return `---\ntitle: ${oneLine(d.title)}\ndate: ${date}\ntags: ${tags}\nexcerpt: ${oneLine(d.excerpt)}\n${extraLines}---\n\n${body}\n`;
};

/** Đọc file .md của blog: phần đầu (meta) và thân bài. Cùng quy tắc với data/posts.ts của trang. */
export const parseMarkdown = (raw: string): { meta: Record<string, string>; body: string } => {
  const text = raw.replace(/^﻿/, '').replace(/\r/g, '');
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const meta: Record<string, string> = {};
  if (m) {
    for (const line of m[1].split('\n')) {
      const i = line.indexOf(':');
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
  }
  return { meta, body: (m ? m[2] : text).trim() };
};

/** Chuyển file .md thành Draft (dùng khi sửa bài có sẵn hoặc khi anh gửi file tự sửa). */
export const draftFromMarkdown = (raw: string, fallbackSlug: string): { draft: Draft; meta: Record<string, string> } => {
  const { meta, body } = parseMarkdown(raw);
  return {
    meta,
    draft: {
      title: meta.title || fallbackSlug,
      slug: fallbackSlug,
      tags: meta.tags ? meta.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      excerpt: meta.excerpt || '',
      content: body,
    },
  };
};

export const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;

/** Mã hoá UTF-8 sang base64 (GitHub API yêu cầu nội dung file ở dạng base64). */
export const toBase64 = (text: string): string => bytesToBase64(new TextEncoder().encode(text));

/** Mã hoá dữ liệu nhị phân (ảnh) sang base64. */
export const bytesToBase64 = (bytes: Uint8Array): string => {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(bin);
};

/** Giải mã base64 (GitHub trả về có xuống dòng) sang chuỗi UTF-8. */
export const fromBase64 = (b64: string): string => {
  const bin = atob(b64.replace(/\s/g, ''));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
};

/**
 * Đọc file bài viết .md (phần đầu --- ... --- và thân bài).
 * Dùng chung cho trang (data/posts.ts) và lúc build trang tĩnh / RSS / sitemap (vite-plugin-blog.ts),
 * nên file này không được import gì của trình duyệt hay React.
 */

export const SITE = {
  url: 'https://springgo.xyz',
  name: 'springgo.xyz',
  author: 'Nguyễn Xuân Tiến',
  /** Tên hiển thị trên tab trình duyệt (trang chủ; các trang khác có dạng "<tiêu đề> — SpringGo") */
  brand: 'SpringGo',
  title: 'SpringGo',
  description: 'Nguyễn Xuân Tiến, Full-stack Developer (.NET, SQL Server) tại Đà Nẵng. Hồ sơ, dự án và blog kỹ thuật.',
  blogTitle: 'Bài viết — SpringGo',
  blogDescription: 'Nơi mình ghi lại chuyện .NET, SQL Server và những điều học được khi làm phần mềm cho doanh nghiệp.',
  /** Ảnh mặc định khi chia sẻ link (bài không có ảnh nào) */
  image: 'https://res.cloudinary.com/dgejmagns/image/upload/0d323034-c750-479a-91f0-bdde8fae45f1.png',
};

export type Post = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  tags: string[];
  excerpt: string;
  content: string;
  readingMinutes: number;
};

/** Đường dẫn của một bài trên trang, ví dụ /blog/phan-trang-du-lieu-lon */
export const postPath = (slug: string) => `/blog/${slug}`;

/** Số phút đọc: bỏ khối code (đọc lướt), ~220 từ / phút cho chữ, ~5 giây cho mỗi dòng code. */
export const readingMinutes = (body: string): number => {
  let codeLines = 0;
  const prose = body.replace(/```[\s\S]*?(```|$)/g, (block) => {
    codeLines += block.split('\n').length - 2;
    return ' ';
  });
  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220 + (codeLines * 5) / 60));
};

export const parsePost = (fileName: string, raw: string): Post & { draft: boolean } => {
  const slug = fileName.split('/').pop()!.replace(/\.md$/, '');
  const text = raw.replace(/^﻿/, '').replace(/\r/g, '');
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const meta: Record<string, string> = {};
  const body = (m ? m[2] : text).trim();

  if (m) {
    for (const line of m[1].split('\n')) {
      const i = line.indexOf(':');
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
  }

  return {
    slug,
    title: meta.title || slug,
    date: meta.date || '',
    tags: meta.tags ? meta.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    excerpt: meta.excerpt || '',
    content: body,
    readingMinutes: readingMinutes(body),
    draft: meta.draft === 'true',
  };
};

/** Đọc danh sách file (tên file -> nội dung), bỏ bài nháp, xếp mới nhất lên đầu. */
export const loadPosts = (files: Record<string, string>): Post[] =>
  Object.entries(files)
    .map(([path, raw]) => parsePost(path, raw))
    .filter((p) => !p.draft)
    .map(({ draft: _draft, ...p }) => p)
    .sort((a, b) => b.date.localeCompare(a.date));

export const formatDate = (iso: string) => {
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${Number(d)} thg ${Number(m)}, ${y}`;
};

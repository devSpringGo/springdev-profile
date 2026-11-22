/**
 * Bài viết được đọc tự động từ các file Markdown trong content/blog/.
 * Muốn thêm bài: tạo file mới, ví dụ content/blog/ten-bai-viet.md, với phần đầu:
 *
 *   ---
 *   title: Tiêu đề bài viết
 *   date: 2026-11-20
 *   tags: SQL Server, Kinh nghiệm
 *   excerpt: Một câu tóm tắt hiển thị ở danh sách.
 *   draft: false
 *   ---
 *
 * Tên file (không có .md) chính là đường dẫn: #/blog/ten-bai-viet
 */

export type Post = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  tags: string[];
  excerpt: string;
  content: string;
  readingMinutes: number;
};

const files = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const parse = (path: string, raw: string): (Post & { draft: boolean }) => {
  const slug = path.split('/').pop()!.replace(/\.md$/, '');
  const text = raw.replace(/\r/g, '');
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const meta: Record<string, string> = {};
  const body = (m ? m[2] : text).trim();

  if (m) {
    for (const line of m[1].split('\n')) {
      const i = line.indexOf(':');
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
  }

  const words = body.split(/\s+/).filter(Boolean).length;

  return {
    slug,
    title: meta.title || slug,
    date: meta.date || '',
    tags: meta.tags ? meta.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    excerpt: meta.excerpt || '',
    content: body,
    readingMinutes: Math.max(1, Math.round(words / 220)),
    draft: meta.draft === 'true',
  };
};

export const posts: Post[] = Object.entries(files)
  .map(([path, raw]) => parse(path, raw))
  .filter((p) => !p.draft)
  .sort((a, b) => b.date.localeCompare(a.date));

export const allTags: string[] = Array.from(new Set(posts.flatMap((p) => p.tags))).sort();

export const formatDate = (iso: string) => {
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${Number(d)} thg ${Number(m)}, ${y}`;
};

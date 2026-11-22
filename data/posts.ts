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
 * Tên file (không có .md) chính là đường dẫn: /blog/ten-bai-viet
 * Ảnh trong bài: để file ở public/images/blog/ rồi viết ![mô tả](/images/blog/ten-anh.jpg)
 */
import { formatDate, loadPosts, postPath, type Post } from '../lib/blog';

export type { Post };
export { formatDate, postPath };

const files = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export const posts: Post[] = loadPosts(files);

export const allTags: string[] = Array.from(new Set(posts.flatMap((p) => p.tags))).sort();

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

/** Giá trị trong phần đầu file chỉ được nằm trên một dòng. */
const oneLine = (s: string) => s.replace(/\s+/g, ' ').trim();

/** Tạo nội dung file .md đúng định dạng blog đang dùng (xem data/posts.ts của trang). */
export const buildMarkdown = (d: Draft, date: string): string => {
  const tags = d.tags.map(oneLine).filter(Boolean).join(', ');
  const body = d.content
    .replace(/\r/g, '')
    // AI đôi khi lặp lại tiêu đề bằng "# ..." ở đầu bài: bỏ đi vì trang đã hiển thị tiêu đề
    .replace(/^#\s+.*\n+/, '')
    .trim();
  return `---\ntitle: ${oneLine(d.title)}\ndate: ${date}\ntags: ${tags}\nexcerpt: ${oneLine(d.excerpt)}\n---\n\n${body}\n`;
};

export const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;

/** Mã hoá UTF-8 sang base64 (GitHub API yêu cầu nội dung file ở dạng base64). */
export const toBase64 = (text: string): string => {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(bin);
};

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildMarkdown, bytesToBase64, draftFromMarkdown, formatDate, fromBase64, parseMarkdown, slugify, toBase64, todayVN } from '../src/markdown.ts';

test('slugify bỏ dấu tiếng Việt và ký tự đặc biệt', () => {
  assert.equal(slugify('Phân trang dữ liệu lớn: OFFSET/FETCH hay keyset?'), 'phan-trang-du-lieu-lon-offset-fetch-hay-keyset');
  assert.equal(slugify('Đường dẫn ĐẸP'), 'duong-dan-dep');
  assert.equal(slugify('!!!'), 'bai-viet');
  assert.ok(slugify('a '.repeat(80)).length <= 60);
});

test('todayVN theo múi giờ Việt Nam', () => {
  // 20:00 UTC ngày 1/1 là 03:00 ngày 2/1 ở Việt Nam
  assert.equal(todayVN(new Date('2026-01-01T20:00:00Z')), '2026-01-02');
});

test('toBase64 giữ đúng UTF-8', () => {
  const text = 'Xin chào, mình là Tiến — ổn định';
  assert.equal(Buffer.from(toBase64(text), 'base64').toString('utf8'), text);
});

/** Bản sao rút gọn của hàm đọc bài trong data/posts.ts của trang, để chắc chắn file bot tạo ra đọc được. */
const parseLikeSite = (raw: string) => {
  const m = raw.replace(/\r/g, '').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  assert.ok(m, 'phải có phần đầu ---');
  const meta: Record<string, string> = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: m[2].trim() };
};

test('buildMarkdown tạo file đúng định dạng blog', () => {
  const md = buildMarkdown(
    {
      title: 'Index trong SQL Server: khi nào nên dùng',
      slug: 'index-sql-server',
      tags: ['SQL Server', ' Hiệu năng '],
      excerpt: 'Một câu tóm tắt\ncó xuống dòng: vẫn phải nằm trên một dòng.',
      content: '# Index trong SQL Server\n\nĐoạn mở đầu.\n\n## Mục 1\n\nNội dung.',
    },
    '2026-11-22'
  );
  const { meta, body } = parseLikeSite(md);
  assert.equal(meta.title, 'Index trong SQL Server: khi nào nên dùng');
  assert.equal(meta.date, '2026-11-22');
  assert.equal(meta.tags, 'SQL Server, Hiệu năng');
  assert.equal(meta.excerpt, 'Một câu tóm tắt có xuống dòng: vẫn phải nằm trên một dòng.');
  assert.ok(body.startsWith('Đoạn mở đầu.'), 'tiêu đề "# ..." lặp lại ở đầu bài phải bị bỏ');
  assert.ok(body.includes('## Mục 1'));
});

test('fromBase64 đọc được base64 có xuống dòng như GitHub trả về', () => {
  const text = 'Bài viết: “Đà Nẵng” – ổn';
  const b64 = Buffer.from(text, 'utf8').toString('base64').replace(/(.{10})/g, '$1\n');
  assert.equal(fromBase64(b64), text);
});

test('formatDate', () => {
  assert.equal(formatDate('2026-10-28'), '28/10/2026');
});

test('sửa bài: đọc file cũ rồi ghi lại vẫn giữ trường draft và ngày cũ', () => {
  const original = '---\r\ntitle: Bài cũ\r\ndate: 2026-08-04\r\ntags: .NET, Kinh nghiệm\r\nexcerpt: Tóm tắt\r\ndraft: true\r\n---\r\n\r\nNội dung cũ.\r\n';
  const { draft, meta } = draftFromMarkdown(original, 'bai-cu');
  assert.equal(draft.title, 'Bài cũ');
  assert.deepEqual(draft.tags, ['.NET', 'Kinh nghiệm']);
  assert.equal(draft.content, 'Nội dung cũ.');
  assert.equal(draft.slug, 'bai-cu');

  const rebuilt = buildMarkdown({ ...draft, content: 'Nội dung mới.' }, meta.date, meta);
  const { meta: m2, body } = parseMarkdown(rebuilt);
  assert.equal(m2.date, '2026-08-04');
  assert.equal(m2.draft, 'true');
  assert.equal(body, 'Nội dung mới.');
  // không bị lặp các trường chính
  assert.equal(rebuilt.match(/^title:/gm)?.length, 1);
});

test('bytesToBase64 mã hoá đúng dữ liệu nhị phân (ảnh), kể cả file lớn hơn một khối', () => {
  const bytes = new Uint8Array(100_000).map((_, i) => (i * 37) % 256);
  assert.deepEqual(new Uint8Array(Buffer.from(bytesToBase64(bytes), 'base64')), bytes);
});

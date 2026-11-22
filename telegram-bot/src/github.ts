import type { Env } from './types.ts';
import { bytesToBase64, fromBase64, parseMarkdown, toBase64 } from './markdown.ts';

const headers = (env: Env, json = false): Record<string, string> => ({
  Authorization: `Bearer ${env.GITHUB_TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'springgo-blog-bot',
  ...(json ? { 'content-type': 'application/json' } : {}),
});

const api = (env: Env, path: string, init: RequestInit = {}) =>
  fetch(`https://api.github.com/repos/${env.GITHUB_REPO}${path}`, { ...init, headers: headers(env, !!init.body) });

const contentsPath = (filePath: string) => `/contents/${filePath.split('/').map(encodeURIComponent).join('/')}`;

async function fail(res: Response, what: string): Promise<never> {
  throw new Error(`GitHub trả lỗi ${res.status} khi ${what}: ${(await res.text()).slice(0, 200)}`);
}

/* ---------- Đọc ---------- */

export type RepoFile = { path: string; sha: string; text: string };

/** Đọc một file trong repo. Trả về null nếu file không tồn tại. */
export async function getFile(env: Env, filePath: string): Promise<RepoFile | null> {
  const res = await api(env, `${contentsPath(filePath)}?ref=${encodeURIComponent(env.GITHUB_BRANCH)}`);
  if (res.status === 404) return null;
  if (!res.ok) return fail(res, 'đọc file');
  const data = (await res.json()) as { path: string; sha: string; content?: string };
  return { path: data.path, sha: data.sha, text: fromBase64(data.content ?? '') };
}

export type PostSummary = { path: string; slug: string; title: string; date: string; tags: string[] };

/**
 * Lấy danh sách bài trong thư mục blog, kèm tiêu đề và ngày.
 * Dùng GraphQL để đọc tất cả file trong MỘT yêu cầu (Worker bị giới hạn số yêu cầu con).
 */
export async function listPosts(env: Env): Promise<PostSummary[]> {
  const [owner, name] = env.GITHUB_REPO.split('/');
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: headers(env, true),
    body: JSON.stringify({
      query: `query($owner:String!,$name:String!,$expr:String!){
        repository(owner:$owner,name:$name){
          object(expression:$expr){ ... on Tree { entries { name path object { ... on Blob { text } } } } }
        }
      }`,
      variables: { owner, name, expr: `${env.GITHUB_BRANCH}:${env.BLOG_DIR}` },
    }),
  });
  if (!res.ok) return fail(res, 'lấy danh sách bài');
  const data = (await res.json()) as {
    data?: { repository?: { object?: { entries?: { name: string; path: string; object?: { text?: string } }[] } } };
    errors?: { message: string }[];
  };
  if (data.errors?.length) throw new Error(`GitHub: ${data.errors[0].message}`);

  return (data.data?.repository?.object?.entries ?? [])
    .filter((e) => e.name.endsWith('.md'))
    .map((e) => {
      const { meta } = parseMarkdown(e.object?.text ?? '');
      return {
        path: e.path,
        slug: e.name.replace(/\.md$/, ''),
        title: meta.title || e.name,
        date: meta.date || '',
        tags: meta.tags ? meta.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Tìm tên file chưa bị dùng: ten-bai, ten-bai-2, ten-bai-3... */
export async function freeSlug(env: Env, slug: string): Promise<string> {
  let candidate = slug;
  for (let n = 2; await getFile(env, `${env.BLOG_DIR}/${candidate}.md`); n++) {
    candidate = `${slug}-${n}`;
  }
  return candidate;
}

/* ---------- Ghi / xoá (mỗi lần là một commit lên nhánh GITHUB_BRANCH) ---------- */

/** Tạo file mới, hoặc ghi đè file đã có nếu truyền `sha` hiện tại của file. */
export async function putFile(env: Env, filePath: string, content: string, message: string, sha?: string): Promise<void> {
  const res = await api(env, contentsPath(filePath), {
    method: 'PUT',
    body: JSON.stringify({ message, content: toBase64(content), branch: env.GITHUB_BRANCH, ...(sha ? { sha } : {}) }),
  });
  if (!res.ok) return fail(res, sha ? 'cập nhật bài' : 'đăng bài');
}

export async function deleteFile(env: Env, filePath: string, sha: string, message: string): Promise<void> {
  const res = await api(env, contentsPath(filePath), {
    method: 'DELETE',
    body: JSON.stringify({ message, sha, branch: env.GITHUB_BRANCH }),
  });
  if (!res.ok) return fail(res, 'xoá bài');
}

/**
 * Ghi nhiều file trong MỘT commit (bài viết + ảnh), để Cloudflare Pages chỉ build lại một lần
 * và trang không bao giờ có bài mà thiếu ảnh. Dùng Git Data API: blob -> tree -> commit -> cập nhật nhánh.
 */
export async function commitFiles(env: Env, files: { path: string; content: string | Uint8Array }[], message: string): Promise<void> {
  const branchRef = `/git/refs/heads/${encodeURIComponent(env.GITHUB_BRANCH)}`;
  const json = async <T>(res: Response, what: string): Promise<T> => (res.ok ? ((await res.json()) as T) : fail(res, what));

  // Tạo blob trước (không phụ thuộc nhánh), để lần thử lại không phải tải ảnh lên lần nữa
  const blobs = await Promise.all(
    files.map(async (f) => {
      const content = typeof f.content === 'string' ? toBase64(f.content) : bytesToBase64(f.content);
      const res = await api(env, '/git/blobs', { method: 'POST', body: JSON.stringify({ content, encoding: 'base64' }) });
      const { sha } = await json<{ sha: string }>(res, `tải lên ${f.path}`);
      return { path: f.path, mode: '100644', type: 'blob', sha };
    })
  );

  // Nếu nhánh vừa có commit khác chen vào (ví dụ anh push từ máy), làm lại từ commit mới nhất
  for (let attempt = 1; ; attempt++) {
    const head = await json<{ object: { sha: string } }>(await api(env, `/git/ref/heads/${encodeURIComponent(env.GITHUB_BRANCH)}`), 'đọc nhánh');
    const parent = await json<{ tree: { sha: string } }>(await api(env, `/git/commits/${head.object.sha}`), 'đọc commit');
    const tree = await json<{ sha: string }>(
      await api(env, '/git/trees', { method: 'POST', body: JSON.stringify({ base_tree: parent.tree.sha, tree: blobs }) }),
      'tạo cây thư mục'
    );
    const commit = await json<{ sha: string }>(
      await api(env, '/git/commits', { method: 'POST', body: JSON.stringify({ message, tree: tree.sha, parents: [head.object.sha] }) }),
      'tạo commit'
    );
    const res = await api(env, branchRef, { method: 'PATCH', body: JSON.stringify({ sha: commit.sha, force: false }) });
    if (res.ok) return;
    if (res.status !== 422 || attempt >= 3) return fail(res, 'cập nhật nhánh');
  }
}

import type { Env } from './types.ts';
import { toBase64 } from './markdown.ts';

const api = (env: Env, path: string, init: RequestInit = {}) =>
  fetch(`https://api.github.com/repos/${env.GITHUB_REPO}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'springgo-blog-bot',
      ...(init.body ? { 'content-type': 'application/json' } : {}),
    },
  });

const contentsPath = (filePath: string) => `/contents/${filePath.split('/').map(encodeURIComponent).join('/')}`;

async function fileExists(env: Env, filePath: string): Promise<boolean> {
  const res = await api(env, `${contentsPath(filePath)}?ref=${encodeURIComponent(env.GITHUB_BRANCH)}`);
  if (res.status === 404) return false;
  if (!res.ok) throw new Error(`GitHub trả lỗi ${res.status} khi kiểm tra file: ${(await res.text()).slice(0, 200)}`);
  return true;
}

/** Tìm tên file chưa bị dùng: ten-bai, ten-bai-2, ten-bai-3... */
export async function freeSlug(env: Env, slug: string): Promise<string> {
  let candidate = slug;
  for (let n = 2; await fileExists(env, `${env.BLOG_DIR}/${candidate}.md`); n++) {
    candidate = `${slug}-${n}`;
  }
  return candidate;
}

/** Tạo file mới trong repo (một commit lên nhánh GITHUB_BRANCH). */
export async function createFile(env: Env, filePath: string, content: string, message: string): Promise<void> {
  const res = await api(env, contentsPath(filePath), {
    method: 'PUT',
    body: JSON.stringify({ message, content: toBase64(content), branch: env.GITHUB_BRANCH }),
  });
  if (!res.ok) throw new Error(`GitHub trả lỗi ${res.status} khi đăng bài: ${(await res.text()).slice(0, 300)}`);
}

export interface Env {
  DRAFTS: KVNamespace;

  // Bí mật (wrangler secret put)
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_WEBHOOK_SECRET: string;
  GEMINI_API_KEY: string;
  GITHUB_TOKEN: string;

  // Cấu hình (wrangler.toml [vars])
  ALLOWED_CHAT_ID: string;
  GEMINI_MODEL: string;
  GITHUB_REPO: string;
  GITHUB_BRANCH: string;
  BLOG_DIR: string;
  SITE_URL: string;
}

/** Bài viết do AI trả về. */
export type Draft = {
  title: string;
  slug: string;
  tags: string[];
  excerpt: string;
  content: string;
};

/** Một lượt trong cuộc hội thoại với AI (để sửa bài theo góp ý). */
export type Turn = { role: 'user' | 'model'; text: string };

/** Bản nháp lưu trong KV trong lúc chờ duyệt. */
export type StoredDraft = {
  id: string;
  chatId: number;
  date: string; // YYYY-MM-DD
  draft: Draft;
  history: Turn[];
  /** message_id của tin nhắn có nút Duyệt / Sửa / Bỏ, để gỡ nút khi đã xử lý */
  messageId?: number;
};

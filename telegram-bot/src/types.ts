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
  /** 'new': bài mới; 'edit': bản sửa của một bài đã đăng */
  mode: 'new' | 'edit';
  /** Với bài đang sửa: đường dẫn file trong repo, ví dụ content/blog/ten-bai.md */
  path?: string;
  /** Với bài đang sửa: các trường khác trong phần đầu file cũ cần giữ lại (ví dụ draft: true) */
  extraMeta?: Record<string, string>;
  date: string; // YYYY-MM-DD
  draft: Draft;
  history: Turn[];
  /** message_id của tin nhắn có nút Duyệt / Sửa / Bỏ, để gỡ nút khi đã xử lý */
  messageId?: number;
  /** Ảnh anh gửi kèm bài: nội dung ảnh nằm trong KV, chỉ đưa lên GitHub khi Duyệt */
  images?: DraftImage[];
};

export type DraftImage = {
  /** Đường dẫn file trong repo, ví dụ public/images/blog/ab12cd34-1.jpg */
  path: string;
  /** Đường dẫn trên trang, ví dụ /images/blog/ab12cd34-1.jpg */
  url: string;
  /** Khoá KV chứa nội dung ảnh */
  key: string;
};

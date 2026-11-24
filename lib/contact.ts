/**
 * Quy tắc của form Liên hệ, dùng chung cho form trên trang (components/Contact.tsx)
 * và Cloudflare Pages Function nhận lời nhắn (functions/api/contact.ts).
 * File này không được import gì của trình duyệt hay React.
 */

export const CONTACT_ENDPOINT = '/api/contact';

export const LIMITS = { name: 100, email: 200, subject: 200, message: 3000 } as const;

export type ContactPayload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  /** Ô bẫy: người thật không thấy ô này, bot tự điền thì bị bỏ qua */
  website?: unknown;
  /** Mã Cloudflare Turnstile (khi có bật chống spam) */
  token?: unknown;
};

export type ContactMessage = { name: string; email: string; subject: string; message: string };

const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/** Kiểm tra dữ liệu form. Trả về thông báo lỗi (tiếng Việt) hoặc dữ liệu đã làm sạch. */
export function validateContact(p: ContactPayload): { error: string } | ContactMessage {
  const name = text(p.name);
  const email = text(p.email);
  const subject = text(p.subject);
  const message = text(p.message);

  if (!name || !email || !subject || !message) return { error: 'Vui lòng điền đủ họ tên, email, chủ đề và nội dung.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Email chưa đúng định dạng.' };
  if (name.length > LIMITS.name) return { error: `Họ tên tối đa ${LIMITS.name} ký tự.` };
  if (email.length > LIMITS.email) return { error: `Email tối đa ${LIMITS.email} ký tự.` };
  if (subject.length > LIMITS.subject) return { error: `Chủ đề tối đa ${LIMITS.subject} ký tự.` };
  if (message.length > LIMITS.message) return { error: `Nội dung tối đa ${LIMITS.message} ký tự.` };
  return { name, email, subject, message };
}

/** Nội dung tin Telegram (chữ thường, không định dạng, để khỏi phải escape ký tự đặc biệt). */
export function formatContactMessage(d: ContactMessage, page: string, now = new Date()): string {
  const time = new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'short', timeStyle: 'short' }).format(now);
  return [
    '📬 Lời nhắn mới từ springgo.xyz',
    '',
    `Từ: ${d.name}`,
    `Email: ${d.email}`,
    `Chủ đề: ${d.subject}`,
    '',
    d.message,
    '',
    '──────────',
    `${time}${page ? ` · gửi từ trang ${page}` : ''}`,
  ].join('\n');
}

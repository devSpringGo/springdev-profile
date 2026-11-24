/**
 * Cloudflare Pages Function: POST /api/contact
 * Nhận lời nhắn từ form Liên hệ trên trang và gửi về Telegram của anh (qua bot @springgo_blog_bot).
 *
 * Thư mục functions/ được Cloudflare Pages tự deploy cùng trang, không cần tạo Worker riêng.
 * Biến môi trường đặt trong Cloudflare Dashboard → Workers & Pages → springdev-profile → Settings → Variables and Secrets:
 *   TELEGRAM_BOT_TOKEN    (Secret)  token của bot, giống bot viết blog
 *   TELEGRAM_CHAT_ID      (Text)    Chat ID nhận tin, ví dụ 5642891542
 *   TURNSTILE_SECRET_KEY  (Secret, không bắt buộc) bật kiểm tra chống spam Cloudflare Turnstile
 * Đổi biến xong phải deploy lại trang thì mới có hiệu lực.
 */
import { formatContactMessage, validateContact, type ContactPayload } from '../../lib/contact';

interface Env {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  TURNSTILE_SECRET_KEY?: string;
}

type Context = { request: Request; env: Env };

const json = (status: number, body: { ok: boolean; error?: string }) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

const parseUrl = (s: string | null) => {
  try {
    return s ? new URL(s) : null;
  } catch {
    return null;
  }
};

async function verifyTurnstile(secret: string, token: string, ip: string | null): Promise<boolean> {
  if (!token) return false;
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

export const onRequestPost = async ({ request, env }: Context): Promise<Response> => {
  // Chỉ nhận yêu cầu từ chính trang này (trình duyệt luôn gửi kèm Origin khi POST)
  const origin = request.headers.get('origin');
  if (origin && parseUrl(origin)?.host !== new URL(request.url).host) return json(403, { ok: false, error: 'Không được phép.' });

  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    console.error('Thiếu TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID');
    return json(500, { ok: false, error: 'Form liên hệ chưa được cấu hình.' });
  }

  let payload: ContactPayload;
  try {
    const raw = await request.text();
    if (raw.length > 20_000) return json(413, { ok: false, error: 'Nội dung quá dài.' });
    payload = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, error: 'Dữ liệu gửi lên không hợp lệ.' });
  }

  // Bot điền vào ô bẫy: báo thành công cho nó đi, nhưng không gửi gì
  if (text(payload.website)) return json(200, { ok: true });

  const data = validateContact(payload);
  if ('error' in data) return json(400, { ok: false, error: data.error });

  if (env.TURNSTILE_SECRET_KEY) {
    const passed = await verifyTurnstile(env.TURNSTILE_SECRET_KEY, text(payload.token), request.headers.get('cf-connecting-ip'));
    if (!passed) return json(403, { ok: false, error: 'Chưa qua bước kiểm tra chống spam. Tải lại trang rồi thử lại.' });
  }

  const page = parseUrl(request.headers.get('referer'))?.pathname ?? '';
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_CHAT_ID,
      text: formatContactMessage(data, page),
      link_preview_options: { is_disabled: true },
    }),
  });
  if (!res.ok) {
    console.error('Telegram sendMessage lỗi', res.status, (await res.text()).slice(0, 300));
    return json(502, { ok: false, error: 'Chưa gửi được lời nhắn. Bạn thử lại sau ít phút hoặc gửi email trực tiếp.' });
  }
  return json(200, { ok: true });
};

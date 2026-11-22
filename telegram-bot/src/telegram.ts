import type { Env } from './types.ts';

type Json = Record<string, unknown>;

export type InlineKeyboard = { inline_keyboard: { text: string; callback_data: string }[][] };

async function parse(res: Response, method: string) {
  const data = (await res.json()) as { ok: boolean; result?: any; description?: string };
  if (!data.ok) throw new Error(`Telegram ${method}: ${data.description}`);
  return data.result;
}

/** Gọi một phương thức Bot API với body JSON. */
export const tg = async (env: Env, method: string, body: Json) =>
  parse(
    await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }),
    method
  );

/** Gửi tin nhắn chữ thường (không dùng định dạng để khỏi phải escape ký tự đặc biệt). */
export const sendText = (env: Env, chatId: number, text: string, extra: Json = {}) =>
  tg(env, 'sendMessage', {
    chat_id: chatId,
    text: text.length > 4096 ? `${text.slice(0, 4090)}…` : text,
    link_preview_options: { is_disabled: true },
    ...extra,
  });

/** Gửi file đính kèm (bản nháp .md) kèm chú thích và nút bấm. */
export async function sendDocument(
  env: Env,
  chatId: number,
  filename: string,
  content: string,
  caption: string,
  replyMarkup?: InlineKeyboard
): Promise<{ message_id: number }> {
  const form = new FormData();
  form.append('chat_id', String(chatId));
  form.append('document', new Blob([content], { type: 'text/markdown' }), filename);
  form.append('caption', caption.length > 1024 ? `${caption.slice(0, 1020)}…` : caption);
  if (replyMarkup) form.append('reply_markup', JSON.stringify(replyMarkup));
  return parse(
    await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendDocument`, { method: 'POST', body: form }),
    'sendDocument'
  );
}

/** Gỡ các nút bấm khỏi một tin nhắn (khi bản nháp đã được xử lý). */
export const clearButtons = (env: Env, chatId: number, messageId: number) =>
  tg(env, 'editMessageReplyMarkup', {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: { inline_keyboard: [] },
  }).catch(() => undefined);

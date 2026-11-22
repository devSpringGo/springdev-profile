/**
 * Bot Telegram: nhắn chủ đề -> AI viết bản nháp -> anh duyệt -> tự đăng lên blog.
 *
 * Đường dẫn của Worker:
 *   POST /telegram           Telegram gọi vào đây (webhook), có kiểm tra secret
 *   GET  /setup?secret=...   Đăng ký webhook + danh sách lệnh với Telegram (chạy 1 lần sau khi deploy)
 */
import type { Env, StoredDraft, Turn } from './types.ts';
import { buildMarkdown, slugify, todayVN, wordCount } from './markdown.ts';
import { writeDraft } from './gemini.ts';
import { createFile, freeSlug } from './github.ts';
import { clearButtons, sendDocument, sendText, tg, type InlineKeyboard } from './telegram.ts';

const DRAFT_TTL = 60 * 60 * 24 * 7; // bản nháp giữ 7 ngày
const draftKey = (id: string) => `draft:${id}`;
const awaitKey = (chatId: number) => `await:${chatId}`; // đang chờ anh gửi góp ý cho bản nháp nào

const HELP = [
  'Bot viết bài cho blog springgo.xyz.',
  '',
  '• Nhắn chủ đề (hoặc /viet <chủ đề>) để AI viết bản nháp.',
  '  Ví dụ: /viet Dùng rowversion để chống ghi đè dữ liệu trong SQL Server',
  '  Có thể thêm yêu cầu: "…, khoảng 800 từ, có ví dụ C#".',
  '• Bản nháp gửi về kèm 3 nút: Duyệt & đăng / Sửa / Bỏ.',
  '• Bấm Sửa rồi nhắn góp ý, AI sẽ viết lại.',
  '• /huy: thôi không góp ý nữa.',
  '• /id: xem Chat ID của bạn.',
].join('\n');

/* ---------------------------------------------------------------- */

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);

    if (req.method === 'GET' && url.pathname === '/setup') return setup(url, env);
    if (req.method === 'GET' && url.pathname === '/') return new Response('springgo blog bot: OK');
    if (req.method !== 'POST' || url.pathname !== '/telegram') return new Response('Not found', { status: 404 });

    // Chỉ nhận yêu cầu thật sự đến từ Telegram
    if (req.headers.get('X-Telegram-Bot-Api-Secret-Token') !== env.TELEGRAM_WEBHOOK_SECRET) {
      return new Response('Forbidden', { status: 403 });
    }

    const update = (await req.json()) as any;

    // Telegram có thể gửi lại cùng một update nếu phản hồi chậm: bỏ qua update đã xử lý
    const seenKey = `upd:${update.update_id}`;
    if (await env.DRAFTS.get(seenKey)) return new Response('ok');
    await env.DRAFTS.put(seenKey, '1', { expirationTtl: 3600 });

    const chatId: number | undefined = update.message?.chat?.id ?? update.callback_query?.message?.chat?.id;
    try {
      await handleUpdate(update, env);
    } catch (err) {
      console.error(err);
      if (chatId && isAllowed(env, chatId)) {
        await sendText(env, chatId, `Có lỗi xảy ra: ${(err as Error).message}`).catch(() => undefined);
      }
    }
    // Luôn trả 200 để Telegram không gửi lại
    return new Response('ok');
  },
};

/* ---------------------------------------------------------------- */

const isAllowed = (env: Env, chatId: number) => env.ALLOWED_CHAT_ID !== '' && String(chatId) === env.ALLOWED_CHAT_ID.trim();

async function setup(url: URL, env: Env): Promise<Response> {
  if (url.searchParams.get('secret') !== env.TELEGRAM_WEBHOOK_SECRET) return new Response('Forbidden', { status: 403 });

  const webhook = await tg(env, 'setWebhook', {
    url: `${url.origin}/telegram`,
    secret_token: env.TELEGRAM_WEBHOOK_SECRET,
    allowed_updates: ['message', 'callback_query'],
    drop_pending_updates: true,
  });
  await tg(env, 'setMyCommands', {
    commands: [
      { command: 'viet', description: 'Viết bài mới: /viet <chủ đề>' },
      { command: 'huy', description: 'Thôi góp ý cho bản nháp' },
      { command: 'help', description: 'Hướng dẫn' },
      { command: 'id', description: 'Xem Chat ID' },
    ],
  });
  return Response.json({ webhook, url: `${url.origin}/telegram` });
}

async function handleUpdate(update: any, env: Env) {
  if (update.callback_query) return onButton(update.callback_query, env);

  const msg = update.message;
  if (!msg?.text) return;
  const chatId: number = msg.chat.id;
  const text: string = msg.text.trim();
  const [command, ...rest] = text.split(/\s+/);
  const cmd = command.startsWith('/') ? command.split('@')[0].toLowerCase() : '';

  if (cmd === '/id') return sendText(env, chatId, `Chat ID của bạn: ${chatId}`);

  if (!isAllowed(env, chatId)) {
    // Lúc mới cài, chưa có chủ: báo Chat ID để điền vào cấu hình. Sau đó bỏ qua người lạ.
    if (env.ALLOWED_CHAT_ID === '') {
      await sendText(env, chatId, `Bot chưa được gán chủ.\nChat ID của bạn là ${chatId}. Điền số này vào ALLOWED_CHAT_ID trong wrangler.toml rồi deploy lại.`);
    }
    return;
  }

  if (cmd === '/start' || cmd === '/help') return sendText(env, chatId, HELP);

  if (cmd === '/huy') {
    await env.DRAFTS.delete(awaitKey(chatId));
    return sendText(env, chatId, 'Đã thôi góp ý. Bản nháp vẫn còn, bạn có thể bấm Duyệt hoặc Bỏ.');
  }

  // Đang chờ góp ý cho một bản nháp -> tin nhắn này là góp ý
  const waitingFor = cmd ? null : await env.DRAFTS.get(awaitKey(chatId));
  if (waitingFor) return revise(env, chatId, waitingFor, text);

  if (cmd === '/viet') return newDraft(env, chatId, rest.join(' '));
  if (cmd) return sendText(env, chatId, 'Không hiểu lệnh này. Gõ /help để xem hướng dẫn.');

  // Tin nhắn thường = chủ đề bài mới
  return newDraft(env, chatId, text);
}

/* ---------------------------------------------------------------- */

async function newDraft(env: Env, chatId: number, topic: string) {
  if (!topic.trim()) return sendText(env, chatId, 'Gõ chủ đề sau lệnh, ví dụ:\n/viet Tối ưu truy vấn với index trong SQL Server');

  await sendText(env, chatId, `Đang viết bài về: “${topic}”…\nThường mất khoảng 20–40 giây.`);
  await tg(env, 'sendChatAction', { chat_id: chatId, action: 'typing' }).catch(() => undefined);

  const history: Turn[] = [{ role: 'user', text: `Viết một bài blog về: ${topic}` }];
  const draft = await writeDraft(env, history);

  const stored: StoredDraft = {
    id: crypto.randomUUID().slice(0, 8),
    chatId,
    date: todayVN(),
    draft,
    history: [...history, { role: 'model', text: JSON.stringify(draft) }],
  };
  await present(env, stored);
}

async function revise(env: Env, chatId: number, id: string, feedback: string) {
  await env.DRAFTS.delete(awaitKey(chatId));
  const stored = await load(env, id);
  if (!stored) return sendText(env, chatId, 'Bản nháp này đã hết hạn hoặc đã được xử lý.');

  await sendText(env, chatId, 'Đang sửa bài theo góp ý…');
  await tg(env, 'sendChatAction', { chat_id: chatId, action: 'typing' }).catch(() => undefined);

  const history: Turn[] = [...stored.history, { role: 'user', text: `Viết lại toàn bộ bài theo góp ý sau: ${feedback}` }];
  const draft = await writeDraft(env, history);

  if (stored.messageId) await clearButtons(env, chatId, stored.messageId);
  stored.draft = draft;
  stored.history = [...history, { role: 'model', text: JSON.stringify(draft) }];
  await present(env, stored);
}

/** Gửi bản nháp cho anh xem: một tin xem trước + file .md đầy đủ có nút Duyệt / Sửa / Bỏ. */
async function present(env: Env, stored: StoredDraft) {
  const { draft, chatId, id } = stored;
  const md = buildMarkdown(draft, stored.date);
  const words = wordCount(draft.content);

  const previewBody = draft.content.length > 3000 ? `${draft.content.slice(0, 3000)}\n\n… (xem đủ trong file đính kèm)` : draft.content;
  await sendText(env, chatId, `${draft.title}\n\n${draft.excerpt}\nNhãn: ${draft.tags.join(', ') || '(không có)'}\n\n──────────\n${previewBody}`);

  const buttons: InlineKeyboard = {
    inline_keyboard: [
      [{ text: '✅ Duyệt & đăng', callback_data: `ok:${id}` }],
      [
        { text: '✏️ Sửa', callback_data: `edit:${id}` },
        { text: '❌ Bỏ', callback_data: `del:${id}` },
      ],
    ],
  };
  const sent = await sendDocument(
    env,
    chatId,
    `${slugify(draft.slug || draft.title)}.md`,
    md,
    `Bản nháp: ${draft.title}\n${words} từ · khoảng ${Math.max(1, Math.round(words / 220))} phút đọc`,
    buttons
  );

  stored.messageId = sent.message_id;
  await env.DRAFTS.put(draftKey(id), JSON.stringify(stored), { expirationTtl: DRAFT_TTL });
}

async function load(env: Env, id: string): Promise<StoredDraft | null> {
  const raw = await env.DRAFTS.get(draftKey(id));
  return raw ? (JSON.parse(raw) as StoredDraft) : null;
}

/* ---------------------------------------------------------------- */

async function onButton(cq: any, env: Env) {
  const chatId: number = cq.message?.chat?.id;
  const messageId: number = cq.message?.message_id;
  const answer = (text: string) => tg(env, 'answerCallbackQuery', { callback_query_id: cq.id, text }).catch(() => undefined);

  if (!chatId || !isAllowed(env, chatId)) return answer('Bạn không có quyền dùng bot này.');

  const [action, id] = String(cq.data ?? '').split(':');
  const stored = id ? await load(env, id) : null;
  if (!stored) {
    await clearButtons(env, chatId, messageId);
    return answer('Bản nháp đã hết hạn hoặc đã được xử lý.');
  }

  if (action === 'ok') {
    await answer('Đang đăng bài…');
    await clearButtons(env, chatId, messageId);
    const slug = await freeSlug(env, slugify(stored.draft.slug || stored.draft.title));
    await createFile(env, `${env.BLOG_DIR}/${slug}.md`, buildMarkdown(stored.draft, stored.date), `blog: ${stored.draft.title}`);
    await env.DRAFTS.delete(draftKey(id));
    return sendText(
      env,
      chatId,
      `Đã đăng “${stored.draft.title}”.\nCloudflare đang build lại trang, khoảng 1–2 phút nữa bài sẽ lên tại:\n${env.SITE_URL}/#/blog/${slug}`
    );
  }

  if (action === 'edit') {
    await answer('Nhắn góp ý cho bài này');
    await env.DRAFTS.put(awaitKey(chatId), id, { expirationTtl: 60 * 60 * 24 });
    return sendText(env, chatId, 'Bạn muốn sửa gì? Nhắn góp ý, ví dụ: "ngắn lại còn 600 từ", "thêm ví dụ code C#", "đổi tiêu đề".\nGõ /huy nếu đổi ý.');
  }

  if (action === 'del') {
    await answer('Đã bỏ bản nháp');
    await clearButtons(env, chatId, messageId);
    await env.DRAFTS.delete(draftKey(id));
    return sendText(env, chatId, 'Đã bỏ bản nháp.');
  }

  return answer('Không rõ thao tác.');
}

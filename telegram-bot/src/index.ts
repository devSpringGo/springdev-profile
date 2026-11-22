/**
 * Bot Telegram cho blog springgo.xyz:
 *   - Viết bài mới: nhắn chủ đề -> AI viết bản nháp -> duyệt -> tự đăng
 *   - Quản lý bài: /baiviet -> danh sách bài, mỗi bài có nút Xem / Sửa / Xoá
 *
 * Đường dẫn của Worker:
 *   POST /telegram           Telegram gọi vào đây (webhook), có kiểm tra secret
 *   GET  /setup?secret=...   Đăng ký webhook + danh sách lệnh với Telegram (chạy lại sau mỗi lần đổi lệnh)
 */
import type { Env, StoredDraft, Turn } from './types.ts';
import { buildMarkdown, draftFromMarkdown, formatDate, slugify, todayVN, wordCount } from './markdown.ts';
import { writeDraft } from './gemini.ts';
import { deleteFile, freeSlug, getFile, listPosts, putFile, type PostSummary } from './github.ts';
import { clearButtons, downloadFile, sendDocument, sendText, tg, type InlineKeyboard } from './telegram.ts';

const DRAFT_TTL = 60 * 60 * 24 * 7; // bản nháp giữ 7 ngày
const LIST_TTL = 60 * 60 * 24; // danh sách bài giữ 1 ngày (để các nút trong danh sách còn dùng được)
const PAGE_SIZE = 5;

const draftKey = (id: string) => `draft:${id}`;
const awaitKey = (chatId: number) => `await:${chatId}`; // đang chờ anh gửi góp ý / file cho bản nháp nào
const listKey = (chatId: number) => `list:${chatId}`;

const HELP = [
  'Bot quản lý blog springgo.xyz.',
  '',
  'VIẾT BÀI MỚI',
  '• Nhắn chủ đề (hoặc /viet <chủ đề>) để AI viết bản nháp.',
  '  Ví dụ: /viet Dùng rowversion để chống ghi đè dữ liệu trong SQL Server',
  '• Bản nháp gửi về kèm nút: Duyệt & đăng / Sửa / Bỏ.',
  '',
  'QUẢN LÝ BÀI ĐÃ ĐĂNG',
  '• /baiviet: danh sách bài, mỗi bài có nút Xem / Sửa / Xoá.',
  '',
  'KHI BẤM SỬA',
  '• Nhắn yêu cầu (ví dụ "ngắn lại", "thêm ví dụ C#") để AI sửa,',
  '  hoặc gửi file .md anh tự sửa.',
  '• /huy: thôi không sửa nữa.',
  '',
  '/id: xem Chat ID.',
].join('\n');

/* ================================================================ */

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

/* ================================================================ */

const isAllowed = (env: Env, chatId: number) => env.ALLOWED_CHAT_ID !== '' && String(chatId) === env.ALLOWED_CHAT_ID.trim();

const postUrl = (env: Env, slug: string) => `${env.SITE_URL}/#/blog/${slug}`;
const slugOf = (path: string) => path.split('/').pop()!.replace(/\.md$/, '');
const typing = (env: Env, chatId: number) => tg(env, 'sendChatAction', { chat_id: chatId, action: 'typing' }).catch(() => undefined);

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
      { command: 'baiviet', description: 'Danh sách bài đã đăng (xem / sửa / xoá)' },
      { command: 'huy', description: 'Thôi sửa bản nháp' },
      { command: 'help', description: 'Hướng dẫn' },
      { command: 'id', description: 'Xem Chat ID' },
    ],
  });
  return Response.json({ webhook, url: `${url.origin}/telegram` });
}

async function handleUpdate(update: any, env: Env) {
  if (update.callback_query) return onButton(update.callback_query, env);

  const msg = update.message;
  if (!msg) return;
  const chatId: number = msg.chat.id;
  const text: string = (msg.text ?? '').trim();
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
  if (cmd === '/baiviet' || cmd === '/ds') return showList(env, chatId, 0);

  if (cmd === '/huy') {
    await env.DRAFTS.delete(awaitKey(chatId));
    return sendText(env, chatId, 'Đã thôi sửa. Bản nháp vẫn còn, bạn có thể bấm Duyệt hoặc Bỏ.');
  }

  // Đang chờ góp ý / file cho một bản nháp
  const waitingFor = cmd ? null : await env.DRAFTS.get(awaitKey(chatId));

  if (msg.document) {
    if (!waitingFor) return sendText(env, chatId, 'Muốn thay nội dung bài bằng file này, hãy bấm ✏️ Sửa ở bài đó trước rồi gửi lại file.');
    return replaceWithFile(env, chatId, waitingFor, msg.document);
  }
  if (!text) return;

  if (waitingFor) return revise(env, chatId, waitingFor, text);
  if (cmd === '/viet') return newDraft(env, chatId, rest.join(' '));
  if (cmd) return sendText(env, chatId, 'Không hiểu lệnh này. Gõ /help để xem hướng dẫn.');

  // Tin nhắn thường = chủ đề bài mới
  return newDraft(env, chatId, text);
}

/* ================================================================
   Bản nháp: viết mới, sửa theo góp ý, thay bằng file, gửi cho anh duyệt
   ================================================================ */

async function newDraft(env: Env, chatId: number, topic: string) {
  if (!topic.trim()) return sendText(env, chatId, 'Gõ chủ đề sau lệnh, ví dụ:\n/viet Tối ưu truy vấn với index trong SQL Server');

  await sendText(env, chatId, `Đang viết bài về: “${topic}”…\nThường mất khoảng 20–40 giây.`);
  await typing(env, chatId);

  const history: Turn[] = [{ role: 'user', text: `Viết một bài blog về: ${topic}` }];
  const draft = await writeDraft(env, history);

  await present(env, {
    id: crypto.randomUUID().slice(0, 8),
    chatId,
    mode: 'new',
    date: todayVN(),
    draft,
    history: [...history, { role: 'model', text: JSON.stringify(draft) }],
  });
}

async function revise(env: Env, chatId: number, id: string, feedback: string) {
  await env.DRAFTS.delete(awaitKey(chatId));
  const stored = await loadDraft(env, id);
  if (!stored) return sendText(env, chatId, 'Bản nháp này đã hết hạn hoặc đã được xử lý.');

  await sendText(env, chatId, 'Đang sửa bài theo yêu cầu…');
  await typing(env, chatId);

  const history: Turn[] = [...stored.history, { role: 'user', text: `Viết lại toàn bộ bài theo yêu cầu sau: ${feedback}` }];
  const draft = await writeDraft(env, history);

  if (stored.messageId) await clearButtons(env, chatId, stored.messageId);
  // Bài đang sửa giữ nguyên đường dẫn cũ, AI không được đổi
  if (stored.mode === 'edit') draft.slug = stored.draft.slug;
  stored.draft = draft;
  stored.history = [...history, { role: 'model', text: JSON.stringify(draft) }];
  await present(env, stored);
}

/** Anh gửi file .md tự sửa: dùng nguyên nội dung file làm bản mới. */
async function replaceWithFile(env: Env, chatId: number, id: string, doc: { file_id: string; file_name?: string; file_size?: number }) {
  if (!/\.(md|markdown|txt)$/i.test(doc.file_name ?? '')) return sendText(env, chatId, 'Chỉ nhận file .md (hoặc .txt).');
  if ((doc.file_size ?? 0) > 1_000_000) return sendText(env, chatId, 'File quá lớn (tối đa 1 MB).');

  await env.DRAFTS.delete(awaitKey(chatId));
  const stored = await loadDraft(env, id);
  if (!stored) return sendText(env, chatId, 'Bản nháp này đã hết hạn hoặc đã được xử lý.');

  const raw = await downloadFile(env, doc.file_id);
  const { draft, meta } = draftFromMarkdown(raw, stored.draft.slug);
  if (!draft.content) return sendText(env, chatId, 'File không có nội dung bài viết.');
  if (stored.mode === 'edit' && meta.date) stored.date = meta.date;

  if (stored.messageId) await clearButtons(env, chatId, stored.messageId);
  stored.draft = draft;
  stored.history = [...stored.history, { role: 'user', text: 'Mình đã tự sửa bài, đây là bản mới.' }, { role: 'model', text: JSON.stringify(draft) }];
  await present(env, stored);
}

/** Gửi bản nháp cho anh xem: một tin xem trước + file .md đầy đủ có nút Duyệt / Sửa / Bỏ. */
async function present(env: Env, stored: StoredDraft) {
  const { draft, chatId, id } = stored;
  const md = buildMarkdown(draft, stored.date, stored.extraMeta);
  const words = wordCount(draft.content);
  const editing = stored.mode === 'edit';

  const previewBody = draft.content.length > 3000 ? `${draft.content.slice(0, 3000)}\n\n… (xem đủ trong file đính kèm)` : draft.content;
  await sendText(env, chatId, `${draft.title}\n\n${draft.excerpt}\nNhãn: ${draft.tags.join(', ') || '(không có)'}\n\n──────────\n${previewBody}`);

  const buttons: InlineKeyboard = {
    inline_keyboard: [
      [{ text: editing ? '✅ Duyệt & cập nhật' : '✅ Duyệt & đăng', callback_data: `ok:${id}` }],
      [
        { text: '✏️ Sửa tiếp', callback_data: `edit:${id}` },
        { text: '❌ Bỏ', callback_data: `del:${id}` },
      ],
    ],
  };
  const sent = await sendDocument(
    env,
    chatId,
    `${editing ? draft.slug : slugify(draft.slug || draft.title)}.md`,
    md,
    `${editing ? 'Bản sửa' : 'Bản nháp'}: ${draft.title}\n${words} từ · khoảng ${Math.max(1, Math.round(words / 220))} phút đọc`,
    buttons
  );

  stored.messageId = sent.message_id;
  await env.DRAFTS.put(draftKey(id), JSON.stringify(stored), { expirationTtl: DRAFT_TTL });
}

async function loadDraft(env: Env, id: string): Promise<StoredDraft | null> {
  const raw = await env.DRAFTS.get(draftKey(id));
  if (!raw) return null;
  const stored = JSON.parse(raw) as StoredDraft;
  stored.mode ??= 'new'; // bản nháp tạo trước khi có tính năng sửa bài
  return stored;
}

/* ================================================================
   Quản lý bài đã đăng: danh sách, xem, sửa, xoá
   ================================================================ */

async function loadList(env: Env, chatId: number): Promise<PostSummary[] | null> {
  const raw = await env.DRAFTS.get(listKey(chatId));
  return raw ? (JSON.parse(raw) as PostSummary[]) : null;
}

function listView(posts: PostSummary[], page: number): { text: string; keyboard: InlineKeyboard } {
  const pages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const p = Math.min(Math.max(page, 0), pages - 1);
  const start = p * PAGE_SIZE;
  const items = posts.slice(start, start + PAGE_SIZE);

  const lines = items.map((post, k) => `${start + k + 1}. ${post.title}\n    ${formatDate(post.date)}${post.tags.length ? ` · ${post.tags.join(', ')}` : ''}`);
  const text = posts.length
    ? `Bài viết trên blog (${posts.length} bài)${pages > 1 ? ` · trang ${p + 1}/${pages}` : ''}\n\n${lines.join('\n\n')}`
    : 'Blog chưa có bài nào. Nhắn chủ đề để viết bài đầu tiên.';

  const rows: InlineKeyboard['inline_keyboard'] = items.map((_, k) => {
    const i = start + k;
    const n = i + 1;
    return [
      { text: `📖 ${n}`, callback_data: `p:${i}` },
      { text: `✏️ Sửa ${n}`, callback_data: `e:${i}` },
      { text: `🗑 Xoá ${n}`, callback_data: `d:${i}` },
    ];
  });
  const nav = [
    ...(p > 0 ? [{ text: '« Trước', callback_data: `pg:${p - 1}` }] : []),
    { text: '🔄 Tải lại', callback_data: `pg:r${p}` },
    ...(p < pages - 1 ? [{ text: 'Sau »', callback_data: `pg:${p + 1}` }] : []),
  ];
  rows.push(nav);
  return { text, keyboard: { inline_keyboard: rows } };
}

/** Gửi danh sách bài (tin mới) hoặc cập nhật tin danh sách đang có (khi chuyển trang). */
async function showList(env: Env, chatId: number, page: number, editMessageId?: number, reload = true) {
  let posts = reload ? null : await loadList(env, chatId);
  if (!posts) {
    posts = await listPosts(env);
    await env.DRAFTS.put(listKey(chatId), JSON.stringify(posts), { expirationTtl: LIST_TTL });
  }
  const { text, keyboard } = listView(posts, page);
  if (editMessageId) {
    return tg(env, 'editMessageText', { chat_id: chatId, message_id: editMessageId, text, reply_markup: keyboard }).catch(() =>
      undefined // Telegram báo lỗi nếu nội dung không đổi: bỏ qua
    );
  }
  return sendText(env, chatId, text, { reply_markup: keyboard });
}

/** Lấy bài thứ i trong danh sách đã lưu, kèm nội dung hiện tại trên GitHub. */
async function pickPost(env: Env, chatId: number, i: number) {
  const posts = await loadList(env, chatId);
  const summary = posts?.[i];
  if (!summary) return null;
  const file = await getFile(env, summary.path);
  return file ? { summary, file } : null;
}

async function viewPost(env: Env, chatId: number, i: number) {
  const picked = await pickPost(env, chatId, i);
  if (!picked) return sendText(env, chatId, 'Không tìm thấy bài này (có thể đã bị xoá). Gõ /baiviet để tải lại danh sách.');
  const { summary, file } = picked;
  const { draft } = draftFromMarkdown(file.text, summary.slug);

  const preview = draft.content.length > 1500 ? `${draft.content.slice(0, 1500)}\n\n… (xem đủ trong file đính kèm)` : draft.content;
  await sendText(env, chatId, `${draft.title}\n${formatDate(summary.date)} · ${wordCount(draft.content)} từ\n${draft.excerpt}\n\n──────────\n${preview}`);
  await sendDocument(env, chatId, `${summary.slug}.md`, file.text, `${draft.title}\n${postUrl(env, summary.slug)}`, {
    inline_keyboard: [
      [
        { text: '✏️ Sửa', callback_data: `e:${i}` },
        { text: '🗑 Xoá', callback_data: `d:${i}` },
      ],
      [{ text: '🌐 Mở trên web', url: postUrl(env, summary.slug) }],
    ],
  });
}

async function startEdit(env: Env, chatId: number, i: number) {
  const picked = await pickPost(env, chatId, i);
  if (!picked) return sendText(env, chatId, 'Không tìm thấy bài này (có thể đã bị xoá). Gõ /baiviet để tải lại danh sách.');
  const { summary, file } = picked;
  const { draft, meta } = draftFromMarkdown(file.text, summary.slug);

  const stored: StoredDraft = {
    id: crypto.randomUUID().slice(0, 8),
    chatId,
    mode: 'edit',
    path: summary.path,
    extraMeta: meta,
    date: meta.date || todayVN(),
    draft,
    history: [
      { role: 'user', text: 'Đây là một bài đã đăng trên blog. Mình sẽ gửi yêu cầu sửa ngay sau đây.' },
      { role: 'model', text: JSON.stringify(draft) },
    ],
  };
  await env.DRAFTS.put(draftKey(stored.id), JSON.stringify(stored), { expirationTtl: DRAFT_TTL });
  await env.DRAFTS.put(awaitKey(chatId), stored.id, { expirationTtl: 60 * 60 * 24 });

  return sendText(
    env,
    chatId,
    `Sửa bài “${draft.title}”.\n\nCó 2 cách:\n• Nhắn yêu cầu để AI sửa, ví dụ: "thêm phần ví dụ C#", "sửa lỗi chính tả", "đổi tiêu đề thành …".\n• Hoặc gửi file .md anh tự sửa (bấm 📖 Xem để tải file hiện tại về).\n\nGõ /huy nếu đổi ý.`
  );
}

async function confirmDelete(env: Env, chatId: number, i: number) {
  const posts = await loadList(env, chatId);
  const summary = posts?.[i];
  if (!summary) return sendText(env, chatId, 'Danh sách đã cũ. Gõ /baiviet để tải lại.');
  return sendText(env, chatId, `Xoá bài “${summary.title}”?\nBài sẽ biến mất khỏi trang sau 1–2 phút (vẫn còn trong lịch sử git nếu cần khôi phục).`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🗑 Xoá hẳn', callback_data: `dx:${i}` },
          { text: 'Thôi', callback_data: 'x' },
        ],
      ],
    },
  });
}

async function doDelete(env: Env, chatId: number, i: number) {
  const picked = await pickPost(env, chatId, i);
  if (!picked) return sendText(env, chatId, 'Bài này không còn trên GitHub (có thể đã bị xoá trước đó).');
  await deleteFile(env, picked.file.path, picked.file.sha, `blog: xoá bài ${picked.summary.title}`);
  await env.DRAFTS.delete(listKey(chatId)); // danh sách cũ không còn đúng
  return sendText(env, chatId, `Đã xoá “${picked.summary.title}”. Cloudflare đang build lại trang, 1–2 phút nữa bài sẽ biến mất.\nGõ /baiviet để xem danh sách mới.`);
}

/* ================================================================
   Xử lý nút bấm
   ================================================================ */

async function onButton(cq: any, env: Env) {
  const chatId: number = cq.message?.chat?.id;
  const messageId: number = cq.message?.message_id;
  const answer = (text = '') => tg(env, 'answerCallbackQuery', { callback_query_id: cq.id, text }).catch(() => undefined);

  if (!chatId || !isAllowed(env, chatId)) return answer('Bạn không có quyền dùng bot này.');

  const data = String(cq.data ?? '');
  const [action, arg = ''] = data.split(':');
  const index = Number(arg);

  // ---- Danh sách bài ----
  switch (action) {
    case 'pg': {
      await answer();
      const reload = arg.startsWith('r');
      return showList(env, chatId, Number(arg.replace('r', '')) || 0, messageId, reload);
    }
    case 'p':
      await answer();
      return viewPost(env, chatId, index);
    case 'e':
      await answer('Gửi yêu cầu sửa');
      return startEdit(env, chatId, index);
    case 'd':
      await answer();
      return confirmDelete(env, chatId, index);
    case 'dx':
      await answer('Đang xoá…');
      await clearButtons(env, chatId, messageId);
      return doDelete(env, chatId, index);
    case 'x':
      await answer('Đã huỷ');
      await clearButtons(env, chatId, messageId);
      return sendText(env, chatId, 'Đã huỷ, bài vẫn giữ nguyên.');
  }

  // ---- Bản nháp (bài mới hoặc bản sửa) ----
  const stored = arg ? await loadDraft(env, arg) : null;
  if (!stored) {
    await clearButtons(env, chatId, messageId);
    return answer('Bản nháp đã hết hạn hoặc đã được xử lý.');
  }
  const { draft } = stored;

  if (action === 'ok') {
    await answer(stored.mode === 'edit' ? 'Đang cập nhật…' : 'Đang đăng bài…');
    await clearButtons(env, chatId, messageId);

    if (stored.mode === 'edit' && stored.path) {
      // Lấy sha mới nhất ngay lúc ghi để không bị GitHub từ chối
      const current = await getFile(env, stored.path);
      await putFile(env, stored.path, buildMarkdown(draft, stored.date, stored.extraMeta), `blog: cập nhật ${draft.title}`, current?.sha);
      await env.DRAFTS.delete(draftKey(stored.id));
      await env.DRAFTS.delete(listKey(chatId));
      return sendText(env, chatId, `Đã cập nhật “${draft.title}”.\nCloudflare đang build lại trang, khoảng 1–2 phút nữa bản mới sẽ lên tại:\n${postUrl(env, slugOf(stored.path))}`);
    }

    const slug = await freeSlug(env, slugify(draft.slug || draft.title));
    await putFile(env, `${env.BLOG_DIR}/${slug}.md`, buildMarkdown(draft, stored.date), `blog: ${draft.title}`);
    await env.DRAFTS.delete(draftKey(stored.id));
    await env.DRAFTS.delete(listKey(chatId));
    return sendText(env, chatId, `Đã đăng “${draft.title}”.\nCloudflare đang build lại trang, khoảng 1–2 phút nữa bài sẽ lên tại:\n${postUrl(env, slug)}`);
  }

  if (action === 'edit') {
    await answer('Gửi yêu cầu sửa');
    await env.DRAFTS.put(awaitKey(chatId), stored.id, { expirationTtl: 60 * 60 * 24 });
    return sendText(
      env,
      chatId,
      'Bạn muốn sửa gì? Nhắn yêu cầu, ví dụ: "ngắn lại còn 600 từ", "thêm ví dụ code C#", "đổi tiêu đề".\nHoặc gửi file .md đã tự sửa.\nGõ /huy nếu đổi ý.'
    );
  }

  if (action === 'del') {
    await answer('Đã bỏ');
    await clearButtons(env, chatId, messageId);
    await env.DRAFTS.delete(draftKey(stored.id));
    return sendText(env, chatId, stored.mode === 'edit' ? 'Đã bỏ bản sửa, bài trên trang giữ nguyên.' : 'Đã bỏ bản nháp.');
  }

  return answer('Không rõ thao tác.');
}

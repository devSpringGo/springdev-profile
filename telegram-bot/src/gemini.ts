import type { Draft, Env, Turn } from './types.ts';
import { DRAFT_SCHEMA, SYSTEM_PROMPT } from './prompt.ts';

/** Ảnh gửi kèm lượt hỏi cuối cùng để AI nhìn thấy (không lưu vào lịch sử cho nhẹ). */
export type Attachment = { mimeType: string; data: string /* base64 */ };

/** Gọi Gemini để viết (hoặc viết lại) bài. `history` là toàn bộ cuộc hội thoại tới giờ. */
export async function writeDraft(env: Env, history: Turn[], attachments: Attachment[] = []): Promise<Draft> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(env.GEMINI_MODEL)}:generateContent`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: history.map((t, i) => ({
        role: t.role,
        parts: [
          ...(i === history.length - 1 ? attachments.map((a) => ({ inlineData: { mimeType: a.mimeType, data: a.data } })) : []),
          { text: t.text },
        ],
      })),
      generationConfig: {
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: DRAFT_SCHEMA,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini trả lỗi ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] }; finishReason?: string }[];
  };
  const candidate = data.candidates?.[0];
  const text = (candidate?.content?.parts ?? [])
    .filter((p) => !p.thought)
    .map((p) => p.text ?? '')
    .join('');

  let draft: Draft;
  try {
    draft = JSON.parse(text);
  } catch {
    throw new Error(`Không đọc được kết quả từ Gemini (finishReason: ${candidate?.finishReason ?? 'không rõ'}).`);
  }

  if (!draft?.title || !draft?.content) throw new Error('Gemini trả về bài thiếu tiêu đề hoặc nội dung.');
  return {
    title: String(draft.title),
    slug: String(draft.slug ?? ''),
    tags: Array.isArray(draft.tags) ? draft.tags.map(String).slice(0, 3) : [],
    excerpt: String(draft.excerpt ?? ''),
    content: String(draft.content),
  };
}

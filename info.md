# springgo.xyz — Ghi chú dự án

Tổng kết các thay đổi lớn và cách vận hành trang hồ sơ + blog cá nhân của Nguyễn Xuân Tiến.
Cập nhật: 22/11/2026.

---

## 1. Tổng quan

| Thành phần | Công nghệ | Chạy ở đâu |
|---|---|---|
| Trang web (hồ sơ + blog) | React 19, TypeScript, Vite, Tailwind (CDN) | Cloudflare Pages, tự build khi có commit lên nhánh `Main` |
| Bot Telegram viết / quản lý bài | Cloudflare Worker (TypeScript), Gemini API, GitHub API | Cloudflare Workers: `springgo-blog-bot` |
| Trợ lý hỏi đáp trên trang | Gemini API (`services/geminiService.ts`) | Chạy trên trình duyệt |

- Repo: `devSpringGo/springdev-profile`, nhánh `Main`
- Cloudflare Pages: project `springdev-profile`, build `npm run build`, thư mục `dist`, biến môi trường `VITE_GEMINI_API_KEY`
- Tên miền: springgo.xyz, www.springgo.xyz

---

## 2. Giao diện trang web

### Hướng thiết kế
- Bỏ các chi tiết kiểu template AI: gradient tím, nền hạt, con trỏ tuỳ biến, pháo hoa / trang trí Tết, nhạc tự phát, số liệu ảo.
- Bố cục **trang chủ cá nhân** (không phải kiểu CV hai cột), nội dung xưng **"mình"**, kể chuyện thay vì liệt kê.
- Màu sáng chủ đạo, màu nhấn xanh dương, có **nút chuyển sáng / tối** (nhớ lựa chọn; mặc định theo máy).
- Font: Be Vietnam Pro (chữ), JetBrains Mono (số / ngày).

### Cấu trúc trang chủ (từ trên xuống)
1. **Thanh menu ngang**: logo `</> DEVSPRING`, các mục Về mình / Dự án / Hành trình / Blog, nút "Nhắn cho mình", nút sáng / tối.
2. **Màn hình mở đầu**: "Xin chào, mình là Tiến." trên nền tranh phong cảnh.
3. **Lớp nội dung** bo góc, trượt lên phủ phong cảnh khi cuộn:
   - **Về mình** (lưới các ô): câu chuyện + số liệu thật, ô "Bây giờ", giờ hiện tại ở Đà Nẵng, ô "Đồ nghề", ô mời liên hệ.
   - **Dự án**: 1 thẻ lớn + 4 thẻ, mỗi thẻ có hình minh hoạ vẽ bằng code.
   - **Hành trình**: 4 chặng nằm ngang từ 2019 đến nay, chi tiết công việc thu gọn.
   - **Blog**: 3 bài mới nhất.
   - **Liên hệ**: email, điện thoại, form gửi lời nhắn về Telegram của anh (xem mục 5b).

### Nền trang
Chọn ở `ACTIVE_BACKGROUND` trong `data/profile.ts`:

| Giá trị | Nền |
|---|---|
| `'phongCanh'` (đang dùng) | Tranh núi – biển vẽ bằng SVG: bình minh (sáng) / đêm trăng có sao (tối) |
| `'songHan'` | Ảnh cầu sông Hàn về đêm (CC0) — `img/danang-han-river.jpg` |
| `'phaoHoa'` | Ảnh pháo hoa cầu Rồng (CC BY-SA 4.0, **bắt buộc giữ ghi nguồn**) — `img/danang-fireworks.jpg` |
| `'duongDongMuc'` | Các đường đồng mức kiểu bản đồ địa hình |

Màu tranh phong cảnh: các biến `--sky-*`, `--mtn-*`, `--sea-*` trong `index.html`.

### Dự án đang hiển thị

| Dự án | Công nghệ |
|---|---|
| Quản lý thiết bị công ty (thẻ lớn) | ASP.NET Core, React, SQL Server |
| Quản lý công việc & chấm KPI | ASP.NET Core, React, SQL Server |
| Quản lý khách hàng tiềm năng mùa Trung thu | ASP.NET Core, React, SQL Server |
| Quản lý camera & đầu ghi | C#, WinForms |
| Tool chuyển văn bản thành giọng nói (28 giọng tiếng Việt) | Python |

---

## 3. Sửa nội dung ở đâu

| Muốn sửa | File |
|---|---|
| Tên, lời giới thiệu, trạng thái, email, điện thoại, ảnh đại diện | `data/profile.ts` → `PROFILE` |
| Mục "Bây giờ" (nhớ sửa ngày `updated`) | `data/profile.ts` → `NOW` |
| Đồ nghề (công cụ theo mức độ quen tay) | `data/profile.ts` → `TOOLBOX` |
| Hành trình | `data/profile.ts` → `JOURNEY` |
| Dự án (dự án đầu tiên = thẻ lớn) | `data/profile.ts` → `WORKS` |
| Nền trang | `data/profile.ts` → `ACTIVE_BACKGROUND` |
| Bài blog | `content/blog/*.md` (hoặc dùng bot Telegram) |
| Ảnh trong bài | `public/images/blog/` (bot tự đưa ảnh vào đây) |
| Favicon (chữ T ghép từ lưới 3×3) | `public/favicon.svg` (bản gốc, tự đổi màu sáng / tối) + `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `site.webmanifest`. Đổi hình thì phải xuất lại các file PNG / ICO |
| Tiêu đề / mô tả trang khi chia sẻ link, tên blog | `lib/blog.ts` → `SITE` |
| Thông tin trợ lý AI trên trang dùng để trả lời | `services/geminiService.ts` → `RESUME_CONTEXT` |
| Màu sắc, font | `index.html` (biến CSS `--paper`, `--ink`, `--accent`...) |

---

## 4. Blog

- Trang danh sách `/blog` (lọc theo chủ đề, tìm kiếm, nhóm theo năm, link RSS) và trang đọc bài `/blog/<ten-file>`.
  Link kiểu cũ `#/blog/<ten-file>` vẫn dùng được, tự chuyển sang đường dẫn mới.
- Trang đọc bài có: **mục lục** (bên phải trên màn hình rộng, thu gọn ở đầu bài trên điện thoại, tự sáng mục đang đọc;
  chỉ hiện khi bài có từ 3 tiêu đề `##`/`###`), **thanh tiến độ đọc** ở mép trên, số phút đọc,
  **tô màu code** (C#, SQL, TS/JS, Python, Bash, PowerShell, JSON, XML/HTML, CSS, YAML) và **nút Chép** trên mỗi khối code.
- Mỗi bài là một file `content/blog/<ten-bai>.md`, tự hiện lên trang khi build:

```markdown
---
title: Tiêu đề bài
date: 2026-11-20
tags: SQL Server, Kinh nghiệm
excerpt: Một câu tóm tắt hiển thị ở danh sách.
draft: false
---

Nội dung bài viết bằng Markdown...
```

- Markdown hỗ trợ: `##`, `###`, đoạn văn, danh sách `-` và `1.`, trích dẫn `>`, khối code, `code`, **đậm**, [liên kết](url),
  **bảng** (`| a | b |` + dòng `|---|---|`, căn lề bằng `:---:`, viết `\|` để có dấu | trong ô),
  **ảnh** nằm riêng một dòng: `![mô tả](/images/blog/ten-anh.jpg "chú thích")` (chú thích không bắt buộc, không có thì lấy mô tả).
  Không hỗ trợ: HTML, chữ nghiêng, tiêu đề cấp 4.
  Bộ đọc Markdown nằm ở `lib/markdown.ts` (dùng chung cho trang và lúc build).

### SEO
Khi build, `vite-plugin-blog.ts` tạo thêm trong `dist/`:

| File | Dùng để |
|---|---|
| `blog.html`, `blog/<ten-file>.html` | Trang có sẵn tiêu đề, mô tả, ảnh xem trước (Open Graph), JSON-LD và nội dung bài, để Google và Facebook / Zalo đọc được không cần JavaScript |
| `rss.xml` | RSS (30 bài mới nhất, có nội dung đầy đủ) |
| `sitemap.xml`, `robots.txt` | Cho Google |

- Ảnh xem trước khi chia sẻ link = ảnh đầu tiên trong bài; bài không có ảnh thì dùng ảnh đại diện.
- Nên vào **Google Search Console**, thêm springgo.xyz và gửi `https://springgo.xyz/sitemap.xml`.
- `draft: true` = ẩn bài.
- Bài hiện có: 3 bài mẫu (Stored Procedure, phân trang dữ liệu lớn, từ WinForms sang web) + bài n8n đăng qua bot.

---

## 5. Bot Telegram @springgo_blog_bot

Mã nguồn: `telegram-bot/` — hướng dẫn cài đặt chi tiết trong `telegram-bot/README.md`.

### Luồng hoạt động
```
Telegram ──► Cloudflare Worker ──► Gemini viết bài
                 │
                 ├─ lưu bản nháp (Cloudflare KV), gửi lại kèm nút Duyệt / Sửa / Bỏ
                 │
                 └─ Duyệt: commit file .md (kèm ảnh, nếu có, trong cùng một commit) lên GitHub ──► Cloudflare Pages build lại trang (1–2 phút)
```

### Lệnh

| Lệnh / nút | Tác dụng |
|---|---|
| `/viet <chủ đề>` hoặc nhắn chủ đề | AI viết bản nháp mới |
| ✅ Duyệt & đăng / ✏️ Sửa / ❌ Bỏ | Xử lý bản nháp |
| `/baiviet` | Danh sách bài đã đăng, mỗi bài có 📖 Xem / ✏️ Sửa / 🗑 Xoá |
| ✏️ Sửa (bài đã đăng) | Nhắn yêu cầu cho AI **hoặc** gửi file `.md` tự sửa → Duyệt & cập nhật (giữ nguyên đường dẫn và ngày đăng) |
| 🗑 Xoá | Hỏi xác nhận trước khi xoá (bài vẫn còn trong lịch sử git) |
| Gửi ảnh (từng ảnh một) | Khi đang có bản nháp hoặc sau khi bấm ✏️ Sửa: AI nhìn ảnh rồi chèn vào chỗ hợp lý. Ghi chú thích để chỉ chỗ đặt. Tối đa 10 ảnh / bài, 5 MB / ảnh |
| `/huy` | Thôi sửa |
| `/help`, `/id` | Hướng dẫn, xem Chat ID |

### Cấu hình hiện tại
- Worker: `https://springgo-blog-bot.xuantien8a2.workers.dev`
- Chỉ nghe lệnh từ Chat ID `5642891542` (`ALLOWED_CHAT_ID` trong `telegram-bot/wrangler.toml`)
- Model AI: `gemini-3-flash-preview` (`GEMINI_MODEL`)
- KV lưu bản nháp: `DRAFTS` (giữ 7 ngày)
- Khoá bí mật trên Cloudflare (không nằm trong code): `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, `GEMINI_API_KEY`, `GITHUB_TOKEN`

### Lệnh hay dùng (chạy trong thư mục `telegram-bot`)
```bash
npm run deploy      # đưa bản mới lên Cloudflare
npm run logs        # xem log khi bot báo lỗi
npm run typecheck   # kiểm tra TypeScript
npm test            # chạy test
npx wrangler secret put GITHUB_TOKEN   # thay token (ví dụ khi hết hạn)
```
Sau khi đổi danh sách lệnh của bot, mở lại `https://springgo-blog-bot.xuantien8a2.workers.dev/setup?secret=<TELEGRAM_WEBHOOK_SECRET>`.

Đổi giọng văn / độ dài bài: sửa `telegram-bot/src/prompt.ts` rồi `npm run deploy`.

---

## 5b. Form liên hệ → Telegram

```
Người xem điền form ──► POST /api/contact (Cloudflare Pages Function, functions/api/contact.ts)
                              │  kiểm tra dữ liệu, ô bẫy bot, Turnstile (nếu bật)
                              └─► bot @springgo_blog_bot nhắn lời nhắn vào Telegram của anh
```

- Code: `functions/api/contact.ts` (phía máy chủ), `components/Contact.tsx` (form), `lib/contact.ts` (quy tắc dùng chung).
  Thư mục `functions/` được Cloudflare Pages tự deploy cùng trang, không cần Worker riêng.
- Form chỉ báo "Đã gửi" khi máy chủ nhận thật; lỗi thì giữ nguyên nội dung và gợi ý gửi email trực tiếp.
- Chống spam: ô bẫy ẩn (luôn bật) + Cloudflare Turnstile (bật khi có khoá, xem dưới).
- Trả lời người gửi: bấm vào địa chỉ email trong tin Telegram.

### Cấu hình (Cloudflare Dashboard → Workers & Pages → springdev-profile → Settings → Variables and Secrets)

| Biến | Loại | Giá trị |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Secret | Token của bot (giống bot viết blog) |
| `TELEGRAM_CHAT_ID` | Text | `5642891542` |
| `TURNSTILE_SECRET_KEY` | Secret | (không bắt buộc) Secret key của Turnstile |
| `VITE_TURNSTILE_SITE_KEY` | Text | (không bắt buộc) Site key của Turnstile, dùng lúc build |

Thêm / đổi biến xong phải **deploy lại** (Deployments → Retry deployment, hoặc push commit mới).

Bật Turnstile: Cloudflare Dashboard → Turnstile → Add widget → tên `springgo`, tên miền `springgo.xyz` và `www.springgo.xyz`,
Widget mode **Managed** → lấy Site key và Secret key điền vào 2 biến trên.

Thiếu `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` thì form báo "chưa được cấu hình" kèm địa chỉ email để người xem gửi trực tiếp.
Khi chạy `npm run dev` form cũng báo lỗi như vậy (máy chủ Vite không chạy `functions/`), đó là bình thường.

---

## 6. Chạy và deploy

```bash
npm install
npm run dev       # xem trên máy: http://localhost:3000
npm run build     # build ra dist/
```

Deploy: chỉ cần push lên `Main`, Cloudflare Pages tự build.

> **Luôn `git pull` trước khi push** — bot tạo commit mới trên GitHub mỗi lần đăng / sửa / xoá bài.

---

## 7. Lịch sử sự cố

- **Push bị GitHub từ chối** vì `img/Antigravity.exe` (234 MB > giới hạn 100 MB).
  Đã gỡ file khỏi commit chưa push (file vẫn còn trên máy) và thêm `*.exe` vào `.gitignore`.

---

## 8. Việc nên làm tiếp

1. **Giấu key Gemini của khung chat**: hiện `VITE_GEMINI_API_KEY` nằm trong mã chạy trên trình duyệt, ai cũng lấy được.
   Nên cho khung chat gọi Gemini qua Worker.
2. **Xoá `telegram-bot/.dev.vars`** nếu không chạy thử bot trên máy (file chứa token thật, đã được gitignore).
3. **Theo dõi hạn GitHub token** của bot. Hết hạn → bot báo lỗi 401/403 → tạo token mới và `npx wrangler secret put GITHUB_TOKEN`.
4. **Đọc lại nội dung viết hộ**: 3 bài blog mẫu và một số câu giới thiệu trong `data/profile.ts`.
5. **Thử Sửa / Xoá bài qua bot** với một bài trước khi dùng thường xuyên (chưa chạy thử thật).
6. **Dọn dẹp (không bắt buộc)**: các component không còn dùng
   (`ParticleBackground`, `CustomCursor`, `AudioPlayer`, `CommandPalette`, `TiltCard`, `SpotlightCard`, `TechMarquee`, `ScrollToTop`, `LuckyMoney`),
   ảnh `img/danang-*.jpg` nếu không dùng nền ảnh chụp, và `img/Antigravity.exe`.

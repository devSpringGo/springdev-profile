# Bot Telegram viết bài cho blog

Nhắn chủ đề cho bot → AI (Gemini) viết bản nháp → anh duyệt ngay trong Telegram → bot đăng bài lên GitHub → Cloudflare Pages tự build lại trang.

```
Telegram ──► Cloudflare Worker (thư mục này) ──► Gemini viết bài
                     │
                     ├─ lưu bản nháp vào Cloudflare KV, gửi lại cho anh kèm nút  [Duyệt & đăng] [Sửa] [Bỏ]
                     │
                     └─ khi Duyệt: tạo file content/blog/<ten-bai>.md trên GitHub
                                            │
                                            ▼
                              Cloudflare Pages build lại springgo.xyz
```

## Cách dùng

| Nhắn cho bot | Kết quả |
|---|---|
| `/viet Dùng rowversion để chống ghi đè dữ liệu` | AI viết bản nháp về chủ đề đó |
| Một câu bình thường (không có `/`) | Cũng được hiểu là chủ đề bài mới |
| Thêm yêu cầu vào chủ đề, ví dụ `…, khoảng 800 từ, có ví dụ C#` | AI viết theo yêu cầu |
| Bấm **✏️ Sửa** rồi nhắn góp ý | AI viết lại cả bài theo góp ý |
| Bấm **✅ Duyệt & đăng** | Bài được đăng, khoảng 1–2 phút sau có trên trang |
| Bấm **❌ Bỏ** | Xoá bản nháp |
| `/baiviet` | Danh sách bài đã đăng (5 bài mỗi trang), mỗi bài có nút **📖 Xem / ✏️ Sửa / 🗑 Xoá** |
| **📖 Xem** | Xem trước nội dung + tải file `.md` của bài, có nút mở bài trên web |
| **✏️ Sửa** ở bài đã đăng | Nhắn yêu cầu để AI sửa, **hoặc gửi file `.md` anh tự sửa**. Bot gửi bản sửa kèm nút **Duyệt & cập nhật / Sửa tiếp / Bỏ**. Bài giữ nguyên đường dẫn và ngày đăng |
| **🗑 Xoá** | Bot hỏi xác nhận, bấm **Xoá hẳn** thì bài biến mất khỏi trang sau 1–2 phút (vẫn còn trong lịch sử git) |
| Gửi ảnh (từng ảnh một) | Ảnh được gắn vào bản nháp đang mở (sau khi bấm **✏️ Sửa**) hoặc bản nháp gửi gần nhất. AI xem ảnh rồi chèn `![mô tả](/images/blog/...)` vào chỗ hợp lý; ghi chú thích cho ảnh để chỉ chỗ đặt. Ảnh nằm tạm trong KV, khi **Duyệt** thì bài + ảnh lên GitHub trong **một commit** (thư mục `public/images/blog/`). Tối đa 10 ảnh / bài, 5 MB / ảnh. Chưa nhận album nhiều ảnh gửi cùng lúc |
| `/huy` | Thôi sửa (sau khi lỡ bấm Sửa) |
| `/id` | Xem Chat ID |

Bản nháp được giữ 7 ngày. Bot chỉ nghe lệnh từ đúng tài khoản Telegram của anh.

---

## Cài đặt (làm một lần)

Cần: Node.js 18+, tài khoản Cloudflare (đang dùng cho springgo.xyz), GitHub, Telegram.

### Bước 0. Kiểm tra Cloudflare Pages tự build khi có commit mới

Bot chỉ thêm file `.md` vào repo, **không** build trang. Vì vậy Cloudflare Pages phải tự build mỗi khi có commit mới.

Vào **Cloudflare Dashboard → Workers & Pages → project springgo.xyz → Settings → Build**:

- Project phải được kết nối với GitHub repo `devSpringGo/springdev-profile`, nhánh `Main`.
  Nếu đang là *Direct Upload* (tự tải thư mục `dist` lên) thì phải tạo lại project theo kiểu **Connect to Git**.
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Environment variables:** thêm `VITE_GEMINI_API_KEY` (key cho khung chat trên trang), vì lúc build trên Cloudflare không có file `.env` của máy anh.

Sau khi đổi, push thử một commit bất kỳ và kiểm tra Cloudflare có tự build thành công không.

### Bước 1. Tạo bot Telegram

1. Mở Telegram, nhắn cho **@BotFather** → `/newbot` → đặt tên, ví dụ `springgo_blog_bot`.
2. BotFather trả về **token** dạng `123456:ABC-...`. Giữ kín token này.

### Bước 2. Tạo GitHub token (chỉ có quyền ghi vào repo này)

GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**:

- **Repository access:** *Only select repositories* → `springdev-profile`
- **Permissions → Repository permissions → Contents:** *Read and write*
- Hạn dùng: tuỳ anh, ví dụ 1 năm. Hết hạn thì tạo lại và cập nhật ở Bước 4.

### Bước 3. Lấy Gemini API key

Vào <https://aistudio.google.com/apikey> → **Create API key**. Nên tạo key riêng cho bot, không dùng chung với key của trang.

### Bước 4. Deploy Worker

Chạy trong thư mục `telegram-bot`:

```bash
npm install
npx wrangler login                         # đăng nhập Cloudflare trên trình duyệt

npx wrangler kv namespace create DRAFTS    # tạo nơi lưu bản nháp
# -> copy giá trị "id" in ra, dán vào dòng id = "..." trong wrangler.toml

npx wrangler secret put TELEGRAM_BOT_TOKEN       # dán token ở Bước 1
npx wrangler secret put GITHUB_TOKEN             # dán token ở Bước 2
npx wrangler secret put GEMINI_API_KEY           # dán key ở Bước 3
npx wrangler secret put TELEGRAM_WEBHOOK_SECRET  # tự đặt một chuỗi ngẫu nhiên, chỉ gồm chữ, số, _ và -
                                                 # ví dụ: springgo_8f3k2Lq9xT7mWp4Z

npm run deploy
# -> wrangler in ra địa chỉ Worker, dạng https://springgo-blog-bot.<tên-tài-khoản>.workers.dev
```

### Bước 5. Nối bot với Worker

Mở trên trình duyệt (thay địa chỉ và chuỗi bí mật của anh):

```
https://springgo-blog-bot.<tên-tài-khoản>.workers.dev/setup?secret=<TELEGRAM_WEBHOOK_SECRET>
```

Thấy `"webhook": true` là xong.

### Bước 6. Gán bot cho riêng anh

1. Nhắn `/id` cho bot → bot trả về Chat ID.
2. Điền số đó vào `ALLOWED_CHAT_ID = "..."` trong `wrangler.toml`.
3. Chạy lại `npm run deploy`.

Giờ nhắn `/viet <chủ đề>` để viết bài đầu tiên.

---

## Tuỳ chỉnh

- **Giọng văn, độ dài, nhãn bài viết:** sửa `src/prompt.ts`, rồi `npm run deploy`.
- **Đổi model AI:** sửa `GEMINI_MODEL` trong `wrangler.toml`.
- **Xem log khi có lỗi:** `npm run logs` (để cửa sổ chạy, rồi nhắn bot).
- **Chạy thử trên máy:** copy `.dev.vars.example` thành `.dev.vars`, điền khoá, rồi `npm run dev`.
  Lưu ý Telegram không gọi được vào máy anh, nên cách này chủ yếu để thử `/setup` và kiểm tra lỗi cú pháp.
- **Kiểm tra code:** `npm run typecheck` và `npm test`.

## Gỡ lỗi nhanh

| Hiện tượng | Nguyên nhân thường gặp |
|---|---|
| Nhắn bot không thấy trả lời | Chưa chạy Bước 5, hoặc `TELEGRAM_WEBHOOK_SECRET` khi đặt và khi mở `/setup` khác nhau |
| Bot trả "Bot chưa được gán chủ" | Chưa làm Bước 6 |
| "Gemini trả lỗi 404" | Tên model trong `GEMINI_MODEL` không còn tồn tại, đổi sang model hiện có |
| "GitHub trả lỗi 403/404" | Token thiếu quyền *Contents: Read and write*, chọn sai repo, hoặc token hết hạn |
| Đã đăng nhưng trang không có bài mới | Cloudflare Pages chưa tự build (xem Bước 0), hoặc build bị lỗi (xem tab *Deployments*) |

---
title: Từ WinForms sang web: những điều phải học lại
date: 2026-08-04
tags: Kinh nghiệm, .NET
excerpt: Chuyển từ ứng dụng desktop sang web nội bộ, thứ khó nhất không phải cú pháp mà là cách nghĩ về trạng thái, dữ liệu và người dùng.
---

Công việc đầu tiên của mình là ứng dụng WinForms. Khi chuyển sang làm web nội bộ, mình nghĩ mình chỉ cần học thêm HTML, CSS và vài framework. Thực tế, thứ phải học lại nhiều nhất là cách suy nghĩ.

## Trạng thái không còn nằm sẵn trong form

Trong WinForms, dữ liệu nằm ngay trên form cho tới khi người dùng đóng cửa sổ. Trên web, mỗi request là một lần bắt đầu lại. Những gì cần giữ phải được đặt ở đâu đó một cách có chủ đích: URL, session, cơ sở dữ liệu, hoặc phía trình duyệt. Hiểu rõ điều này giúp tránh được cả một nhóm lỗi kiểu "lúc được lúc không".

## Kiểm tra dữ liệu ở cả hai phía

Kiểm tra trên giao diện giúp người dùng sửa sai nhanh. Kiểm tra ở server mới là thứ bảo vệ dữ liệu. Với hệ thống tài chính hay kế toán, mọi dữ liệu gửi lên đều cần được kiểm tra lại, kể cả khi giao diện đã chặn.

## Nhiều người cùng sửa một bản ghi

Hệ thống web nội bộ có nhiều người dùng cùng lúc: hai nhân viên hoàn toàn có thể mở cùng một hợp đồng. Cột `rowversion` trong SQL Server là một cách đơn giản để phát hiện xung đột:

```sql
UPDATE dbo.HopDong
SET GhiChu = @GhiChu
WHERE HopDongId = @HopDongId
  AND RowVer = @RowVer;

IF @@ROWCOUNT = 0
    THROW 50001, N'Hợp đồng đã được người khác cập nhật. Vui lòng tải lại.', 1;
```

Người lưu sau sẽ nhận thông báo thay vì vô tình ghi đè thay đổi của người trước.

## Người dùng nội bộ vẫn là người dùng

Phần mềm nội bộ hay bị xem nhẹ phần giao diện vì "nhân viên dùng quen là được". Nhưng một màn hình nhập liệu được dùng hàng trăm lần mỗi ngày thì mỗi cú click thừa đều cộng dồn. Những thay đổi nhỏ như phím tắt, tự điền giá trị mặc định hay giữ lại bộ lọc lần trước thường được cảm ơn nhiều hơn cả một tính năng lớn.

## Điều vẫn giữ nguyên

Dù là desktop hay web, phần quan trọng nhất vẫn là hiểu nghiệp vụ và dữ liệu. Cú pháp học vài tuần là quen. Hiểu đúng một quy trình kế toán hay vòng đời của một hợp đồng mới là thứ làm nên phần mềm dùng được.

---
title: 6 thói quen khi viết Stored Procedure trên SQL Server
date: 2026-10-28
tags: SQL Server, Hiệu năng
excerpt: Những điều nhỏ mình luôn làm khi viết Stored Procedure, giúp truy vấn nhanh hơn và dễ bảo trì hơn về lâu dài.
---

Phần lớn thời gian ở các dự án nội bộ, mình làm việc với SQL Server qua Stored Procedure. Sau vài năm, mình rút ra một số thói quen nhỏ. Không có gì cao siêu, nhưng chúng giúp tránh được khá nhiều lỗi và những lần "sao tự nhiên chậm thế".

## 1. Luôn bật SET NOCOUNT ON

Mặc định SQL Server gửi về thông báo số dòng bị ảnh hưởng sau mỗi câu lệnh. Với procedure có nhiều bước, đây là lưu lượng thừa, và một số thư viện truy cập dữ liệu cũ còn hiểu nhầm các thông báo này là kết quả trả về.

```sql
CREATE OR ALTER PROCEDURE dbo.usp_HopDong_GetById
    @HopDongId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT HopDongId, SoHopDong, KhachHangId, NgayKy, TrangThai
    FROM dbo.HopDong
    WHERE HopDongId = @HopDongId;
END
```

## 2. Không dùng SELECT *

Chỉ lấy đúng cột cần. Câu truy vấn đọc ít dữ liệu hơn, có cơ hội dùng covering index, và không bị ảnh hưởng khi ai đó thêm cột vào bảng.

## 3. Giữ điều kiện WHERE có thể dùng index

Bọc cột trong hàm khiến SQL Server không thể seek trên index của cột đó:

```sql
-- Không dùng được index trên NgayKy
WHERE YEAR(NgayKy) = 2025

-- Dùng được index
WHERE NgayKy >= '20250101' AND NgayKy < '20260101'
```

Tương tự, `LEFT(SoHopDong, 3) = 'HD-'` nên viết lại thành `SoHopDong LIKE 'HD-%'`.

## 4. Để ý parameter sniffing

Kế hoạch thực thi được tạo theo giá trị tham số của lần chạy đầu tiên. Nếu dữ liệu phân bố lệch, ví dụ một khách hàng có hàng trăm nghìn dòng còn đa số chỉ vài dòng, kế hoạch đó có thể rất tệ cho các lần sau. Khi gặp, mình thử theo thứ tự:

- Kiểm tra lại index trước, vì đa số trường hợp gốc rễ nằm ở đây.
- Thêm `OPTION (RECOMPILE)` cho câu lệnh bị ảnh hưởng nếu procedure không chạy quá dày.
- Dùng `OPTIMIZE FOR UNKNOWN` khi muốn một kế hoạch "trung bình" và ổn định.

## 5. Transaction đi cùng TRY...CATCH và XACT_ABORT

```sql
SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    UPDATE dbo.HopDong
    SET TrangThai = N'DaDuyet'
    WHERE HopDongId = @HopDongId;

    INSERT INTO dbo.HopDong_LichSu (HopDongId, HanhDong, ThoiGian)
    VALUES (@HopDongId, N'Duyet', SYSDATETIME());

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH
```

`XACT_ABORT ON` đảm bảo transaction được rollback cả khi lỗi xảy ra theo cách mà khối CATCH không bắt được, ví dụ client bị timeout giữa chừng. `THROW` giữ nguyên lỗi gốc để ứng dụng biết chuyện gì đã xảy ra.

## 6. Đọc execution plan trước khi đoán

Khi một procedure chậm, mình bật **Include Actual Execution Plan** trong SSMS và tìm các dấu hiệu quen thuộc: Index Scan trên bảng lớn, Key Lookup lặp lại rất nhiều lần, hoặc số dòng ước tính lệch xa số dòng thực tế. Đa số lần, câu trả lời nằm ngay đó.

> Tối ưu mà không đo thì chỉ là đoán. Đo trước, sửa sau, rồi đo lại.

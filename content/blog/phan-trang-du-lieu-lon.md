---
title: Phân trang dữ liệu lớn: OFFSET/FETCH hay keyset?
date: 2026-09-15
tags: SQL Server, Hiệu năng
excerpt: OFFSET/FETCH dễ viết nhưng chậm dần khi người dùng lật tới các trang sau. Keyset pagination giải quyết việc đó như thế nào.
---

Màn hình danh sách xuất hiện ở hầu hết phần mềm nội bộ: danh sách hợp đồng, phiếu nhập, đơn hàng. Khi bảng còn nhỏ, phân trang kiểu gì cũng nhanh. Khi bảng lên vài triệu dòng, khác biệt bắt đầu lộ ra.

## Cách quen thuộc: OFFSET/FETCH

```sql
SELECT DonHangId, SoDonHang, NgayTao, TongTien
FROM dbo.DonHang
ORDER BY NgayTao DESC, DonHangId DESC
OFFSET (@Trang - 1) * @KichThuoc ROWS
FETCH NEXT @KichThuoc ROWS ONLY;
```

Dễ viết, dễ hiểu, cho phép nhảy thẳng tới trang bất kỳ. Vấn đề là để lấy trang 5.000, SQL Server vẫn phải đọc qua toàn bộ các dòng phía trước rồi bỏ đi. Trang càng xa, truy vấn càng chậm.

## Keyset pagination

Thay vì nói "bỏ qua N dòng", ta nói "lấy các dòng đứng sau dòng cuối cùng của trang trước":

```sql
SELECT TOP (@KichThuoc) DonHangId, SoDonHang, NgayTao, TongTien
FROM dbo.DonHang
WHERE NgayTao <= @NgayTaoCuoi
  AND (NgayTao < @NgayTaoCuoi OR DonHangId < @DonHangIdCuoi)
ORDER BY NgayTao DESC, DonHangId DESC;
```

Điều kiện `NgayTao <= @NgayTaoCuoi` ở đầu giúp SQL Server có một điểm bắt đầu rõ ràng để seek trên index. Kết hợp với index phù hợp, trang thứ 5.000 cũng nhanh như trang đầu:

```sql
CREATE INDEX IX_DonHang_NgayTao_Id
ON dbo.DonHang (NgayTao DESC, DonHangId DESC)
INCLUDE (SoDonHang, TongTien);
```

Lưu ý: tổ hợp cột sắp xếp phải là duy nhất, nên luôn thêm khóa chính vào cuối `ORDER BY`. Nếu không, các dòng có cùng `NgayTao` có thể bị lặp hoặc bị bỏ sót giữa hai trang.

## Nên chọn cách nào?

- **OFFSET/FETCH** khi dữ liệu không quá lớn, hoặc người dùng thực sự cần nhảy tới một số trang cụ thể.
- **Keyset** cho danh sách lớn, cuộn vô hạn, hoặc API trả dữ liệu theo từng lô.

Trong thực tế, phần lớn người dùng chỉ xem vài trang đầu rồi dùng bộ lọc. Vì vậy một bộ lọc tốt đi kèm index đúng thường quan trọng hơn chuyện chọn kiểu phân trang nào.

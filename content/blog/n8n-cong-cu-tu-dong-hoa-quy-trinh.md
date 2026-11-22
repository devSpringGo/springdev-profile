---
title: n8n: Công cụ tự động hóa quy trình cho lập trình viên
date: 2026-11-22
tags: Kinh nghiệm, .NET, SQL Server
excerpt: Tìm hiểu cách n8n giúp lập trình viên tự động hóa các luồng dữ liệu giữa SQL Server, API và các dịch vụ bên thứ ba một cách linh hoạt.
---

Trong quá trình phát triển phần mềm nội bộ, mình thường xuyên nhận được các yêu cầu về việc kết nối dữ liệu giữa các hệ thống khác nhau. Ví dụ như đẩy dữ liệu từ SQL Server sang Google Sheets cho bộ phận kinh doanh, hoặc định kỳ kiểm tra các đơn hàng quá hạn để cập nhật trạng thái trong database. Thay vì viết thêm các Worker Service bằng C# hay Python cho mỗi yêu cầu nhỏ này, mình chọn n8n để tối ưu hóa quy trình.

## n8n là gì và tại sao nên sử dụng

n8n là một công cụ Workflow Automation mã nguồn mở theo mô hình node-based. Khác với các nền tảng trả phí theo số lượng task, n8n cho phép mình tự host trên server riêng, giúp kiểm soát hoàn toàn dữ liệu và không bị giới hạn số lần thực thi. Với một lập trình viên, điểm mạnh nhất của n8n là khả năng mở rộng cực cao thông qua việc viết code trực tiếp trong các node.

Mô hình hoạt động của n8n dựa trên các node kết nối với nhau. Mỗi node thực hiện một nhiệm vụ cụ thể: nhận dữ liệu, xử lý logic, hoặc gửi dữ liệu đi. Dữ liệu luân chuyển giữa các node là JSON, điều này rất quen thuộc với bất kỳ ai làm việc với Web API.

## Cài đặt n8n với Docker

Để triển khai nhanh n8n trên môi trường làm việc hoặc server nội bộ, Docker là lựa chọn tốt nhất. Mình thường sử dụng cấu hình đơn giản để chạy n8n như sau:

```yaml
version: '3'
services:
  n8n:
    image: n8nio/n8n:latest
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=192.168.1.100
      - NODE_ENV=production
    volumes:
      - n8n_data:/home/node/.n8n
volumes:
  n8n_data:
```

Sau khi khởi chạy, giao diện quản trị của n8n cung cấp một canvas để mình kéo thả các node và thiết lập luồng xử lý.

## Ứng dụng đồng bộ hóa dữ liệu từ SQL Server

Một trong những ứng dụng phổ biến nhất của n8n trong công việc của mình là tương tác với SQL Server. Giả sử mình cần lấy danh sách khách hàng mới từ bảng `KhachHang` và đẩy vào một hệ thống quản lý khác qua API.

Trong n8n, mình sử dụng node Microsoft SQL để thực hiện câu lệnh truy vấn. Node này hỗ trợ cả việc chạy câu lệnh SQL thuần túy hoặc gọi Store Procedure. Sau khi có dữ liệu, mình dùng node HTTP Request để gọi API của hệ thống đích. Việc map dữ liệu giữa các cột trong database và các trường trong API được thực hiện hoàn toàn bằng giao diện kéo thả hoặc biểu thức (expression) đơn giản.

Ví dụ câu lệnh truy vấn trong node SQL:

```sql
SELECT MaKhachHang, TenKhachHang, Email 
FROM KhachHang 
WHERE DaDongBo = 0;
```

Sau khi node HTTP Request gửi dữ liệu thành công, mình nối thêm một node SQL nữa để cập nhật trạng thái `DaDongBo = 1` cho các bản ghi đó.

## Xử lý logic phức tạp với Code Node

Mặc dù n8n có sẵn các node logic như If, Switch hay Merge, nhưng đôi khi nghiệp vụ đòi hỏi xử lý mảng hoặc tính toán phức tạp. Lúc này, Code Node là cứu cánh. n8n cho phép viết JavaScript (hoặc Python trong các bản cập nhật mới) để can thiệp trực tiếp vào dữ liệu.

Giả sử mình nhận được một danh sách hóa đơn và cần tính tổng tiền sau thuế trước khi chuyển sang bước tiếp theo. Đoạn code trong node sẽ trông như thế này:

```javascript
for (const item of $input.all()) {
  const giaTri = item.json.GiaTriDonHang;
  const thue = item.json.PhanTramThue / 100;
  item.json.TongTienSauThue = giaTri * (1 + thue);
}
return $input.all();
```

Việc có thể viết code trực tiếp giúp mình không bị giới hạn bởi các tính năng có sẵn của công cụ.

## Kết nối với ứng dụng ASP.NET Core

Trong kiến trúc hệ thống mình xây dựng, n8n đóng vai trò như một lớp trung gian xử lý các tác vụ phụ trợ. Thay vì để ứng dụng ASP.NET Core trực tiếp xử lý các logic kết nối bên thứ ba vốn hay thay đổi, mình cho ứng dụng bắn một Webhook sang n8n.

Trong C#, mình chỉ cần một đoạn code HttpClient đơn giản để gửi dữ liệu sang n8n:

```csharp
var payload = new { 
    Id = hoaDon.Id, 
    SoTien = hoaDon.TongTien, 
    NgayTao = DateTime.Now 
};
await _httpClient.PostAsJsonAsync("https://n8n.mycompany.com/webhook/invoice-trigger", payload);
```

Tại đầu n8n, node Webhook sẽ nhận payload này và bắt đầu chuỗi các hành động như lưu log vào file, gửi mail thông báo, hoặc cập nhật vào bảng tính. Cách tiếp cận này giúp mã nguồn C# luôn sạch sẽ, chỉ tập trung vào logic nghiệp vụ chính (Core Business Logic), còn các luồng tích hợp được quản lý tập trung tại n8n.

## Khả năng lập lịch và tự động hóa

n8n cung cấp node Cron (Schedule) rất mạnh mẽ. Mình có thể thiết lập các tác vụ chạy vào một giờ cố định trong ngày hoặc lặp lại sau mỗi vài phút. Điều này thay thế hoàn toàn cho Windows Task Scheduler hay SQL Server Agent trong nhiều trường hợp, nhất là khi tác vụ đó cần tương tác với các dịch vụ web bên ngoài.

Điểm mình thích ở n8n là khả năng quan sát (observability). Mỗi lần workflow chạy, n8n đều lưu lại lịch sử (Execution History). Nếu một bước nào đó bị lỗi, mình có thể nhấn vào để xem chính xác dữ liệu đầu vào là gì, lỗi xảy ra ở đâu và thực hiện chạy lại (Retry) từ đúng bước đó sau khi đã sửa lỗi.

Sử dụng n8n không có nghĩa là ngừng viết code, mà là chọn cách viết code thông minh hơn. Nó giúp mình giải quyết các bài toán tích hợp hệ thống một cách nhanh chóng, dễ bảo trì và chuyên nghiệp hơn trong môi trường doanh nghiệp.

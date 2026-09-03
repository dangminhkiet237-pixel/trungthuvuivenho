# Hướng dẫn cài đặt trang admin cho trungthuvuivenho.vercel.app

## Cấu trúc file
```
/index.html          -> trang chính (public), tự động lấy tiêu đề + video mới nhất từ API
/admin/index.html    -> trang quản trị, mật khẩu: 160511
/api/content.js      -> API lưu/đọc tiêu đề + link video (dùng Vercel KV)
/api/upload.js       -> API upload video trực tiếp (dùng Vercel Blob)
/package.json        -> khai báo thư viện cần thiết
```

## Các bước bắt buộc để "đồng bộ ngay lập tức" hoạt động thật sự

Vì đây là 1 trang tĩnh trên Vercel, muốn admin sửa xong là TẤT CẢ mọi người
xem cùng lúc thấy ngay, cần 1 nơi lưu dữ liệu dùng chung (không phải máy của bạn).
Vercel cho 2 dịch vụ này MIỄN PHÍ, chỉ cần bật lên (không cần code thêm):

### Bước 1: Đẩy code này lên GitHub repo đang kết nối với project Vercel
(ghi đè các file cũ: index.html, thêm thư mục admin/, api/, package.json)

### Bước 2: Bật Vercel KV (lưu tiêu đề + link video)
1. Vào https://vercel.com/dashboard → chọn project `trungthuvuivenho`
2. Tab **Storage** → **Create Database** → chọn **KV**
3. Đặt tên bất kỳ, bấm **Connect to Project** → chọn đúng project này
4. Vercel tự thêm biến môi trường (KV_REST_API_URL, KV_REST_API_TOKEN...) — không cần tự nhập gì

### Bước 3: Bật Vercel Blob (để upload video trực tiếp từ trang admin)
1. Vẫn ở tab **Storage** → **Create Database** → chọn **Blob**
2. Bấm **Connect to Project** → chọn đúng project này

### Bước 4: Redeploy
Sau khi bật xong 2 dịch vụ trên, vào tab **Deployments** → bấm **Redeploy**
bản mới nhất (để các biến môi trường được áp dụng).

## Cách dùng
- Trang chính: `trungthuvuivenho.vercel.app`
- Trang quản trị: `trungthuvuivenho.vercel.app/admin`
  - Nhập mật khẩu: `160511`
  - Sửa tiêu đề, dán link video HOẶC chọn file mp4 để tải lên trực tiếp
  - Bấm "Lưu & Đồng bộ ngay" — ai vào lại trang chính (F5) sẽ thấy thay đổi ngay lập tức

## Lưu ý
- Nếu KHÔNG bật Vercel KV/Blob, trang admin vẫn hiển thị nhưng khi lưu sẽ báo lỗi
  ("Kiểm tra đã bật Vercel KV/Blob chưa"), vì chưa có nơi lưu dữ liệu.
- Mật khẩu `160511` được kiểm tra ở cả trình duyệt lẫn server (api/content.js,
  api/upload.js) nên người khác không thể sửa nội dung nếu không có mật khẩu,
  kể cả khi họ gọi thẳng vào API.
- Muốn đổi mật khẩu: sửa dòng `const ADMIN_PASSWORD = '160511';`
  trong cả 2 file `api/content.js` và `api/upload.js`.

# 🌐 Hướng dẫn truy cập Web Public và Private

## 📋 Tổng quan

Dự án này có thể truy cập qua 2 cách:
1. **Private (Local)**: Chỉ truy cập từ máy tính của bạn qua `localhost`
2. **Public (Internet)**: Truy cập từ bất kỳ đâu qua internet nhờ ngrok

---

## 🔒 Cách 1: Truy cập PRIVATE (Localhost)

### Bước 1: Khởi động server
```bash
npm start
```

### Bước 2: Truy cập trên cùng máy tính
Mở trình duyệt và truy cập:
- **Trang chủ Wiki**: http://localhost:3000/wiki
- **Đăng nhập**: http://localhost:3000/login.html
- **Dashboard**: http://localhost:3000/dashboard.html
- **API Agents**: http://localhost:3000/api/agents

### Đặc điểm:
✅ **Nhanh** - Không qua internet
✅ **An toàn** - Chỉ truy cập từ máy local
❌ **Không chia sẻ được** - Người khác không thể truy cập

---

## 🌍 Cách 2: Truy cập PUBLIC (Internet - qua Ngrok)

### Bước 1: Lấy Ngrok Auth Token

1. **Đăng ký tài khoản miễn phí** tại: https://ngrok.com
2. **Đăng nhập** vào: https://dashboard.ngrok.com
3. **Vào phần "Your Authtoken"** hoặc **"Get Started"**
4. **Copy token** của bạn (ví dụ: `2abc123xyz...`)

### Bước 2: Tạo file .env

Tạo file `.env` trong thư mục gốc của project:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=valorant

# Session Secret (tạo bằng: node generate-secret.js)
SESSION_SECRET=your_secret_here

# Server
PORT=3000

# Ngrok Configuration
ENABLE_NGROK=true
NGROK_AUTH_TOKEN=your_ngrok_token_here
```

**Lưu ý:** 
- Thay `your_ngrok_token_here` bằng token bạn đã copy
- Tạo SESSION_SECRET bằng: `node generate-secret.js`

### Bước 3: Cài đặt ngrok (nếu chưa có)
```bash
npm install ngrok
```

### Bước 4: Khởi động server
```bash
npm start
```

### Bước 5: Lấy URL Public

Sau khi server khởi động, bạn sẽ thấy trong console:

```
🚀 Server đang chạy tại: http://localhost:3000
🌐 Ngrok tunnel đã được khởi tạo:
   Public URL: https://abc123.ngrok-free.app
   Local URL: http://localhost:3000
```

**URL Public** (ví dụ: `https://abc123.ngrok-free.app`) là URL bạn có thể:
- Chia sẻ với người khác
- Truy cập từ điện thoại
- Truy cập từ máy tính khác
- Truy cập từ bất kỳ đâu có internet

### Bước 6: Truy cập từ internet

Sử dụng URL public ngrok:
- **Trang chủ Wiki**: `https://abc123.ngrok-free.app/wiki`
- **Đăng nhập**: `https://abc123.ngrok-free.app/login.html`
- **Dashboard**: `https://abc123.ngrok-free.app/dashboard.html`
- **API Agents**: `https://abc123.ngrok-free.app/api/agents`

### Đặc điểm:
✅ **Chia sẻ được** - Người khác có thể truy cập
✅ **Truy cập mọi nơi** - Từ điện thoại, máy tính khác
⚠️ **URL thay đổi** - Mỗi lần khởi động server sẽ có URL mới (trừ khi dùng tài khoản trả phí)
⚠️ **Cần internet** - Phải có kết nối internet

---

## 🔄 So sánh Private vs Public

| Tính năng | Private (Localhost) | Public (Ngrok) |
|-----------|---------------------|----------------|
| **Tốc độ** | ⚡ Rất nhanh | 🐢 Phụ thuộc internet |
| **Truy cập** | Chỉ trên máy local | Từ mọi nơi |
| **Chia sẻ** | ❌ Không được | ✅ Có thể chia sẻ |
| **Bảo mật** | 🔒 Rất an toàn | ⚠️ Cần cẩn thận |
| **Cấu hình** | Không cần | Cần ngrok token |
| **Chi phí** | Miễn phí | Miễn phí (có giới hạn) |

---

## 🎯 Các trường hợp sử dụng

### Dùng Private khi:
- ✅ Phát triển và test local
- ✅ Không cần chia sẻ với người khác
- ✅ Muốn tốc độ nhanh nhất
- ✅ Làm việc một mình

### Dùng Public khi:
- ✅ Demo cho khách hàng/client
- ✅ Test từ điện thoại
- ✅ Làm việc nhóm (remote)
- ✅ Test trên thiết bị khác
- ✅ Demo trong meeting

---

## 🛠️ Troubleshooting

### ❌ Lỗi: "Cannot find module 'ngrok'"
**Giải pháp:**
```bash
npm install ngrok
```

### ❌ Lỗi: "Ngrok tunnel không khởi tạo được"
**Kiểm tra:**
1. Token ngrok đã đúng chưa?
2. `ENABLE_NGROK=true` trong file `.env`?
3. Có kết nối internet không?
4. Token còn hạn không? (kiểm tra tại dashboard.ngrok.com)

### ❌ URL ngrok không truy cập được
**Nguyên nhân:**
- Server chưa chạy
- Token ngrok sai
- Internet bị mất
- Ngrok service đang bảo trì

**Giải pháp:**
1. Kiểm tra server đang chạy: `npm start`
2. Kiểm tra console có hiển thị URL ngrok không
3. Thử khởi động lại server

### ⚠️ URL ngrok thay đổi mỗi lần khởi động
**Đây là bình thường** với tài khoản ngrok miễn phí.

**Nếu muốn URL cố định:**
- Nâng cấp lên tài khoản ngrok trả phí
- Hoặc sử dụng domain tùy chỉnh

---

## 📱 Test từ điện thoại

1. Khởi động server với ngrok
2. Lấy URL public từ console
3. Mở trình duyệt trên điện thoại
4. Truy cập URL public (ví dụ: `https://abc123.ngrok-free.app/wiki`)
5. Đảm bảo điện thoại và máy tính cùng mạng WiFi hoặc điện thoại có internet

---

## 🔐 Lưu ý bảo mật khi dùng Public

1. **Không chia sẻ URL** với người lạ
2. **Đổi mật khẩu admin** mạnh
3. **Không commit** file `.env` vào git
4. **Tắt ngrok** khi không dùng
5. **Kiểm tra logs** thường xuyên

---

## 🎉 Hoàn thành!

Bây giờ bạn đã biết cách:
- ✅ Truy cập web từ localhost (private)
- ✅ Chia sẻ web với người khác qua internet (public)
- ✅ Test từ điện thoại và thiết bị khác

**Chúc bạn thành công!** 🚀


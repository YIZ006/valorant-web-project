# 🎮 Valorant Wiki - Hướng dẫn chạy project

## 📋 Tổng quan
Project này đã được chuyển đổi thành một hệ thống wiki giống Fandom, cho phép:
- Hiển thị thông tin về Maps, Agents, Weapons của Valorant
- Chỉnh sửa nội dung trực tiếp qua giao diện web
- Lưu lịch sử chỉnh sửa (revisions)
- Quản lý admin với hệ thống đăng nhập

## 🚀 Cách chạy project

### Bước 1: Cài đặt dependencies
```bash
npm install
```

### Bước 2: Tạo database
1. Tạo database MySQL tên `valorant`
2. Chạy file `database/migrations/001_init.sql` để tạo cấu trúc bảng
3. Chạy file `database/seeders/001_sample_pages_data.sql` để thêm dữ liệu mẫu

### Bước 3: Cấu hình Environment Variables
1. Tạo file `.env` trong thư mục gốc của project
2. **Tạo SESSION_SECRET:** Chạy script để tạo chuỗi bí mật ngẫu nhiên:
   ```bash
   node generate-secret.js
   ```
   Copy chuỗi được tạo và dùng cho `SESSION_SECRET` trong file `.env`

3. Cấu hình các biến môi trường trong file `.env`:
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=valorant

# Session (dùng chuỗi từ generate-secret.js)
SESSION_SECRET=your_generated_secret_here

# Server
PORT=3000

# Ngrok (tùy chọn - để truy cập từ internet)
ENABLE_NGROK=false
NGROK_AUTH_TOKEN=your_ngrok_token_here
```

**Lưu ý:** 
- Xem file `ENV_SETUP.md` để biết chi tiết cách tạo SESSION_SECRET
- Nếu bạn muốn sử dụng ngrok để truy cập server từ internet:
  - Đăng ký tài khoản tại https://ngrok.com
  - Lấy Auth Token tại: https://dashboard.ngrok.com/get-started/your-authtoken
  - Đặt `ENABLE_NGROK=true` và điền `NGROK_AUTH_TOKEN` trong file `.env`

### Bước 4: Chạy server
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

**Nếu đã bật ngrok:** Bạn sẽ thấy URL public ngrok trong console, ví dụ:
```
🌐 Ngrok tunnel đã được khởi tạo:
   Public URL: https://abc123.ngrok-free.app
   Local URL: http://localhost:3000
```

Bạn có thể chia sẻ URL public này để người khác truy cập server từ internet!

> 📖 **Xem hướng dẫn chi tiết:** Xem file `HUONG_DAN_TRUY_CAP.md` để biết cách truy cập cả web **PRIVATE** (localhost) và **PUBLIC** (internet) một cách đầy đủ.

## 🌐 Các URL chính

### 🔒 Truy cập PRIVATE (Localhost)
Chỉ truy cập từ máy tính của bạn:

#### Wiki Pages
- **Danh sách trang:** `http://localhost:3000/wiki`
- **Xem trang:** `http://localhost:3000/wiki/Map/ascent`
- **Chỉnh sửa:** `http://localhost:3000/wiki/edit/1` (cần đăng nhập)

#### Admin
- **Đăng nhập:** `http://localhost:3000/login.html`
- **Đăng ký:** `http://localhost:3000/register.html`
- **Dashboard:** `http://localhost:3000/dashboard.html`

#### API
- **Agents:** `http://localhost:3000/api/agents`
- **Maps:** `http://localhost:3000/api/maps`
- **Roles:** `http://localhost:3000/api/roles`

### 🌍 Truy cập PUBLIC (Internet - qua Ngrok)
Sau khi khởi động server với `ENABLE_NGROK=true`, bạn sẽ nhận được URL public (ví dụ: `https://abc123.ngrok-free.app`).

Thay `localhost:3000` bằng URL ngrok của bạn:
- **Wiki:** `https://abc123.ngrok-free.app/wiki`
- **Login:** `https://abc123.ngrok-free.app/login.html`
- **Dashboard:** `https://abc123.ngrok-free.app/dashboard.html`
- **API:** `https://abc123.ngrok-free.app/api/agents`

> 💡 **Lưu ý:** URL ngrok sẽ thay đổi mỗi lần khởi động server (trừ khi dùng tài khoản trả phí). Kiểm tra console để lấy URL mới nhất.

> 📖 **Xem chi tiết:** Xem file `HUONG_DAN_TRUY_CAP.md` để biết cách cấu hình và sử dụng ngrok đầy đủ.

## 📁 Cấu trúc project

```
valorant_prj/
├── src/
│   ├── server.js                 # Điểm vào (Express + ngrok)
│   ├── bootstrap/app.js          # Khởi tạo app, middleware, static
│   ├── config/                   # database.js, session.js
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/      # Auth, Wiki, Admin, Agents...
│   │   │   └── Middlewares/      # ensureAuthenticated, ...
│   │   └── Services/             # Tầng business + DB queries
│   ├── routes/
│   │   ├── web.js                # Routes giao diện (wiki, auth, dashboard)
│   │   └── api.js                # Routes REST `/api/*`
│   └── resources/views/          # Template EJS
├── database/
│   ├── migrations/001_init.sql   # Cấu trúc database
│   └── seeders/001_sample_pages_data.sql
├── public/                       # Asset public (login, landing)
├── private/                      # Trang dashboard/admin tĩnh
├── generate-secret.js
└── ENV_SETUP.md
```

## 🔧 Tính năng đã hoàn thành

✅ **Wiki System:**
- Hiển thị trang wiki với URL động `/wiki/:category/:slug`
- Chỉnh sửa nội dung trực tiếp qua web
- Lưu lịch sử chỉnh sửa (revisions)
- Giao diện đẹp, responsive

✅ **Authentication:**
- Đăng nhập/đăng xuất admin
- Bảo vệ route chỉnh sửa
- Session management

✅ **Database:**
- Bảng Pages và Revisions cho wiki
- Dữ liệu mẫu về Maps, Agents, Weapons
- Quan hệ giữa các bảng

## 🎯 Cách sử dụng

1. **Xem wiki:** Truy cập `/wiki` để xem danh sách trang
2. **Đăng nhập:** Dùng `/login.html` để đăng nhập admin
3. **Chỉnh sửa:** Click "Chỉnh sửa" trên bất kỳ trang nào (cần đăng nhập)
4. **Thêm nội dung:** Sử dụng HTML để format nội dung

## 🌐 Sử dụng Ngrok để truy cập từ Internet

Project đã được tích hợp sẵn ngrok để bạn có thể chia sẻ server với người khác qua internet.

### Cách sử dụng:
1. **Đăng ký tài khoản ngrok** (miễn phí): https://ngrok.com
2. **Lấy Auth Token:**
   - Đăng nhập vào https://dashboard.ngrok.com
   - Vào phần "Your Authtoken"
   - Copy token của bạn
3. **Cấu hình trong `.env`:**
   ```env
   ENABLE_NGROK=true
   NGROK_AUTH_TOKEN=your_token_here
   ```
4. **Khởi động lại server:**
   ```bash
   npm start
   ```
5. **Kiểm tra console:** Bạn sẽ thấy URL public ngrok, ví dụ:
   ```
   🌐 Ngrok tunnel đã được khởi tạo:
      Public URL: https://abc123.ngrok-free.app
   ```

### Lưu ý:
- URL ngrok sẽ thay đổi mỗi lần khởi động server (trừ khi dùng tài khoản trả phí)
- URL free có giới hạn về số lượng requests
- Ngrok tunnel sẽ tự động đóng khi bạn dừng server (Ctrl+C)

## 🐛 Troubleshooting

**Lỗi kết nối database:**
- Kiểm tra MySQL đã chạy chưa
- Kiểm tra thông tin kết nối trong `.env` hoặc `config/database.js`
- Đảm bảo database `valorant` đã được tạo

**Lỗi ngrok:**
- Kiểm tra `NGROK_AUTH_TOKEN` đã được điền đúng chưa
- Đảm bảo `ENABLE_NGROK=true` trong file `.env`
- Kiểm tra kết nối internet của bạn

**Lỗi template:**
- Kiểm tra thư mục `views/` có đầy đủ file không
- Đảm bảo EJS đã được cài đặt: `npm install ejs`

**Lỗi 404:**
- Kiểm tra route trong `src/server.js`
- Đảm bảo URL đúng format: `/wiki/Map/ascent`

## 📝 Ghi chú

- Project này đã được chuyển đổi từ CRUD app thành wiki system
- Sử dụng EJS template engine
- Database MySQL với bảng Pages và Revisions
- Hệ thống authentication đơn giản
- Giao diện responsive với CSS inline

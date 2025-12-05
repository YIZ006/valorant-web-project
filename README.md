# 🎮 Valorant Wiki Project

Một hệ thống wiki về Valorant được xây dựng với Node.js, Express, và MySQL. Hệ thống cho phép hiển thị và chỉnh sửa thông tin về Maps, Agents, và Weapons của Valorant.

## ✨ Tính năng

- 📖 **Wiki System**: Hiển thị và chỉnh sửa nội dung wiki về Valorant
- 🔐 **Authentication**: Hệ thống đăng nhập/đăng ký cho admin
- 📝 **Edit History**: Lưu lịch sử chỉnh sửa (revisions)
- 🌐 **Public Access**: Hỗ trợ ngrok để truy cập từ internet
- 🎨 **Responsive UI**: Giao diện đẹp, responsive
- 🔄 **REST API**: API endpoints cho Agents, Maps, Roles

## 🚀 Cài đặt

### Yêu cầu

- Node.js (v14 trở lên)
- MySQL (v5.7 trở lên)
- npm hoặc yarn

### Bước 1: Clone repository

```bash
git clone https://github.com/YOUR_USERNAME/valorant_prj.git
cd valorant_prj
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Tạo database

1. Tạo database MySQL tên `valorant`:
```sql
CREATE DATABASE valorant;
```

2. Chạy migration để tạo cấu trúc bảng:
```bash
mysql -u root -p valorant < database/migrations/001_init.sql
```

3. (Tùy chọn) Thêm dữ liệu mẫu:
```bash
mysql -u root -p valorant < database/seeders/001_sample_pages_data.sql
```

### Bước 4: Cấu hình Environment Variables

1. Tạo file `.env` trong thư mục gốc:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=valorant

# Session Secret (tạo bằng: node generate-secret.js)
SESSION_SECRET=your_generated_secret_here

# Server Configuration
PORT=3000

# Ngrok Configuration (tùy chọn)
ENABLE_NGROK=false
NGROK_AUTH_TOKEN=your_ngrok_token_here
```

2. Tạo SESSION_SECRET:
```bash
node generate-secret.js
```
Copy chuỗi được tạo và paste vào `SESSION_SECRET` trong file `.env`.

### Bước 5: Chạy server

```bash
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## 📖 Hướng dẫn sử dụng

### Xem Wiki

- **Danh sách trang**: `http://localhost:3000/wiki`
- **Xem trang cụ thể**: `http://localhost:3000/wiki/Map/ascent`
- **Chỉnh sửa**: `http://localhost:3000/wiki/edit/1` (cần đăng nhập)

### Admin Panel

- **Đăng nhập**: `http://localhost:3000/login.html`
- **Đăng ký**: `http://localhost:3000/register.html`
- **Dashboard**: `http://localhost:3000/dashboard.html`

### API Endpoints

- **Agents**: `GET http://localhost:3000/api/agents`
- **Maps**: `GET http://localhost:3000/api/maps`
- **Roles**: `GET http://localhost:3000/api/roles`

## 🌐 Sử dụng Ngrok (Truy cập từ Internet)

Để chia sẻ server với người khác qua internet:

1. Đăng ký tài khoản tại [ngrok.com](https://ngrok.com)
2. Lấy Auth Token tại [dashboard.ngrok.com](https://dashboard.ngrok.com/get-started/your-authtoken)
3. Cập nhật file `.env`:
   ```env
   ENABLE_NGROK=true
   NGROK_AUTH_TOKEN=your_token_here
   ```
4. Khởi động lại server - URL public sẽ hiển thị trong console

## 📁 Cấu trúc Project

```
valorant_prj/
├── src/
│   ├── server.js              # Entry point
│   ├── bootstrap/
│   │   └── app.js            # App initialization
│   ├── config/
│   │   ├── database.js       # Database configuration
│   │   └── session.js        # Session configuration
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/  # Controllers
│   │   │   └── Middlewares/  # Middlewares
│   │   └── Services/         # Business logic
│   ├── routes/
│   │   ├── web.js            # Web routes
│   │   └── api.js            # API routes
│   └── resources/
│       ├── views/            # EJS templates
│       └── assets/           # CSS, JS files
├── database/
│   ├── migrations/           # Database migrations
│   └── seeders/              # Sample data
├── package.json
└── README.md
```

## 🛠️ Công nghệ sử dụng

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Template Engine**: EJS
- **Authentication**: Express Session, bcrypt
- **Tunneling**: Ngrok

## 📝 Scripts

```bash
npm start          # Chạy server
node generate-secret.js  # Tạo SESSION_SECRET ngẫu nhiên
```

## 🔒 Bảo mật

- File `.env` đã được thêm vào `.gitignore` để bảo vệ thông tin nhạy cảm
- Mật khẩu được hash bằng bcrypt
- Session được bảo vệ bằng SESSION_SECRET

## 📚 Tài liệu thêm

- [ENV_SETUP.md](./ENV_SETUP.md) - Hướng dẫn cấu hình environment variables
- [README_WIKI.md](./README_WIKI.md) - Hướng dẫn chi tiết về wiki system
- [HUONG_DAN_TRUY_CAP.md](./HUONG_DAN_TRUY_CAP.md) - Hướng dẫn truy cập
- [ROUTES_STRUCTURE.md](./ROUTES_STRUCTURE.md) - Cấu trúc routes

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

ISC

## 👤 Tác giả

Your Name

---

⭐ Nếu project này hữu ích, hãy cho một star!


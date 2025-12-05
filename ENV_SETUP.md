# 🔧 Hướng dẫn cấu hình Environment Variables

## Tạo file .env

Tạo file `.env` trong thư mục gốc của project với nội dung sau:

```env
# ==========================
# 🗄️ DATABASE CONFIGURATION
# ==========================
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=valorant

# ==========================
# 🔐 SESSION SECRET
# ==========================
SESSION_SECRET=mySecretKey123

# ==========================
# 🚀 SERVER CONFIGURATION
# ==========================
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
```

## 🔐 Tạo SESSION_SECRET

`SESSION_SECRET` là một chuỗi bí mật dùng để mã hóa session cookies. Bạn cần tự tạo một chuỗi ngẫu nhiên mạnh.

### Cách 1: Dùng script có sẵn (Khuyến nghị)
```bash
node generate-secret.js
```

Script sẽ tạo một chuỗi ngẫu nhiên 64 ký tự. Copy và paste vào file `.env`.

### Cách 2: Tạo thủ công bằng Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Cách 3: Tạo online
Truy cập: https://randomkeygen.com/ hoặc https://generate-secret.vercel.app/

### Cách 4: Dùng chuỗi đơn giản (Chỉ dùng cho development)
```env
SESSION_SECRET=mySecretKey123
```

⚠️ **Lưu ý:** Chuỗi đơn giản không an toàn cho production. Nên dùng chuỗi ngẫu nhiên mạnh!

## Lưu ý bảo mật

- **KHÔNG** commit file `.env` vào git (đã có trong `.gitignore`)
- **KHÔNG** chia sẻ `SESSION_SECRET` với ai
- Thay đổi `SESSION_SECRET` bằng một chuỗi ngẫu nhiên mạnh (dùng `generate-secret.js`)
- Để truy cập từ internet, deploy lên Railway hoặc Render (xem [RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md))


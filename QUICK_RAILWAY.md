# ⚡ Hướng dẫn Nhanh: Deploy lên Railway

## 🎯 3 Bước đơn giản

### 1️⃣ Tạo Web Service

1. Vào [Railway Dashboard](https://railway.app)
2. Trong project của bạn (đã có MySQL), click **"+ New"** → **"GitHub Repo"**
3. Chọn repository: `valorant-web-project`
4. Railway tự động detect và bắt đầu deploy

### 2️⃣ Cấu hình Environment Variables

Vào Web Service → Tab **"Variables"**, thêm:

| Key | Value | Ghi chú |
|-----|-------|---------|
| `DATABASE_URL` | `mysql://...` | Railway tự động tạo nếu MySQL trong cùng project |
| `SESSION_SECRET` | `...` | Chạy `node generate-secret.js` để tạo |
| `HOST` | `0.0.0.0` | Để public access (có thể truy cập từ internet) |
| `NODE_ENV` | `production` | |

**Lưu ý**: Railway tự động tạo `DATABASE_URL` từ MySQL service trong cùng project!

### 3️⃣ Chạy Migration

Sau khi deploy thành công:

1. Vào Web Service → Tab **"Settings"** → **"Open Shell"**
2. Hoặc vào **"Deployments"** → **"View Logs"** → Tab **"Shell"**
3. Chạy: `npm run migrate`

## ✅ Xong!

Vào Web Service → Tab **"Settings"** → **"Generate Domain"** để lấy URL public.

Website của bạn sẽ chạy tại: `https://your-app.up.railway.app`

## 🔍 Kiểm tra Logs

Vào **"Deployments"** → **"View Logs"** để xem:
```
✅ Kết nối database thành công!
🚀 Server đang chạy tại: http://0.0.0.0:3000
```

## 🐛 Nếu gặp lỗi

### Database connection error
- Kiểm tra MySQL service đang chạy (status: "Online")
- Kiểm tra biến `DATABASE_URL` trong Variables
- Đảm bảo MySQL và Web Service trong cùng project

### Migration chưa chạy
- Chạy `npm run migrate` trong Railway Shell
- Kiểm tra logs để xem có lỗi không

---

**Xem chi tiết**: [RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md)


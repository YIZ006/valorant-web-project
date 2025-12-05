# ⚡ Hướng dẫn Nhanh: Cấu hình .env cho Railway

## 📝 Cập nhật file .env

Dựa trên connection string từ Railway của bạn, mở file `.env` và cập nhật như sau:

### Cấu hình đầy đủ:

```env
# ==========================
# 🗄️ RAILWAY MYSQL DATABASE
# ==========================
# Option 1: Sử dụng DATABASE_URL (Khuyến nghị)
DATABASE_URL=mysql://root:ABFdhiYltiCKWshVGDcBAbxWsBMQGTcz@switchback.proxy.rlwy.net:13403/railway

# Option 2: Hoặc dùng các biến riêng lẻ
# DB_HOST=switchback.proxy.rlwy.net
# DB_PORT=13403
# DB_USER=root
# DB_PASSWORD=ABFdhiYltiCKWshVGDcBAbxWsBMQGTcz
# DB_NAME=railway
# DB_SSL=false

# ==========================
# 🔐 SESSION SECRET
# ==========================
SESSION_SECRET=6f5c5772d8788374b05bf3c1c09baeac0d44c702f3d643bd3290e6f61adf9f75

# ==========================
# 🚀 SERVER CONFIGURATION
# ==========================
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
```

## ⚠️ Lưu ý quan trọng

1. **Thay password**: Thay `ABFdhiYltiCKWshVGDcBAbxWsBMQGTcz` bằng password thực tế từ Railway của bạn
2. **Database name**: Railway mặc định dùng database tên `railway`
3. **SSL**: Nếu gặp lỗi SSL, thử thêm `DB_SSL=true` hoặc đổi trong code

## ✅ Test kết nối

Sau khi cập nhật `.env`, test kết nối:

```bash
npm run test-db
```

Hoặc chạy server:

```bash
npm start
```

Bạn sẽ thấy:
```
✅ Kết nối database thành công!
Database: railway
Host: switchback.proxy.rlwy.net:13403
🚀 Server đang chạy tại: http://localhost:3000
```

## 🔍 Nếu gặp lỗi

### Lỗi SSL:
Thêm vào `.env`:
```env
DB_SSL=true
```

### Lỗi "Access denied":
- Kiểm tra password đã đúng chưa
- Kiểm tra username (thường là `root`)

### Lỗi "Can't connect":
- Kiểm tra host và port đã đúng chưa
- Đảm bảo đang dùng **Public Network** URL khi test từ máy local
- Kiểm tra firewall

---

**Xem chi tiết**: [ENV_RAILWAY.md](./ENV_RAILWAY.md)


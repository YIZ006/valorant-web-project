# 🔧 Cấu hình .env cho Railway MySQL

## Cấu hình cho Railway Database

Dựa trên connection string từ Railway của bạn, cập nhật file `.env` như sau:

### Option 1: Sử dụng DATABASE_URL (Khuyến nghị)

Thêm vào file `.env`:

```env
# Railway MySQL Database
DATABASE_URL=mysql://root:ABFdhiYltiCKWshVGDcBAbxWsBMQGTcz@switchback.proxy.rlwy.net:13403/railway

# Session Secret (tạo bằng: node generate-secret.js)
SESSION_SECRET=your_generated_secret_here

# Server Configuration
PORT=3000
NODE_ENV=development

# Ngrok (không cần khi dùng Railway)
ENABLE_NGROK=false
```

### Option 2: Sử dụng các biến riêng lẻ

Nếu muốn tách riêng, dùng:

```env
# Railway MySQL Database Configuration
DB_HOST=switchback.proxy.rlwy.net
DB_PORT=13403
DB_USER=root
DB_PASSWORD=ABFdhiYltiCKWshVGDcBAbxWsBMQGTcz
DB_NAME=railway
DB_SSL=false

# Session Secret
SESSION_SECRET=your_generated_secret_here

# Server Configuration
PORT=3000
NODE_ENV=development

# Ngrok
ENABLE_NGROK=false
```

## Lưu ý quan trọng

1. **Password**: Thay `ABFdhiYltiCKWshVGDcBAbxWsBMQGTcz` bằng password thực tế từ Railway của bạn
2. **Database name**: Railway mặc định tạo database tên `railway`
3. **SSL**: Railway có thể yêu cầu SSL, nếu lỗi kết nối, thử đổi `DB_SSL=true`
4. **Private vs Public Network**: 
   - Nếu deploy trên Railway, dùng **Private Network** URL (miễn phí)
   - Nếu test từ máy local, dùng **Public Network** URL

## Test kết nối

Sau khi cấu hình, chạy:

```bash
npm run test-db
```

Hoặc:

```bash
npm start
```

Bạn sẽ thấy:
```
✅ Kết nối database thành công!
Database: railway
Host: switchback.proxy.rlwy.net:13403
```


# 🚀 Hướng dẫn Deploy lên Render.com

## 📋 Bước 1: Tạo Database trên Render

1. Đăng nhập vào [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"** hoặc **"MySQL"**
3. Chọn **"MySQL"** (nếu có) hoặc dùng PostgreSQL và điều chỉnh code
4. Đặt tên database: `valorant-db`
5. Chọn plan (Free tier có sẵn)
6. Click **"Create Database"**
7. **Lưu ý**: Render sẽ cung cấp:
   - **Internal Database URL** (dùng cho app trên cùng network)
   - **External Database URL** (dùng cho app khác network)

## 📋 Bước 2: Tạo Web Service

1. Trong Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect repository GitHub của bạn
3. Chọn repository: `valorant-web-project`
4. Đặt tên service: `valorant-wiki`
5. Chọn branch: `main`
6. Build command: `npm install`
7. Start command: `npm start`

## 📋 Bước 3: Cấu hình Environment Variables

Trong phần **"Environment"** của Web Service, thêm các biến sau:

### Database Configuration

**Cách 1: Sử dụng DATABASE_URL (Khuyến nghị)**
```
DATABASE_URL=mysql://user:password@host:port/database
```
Copy **Internal Database URL** từ database bạn vừa tạo và paste vào đây.

**Cách 2: Sử dụng các biến riêng lẻ**
```
DB_HOST=dbserver-xxxx.render.com
DB_PORT=3306
DB_USER=valorant_user
DB_PASSWORD=your_password_here
DB_NAME=valorant
DB_SSL=true
```

### Session Secret
```
SESSION_SECRET=your_very_long_random_secret_key_here
```
Tạo secret bằng cách chạy: `node generate-secret.js` trên máy local, sau đó copy kết quả.

### Server Configuration
```
PORT=10000
NODE_ENV=production
```
**Lưu ý**: Render tự động set PORT, nhưng bạn có thể để PORT=10000 để đảm bảo.

### Ngrok (Tùy chọn - không cần trên Render)
```
ENABLE_NGROK=false
```

## 📋 Bước 4: Chạy Migration Database

Sau khi deploy thành công, bạn cần chạy migration để tạo bảng:

### Cách 1: Sử dụng Render Shell
1. Vào Web Service → **"Shell"**
2. Chạy lệnh:
```bash
mysql -h YOUR_DB_HOST -u YOUR_DB_USER -pYOUR_DB_PASSWORD YOUR_DB_NAME < database/migrations/001_init.sql
```

### Cách 2: Sử dụng MySQL Client từ máy local
1. Kết nối đến External Database URL
2. Chạy file migration:
```bash
mysql -h dbserver-xxxx.render.com -u valorant_user -p valorant < database/migrations/001_init.sql
```

### Cách 3: Tạo script tự động chạy migration
Tạo file `scripts/migrate.js` và thêm vào package.json:
```json
"scripts": {
  "migrate": "node scripts/migrate.js",
  "start": "node src/server.js"
}
```

## 📋 Bước 5: Deploy và Kiểm tra

1. Click **"Save Changes"** trong Environment Variables
2. Render sẽ tự động deploy lại
3. Kiểm tra logs trong **"Logs"** tab
4. Nếu thành công, bạn sẽ thấy:
   ```
   ✅ Kết nối database thành công!
   🚀 Server đang chạy tại: http://localhost:10000
   ```

## 🐛 Troubleshooting

### Lỗi: "Không thể khởi động server vì lỗi kết nối database"

**Nguyên nhân:**
- Environment variables chưa được cấu hình đúng
- Database chưa được tạo
- Firewall chặn kết nối

**Giải pháp:**
1. Kiểm tra lại tất cả environment variables trong Render Dashboard
2. Đảm bảo sử dụng **Internal Database URL** (không phải External)
3. Kiểm tra database đã được tạo và đang chạy
4. Xem logs chi tiết trong Render để biết lỗi cụ thể

### Lỗi: "Warning: connect.session() MemoryStore"

Đây là cảnh báo, không phải lỗi. MemoryStore hoạt động nhưng không phù hợp production. 
Để fix, bạn có thể:
- Cài đặt Redis và sử dụng connect-redis
- Hoặc bỏ qua cảnh báo này (app vẫn chạy được)

### Lỗi: "dotenv injecting env (0)"

Điều này có nghĩa là không có file `.env` trên Render (đúng như vậy vì đã gitignore).
Bạn cần cấu hình tất cả biến môi trường trong Render Dashboard thay vì dùng file `.env`.

### Database Connection Timeout

Nếu dùng External Database URL, có thể bị timeout. Hãy:
1. Sử dụng Internal Database URL
2. Đảm bảo Web Service và Database ở cùng region
3. Kiểm tra firewall settings

## 📝 Checklist Deploy

- [ ] Database đã được tạo trên Render
- [ ] Web Service đã được tạo và connect GitHub
- [ ] Tất cả environment variables đã được cấu hình
- [ ] Migration đã được chạy (bảng đã được tạo)
- [ ] Seed data đã được thêm (nếu cần)
- [ ] Service đã deploy thành công
- [ ] Website đã hoạt động và có thể truy cập

## 🔗 Links hữu ích

- [Render Documentation](https://render.com/docs)
- [Render MySQL Setup](https://render.com/docs/databases)
- [Environment Variables trên Render](https://render.com/docs/environment-variables)

## 💡 Tips

1. **Luôn sử dụng Internal Database URL** cho app trên cùng Render network
2. **SESSION_SECRET phải là chuỗi ngẫu nhiên mạnh** - không dùng giá trị mặc định
3. **Kiểm tra logs thường xuyên** để phát hiện lỗi sớm
4. **Backup database** định kỳ nếu có dữ liệu quan trọng
5. **Sử dụng Render Shell** để debug và chạy migration

---

Chúc bạn deploy thành công! 🎉


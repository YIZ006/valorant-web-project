# 🚂 Hướng dẫn Kết nối MySQL từ Railway sang Render

## 📋 Bước 1: Lấy Connection String từ Railway

1. Trong Railway Dashboard, vào MySQL service của bạn
2. Click tab **"Database"** → **"Connect"**
3. **QUAN TRỌNG**: Chọn tab **"Private Network"** (không phải Public Network)
   - Private Network: Miễn phí, nhanh hơn
   - Public Network: Có thể tốn phí egress
4. Copy **Connection URL** (có dạng: `mysql://root:password@host:port/railway`)

## 📋 Bước 2: Cấu hình trên Render

1. Vào Render Dashboard → Web Service của bạn
2. Vào phần **"Environment"** (hoặc **"Environment Variables"**)
3. Thêm các biến sau:

### Option 1: Dùng DATABASE_URL (Khuyến nghị)

```
DATABASE_URL=mysql://root:MtJxlQPvXJtiPsCymKpfpBVsbEoYwXwW@gondola.proxy.rlwy.net:15518/railway
```

**Lưu ý**: Thay URL trên bằng URL **Private Network** từ Railway của bạn!

### Option 2: Dùng các biến riêng lẻ

Nếu muốn tách riêng, parse URL và thêm:

```
DB_HOST=gondola.proxy.rlwy.net
DB_PORT=15518
DB_USER=root
DB_PASSWORD=MtJxlQPvXJtiPsCymKpfpBVsbEoYwXwW
DB_NAME=railway
DB_SSL=false
```

### Thêm các biến khác:

```
SESSION_SECRET=your_random_secret_here
NODE_ENV=production
PORT=10000
```

## 📋 Bước 3: Chạy Migration

Sau khi deploy thành công, bạn cần tạo các bảng trong database:

### Cách 1: Sử dụng Railway Shell

1. Vào Railway Dashboard → MySQL service
2. Click **"Connect"** → Tab **"Railway CLI"**
3. Chạy lệnh:
```bash
railway connect MySQL
```
4. Sau khi kết nối, chạy migration:
```bash
mysql -u root -p railway < database/migrations/001_init.sql
```

### Cách 2: Sử dụng MySQL Client từ máy local

1. Cài đặt MySQL client (nếu chưa có)
2. Kết nối bằng Public Network URL:
```bash
mysql -h gondola.proxy.rlwy.net -P 15518 -u root -p railway
```
3. Sau khi kết nối, chạy file SQL:
```bash
mysql -h gondola.proxy.rlwy.net -P 15518 -u root -p railway < database/migrations/001_init.sql
```

### Cách 3: Sử dụng Render Shell (Sau khi deploy)

1. Vào Render Dashboard → Web Service → **"Shell"**
2. Chạy migration script:
```bash
npm run migrate
```

## 📋 Bước 4: Kiểm tra Kết nối

Sau khi deploy, kiểm tra logs trong Render:

1. Vào Render Dashboard → Web Service → **"Logs"**
2. Tìm dòng:
   ```
   ✅ Kết nối database thành công!
   Database: railway
   Host: gondola.proxy.rlwy.net:15518
   ```

Nếu thấy lỗi, kiểm tra:
- Connection URL đã đúng chưa?
- Database đã được tạo chưa?
- Firewall có chặn không?

## 🔒 Bảo mật

⚠️ **QUAN TRỌNG**: 
- **KHÔNG** commit connection string vào Git
- **KHÔNG** chia sẻ password với ai
- Sử dụng **Private Network** URL khi có thể
- Đổi password định kỳ trong Railway Dashboard

## 🐛 Troubleshooting

### Lỗi: "Access denied for user"

- Kiểm tra username và password đã đúng chưa
- Đảm bảo đang dùng đúng database name

### Lỗi: "Can't connect to MySQL server"

- Kiểm tra host và port đã đúng chưa
- Thử dùng Public Network URL nếu Private Network không hoạt động
- Kiểm tra firewall settings trên Railway

### Lỗi: "Unknown database"

- Đảm bảo database name trong URL đúng
- Database có thể có tên khác (kiểm tra trong Railway Dashboard)

---

Chúc bạn kết nối thành công! 🎉


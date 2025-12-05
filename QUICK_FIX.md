# ⚡ Fix Nhanh: Lỗi "Unknown database 'valorant'"

## 🔍 Vấn đề

Bạn đang cố kết nối đến database `valorant` nhưng trên Railway database mặc định tên là `railway`.

## ✅ Giải pháp nhanh

### Cách 1: Cập nhật .env để dùng database "railway" (Khuyến nghị)

Mở file `.env` và sửa:

**Nếu dùng DATABASE_URL:**
```env
DATABASE_URL=mysql://root:password@host:port/railway
```

**Nếu dùng các biến riêng lẻ:**
```env
DB_NAME=railway
# hoặc
DB_DATABASE=railway
```

Sau đó chạy lại:
```bash
npm run test-db
```

### Cách 2: Tạo database "valorant" trên Railway

1. Vào Railway Dashboard → MySQL Service → **"Connect"**
2. Copy **Public Network** URL
3. Kết nối bằng MySQL Workbench hoặc MySQL client
4. Chạy:
```sql
CREATE DATABASE valorant;
```
5. Chạy migration:
```bash
npm run migrate
```

### Cách 3: Chạy migration vào database "railway"

Nếu bạn muốn dùng database `railway` (khuyến nghị):

1. Cập nhật `.env`:
```env
DB_NAME=railway
```

2. Chạy migration:
```bash
npm run migrate
```

Migration sẽ tự động tạo các bảng trong database `railway`.

## 📝 Lưu ý

- Railway mặc định tạo database tên `railway`
- Code đã được cập nhật để tự động dùng `railway` nếu không chỉ định
- Nếu muốn dùng database khác, cần tạo thủ công trên Railway


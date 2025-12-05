# 🔧 Fix lỗi kết nối Database

## ❌ Lỗi hiện tại

```
Unknown database 'valorant'
```

## 🔍 Nguyên nhân

Database trên Railway mặc định tên là `railway`, không phải `valorant`.

## ✅ Giải pháp

### Cách 1: Đổi database name trong .env (Khuyến nghị)

Cập nhật file `.env`:

```env
# Nếu dùng DATABASE_URL
DATABASE_URL=mysql://root:password@host:port/railway

# Hoặc nếu dùng các biến riêng lẻ
DB_NAME=railway
# hoặc
DB_DATABASE=railway
```

### Cách 2: Tạo database "valorant" trên Railway

1. Vào Railway Dashboard → MySQL Service → **"Connect"**
2. Click **"Open MySQL Shell"** hoặc dùng MySQL Workbench
3. Chạy lệnh:
```sql
CREATE DATABASE valorant;
```
4. Sau đó chạy migration vào database `valorant`:
```bash
mysql -h host -P port -u root -p valorant < database/migrations/001_init.sql
```

### Cách 3: Dùng database "railway" và chạy migration

1. Đảm bảo `.env` có:
```env
DB_NAME=railway
```

2. Chạy migration vào database `railway`:
```bash
npm run migrate
```

## 📝 Lưu ý

- Railway mặc định tạo database tên `railway`
- Nếu muốn dùng database khác, cần tạo thủ công
- Code đã được cập nhật để mặc định dùng `railway` thay vì `valorant`


# 🌱 Hướng dẫn Seed dữ liệu Wiki

## ❌ Vấn đề

Dữ liệu trong wiki bị mất hoặc không có dữ liệu ban đầu.

## 🔍 Nguyên nhân

Migration chỉ tạo **tables** (cấu trúc database), không tự động thêm **dữ liệu mẫu**. Bạn cần chạy **seeder** để thêm dữ liệu vào database.

## ✅ Giải pháp

### Cách 1: Chạy Seeder Local

```bash
# Chạy migration (nếu chưa chạy)
npm run migrate

# Chạy seeder để thêm dữ liệu mẫu
npm run seed

# Hoặc chạy cả migration và seeder cùng lúc
npm run migrate-and-seed
```

### Cách 2: Chạy Seeder trên Railway

#### Bước 1: Vào Railway Dashboard

1. Vào Web Service → Tab **"Deploy Logs"**
2. Hoặc vào MySQL Service → **"Connect"** → **"Open MySQL Shell"**

#### Bước 2: Chạy Seeder qua Railway Shell

1. Vào Web Service → Tab **"Settings"** → **"Service"**
2. Tìm phần **"Run Command"** hoặc **"Shell"**
3. Chạy lệnh:
```bash
npm run seed
```

#### Bước 3: Hoặc chạy qua MySQL Shell

1. Vào MySQL Service → **"Connect"** → **"Open MySQL Shell"**
2. Copy nội dung file `database/seeders/001_sample_pages_data.sql`
3. Paste vào MySQL Shell và chạy

### Cách 3: Tự động chạy Seeder khi Deploy

Để tự động chạy seeder mỗi khi deploy, bạn có thể:

1. Thêm vào **Build Command** trên Railway:
```bash
npm install && npm run migrate && npm run seed
```

⚠️ **Lưu ý:** Cách này sẽ chạy seeder mỗi lần deploy, có thể tạo duplicate data.

## 📝 Dữ liệu được Seed

Seeder sẽ thêm các trang wiki mẫu:

- **Maps:** Ascent, Haven, Icebox, Lotus, Pearl, Split, Sunset
- **Agents:** Jett, Sage
- **Weapons:** Vandal, Phantom

## 🔍 Kiểm tra dữ liệu

Sau khi chạy seeder, kiểm tra:

```sql
-- Xem số lượng pages
SELECT COUNT(*) FROM Pages;

-- Xem tất cả pages
SELECT title, slug, category FROM Pages;
```

## 💡 Tips

1. **Seeder chỉ chạy một lần:** Nếu đã có dữ liệu, seeder sẽ skip (không tạo duplicate)
2. **Backup trước khi seed:** Nếu có dữ liệu quan trọng, backup trước khi chạy seeder
3. **Chạy migration trước:** Đảm bảo đã chạy migration để tạo tables trước khi seed

## 🐛 Troubleshooting

### Lỗi "Bảng 'Pages' chưa tồn tại"

```bash
# Chạy migration trước
npm run migrate
```

### Lỗi "Duplicate entry"

Đây là lỗi bình thường - seeder sẽ tự động skip các record đã tồn tại.

### Dữ liệu không hiển thị

1. Kiểm tra database connection đúng chưa
2. Kiểm tra xem seeder đã chạy thành công chưa
3. Kiểm tra logs để xem có lỗi gì không

---

Sau khi chạy seeder, dữ liệu wiki sẽ được thêm vào database và hiển thị trên website!


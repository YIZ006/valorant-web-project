# 🔧 Fix lỗi 502 Bad Gateway trên Railway

## ❌ Vấn đề

Server không thể khởi động → 502 Bad Gateway

## 🔍 Nguyên nhân có thể

1. **Database connection fail** → Server exit trước khi start
2. **Thiếu environment variables**
3. **Database chưa được tạo**
4. **Đang dùng Public URL thay vì Internal URL**

## ✅ Giải pháp từng bước

### Bước 1: Kiểm tra MySQL Service

1. Vào Railway Dashboard
2. Kiểm tra MySQL service phải là **"Online"** (không phải "Crashed" hoặc "Stopped")
3. Nếu MySQL service crashed, click **"Redeploy"**

### Bước 2: Lấy MYSQL_URL từ MySQL Service

1. Click vào **MySQL Service**
2. Vào tab **"Variables"**
3. Tìm biến **`MYSQL_URL`**
4. Copy giá trị (ví dụ: `mysql://root:password@mysql.railway.internal:3306/railway`)

### Bước 3: Thêm MYSQL_URL vào Web Service

1. Click vào **Web Service** (valorant-web-project)
2. Vào tab **"Variables"**
3. Click **"+ New Variable"**
4. Thêm:
   - **Key:** `MYSQL_URL`
   - **Value:** (paste URL từ MySQL service)
5. Click **"Add"**

### Bước 4: Kiểm tra Database Name

Từ `MYSQL_URL`, kiểm tra database name:
- Nếu URL có `/valorant` → Database name là `valorant`
- Nếu URL có `/railway` → Database name là `railway`

**Nếu database name là `railway` nhưng bạn cần `valorant`:**

1. Vào MySQL Service → **"Connect"** → **"Open MySQL Shell"**
2. Chạy:
```sql
CREATE DATABASE IF NOT EXISTS valorant;
```

3. Sau đó, trong Web Service Variables, thay đổi `MYSQL_URL`:
   - Tìm phần `/railway` ở cuối URL
   - Đổi thành `/valorant`
   - Ví dụ: `mysql://root:password@mysql.railway.internal:3306/valorant`

### Bước 5: Xóa DATABASE_URL (nếu có)

Nếu có biến `DATABASE_URL` trong Web Service Variables:
1. Click vào biến `DATABASE_URL`
2. Click **"Delete"**

**Lý do:** Code ưu tiên dùng `MYSQL_URL` (Internal URL), nhưng nếu có `DATABASE_URL` và không có `MYSQL_URL`, sẽ dùng `DATABASE_URL` (Public URL) → có thể bị timeout.

### Bước 6: Kiểm tra các Environment Variables khác

Đảm bảo có các biến sau trong Web Service Variables:

- `MYSQL_URL` (từ MySQL service)
- `PORT` (Railway tự động set, không cần thêm)
- `NODE_ENV=production` (optional, nhưng nên có)
- `SESSION_SECRET` (nếu dùng session)

### Bước 7: Redeploy Web Service

1. Vào Web Service
2. Click **"Redeploy"** hoặc **"Deploy"**
3. Đợi deploy xong
4. Kiểm tra **"Deploy Logs"** để xem có lỗi không

### Bước 8: Kiểm tra Logs

1. Vào Web Service → Tab **"Deploy Logs"**
2. Tìm các dòng:
   - `✅ Kết nối database thành công!` → Database OK
   - `✅ Server đã khởi động thành công!` → Server OK
   - `❌ Lỗi kết nối database` → Database connection fail

## 🔍 Debug Commands

Nếu vẫn không được, thử chạy local để test:

```bash
# Test database connection
npm run test-db

# Chạy migration
npm run migrate
```

## 📝 Checklist

- [ ] MySQL service đang "Online"
- [ ] `MYSQL_URL` đã được thêm vào Web Service Variables
- [ ] Database name đúng (`valorant` hoặc `railway`)
- [ ] Database đã được tạo (nếu cần)
- [ ] `DATABASE_URL` đã được xóa (nếu có)
- [ ] Web Service đã được redeploy
- [ ] Kiểm tra Deploy Logs không có lỗi

## 💡 Tips

1. **Luôn dùng MYSQL_URL (Internal)** trên Railway để tránh timeout
2. **Database name mặc định** trên Railway là `railway`, không phải `valorant`
3. **Server sẽ retry** database connection 5 lần trước khi start
4. **Server sẽ vẫn start** ngay cả khi database fail (nhưng sẽ log warning)

---

Sau khi làm theo các bước trên, Railway sẽ tự động redeploy và server sẽ chạy thành công!


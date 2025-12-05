# 🔧 Fix lỗi ETIMEDOUT - Database Connection Timeout

## ❌ Lỗi

```
connect ETIMEDOUT
Host: ballast.proxy.rlwy.net
Database: valorant
```

## 🔍 Nguyên nhân

1. **Đang dùng Public Network URL** thay vì Internal URL
2. **Database name sai**: Đang dùng `valorant` nhưng Railway mặc định là `railway`
3. **Connection timeout** do network issues

## ✅ Giải pháp

### Bước 1: Kiểm tra Environment Variables trên Railway

Vào Web Service → Tab **"Variables"**, kiểm tra:

1. **MYSQL_URL** (Internal URL) - Railway tự động tạo
   - Format: `mysql://root:password@mysql.railway.internal:3306/valorant`
   - Đây là URL nên dùng (nhanh, miễn phí)

2. **DATABASE_URL** (nếu có) - Có thể là Public URL
   - Format: `mysql://root:password@ballast.proxy.rlwy.net:43862/valorant`
   - Public URL có thể bị timeout

### Bước 2: Đảm bảo dùng MYSQL_URL

Code đã được cập nhật để **ưu tiên dùng MYSQL_URL** (Internal URL).

**Nếu không có MYSQL_URL**, làm như sau:

1. Vào MySQL Service → Tab **"Variables"**
2. Tìm biến `MYSQL_URL`
3. Copy giá trị
4. Vào Web Service → Tab **"Variables"**
5. Thêm biến:
   - Key: `MYSQL_URL`
   - Value: (paste URL từ MySQL service)

### Bước 3: Kiểm tra Database Name

Từ `MYSQL_URL`, kiểm tra database name:
- Nếu là `/valorant` → Database name là `valorant`
- Nếu là `/railway` → Database name là `railway`

**Nếu database name là `valorant`**:
- Đảm bảo database `valorant` đã được tạo trên Railway
- Hoặc đổi database name trong URL thành `railway`

### Bước 4: Tạo Database (nếu cần)

Nếu database `valorant` chưa tồn tại:

1. Vào MySQL Service → **"Connect"** → **"Open MySQL Shell"**
2. Chạy:
```sql
CREATE DATABASE IF NOT EXISTS valorant;
```

### Bước 5: Kiểm tra MySQL Service

Đảm bảo MySQL service đang **"Online"** (không phải "Crashed" hoặc "Stopped").

## 📝 Code đã được cập nhật

- Thêm timeout settings (60 seconds)
- Ưu tiên dùng `MYSQL_URL` (Internal URL)
- Cải thiện error messages cho timeout

## 🔍 Debug Steps

1. Kiểm tra MySQL service status: Phải là "Online"
2. Kiểm tra biến `MYSQL_URL` trong Web Service Variables
3. Kiểm tra database name trong URL
4. Kiểm tra logs để xem host và port đang dùng
5. Thử tạo database `valorant` nếu chưa có

---

Sau khi fix, Railway sẽ tự động redeploy và kết nối thành công!


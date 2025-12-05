# 🔧 Fix Service Crashed trên Railway

## 🔍 Vấn đề

Service `valorant-web-project` đã crash, có thể do:
1. Database `valorant` chưa được tạo
2. Chưa cấu hình đúng biến môi trường
3. Lỗi kết nối database

## ✅ Giải pháp

### Bước 1: Kiểm tra Database đã được tạo chưa

Từ hình ảnh, tôi thấy `MYSQL_URL` có database name là `valorant`:
```
mysql://root:...@mysql.railway.internal:3306/valorant
```

**Cần kiểm tra:**
1. Vào Railway → MySQL Service → Tab **"Database"**
2. Hoặc vào **"Connect"** → **"Open MySQL Shell"**
3. Chạy lệnh để kiểm tra:
```sql
SHOW DATABASES;
```

Nếu không thấy database `valorant`, tạo nó:
```sql
CREATE DATABASE valorant;
```

### Bước 2: Cấu hình Web Service Variables

Vào Web Service `valorant-web-project` → Tab **"Variables"**:

#### Railway tự động tạo:
- `MYSQL_URL` - Internal URL (đã có sẵn)

#### Bạn cần thêm:
1. **SESSION_SECRET**:
   - Key: `SESSION_SECRET`
   - Value: (chạy `node generate-secret.js` để tạo)

2. **NODE_ENV**:
   - Key: `NODE_ENV`
   - Value: `production`

3. **HOST** (để public access):
   - Key: `HOST`
   - Value: `0.0.0.0`

### Bước 3: Chạy Migration

Sau khi database `valorant` đã được tạo:

1. Vào Web Service → **"Settings"** → **"Open Shell"**
2. Chạy migration:
```bash
npm run migrate
```

Hoặc nếu muốn chỉ định database:
```bash
DB_NAME=valorant npm run migrate
```

### Bước 4: Kiểm tra Logs

Vào Web Service → Tab **"Deployments"** → **"View Logs"** để xem lỗi cụ thể.

## 📝 Lưu ý quan trọng

1. **MYSQL_URL vs DATABASE_URL**:
   - Railway tự động tạo `MYSQL_URL` với Internal URL
   - Code đã được cập nhật để ưu tiên dùng `MYSQL_URL`
   - Internal URL chỉ hoạt động giữa các service trong cùng project

2. **Database name**:
   - Từ `MYSQL_URL`, database name là `valorant`
   - Đảm bảo database này đã được tạo trên Railway

3. **Service crash**:
   - Thường do lỗi kết nối database
   - Kiểm tra logs để biết lỗi cụ thể
   - Đảm bảo migration đã được chạy

## 🔍 Debug Steps

1. Kiểm tra database `valorant` đã tồn tại chưa
2. Kiểm tra biến `MYSQL_URL` trong Web Service Variables
3. Kiểm tra logs để xem lỗi cụ thể
4. Chạy migration nếu chưa chạy
5. Redeploy service sau khi fix


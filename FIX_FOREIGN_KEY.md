# 🔧 Fix lỗi Foreign Key `Abilities_ibfk_1`

## ❌ Lỗi

```
Abilities_ibfk_1 - Foreign key constraint error
```

## 🔍 Nguyên nhân

Lỗi này xảy ra khi:
1. Bảng `Agents` chưa được tạo trước khi tạo bảng `Abilities`
2. Foreign key constraint không có `ON DELETE` và `ON UPDATE` clauses
3. Bảng đã tồn tại nhưng foreign key bị conflict

## ✅ Giải pháp

### Cách 1: Xóa và tạo lại database (Khuyến nghị)

1. Vào Railway → MySQL Service → **"Database"** hoặc **"Connect"**
2. Mở MySQL Shell hoặc MySQL Workbench
3. Xóa database cũ (nếu có):
```sql
DROP DATABASE IF EXISTS valorant;
CREATE DATABASE valorant;
USE valorant;
```

4. Chạy lại migration:
```bash
npm run migrate
```

### Cách 2: Xóa foreign key và tạo lại

Nếu database đã có dữ liệu quan trọng:

1. Kết nối MySQL:
```sql
USE valorant;
```

2. Xóa foreign key cũ:
```sql
ALTER TABLE Abilities DROP FOREIGN KEY Abilities_ibfk_1;
```

3. Tạo lại foreign key với ON DELETE/UPDATE:
```sql
ALTER TABLE Abilities 
ADD CONSTRAINT Abilities_ibfk_1 
FOREIGN KEY (agent_id) 
REFERENCES Agents(agent_id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;
```

### Cách 3: Chạy migration mới

Migration đã được cập nhật với `ON DELETE CASCADE` và `ON UPDATE CASCADE`:

1. Đảm bảo đã pull code mới nhất từ GitHub
2. Chạy migration:
```bash
npm run migrate
```

## 📝 Thay đổi đã thực hiện

- Thêm `ON DELETE CASCADE ON UPDATE CASCADE` cho tất cả foreign keys
- Đảm bảo thứ tự tạo bảng đúng (Agents trước Abilities)
- Cải thiện error handling

## 🔍 Kiểm tra

Sau khi fix, kiểm tra foreign keys:

```sql
SHOW CREATE TABLE Abilities;
```

Bạn sẽ thấy foreign key với `ON DELETE CASCADE ON UPDATE CASCADE`.


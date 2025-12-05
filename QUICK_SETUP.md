# ⚡ Hướng dẫn Nhanh: Kết nối Railway MySQL với Render

## 🎯 Tóm tắt nhanh

Bạn đã có MySQL trên Railway, giờ cần kết nối với Render.

## 📝 Các bước:

### 1️⃣ Copy Connection URL từ Railway

Từ hình ảnh của bạn, bạn có:
```
mysql://root:MtJxlQPvXJtiPsCymKpfpBVsbEoYwXwW@gondola.proxy.rlwy.net:15518/railway
```

**⚠️ QUAN TRỌNG**: 
- Nếu có tab **"Private Network"**, dùng URL đó (miễn phí hơn)
- Nếu không có, dùng URL **"Public Network"** hiện tại

### 2️⃣ Cấu hình trên Render

1. Vào **Render Dashboard** → Web Service của bạn
2. Vào **"Environment"** tab
3. Thêm biến mới:

**Key**: `DATABASE_URL`  
**Value**: `mysql://root:MtJxlQPvXJtiPsCymKpfpBVsbEoYwXwW@gondola.proxy.rlwy.net:15518/railway`

**Lưu ý**: Thay URL trên bằng URL **Private Network** nếu có!

### 3️⃣ Thêm các biến khác

Thêm các biến sau:

| Key | Value | Ghi chú |
|-----|-------|---------|
| `SESSION_SECRET` | `your_random_secret_here` | Chạy `node generate-secret.js` để tạo |
| `NODE_ENV` | `production` | |
| `PORT` | `10000` | Render tự set, nhưng để đảm bảo |

### 4️⃣ Chạy Migration

Sau khi deploy thành công:

**Cách 1: Dùng Render Shell**
1. Vào Render → Web Service → **"Shell"**
2. Chạy: `npm run migrate`

**Cách 2: Dùng MySQL Client từ máy local**
```bash
mysql -h gondola.proxy.rlwy.net -P 15518 -u root -p railway < database/migrations/001_init.sql
```
(Nhập password khi được hỏi)

### 5️⃣ Kiểm tra

Vào **Render Logs**, bạn sẽ thấy:
```
✅ Kết nối database thành công!
Database: railway
Host: gondola.proxy.rlwy.net:15518
```

## 🔍 Test kết nối từ máy local (Tùy chọn)

1. Tạo file `.env` trong project:
```env
DATABASE_URL=mysql://root:MtJxlQPvXJtiPsCymKpfpBVsbEoYwXwW@gondola.proxy.rlwy.net:15518/railway
```

2. Chạy test:
```bash
npm run test-db
```

## ⚠️ Lưu ý quan trọng

1. **Database name**: Railway tạo database tên `railway` mặc định. Nếu bạn muốn đổi tên, cần tạo database mới hoặc đổi trong connection URL.

2. **Private vs Public Network**:
   - **Private Network**: Miễn phí, chỉ hoạt động giữa các service trên Railway
   - **Public Network**: Có thể tốn phí egress, nhưng hoạt động từ bất kỳ đâu

3. **Bảo mật**: 
   - KHÔNG commit password vào Git
   - Đổi password định kỳ trong Railway Dashboard

## 🐛 Nếu gặp lỗi

### Lỗi: "Access denied"
- Kiểm tra username/password đã đúng chưa
- Thử reset password trong Railway Dashboard

### Lỗi: "Can't connect"
- Kiểm tra host và port
- Thử dùng Public Network URL nếu Private không hoạt động

### Lỗi: "Unknown database"
- Database name trong URL có thể sai
- Kiểm tra database name trong Railway Dashboard

---

**Xem chi tiết**: [RAILWAY_SETUP.md](./RAILWAY_SETUP.md)


# 🚀 Hướng dẫn Deploy lên Railway

## 📋 Bước 1: Cấu hình Environment Variables trên Railway

Sau khi tạo Web Service trên Railway, bạn cần cấu hình các biến môi trường:

### 1. DATABASE_URL (Tự động hoặc thủ công)

**Cách 1: Railway tự động tạo (Nếu MySQL và Web Service trong cùng project)**
- Railway tự động tạo biến `DATABASE_URL` từ MySQL service
- Không cần làm gì thêm!

**Cách 2: Thêm thủ công**
1. Vào Railway Dashboard → MySQL Service → Tab **"Connect"**
2. Copy **Private Network** URL (hoặc Public Network nếu cần)
3. Vào Web Service → Tab **"Variables"**
4. Thêm biến:
   - Key: `DATABASE_URL`
   - Value: `mysql://root:password@host:port/railway`

### 2. SESSION_SECRET

1. Chạy trên máy local:
```bash
node generate-secret.js
```

2. Copy chuỗi được tạo

3. Vào Railway → Web Service → **"Variables"**
4. Thêm biến:
   - Key: `SESSION_SECRET`
   - Value: (paste chuỗi vừa copy)

### 3. NODE_ENV

Vào Railway → Web Service → **"Variables"**:
- Key: `NODE_ENV`
- Value: `production`

### 4. HOST (Để public access)

Để cho phép truy cập từ internet:
- Key: `HOST`
- Value: `0.0.0.0`

**Lưu ý**: 
- `0.0.0.0` = Public (có thể truy cập từ internet)
- `localhost` hoặc `127.0.0.1` = Chỉ truy cập từ máy local
- Mặc định: `0.0.0.0` cho production, `localhost` cho development

### 5. PORT (Tùy chọn)

Railway tự động set PORT, nhưng bạn có thể thêm:
- Key: `PORT`
- Value: `3000`

## 📋 Bước 2: Chạy Migration

Sau khi deploy thành công:

1. Vào Railway → Web Service → **"Settings"** → **"Open Shell"**
2. Hoặc vào **"Deployments"** → **"View Logs"** → Tab **"Shell"**
3. Chạy:
```bash
npm run migrate
```

## 📋 Bước 3: Kiểm tra

Vào **"Deployments"** → **"View Logs"**, bạn sẽ thấy:
```
✅ Kết nối database thành công!
Database: railway
Host: switchback.proxy.rlwy.net:13403
🚀 Server đang chạy tại: http://0.0.0.0:3000
```

## 🔧 Cấu hình cho Local Development

Nếu muốn test trên máy local trước khi deploy:

1. Copy file `.env.example` thành `.env`:
```bash
cp .env.example .env
```

2. Cập nhật `.env` với thông tin từ Railway:
   - Lấy **Public Network** URL từ Railway MySQL Service
   - Thay `YOUR_PASSWORD` bằng password thực tế
   - Tạo `SESSION_SECRET` bằng `node generate-secret.js`

3. Test kết nối:
```bash
npm run test-db
```

4. Chạy server:
```bash
npm start
```

## ⚠️ Lưu ý quan trọng

1. **File .env KHÔNG được commit lên GitHub** (đã có trong .gitignore)
2. **Chỉ commit .env.example** (template không có thông tin nhạy cảm)
3. **Railway tự động inject DATABASE_URL** nếu MySQL và Web Service trong cùng project
4. **Password được Railway quản lý tự động**, bạn không cần nhập thủ công

## 📝 Checklist Deploy

- [ ] Web Service đã được tạo trên Railway
- [ ] MySQL Database đã được tạo và đang chạy
- [ ] DATABASE_URL đã được cấu hình (tự động hoặc thủ công)
- [ ] SESSION_SECRET đã được thêm vào Variables
- [ ] NODE_ENV=production đã được set
- [ ] Migration đã được chạy (`npm run migrate`)
- [ ] Service đã deploy thành công
- [ ] Website đã hoạt động

---

**Xem thêm**: [RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md) để biết hướng dẫn chi tiết đầy đủ.


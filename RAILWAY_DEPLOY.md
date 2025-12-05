# 🚂 Hướng dẫn Deploy lên Railway.com

Railway cho phép deploy cả Web Service và Database trên cùng một platform, rất tiện lợi!

## 📋 Bước 1: Tạo Web Service trên Railway

1. Vào [Railway Dashboard](https://railway.app)
2. Trong project của bạn, click **"+ New"** → **"GitHub Repo"**
3. Chọn repository: `valorant-web-project`
4. Railway sẽ tự động detect Node.js và bắt đầu deploy

## 📋 Bước 2: Kết nối với MySQL Database

Railway tự động tạo biến môi trường khi có database trong cùng project!

1. Trong Web Service vừa tạo, vào tab **"Variables"**
2. Railway đã tự động thêm biến `DATABASE_URL` từ MySQL service
3. Nếu chưa có, bạn có thể:
   - Vào MySQL service → Tab **"Connect"** → Copy **Private Network** URL
   - Vào Web Service → **"Variables"** → Thêm:
     - Key: `DATABASE_URL`
     - Value: `mysql://root:password@host:port/railway`

## 📋 Bước 3: Cấu hình Environment Variables
Vào Web Service → Tab **"Variables"**, thêm các biến sau:
### Database (Đã tự động nếu MySQL trong cùng project)
```
DATABASE_URL=mysql://root:password@host:port/railway
```
Railway tự động tạo biến này nếu MySQL và Web Service trong cùng project.
### Session Secret
```
SESSION_SECRET=your_random_secret_here
```
Chạy `node generate-secret.js` để tạo secret, sau đó copy vào đây.

### Server Configuration
```
NODE_ENV=production
PORT=3000
```
**Lưu ý**: Railway tự động set PORT, nhưng có thể để PORT=3000 để đảm bảo.

### Ngrok (Không cần trên Railway)
```
ENABLE_NGROK=false
```

## 📋 Bước 4: Cấu hình Build & Start Commands

Railway tự động detect, nhưng bạn có thể kiểm tra:

1. Vào Web Service → Tab **"Settings"**
2. **Build Command**: `npm install` (hoặc để trống, Railway tự detect)
3. **Start Command**: `npm start` (hoặc để trống)

## 📋 Bước 5: Chạy Migration

Sau khi deploy thành công, bạn cần tạo các bảng trong database:

### Cách 1: Sử dụng Railway Shell (Khuyến nghị)

1. Vào Web Service → Tab **"Deployments"** → Click vào deployment mới nhất
2. Click **"View Logs"** → Tab **"Shell"**
3. Hoặc vào Web Service → Tab **"Settings"** → **"Open Shell"**
4. Chạy migration:
```bash
npm run migrate
```

### Cách 2: Sử dụng MySQL Client từ máy local

1. Vào MySQL service → Tab **"Connect"** → Copy **Public Network** URL
2. Chạy từ máy local:
```bash
mysql -h host -P port -u root -p railway < database/migrations/001_init.sql
```

### Cách 3: Sử dụng Railway CLI

1. Cài Railway CLI:
```bash
npm i -g @railway/cli
```

2. Login:
```bash
railway login
```

3. Link project:
```bash
railway link
```

4. Connect và chạy migration:
```bash
railway connect MySQL
mysql -u root -p railway < database/migrations/001_init.sql
```

## 📋 Bước 6: Kiểm tra Deploy

1. Vào Web Service → Tab **"Deployments"**
2. Đợi deployment hoàn thành (status: "Active")
3. Click vào URL được cung cấp (ví dụ: `https://valorant-web-project.up.railway.app`)
4. Kiểm tra logs trong tab **"Deployments"** → **"View Logs"**

Bạn sẽ thấy:
```
✅ Kết nối database thành công!
Database: railway
Host: host:port
🚀 Server đang chạy tại: http://0.0.0.0:3000
```

## 🔧 Cấu hình Custom Domain (Tùy chọn)

1. Vào Web Service → Tab **"Settings"**
2. Scroll xuống **"Networking"**
3. Click **"Generate Domain"** để có domain miễn phí
4. Hoặc thêm custom domain của bạn

## 🐛 Troubleshooting

### Lỗi: "Không thể khởi động server vì lỗi kết nối database"

**Nguyên nhân**: Database chưa được kết nối hoặc biến môi trường chưa đúng.

**Giải pháp**:
1. Kiểm tra MySQL service đang chạy (status: "Online")
2. Kiểm tra biến `DATABASE_URL` trong Web Service → Variables
3. Đảm bảo MySQL và Web Service trong cùng project
4. Xem logs chi tiết để biết lỗi cụ thể

### Lỗi: "Module not found"

**Nguyên nhân**: Dependencies chưa được cài đặt.

**Giải pháp**:
1. Kiểm tra `package.json` có đầy đủ dependencies
2. Xem build logs để kiểm tra `npm install` có thành công không
3. Đảm bảo `package-lock.json` đã được commit

### Lỗi: "Port already in use"

**Nguyên nhân**: PORT environment variable conflict.

**Giải pháp**:
1. Xóa biến `PORT` trong Variables (Railway tự động set)
2. Hoặc để PORT=3000

### Database chưa có bảng

**Giải pháp**: Chạy migration (xem Bước 5)

## 💡 Tips

1. **Private Network**: Railway tự động kết nối các service trong cùng project qua private network (miễn phí, nhanh)

2. **Auto Deploy**: Railway tự động deploy khi bạn push code lên GitHub (nếu đã connect repo)

3. **Environment Variables**: Railway tự động tạo biến từ các service khác trong project (như DATABASE_URL từ MySQL)

4. **Logs**: Xem logs real-time trong tab "Deployments" → "View Logs"

5. **Rollback**: Có thể rollback về deployment cũ trong tab "Deployments"

## 📝 Checklist Deploy

- [ ] Web Service đã được tạo và connect GitHub
- [ ] MySQL Database đã được tạo và đang chạy
- [ ] Environment variables đã được cấu hình (DATABASE_URL, SESSION_SECRET, NODE_ENV)
- [ ] Migration đã được chạy (bảng đã được tạo)
- [ ] Service đã deploy thành công (status: Active)
- [ ] Website đã hoạt động và có thể truy cập
- [ ] Logs không có lỗi

## 🔗 Links hữu ích

- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Railway Status](https://status.railway.app)


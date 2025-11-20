# 🎮 Valorant Wiki - Cấu trúc Routes

## 📁 Cấu trúc thư mục Routes

```
routes/
├── index.js          # Main routes file - mount tất cả routes
├── auth.js           # Authentication routes (login, register, logout)
├── wiki.js           # Wiki routes (view, edit, list pages)
├── admin.js          # Admin management routes
├── agents.js         # Agent management routes
├── roles.js          # Role management routes
└── maps.js           # Map management routes
```

## 🔗 URL Mapping

### **Authentication Routes** (`/auth`)
- `POST /auth/register` - Đăng ký admin
- `POST /auth/login` - Đăng nhập
- `GET /auth/logout` - Đăng xuất

### **Wiki Routes** (`/wiki`)
- `GET /wiki` - Danh sách tất cả trang wiki
- `GET /wiki/:category/:slug` - Xem trang wiki cụ thể
- `GET /wiki/edit/:id` - Form chỉnh sửa trang (cần đăng nhập)
- `POST /wiki/edit/:id` - Lưu chỉnh sửa trang (cần đăng nhập)

### **Admin API Routes** (`/api/admin`)
- `GET /api/admin` - Lấy danh sách admin
- `PUT /api/admin/:admin_id` - Cập nhật admin
- `DELETE /api/admin/:admin_id` - Xóa admin
- `GET /api/admin/me` - Thông tin admin hiện tại

### **Agent API Routes** (`/api/agents`)
- `GET /api/agents` - Lấy danh sách agents
- `POST /api/agents` - Thêm agent mới
- `PUT /api/agents/:agent_id` - Cập nhật agent
- `DELETE /api/agents/:agent_id` - Xóa agent

### **Role API Routes** (`/api/roles`)
- `GET /api/roles` - Lấy danh sách roles
- `POST /api/roles` - Thêm role mới
- `PUT /api/roles/:role_id` - Cập nhật role
- `DELETE /api/roles/:role_id` - Xóa role

### **Map API Routes** (`/api/maps`)
- `GET /api/maps` - Lấy danh sách maps
- `POST /api/maps` - Thêm map mới
- `PUT /api/maps/:map_id` - Cập nhật map
- `DELETE /api/maps/:map_id` - Xóa map

### **Other Routes**
- `GET /pages/:name` - Serve các trang admin
- `GET /dashboard.html` - Dashboard admin
- `GET /admin.html` - Trang quản lý admin

## 🛠️ Cách hoạt động

### **1. Middleware Pattern**
Mỗi route file sử dụng middleware pattern:
```javascript
// Inject pool vào request
const injectPool = (pool) => {
  return (req, res, next) => {
    req.pool = pool;
    next();
  };
};

// Kiểm tra authentication
const isAuthenticated = (req, res, next) => {
  if (req.session.user) return next();
  res.status(401).json({ error: "Chưa đăng nhập" });
};
```

### **2. Route Mounting**
Trong `routes/index.js`:
```javascript
// Mount các routes với middleware inject pool
router.use("/auth", injectPool(global.pool), authRoutes);
router.use("/wiki", injectPool(global.pool), wikiRoutes);
router.use("/api/admin", injectPool(global.pool), adminRoutes);
// ...
```

### **3. Server Integration**
Trong `server.js`:
```javascript
// Import routes
const routes = require("./routes");

// Mount tất cả routes
app.use("/", routes);
```

## 🎯 Lợi ích của cấu trúc này

✅ **Tách biệt concerns** - Mỗi module quản lý một nhóm routes riêng
✅ **Dễ maintain** - Sửa một module không ảnh hưởng module khác
✅ **Reusable** - Có thể tái sử dụng middleware và logic
✅ **Scalable** - Dễ dàng thêm routes mới
✅ **Clean code** - Server.js ngắn gọn, dễ đọc

## 🚀 Cách thêm routes mới

1. **Tạo file route mới** trong `routes/`
2. **Export router** từ file đó
3. **Import và mount** trong `routes/index.js`
4. **Test** routes mới

Ví dụ thêm routes cho weapons:
```javascript
// routes/weapons.js
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  // Logic lấy danh sách weapons
});

module.exports = router;
```

```javascript
// routes/index.js
const weaponsRoutes = require("./weapons");
router.use("/api/weapons", injectPool(global.pool), weaponsRoutes);
```


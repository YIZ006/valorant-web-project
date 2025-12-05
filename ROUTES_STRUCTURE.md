# 🎮 Valorant Wiki - Cấu trúc Routes (Laravel-style)

## 📁 Thư mục liên quan

```
src/
├── app/
│   ├── Http/
│   │   ├── Controllers/    # Chứa toàn bộ controller
│   │   └── Middlewares/    # ensureAuthenticated, ensureApiAuthenticated
│   └── Services/           # Làm việc với database / business logic
├── routes/
│   ├── web.js              # Các route giao diện + auth + wiki
│   └── api.js              # Các route REST `/api/*`
└── bootstrap/app.js        # Nơi mount web/api routes vào Express app
```

## 🔗 URL Mapping (không đổi endpoint)

| Nhóm | Endpoints | Controller |
| --- | --- | --- |
| Auth (`/auth`) | `POST /auth/register`, `POST /auth/login`, `GET /auth/logout` | `AuthController` |
| Wiki (`/wiki`) | `GET /wiki`, `GET /wiki/:category/:slug`, `GET/POST /wiki/edit/:id` | `WikiController` |
| Admin (`/api/admin`) | `GET /api/admin`, `GET /api/admin/me`, `PUT /api/admin/:admin_id`, `DELETE /api/admin/:admin_id` | `AdminController` |
| Agents (`/api/agents`) | CRUD | `AgentController` |
| Roles (`/api/roles`) | CRUD | `RoleController` |
| Maps (`/api/maps`) | CRUD | `MapController` |
| Static pages | `/dashboard.html`, `/admin.html`, `/pages/:name`, ... | Handled in `web.js` với middleware `ensureAuthenticated` |

## 🧱 Luồng request

1. **Router** (`routes/web.js` hoặc `routes/api.js`) định nghĩa endpoint.
2. **Middleware** `ensureAuthenticated`/`ensureApiAuthenticated` bảo vệ route.
3. **Controller** xử lý request, validate dữ liệu và gọi Service.
4. **Service** làm việc với database thông qua `mysql2` pool.

Không còn `global.pool`. Tầng Service import trực tiếp `pool` từ `src/config/database.js`, giống cách Laravel dùng Query Builder/Eloquent trong service layer.

## 🧩 Ví dụ rút gọn

```js
// routes/api.js
router.get("/agents", ensureApiAuthenticated, AgentController.index);
```

```js
// app/Http/Controllers/AgentController.js
const AgentService = require("../../Services/AgentService");

class AgentController {
  static async index(req, res) {
    const agents = await AgentService.listAgents();
    res.json(agents);
  }
}
```

```js
// app/Services/AgentService.js
const { pool } = require("../../config/database");
module.exports = {
  listAgents: async () => {
    const [rows] = await pool.query("SELECT * FROM agents");
    return rows;
  },
};
```

## 🚀 Thêm route mới

1. Tạo controller/service mới (nếu cần) dưới `src/app`.
2. Định nghĩa endpoint trong `routes/web.js` hoặc `routes/api.js`.
3. Mount middleware phù hợp.
4. (Tuỳ chọn) cập nhật tài liệu nếu là module lớn.

Ví dụ thêm `WeaponsController` vào API:

```js
// routes/api.js
const WeaponsController = require("../app/Http/Controllers/WeaponsController");
router.get("/weapons", ensureApiAuthenticated, WeaponsController.index);
```

## ✅ Lợi ích

- Cấu trúc thư mục quen thuộc nếu bạn từng dùng Laravel.
- Controllers mỏng, dễ đọc; Services gom toàn bộ truy cập DB.
- Không cần `global` state, dễ test và mở rộng.
- Dễ thêm middleware/guards mới cho từng nhóm route.


# 🔗 Hướng dẫn lấy URL cho MCP Server

## 📋 Tổng quan

URL trong file `mcp.json` là địa chỉ của MCP (Model Context Protocol) server. URL `mcp://your-db-mcp.borg.sh/123abc` là **ví dụ/template**, bạn cần thay bằng URL thực.

## 🔍 Các cách lấy URL MCP Server

### Cách 1: Sử dụng MCP Server Provider (Cloud Service)

Nếu bạn đang sử dụng một MCP server provider (như database-as-a-service), URL sẽ được cung cấp trong dashboard của họ:

1. **Đăng ký tài khoản** tại provider
2. **Tạo MCP server instance**
3. **Copy URL** từ dashboard (ví dụ: `mcp://db-server.example.com/abc123`)
4. **Paste vào file `mcp.json`**

### Cách 2: Tự host MCP Server với Ngrok

Nếu bạn tự host MCP server trên máy local:

#### Bước 1: Chạy MCP server local
```bash
# Ví dụ: MCP server chạy trên port 8080
node mcp-server.js
```

#### Bước 2: Tạo ngrok tunnel
```bash
ngrok http 8080
```

#### Bước 3: Lấy URL từ ngrok
Ngrok sẽ hiển thị:
```
Forwarding    https://abc123.ngrok-free.app -> localhost:8080
```

#### Bước 4: Cập nhật mcp.json
```json
{
  "mcpServers": {
    "borg": {
      "url": "mcp://abc123.ngrok-free.app"
    }
  }
}
```

### Cách 3: Sử dụng Domain/Subdomain riêng

Nếu bạn có domain riêng và đã deploy MCP server:

```json
{
  "mcpServers": {
    "borg": {
      "url": "mcp://mcp.yourdomain.com"
    }
  }
}
```

### Cách 4: Localhost (chỉ dùng cho development)

Nếu MCP server chạy trên cùng máy với Cursor:

```json
{
  "mcpServers": {
    "borg": {
      "url": "mcp://localhost:8080"
    }
  }
}
```

## 🎯 Cấu trúc URL MCP

URL MCP có format:
```
mcp://[hostname]:[port]/[path]?[token]
```

**Ví dụ:**
- `mcp://example.com` - Không có port (dùng default)
- `mcp://example.com:8080` - Có port
- `mcp://example.com/path` - Có path
- `mcp://example.com/path?token=abc123` - Có token

## 🔧 Kiểm tra URL có hoạt động không

### Test với curl:
```bash
curl -X GET "mcp://your-server.com" 
```

### Test trong Node.js:
```javascript
const testMCP = async () => {
  try {
    const response = await fetch('mcp://your-server.com');
    console.log('MCP server is reachable');
  } catch (error) {
    console.error('Cannot reach MCP server:', error);
  }
};
```

## 📝 Ví dụ cấu hình đầy đủ

### Ví dụ 1: Ngrok
```json
{
  "mcpServers": {
    "borg": {
      "url": "mcp://abc123.ngrok-free.app",
      "auth": {
        "token": "your-auth-token"
      }
    }
  }
}
```

### Ví dụ 2: Custom domain
```json
{
  "mcpServers": {
    "borg": {
      "url": "mcp://mcp.borg.sh",
      "auth": {
        "apiKey": "your-api-key"
      }
    }
  }
}
```

### Ví dụ 3: Localhost
```json
{
  "mcpServers": {
    "borg": {
      "url": "mcp://localhost:8080"
    }
  }
}
```

## ⚠️ Lưu ý

1. **URL hiện tại (`mcp://your-db-mcp.borg.sh/123abc`) là ví dụ** - cần thay bằng URL thực
2. **Nếu không có MCP server**, có thể bỏ qua cấu hình này hoặc comment out
3. **URL ngrok thay đổi** mỗi lần khởi động (trừ tài khoản trả phí)
4. **Bảo mật**: Không commit URL có token vào git

## 🐛 Troubleshooting

### Lỗi: "Cannot connect to MCP server"
- Kiểm tra URL đúng chưa
- Kiểm tra MCP server đang chạy chưa
- Kiểm tra firewall/network
- Kiểm tra token/auth nếu có

### Lỗi: "Invalid URL format"
- Đảm bảo URL bắt đầu bằng `mcp://`
- Kiểm tra không có khoảng trắng
- Kiểm tra JSON syntax đúng

## 💡 Gợi ý

Nếu bạn chưa có MCP server, có thể:
1. **Tạm thời comment out** phần này trong `mcp.json`
2. **Hoặc xóa** nếu không cần
3. **Tạo MCP server riêng** nếu muốn tích hợp

```json
{
  "mcpServers": {}
}
```


/**
 * Script tạo SESSION_SECRET ngẫu nhiên
 * Chạy: node generate-secret.js
 */

const crypto = require("crypto");

// Tạo một chuỗi ngẫu nhiên mạnh (64 ký tự)
const secret = crypto.randomBytes(32).toString("hex");

console.log("=".repeat(60));
console.log("🔐 SESSION_SECRET đã được tạo:");
console.log("=".repeat(60));
console.log(secret);
console.log("=".repeat(60));
console.log("\n💡 Copy chuỗi trên và paste vào file .env:");
console.log(`SESSION_SECRET=${secret}`);
console.log("\n⚠️  Lưu ý: Giữ bí mật chuỗi này, không chia sẻ với ai!");


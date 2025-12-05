/**
 * Script để tự động cấu hình .env cho Railway MySQL
 * Sử dụng: node scripts/setup-railway-env.js
 * 
 * Hoặc truyền DATABASE_URL làm argument:
 * node scripts/setup-railway-env.js "mysql://root:password@host:port/railway"
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Lấy DATABASE_URL từ argument hoặc prompt
const databaseUrl = process.argv[2];

if (!databaseUrl) {
  console.log('📝 Hướng dẫn cấu hình .env cho Railway MySQL\n');
  console.log('Cách 1: Truyền DATABASE_URL làm argument:');
  console.log('  node scripts/setup-railway-env.js "mysql://root:password@host:port/railway"\n');
  console.log('Cách 2: Tự cập nhật file .env với nội dung sau:\n');
  console.log('DATABASE_URL=mysql://root:YOUR_PASSWORD@switchback.proxy.rlwy.net:13403/railway');
  console.log('SESSION_SECRET=' + crypto.randomBytes(32).toString('hex'));
  console.log('HOST=0.0.0.0');
  console.log('NODE_ENV=development');
  console.log('PORT=3000\n');
  process.exit(0);
}

// Parse DATABASE_URL
let parsedUrl;
try {
  parsedUrl = new URL(databaseUrl);
} catch (error) {
  console.error('❌ DATABASE_URL không hợp lệ:', error.message);
  process.exit(1);
}

// Tạo SESSION_SECRET
const sessionSecret = crypto.randomBytes(32).toString('hex');

// Tạo nội dung .env
const envContent = `# ==========================
# 🗄️ RAILWAY MYSQL DATABASE
# ==========================
DATABASE_URL=${databaseUrl}

# ==========================
# 🔐 SESSION SECRET
# ==========================
SESSION_SECRET=${sessionSecret}

# ==========================
# 🚀 SERVER CONFIGURATION
# ==========================
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
`;

// Đường dẫn file .env
const envPath = path.join(__dirname, '..', '.env');

// Kiểm tra file .env đã tồn tại chưa
if (fs.existsSync(envPath)) {
  console.log('⚠️  File .env đã tồn tại!');
  console.log('📝 Nội dung mới sẽ được ghi vào .env.railway.example');
  console.log('💡 Bạn có thể copy nội dung vào file .env hiện tại\n');
  
  const examplePath = path.join(__dirname, '..', '.env.railway.example');
  fs.writeFileSync(examplePath, envContent);
  console.log('✅ Đã tạo file .env.railway.example');
  console.log('📋 Nội dung:');
  console.log('─'.repeat(50));
  console.log(envContent);
  console.log('─'.repeat(50));
} else {
  // Tạo file .env mới
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Đã tạo file .env với cấu hình Railway MySQL!');
  console.log(`   Database: ${parsedUrl.pathname.slice(1) || 'railway'}`);
  console.log(`   Host: ${parsedUrl.hostname}:${parsedUrl.port || 3306}`);
  console.log(`   User: ${parsedUrl.username}`);
  console.log(`\n🔐 SESSION_SECRET đã được tạo tự động`);
}

console.log('\n💡 Tiếp theo:');
console.log('   1. Kiểm tra file .env đã đúng chưa');
console.log('   2. Test kết nối: npm run test-db');
console.log('   3. Chạy server: npm start\n');


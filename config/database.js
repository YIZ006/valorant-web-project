require("dotenv").config();
const mysql = require("mysql2/promise");

// Cấu hình database từ environment variables
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "valorant",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Tạo pool connection
const pool = mysql.createPool(dbConfig);

// Test kết nối
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Kết nối database thành công!");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Lỗi kết nối database:", error.message);
    return false;
  }
};

module.exports = {
  pool,
  testConnection
};
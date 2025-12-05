const sessionConfig = {
  secret: process.env.SESSION_SECRET || "d80c655ae436a6178767791d6bd8642657c7d72075063c9384299b73fd749eea",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
  // Sử dụng MemoryStore cho development, nhưng cảnh báo
  // Trong production nên dùng Redis hoặc database-backed store
  name: 'valorant.sid',
};

// Cảnh báo về MemoryStore trong production
if (process.env.NODE_ENV === 'production') {
  console.warn("⚠️  WARNING: Using MemoryStore for sessions in production.");
  console.warn("⚠️  This is not recommended for production. Consider using:");
  console.warn("    - Redis with connect-redis");
  console.warn("    - Database-backed store with connect-session-sequelize");
}

module.exports = { sessionConfig };


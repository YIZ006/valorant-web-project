const sessionConfig = {
  secret: process.env.SESSION_SECRET || "mySecretKey123",
  resave: false,
  saveUninitialized: false,
};

module.exports = { sessionConfig };


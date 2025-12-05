const ensureAuthenticated = (req, res, next) => {
  if (req.session?.user) {
    return next();
  }
  return res.redirect("/login.html");
};

const ensureApiAuthenticated = (req, res, next) => {
  if (req.session?.user) {
    return next();
  }
  return res.status(401).json({ error: "Chưa đăng nhập" });
};

module.exports = {
  ensureAuthenticated,
  ensureApiAuthenticated,
};


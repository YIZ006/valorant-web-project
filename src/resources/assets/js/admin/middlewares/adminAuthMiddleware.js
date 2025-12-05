const jwt = require("jsonwebtoken");

function verifyAdmin(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ message: "Thiếu token" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Token không hợp lệ" });
        if (decoded.role !== "superadmin" && decoded.role !== "moderator")
            return res.status(403).json({ message: "Không có quyền truy cập" });

        req.admin = decoded;
        next();
    });
}

module.exports = verifyAdmin;

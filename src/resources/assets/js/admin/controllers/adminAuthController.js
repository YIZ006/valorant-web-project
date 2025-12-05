const db = require("../../../config/db"); // đường dẫn tùy bạn
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.promise().query("SELECT * FROM Admins WHERE username = ?", [username]);
        const admin = rows[0];

        if (!admin) return res.status(404).json({ message: "Admin không tồn tại" });

        const validPass = await bcrypt.compare(password, admin.password);
        if (!validPass) return res.status(401).json({ message: "Sai mật khẩu" });

        const token = jwt.sign(
            { admin_id: admin.admin_id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({ message: "Đăng nhập thành công", token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server" });
    }
};

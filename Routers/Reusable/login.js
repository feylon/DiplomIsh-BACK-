import { comparePassword } from "../../functions/bcrypt.js";
import { pool } from "../../functions/db.js";
import { Router } from "express";
import { sign } from "../../functions/jwt.js";
import Joi from "joi";

const router = Router();

// Validatsiya sxemasi
const loginSchema = Joi.object({
    student_id_number: Joi.number().integer().required().messages({
        "any.required": "student_id_number is required.",
    }),
    password: Joi.string().min(1).required().messages({
        "string.min": "Password must be at least 1 characters long.",
        "any.required": "Password is required.",
    }),
});

router.post("/", async (req, res) => {
    console.log(req.body);
    
    const { error } = loginSchema.validate(req.body);
    const { student_id_number, password } = req.body;

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE student_id_number = $1",
            [student_id_number]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        const user = result.rows[0];

        const match = await comparePassword(password, user.password);

        if (!match) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const token = sign({ id: user.id, role: user.role });
        try {
            const ip = req.ip;
            const user_agent = req.headers["user-agent"];
            await pool.query(
                "INSERT INTO loginHistory (user_id, ip_address, user_agent) VALUES ($1, $2, $3)",
                [user.id, ip, user_agent]
            );
        } catch (error) {
            console.error("Error logging login history:", error);
            return res.status(500).json({ message: "Internal server error." });
        }
        res.json({
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                student_id_number: user.student_id_number,
                role: user.role,
                phone: user.phone,
                img_url: user.img_url,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Internal server error." });
    }
});

export default router;

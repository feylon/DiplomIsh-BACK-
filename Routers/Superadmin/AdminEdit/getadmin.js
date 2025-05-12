import { Router } from "express";
import { verify, checkrole } from "../../../functions/jwt.js";
import { pool } from "../../../functions/db.js";
const router = Router();

// url = http://localhost:3000/api/superadmin/getadmin
router.get("/", verify, checkrole("superadmin"), async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT student_id_number, full_name, email, passport_pin, passport_number, phone, gender, role 
             FROM users WHERE role = 'admin';`
        );
        res.status(200).json({ data: result.rows });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Database error" });
    }
});

export default router;

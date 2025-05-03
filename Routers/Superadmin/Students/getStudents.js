import { Router } from "express";
import { verify, checkrole } from "../../../functions/jwt.js";
import { pool } from "../../../functions/db.js";
import Joi from "joi";

//url http://localhost:3000/api/admin/getusers?page=1&size=2

const router = Router();

const Schema = Joi.object({
    page: Joi.number().integer().min(1).required(),
    size: Joi.number().integer().min(1).required()
});

router.get('/', verify, checkrole('superadmin'), async (req, res) => {
    const { error, value } = Schema.validate(req.query);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { page, size } = value;
    const offset = (page - 1) * size;

    try {
        const query = `
            SELECT id, full_name, email, phone, student_id_number, passport_pin, passport_number, gender, role, img_url, groupname, created_at
            FROM users
            WHERE role = 'student'
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2
        `;
        const students = await pool.query(query, [size, offset]);

        const countQuery = `
            SELECT COUNT(*) AS total
            FROM users
            WHERE role = 'student'
        `;
        const totalResult = await pool.query(countQuery);
        const total = parseInt(totalResult.rows[0].total, 10);

        res.json({
            students: students.rows,
            pagination: {
                total,
                page,
                size,
                totalPages: Math.ceil(total / size)
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
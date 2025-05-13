import { Router } from "express";
import { verify, checkrole } from "../../../functions/jwt.js";
import { pool } from "../../../functions/db.js";
import Joi from "joi";

//url http://localhost:3000/api/superadmin/getusers?page=1&size=2 tags : Superadmin 



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
            WHERE role = 'admin'
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2
        `;
        const students = await pool.query(query, [size, offset]);

        const countQuery = `
            SELECT COUNT(*) AS total
            FROM users
            WHERE role = 'admin'
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
/**
 * @swagger
 * /api/superadmin/getusers:
 *   get:
 *     summary: Admin foydalanuvchilarni sahifalab olish (faqat superadmin uchun)
 *     description: Superadmin barcha admin rolli foydalanuvchilar ro'yxatini sahifalab ko'rishi mumkin. JWT token va superadmin roli talab etiladi.
 *     tags:
 *       - Superadmin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Sahifa raqami (1 dan boshlab)
 *       - name: size
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Har bir sahifadagi foydalanuvchi soni
 *     responses:
 *       200:
 *         description: Adminlar ro'yxati muvaffaqiyatli qaytarildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 students:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       full_name:
 *                         type: string
 *                         example: Nodira Karimova
 *                       email:
 *                         type: string
 *                         example: nodira@example.com
 *                       phone:
 *                         type: string
 *                         example: +998901234567
 *                       student_id_number:
 *                         type: string
 *                         example: 2100456789
 *                       passport_pin:
 *                         type: string
 *                         example: AB1234567
 *                       passport_number:
 *                         type: string
 *                         example: AA1234567
 *                       gender:
 *                         type: string
 *                         example: Ayol
 *                       role:
 *                         type: string
 *                         example: admin
 *                       img_url:
 *                         type: string
 *                         example: https://example.com/image.jpg
 *                       groupname:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-05-10T12:34:56.000Z
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     size:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *       400:
 *         description: Noto‘g‘ri so‘rov parametrlari
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       401:
 *         description: Ruxsat etilmagan. Token mavjud emas yoki noto‘g‘ri
 *       403:
 *         description: Ruxsat yo‘q. Faqat superadmin kirishi mumkin
 *       500:
 *         description: Ichki server xatoligi
 */

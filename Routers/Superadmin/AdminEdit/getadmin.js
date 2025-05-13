import { Router } from "express";
import { verify, checkrole } from "../../../functions/jwt.js";
import { pool } from "../../../functions/db.js";
const router = Router();

// url = http://localhost:3000/api/superadmin/getadmin Tags :Superadmin
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

/**
 * @swagger
 * /api/superadmin/getadmin:
 *   get:
 *     summary: Admin foydalanuvchilari ro'yxatini olish (faqat superadmin)
 *     description: Superadmin barcha admin foydalanuvchilarni ro'yxatini olish imkoniyatiga ega.
 *     tags:
 *       - Superadmin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin foydalanuvchilar ro'yxati muvaffaqiyatli olishdi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       student_id_number:
 *                         type: integer
 *                         example: 123456
 *                       full_name:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "john.doe@example.com"
 *                       passport_pin:
 *                         type: string
 *                         example: "ABC1234"
 *                       passport_number:
 *                         type: string
 *                         example: "A12345678"
 *                       phone:
 *                         type: string
 *                         example: "+998901234567"
 *                       gender:
 *                         type: string
 *                         enum:
 *                           - "Ayol"
 *                           - "Erkak"
 *                         example: "Erkak"
 *                       role:
 *                         type: string
 *                         example: "admin"
 *       500:
 *         description: Server xatosi yoki bazadagi muammo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database error"
 */

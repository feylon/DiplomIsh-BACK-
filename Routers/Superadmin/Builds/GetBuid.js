import { Router } from "express";
import { verify, checkrole } from "../../../functions/jwt.js";
import { pool } from "../../../functions/db.js";

const router = Router();

// url = http://localhost:3000/api/superadmin/getbuild tags Superadmin
router.get('/', verify, checkrole('superadmin'), async (req, res) => {
    try {
        const data = await pool.query(`
            Select 
build.name as name,
users.full_name as full_name,
build.created_at as created_at,
build.description as description
from build inner join users on build.user_id = users.id
order by build.created_at desc
            `);
        if (data.rowCount > 0) {
            return res.status(200).send({ data: data.rows });
        } else {
            return res.status(404).send({ error: "Builds not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Server error" });
    }
});

export default router;

/**
 * @swagger
 * /api/superadmin/getbuild:
 *   get:
 *     summary: Barcha binolarni ko'rsatish (faqat superadmin)
 *     description: Superadmin barcha mavjud binolarni va ularni yaratuvchi foydalanuvchilarni ko'rsatadi.
 *     tags:
 *       - Superadmin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli binolar ro'yxati
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
 *                       name:
 *                         type: string
 *                         example: Bino A
 *                       full_name:
 *                         type: string
 *                         example: John Doe
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-04-01T12:00:00Z"
 *                       description:
 *                         type: string
 *                         example: "Science faculty building"
 *       404:
 *         description: Binolar topilmadi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Builds not found"
 *       401:
 *         description: Foydalanuvchi roli noto'g'ri yoki autentifikatsiya xato
 *       500:
 *         description: Ichki server xatoligi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server error"
 */

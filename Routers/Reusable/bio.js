import { comparePassword } from "../../functions/bcrypt.js";
import { pool } from "../../functions/db.js";
import { Router } from "express";
import { sign,verify } from "../../functions/jwt.js";
import Joi from "joi";

const router = Router();



router.get("/", verify, async (req, res) => {
    console.log(req.user);

    try {
        const data = await pool.query(
`select
full_name,
email,
phone,
student_id_number,
passport_pin,
gender,
img_url,
groupname as group_name,
role

from users where id = $1`,
            [req.user.id]

        );
        return res.status(200).json(
           data.rows[0]
        );

    } catch (error) {
        console.log(error);
        return res.status(500).json({status: false, message: "Internal server error"});

    }


});

export default router;
// URL http://localhost:3000/api/bio tags : avtorizatsiya
/**
 * @swagger
 * /api/bio:
 *   get:
 *     summary: Foydalanuvchi ma'lumotlarini olish
 *     description: JWT token asosida avtorizatsiyadan o‘tgan foydalanuvchining shaxsiy ma’lumotlarini qaytaradi.
 *     tags:
 *       - Avtorizatsiya
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Foydalanuvchining shaxsiy ma’lumotlari muvaffaqiyatli qaytarildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 full_name:
 *                   type: string
 *                   example: Alisher Aliyev
 *                 email:
 *                   type: string
 *                   example: alisher@example.com
 *                 phone:
 *                   type: string
 *                   example: +998901234567
 *                 student_id_number:
 *                   type: string
 *                   example: 2100123456
 *                 passport_pin:
 *                   type: string
 *                   example: AB1234567
 *                 gender:
 *                   type: string
 *                   example: Erkak
 *                 img_url:
 *                   type: string
 *                   example: https://example.com/images/alisher.jpg
 *                 group_name:
 *                   type: string
 *                   example: 913-21
 *                 role:
 *                   type: string
 *                   example: user
 *       401:
 *         description: Ruxsat etilmagan. JWT token noto‘g‘ri yoki yo‘q
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token xato yoki mavjud emas
 *       500:
 *         description: Serverda ichki xatolik yuz berdi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

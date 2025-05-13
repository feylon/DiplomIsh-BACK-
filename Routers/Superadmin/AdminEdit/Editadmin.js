import { Router } from "express";
import { verify, checkrole } from "../../../functions/jwt.js";
import { pool } from "../../../functions/db.js";
import Joi from "joi";
const router = Router();

// url = http://localhost:3000/api/superadmin/editadmin Tags Superadmin
const schema = Joi.object({
    student_id_number: Joi.number().integer().min(0).required(),
    full_name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    passport_pin: Joi.string().required(),
    passport_number: Joi.string().required(),
    phone: Joi.string().required(),
    gender: Joi.string().valid("Ayol", "Erkak").required(),
});

router.put("/", verify, checkrole("superadmin"), async (req, res) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const {
        student_id_number,
        full_name,
        email,
        passport_pin,
        passport_number,
        phone,
        gender
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE users 
             SET full_name = $1, email = $2, passport_pin = $3, passport_number = $4, phone = $5, gender = $6
             WHERE student_id_number = $7;`,
            [
                full_name, email, passport_pin, passport_number, phone, gender, student_id_number
            ]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
        }

        res.status(200).json({ data: "success" });
    } catch (err) {
        if(err.code == '23505')
            return res.status(409).send({error : err.detail})
        console.log(err);
        res.status(500).json({ error: "Database error" });
    }
});

export default router;

/**
 * @swagger
 * /api/superadmin/editadmin:
 *   put:
 *     summary: Admin foydalanuvchisi ma'lumotlarini yangilash (faqat superadmin)
 *     description: Superadmin foydalanuvchi ma'lumotlarini yangilash imkoniyatiga ega. Foydalanuvchi `student_id_number` orqali topilib, yangilanadi.
 *     tags:
 *       - Superadmin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_id_number:
 *                 type: integer
 *                 example: 123456
 *               full_name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               passport_pin:
 *                 type: string
 *                 example: "ABC1234"
 *               passport_number:
 *                 type: string
 *                 example: "A12345678"
 *               phone:
 *                 type: string
 *                 example: "+998901234567"
 *               gender:
 *                 type: string
 *                 enum:
 *                   - "Ayol"
 *                   - "Erkak"
 *                 example: "Erkak"
 *     responses:
 *       200:
 *         description: Foydalanuvchi ma'lumotlari muvaffaqiyatli yangilandi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   example: "success"
 *       400:
 *         description: Yaroqsiz so'rov. Kiruvchi ma'lumotlar noto'g'ri.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "email is not allowed"
 *       404:
 *         description: Foydalanuvchi topilmadi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Foydalanuvchi topilmadi"
 *       409:
 *         description: Foydalanuvchi ma'lumotlari allaqachon mavjud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Ushbu email allaqachon mavjud"
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

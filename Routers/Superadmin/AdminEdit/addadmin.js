import { Router } from "express";
import { verify, checkrole } from "../../../functions/jwt.js";
import { pool } from "../../../functions/db.js";
import { hashPassword } from "../../../functions/bcrypt.js"
import Joi from "joi";
const router = Router();

// url = http://localhost:3000/api/superadmin/addadmin Tags : Superadmin
const schema = Joi.object({
    student_id_number: Joi.number().integer().min(0).required(),
    full_name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    passport_pin: Joi.string().required(),
    passport_number: Joi.string().required(),
    phone: Joi.string().required(),
    gender: Joi.string().valid("Ayol", "Erkak").required(),

});

router.post("/", verify, checkrole("superadmin"), async (req, res) => {
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
const hashPassword_pin = await hashPassword(passport_pin);
    try {
        const result = await pool.query(
            `INSERT INTO users (student_id_number, full_name, password, email, passport_pin, passport_number, phone, gender,role)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'admin');`,
            [
                student_id_number, full_name, hashPassword_pin, email, passport_pin, passport_number, phone, gender
            ]
        );
        res.status(201).json({data : "success"});
    } catch (err) {
        if(err.code == '23505')
            return res.status(409).send({error : "Ushbu foydalanuvchi allaqachon qushilgan"})
        console.log(err)
        res.status(500).json({ error: "Database error" });
    }
});

export default router;
/**
 * @swagger
 * /api/superadmin/addadmin:
 *   post:
 *     summary: Yangi admin foydalanuvchini qo'shish (faqat superadmin)
 *     description: Superadmin yangi admin foydalanuvchi qo'shish imkonini beradi.
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
 *       201:
 *         description: Foydalanuvchi muvaffaqiyatli qo'shildi
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
 *       409:
 *         description: Foydalanuvchi allaqachon mavjud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Ushbu foydalanuvchi allaqachon qushilgan"
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

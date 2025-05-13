import { Router } from "express";
import { verify, checkrole } from "../../../functions/jwt.js";
import { pool } from "../../../functions/db.js";
import Joi from "joi";

// url = http://localhost:3000/api/superadmin/addbuild tags : Superadmin
const router = Router();

const Schema = Joi.object (
    {
        name : Joi.string().min(3).max(30).required(),
        description : Joi.string().min(3).max(100).required(),
        user_id : Joi.string().uuid().required()
    }
);

router.post('/', verify, checkrole('superadmin'), async (req, res) => {
    const checkSchema = Schema.validate(req.body);
    const {error, value} = checkSchema;
    if(error) return res.status(400).send({
        error : error.message
    });
    const {
        name, description, user_id
    } = value;
    try {
        const data = await pool.query("Select * from build where name = $1", [name]);
        if(data.rowCount > 0) return res.status(409).send({
            error : "Ushbu build allaqachon mavjud"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({error : "Serverda xatolik"});
    }

    try {
        let data = await pool.query("Insert into build (name, description, user_id) values ($1, $2, $3);", [name, description, user_id]);{
            if(data.rowCount > 0) return res.status(201).send({data : "success"});
            else return res.status(500).send({error : "Serverda xatolik"});
        }
    } catch (error) {
        if(error.code == '23503')
            return res.status(401).send({error : "Foydlanuvchi idsi xato"})
        console.log(error);
        return res.status(500).send({error : "Serverda xatolik"});
    }

});

export default router;
/**
 * @swagger
 * /api/superadmin/addbuild:
 *   post:
 *     summary: Yangi bino qo'shish (faqat superadmin)
 *     description: Superadmin yangi bino nomi, tavsifi va unga biriktirilgan foydalanuvchini ko'rsatgan holda yangi bina qo'shadi.
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
 *             required:
 *               - name
 *               - description
 *               - user_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: Bino A
 *               description:
 *                 type: string
 *                 example: Fizika fakultetining asosiy binosi
 *               user_id:
 *                 type: string
 *                 format: uuid
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       201:
 *         description: Yangi bino muvaffaqiyatli qo'shildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   example: success
 *       400:
 *         description: Noto‘g‘ri so‘rov ma’lumotlari
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       401:
 *         description: Foydalanuvchi IDsi mavjud emas yoki noto‘g‘ri (FK constraint)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Foydlanuvchi idsi xato
 *       403:
 *         description: Ruxsat yo‘q. Faqat superadmin kirishi mumkin
 *       409:
 *         description: Bunday bino nomi allaqachon mavjud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Ushbu build allaqachon mavjud
 *       500:
 *         description: Ichki server xatoligi
 */

import { Router } from "express";
import { verify, checkrole } from "../../../functions/jwt.js";
import { pool } from "../../../functions/db.js";
import Joi from "joi";

// url = http://localhost:3000/api/superadmin/editbuild/:id tags Superadmin
const router = Router();

const Schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    description: Joi.string().min(3).max(100).required(),
    user_id: Joi.string().uuid().required()
});

const schemaid = Joi.string().uuid().required();

router.patch('/:id', verify, checkrole('superadmin'), async (req, res) => {
    const { id } = req.params;
    const checkSchemaId = schemaid.validate(req.params.id);
    if(checkSchemaId.error)
        return res.status(401).send({error : checkSchemaId.error.message}) 
    const checkSchema = Schema.validate(req.body);
    const { error, value } = checkSchema;
    if (error) return res.status(400).send({ error: error.message });

    const { name, description, user_id } = value;

    try {
        const exist = await pool.query("SELECT * FROM build WHERE id = $1", [id]);
        if (exist.rowCount === 0) {
            return res.status(404).send({ error: "Build topilmadi" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Serverda xatolik" });
    }

    try {
        const update = await pool.query(
            `UPDATE build 
             SET name = $1, description = $2, user_id = $3 
             WHERE id = $4`,
            [name, description, user_id, id]
        );
        if (update.rowCount > 0) {
            return res.status(200).send({ message: "Build muvaffaqiyatli yangilandi" });
        } else {
            return res.status(500).send({ error: "Serverda xatolik" });
        }
    } catch (error) {
        if (error.code === '23503') {
            return res.status(401).send({ error: "Foydalanuvchi ID noto'g'ri" });
        }
        console.log(error);
        return res.status(500).send({ error: "Serverda xatolik" });
    }
});

export default router;
/**
 * @swagger
 * /api/superadmin/editbuild/{id}:
 *   patch:
 *     summary: Mavjud binoni tahrirlash (faqat superadmin)
 *     description: Superadmin mavjud binoning nomi, tavsifi va unga biriktirilgan foydalanuvchini yangilaydi.
 *     tags:
 *       - Superadmin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Tahrir qilinayotgan binoning UUID formadagi IDsi
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 123e4567-e89b-12d3-a456-426614174000
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
 *                 example: Bino B
 *               description:
 *                 type: string
 *                 example: Matematika fakulteti uchun ajratilgan bino
 *               user_id:
 *                 type: string
 *                 format: uuid
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       200:
 *         description: Bino muvaffaqiyatli yangilandi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Build muvaffaqiyatli yangilandi
 *       400:
 *         description: Yaroqsiz ma'lumot
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       401:
 *         description: Noto‘g‘ri user_id yoki ID formati noto‘g‘ri
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Foydalanuvchi ID noto'g'ri
 *       403:
 *         description: Ruxsat yo‘q. Faqat superadmin kirishi mumkin
 *       404:
 *         description: Bino topilmadi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Build topilmadi
 *       500:
 *         description: Ichki server xatoligi
 */

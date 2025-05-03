import { Router } from "express";
import { verify, checkrole } from "../../../functions/jwt.js";
import { pool } from "../../../functions/db.js";
import Joi from "joi";
const router = Router();

// url = http://localhost:3000/api/superadmin/editadmin
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

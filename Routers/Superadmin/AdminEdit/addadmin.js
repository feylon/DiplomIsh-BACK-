import { Router } from "express";
import { verify, checkrole } from "../../../functions/jwt.js";
import { pool } from "../../../functions/db.js";
import { hashPassword } from "../../../functions/bcrypt.js"
import Joi from "joi";
const router = Router();

// url = http://localhost:3000/api/superadmin/addadmin
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
            `INSERT INTO users (student_id_number, full_name, password, email, passport_pin, passport_number, phone, gender)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
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
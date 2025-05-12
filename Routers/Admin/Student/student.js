import { Router } from "express";
import { verify, checkrole } from "../../../functions/jwt.js";
import { pool } from "../../../functions/db.js";
import Joi from "joi";
import { encrypt } from "../../../functions/crypto.js";


const router = Router();
const schema = Joi.object({
    student_id: Joi.string().uuid().required()
});



router.post("/", verify, checkrole("admin"), async (req, res) => {
    console.log(req.query)
    const { error, value } = schema.validate(req.query);
    if (error) return res.status(400).json({ status: false, message: error.details[0].message });
    const { student_id } = value;

    try {
        const data = await pool.query(`
Select 
id,
full_name,
passport_pin,
passport_number,
img_url,
groupname
from users where role = 'student' and id = $1
        `, [student_id]);
        res.status(200).send({data : data.rows})

    } catch (error) {
console.log(error)
    }
});


export default router;

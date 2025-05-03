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

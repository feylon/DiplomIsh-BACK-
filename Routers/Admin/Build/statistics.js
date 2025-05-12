import { Router } from "express";
import { verify, checkrole } from "../../../functions/jwt.js";
import { pool } from "../../../functions/db.js";
import Joi from "joi";
import {encrypt} from "../../../functions/crypto.js";


const router = Router();
const schema = Joi.object({
      status: Joi.string().valid("in", "out").required(),
});



router.post("/", verify, checkrole("admin"), async (req, res) => {
const {error, value} = schema.validate(req.body);
if (error) return res.status(400).json({status: false, message: error.details[0].message});
const {status} = value;
try {
    const data = await pool.query(`
        SELECT
  history.id as id,
  users.full_name as full_name,
  users.phone as user_phone,
  users.groupname as groupname,
  users.img_url as img_url,
  history.enter_time as enter_time,
  history.exit_time as exit_time,
  users.role as role,
  (history.exit_time - history.enter_time) as time
FROM
  history
INNER JOIN users ON users.id = history.user_id
INNER JOIN build ON build.id = history.build_id
WHERE
  build.user_id = $1
  AND history.status = $2
ORDER BY
  history.enter_time DESC
LIMIT 1000;

;
    `, [req.user.id, status]);
res.status(200).send(
    
    
  data.rows
);
} catch (error) {
    console.log(error);
    return res.status(500).json({status: false, message: "Internal server error"});
}

});


export default router;

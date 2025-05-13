import { Router } from "express";
import { verify, checkrole } from "../../../functions/jwt.js";
import { pool } from "../../../functions/db.js";
import Joi from "joi";


const router = Router();
const schema = Joi.object({
    student_id: Joi.string().uuid().required()
});



router.post("/", verify, checkrole("admin"), async (req, res) => {
const {error, value} = schema.validate(req.body);
if (error) return res.status(400).json({status: false, message: error.details[0].message});
const {student_id, build_id} = value;


try {
 let data = await pool.query(`
    Select build.id, user_id as user_id from build
inner join users on build.user_id = users.id
where user_id = $1
   
    `, [req.user.id]);
    if (data.rowCount == 0) return res.status(404).json({status: false, message: "Build not found"});
    const build_id = data.rows[0].id;        

    const result = await pool.query(`
        UPDATE history SET
    status = 'out',
    exit_time = now()
    WHERE status = 'in' AND user_id = $1 AND build_id = $2 returning exit_time - enter_time as time;

        `,
    [student_id, build_id,] );

    console.log(result.rows[0]);
        
if(result.rows.length == 0)
    return res.status(400).send({
"en" : "You have destroyed the building.",
"uz" : "Binoni tar etgansiz"
    });
 return   res.status(200).send(
        {
            en : "Success",
            uz : "Muvaffaqiyatli",
            time : result.rows[0].time,
        })
    
} catch (error) {
  console.log(error);
  return res.status(500).json({status: false, message: "Internal server error"});  
}



});


export default router;

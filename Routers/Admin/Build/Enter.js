import { Router } from "express";
import { verify, checkrole } from "../../../functions/jwt.js";
import { pool } from "../../../functions/db.js";
import Joi from "joi";
import {encrypt} from "../../../functions/crypto.js";


const router = Router();
const schema = Joi.object({
    student_id: Joi.string().uuid().required()   
});



router.post("/", verify, checkrole("admin"), async (req, res) => {
const {error, value} = schema.validate(req.body);
if (error) return res.status(400).json({status: false, message: error.details[0].message});
const {student_id} = value;


try {
 let data = await pool.query(`
    Select build.id, user_id as user_id from build
inner join users on build.user_id = users.id
where user_id = $1
   
    `, [req.user.id]);
    if (data.rowCount == 0) return res.status(404).json({status: false, message: "Build not found"});
    const build_id = data.rows[0].id;        


    // Check dominate
    const checkID = await pool.query(
        `
        Select * from history
where status = 'in' AND build_id =  $1
and
user_id = $2
        `,
        [build_id, student_id]
    );

    if(checkID.rowCount > 0){
     return res.status(409).send({
            uz : "Siz binodasiz",
            en : "You are in the building."
        })
    }

    const result = await pool.query(`
    insert into history (build_id, user_id, message)
    values ($1, $2, 'Build Entered')`,
    [build_id, student_id,  ]    )
        

    
} catch (error) {
  console.log(error);
  return res.status(500).json({status: false, message: "Internal server error"});  
}
res.send({
    status: true,
    message: "Success",
    data: encrypt(JSON.stringify({
        student_id
    }))})


});


export default router;

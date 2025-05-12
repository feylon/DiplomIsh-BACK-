import {verify, checkrole} from "../../functions/jwt.js";
import {Router} from "express";
import {pool} from "../../functions/db.js";

const router = Router();
router.get("/", verify, checkrole('student'), async (req, res) => {
try {
    try {
        let data = await pool.query(`
SELECT 
id, full_name as fullname, email,
phone,
student_id_number,
passport_pin,
passport_number,
gender,
img_url,
groupname
from users
where users.role = 'student' and users.id = $1  
            `, [req.user.id]);
            console.log(data.rows[0].id);
 return   res.status(200).json(data.rows[0]);
    } catch (error) {
        console.log(error)
    }
} catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
}

return res.status(200).json({ message: "QR code generated successfully" });


});
export default router;
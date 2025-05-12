import {verify, checkrole} from "../../../functions/jwt.js";
import {Router} from "express";
import {pool} from "../../../functions/db.js";
import QRCode from "qrcode";

const router = Router();
router.get("/", verify, checkrole('student'), async (req, res) => {
try {
    try {
        let data = await pool.query(`
           Select
           	history.id as id,
history.user_id as user_id,
build.name as build_name,
history.enter_time as enter_time,
history.exit_time as exit_time,
history.status as status,
(history.exit_time - history.enter_time) as time
from
history
inner join users on history.user_id = users.id
inner join build on history.build_id = build.id
where history.user_id = $1
order by history.created_at desc
            `, [req.user.id]);
            console.log(data.rows[0].id);
            // /const qrBase64 = await QRCode.toDataURL(data.rows[0].id);
 return   res.json(data.rows);
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
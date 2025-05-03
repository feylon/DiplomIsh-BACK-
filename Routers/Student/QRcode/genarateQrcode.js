import {verify, checkrole} from "../../../functions/jwt.js";
import {Router} from "express";
import {pool} from "../../../functions/db.js";
import QRCode from "qrcode";

const router = Router();
router.get("/", verify, checkrole('student'), async (req, res) => {
try {
    try {
        let data = await pool.query(`
            
            SELECT id FROM public.users
where users.role = 'student' and users.id = $1  
            `, [req.user.id]);
            console.log(data.rows[0].id);
            const qrBase64 = await QRCode.toDataURL(data.rows[0].id);
 return   res.json({ image: qrBase64 });
    } catch (error) {
        
    }
} catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
}

return res.status(200).json({ message: "QR code generated successfully" });


});
export default router;
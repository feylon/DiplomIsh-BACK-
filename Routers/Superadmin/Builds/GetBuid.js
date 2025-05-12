import { Router } from "express";
import { verify, checkrole } from "../../../functions/jwt.js";
import { pool } from "../../../functions/db.js";

const router = Router();

// url = http://localhost:3000/api/superadmin/getbuild
router.get('/', verify, checkrole('superadmin'), async (req, res) => {
    try {
        const data = await pool.query(`
            Select 
build.name as name,
users.full_name as full_name,
build.created_at as created_at,
build.description as description
from build inner join users on build.user_id = users.id
order by build.created_at desc
            `);
        if (data.rowCount > 0) {
            return res.status(200).send({ data: data.rows });
        } else {
            return res.status(404).send({ error: "Builds not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Server error" });
    }
});

export default router;

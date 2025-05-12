import { comparePassword, hashPassword } from "../../functions/bcrypt.js";
import { pool } from "../../functions/db.js";
import { Router } from "express";
import { sign } from "../../functions/jwt.js";
import { v4 as uuidv4 } from 'uuid';
import Joi from "joi";
import fetch from 'node-fetch';
import { configDotenv } from "dotenv";
import rateLimit from 'express-rate-limit';

configDotenv();


async function getAccount(token){
try {
    let data = await fetch(`${process.env.hemis_url}/account/me`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
    console.log(data.status);
    if(data.status == 401){
        return {status: 401, message: "Token xato"};}
    
    if(data.status == 200){
        data = await data.json();
        const { full_name, email, phone, student_id_number, passport_pin,
            passport_number,
            gender,
            image,
            group
         } 
        
        
        = data.data;

        return {status: 200, data :
        {full_name : full_name,
          email : email,
          phone : phone,
          student_id_number : student_id_number,
          passport_pin : passport_pin,
          passport_number : passport_number,  
          gender : gender.name,
          img_url : image,
          group : group.name,
        } };
    }    
} catch (error) {
 console.log(error);
    return {status: 500, message: "Serverda xatolik"};   
}
}


const limiter = rateLimit({
    windowMs: 10 * 1000, // 10 sekundlik oynani belgilaymiz
    max: 1, // Faqat 1 ta so'rov ruxsat beriladi
    message: '10 sekundda faqat 1 ta so‘rov yuborishingiz mumkin. Iltimos kuting.',
    standardHeaders: true, // Standart headerlar
    legacyHeaders: false,  // Eski headerlarni o'chirish
  });

const router = Router();

// Validatsiya sxemasi
const loginSchema = Joi.object({
    login: Joi.number().required().messages({
        "any.required": "login is required.",
    }),
    password: Joi.string().min(1).required().messages({
        "string.min": "Password must be at least 1 characters long.",
        "any.required": "Password is required.",
    }),
});

router.post("/",  async (req, res) => {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

const { login, password} =  value;


try {
    const result = await pool.query(
        "SELECT * FROM users WHERE student_id_number = $1",
        [login]
    );
    if(result.rowCount > 0) {
        return res.status(499).json({ message: "Foydalanuvchi ro'yxatdan o'tgan" });
    }
} catch (error) {
    console.log(error);
    return res.status(500).json({message: "Serverda xatolik"});
}
try {
    let data = await fetch(`${process.env.hemis_url}/auth/login`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            login,
            password,
        })
    });
    if(data.status == 401){
        return res.status(401).json({message: "Login yoki parol xato"});
    }
    if(data.status == 200){
        data = await data.json();
        const { token } = data.data;
        const account = await getAccount(token);
        if(account.status == 401){
            return res.status(401).json({message: "Token xato"});
        }
        if(account.status == 200){
            console.log(account);
            const passport_number_password = await hashPassword(account.data.passport_number);
           
            try {
               
                const result = await pool.query(
                    `
                    INSERT INTO users (
                    full_name,
                    email,
                    password,
                    phone,
                    student_id_number,
                    passport_pin,
                    passport_number,
                    gender,
                    img_url, groupname
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
                    [
                        account.data.full_name,
                        uuidv4(),
                        passport_number_password,
                        account.data.phone,
                        account.data.student_id_number,
                        account.data.passport_pin,
                        account.data.passport_number,
                        account.data.gender,
                        account.data.img_url,
                        account.data.group,
                    ]
                    
                );    

return res.status(200).json({message: "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi"});

            } catch (error) {
                console.log(error);
             return  res.status(500).json({message: "Serverda xatolik, ma'lumotlar saqlanmadi"});
            }  





        }
    }
} catch (error) {
    
}

res.send("ok");

});

export default router;

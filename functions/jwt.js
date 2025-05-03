import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config(); 
const secretKey = process.env.token; 


export function sign(payload, expiresIn = "1d") {
    return jwt.sign(payload, secretKey, { expiresIn });
}

export function verify(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access token is missing" });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded
        
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid access token" });
    }
}

export function checkrole(requiredRole) {

    return (req, res, next) => {
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).json({ message: "Forbidden: insufficient role" });
        }
        next();
    };
}
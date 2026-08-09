import jwt from "jsonwebtoken";

export const generateToken =(userID)=>{
    const token =jwt.sign({userId},process.env.JWT_SECRET);
}
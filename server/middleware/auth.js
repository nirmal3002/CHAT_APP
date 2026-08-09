import User  from "../models/users";
import jwt from "jsonwebtoken";

export  const protectRoute =async(req,res ,next)=>{
try{
    const token =req.headers.token;
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    const user =await user.findById(decoded.userId).select("-password");

    if(!user) return res,json({sucess:false ,message:"user not  found"});

    req.user =user;
    next();
}catch(error){
  res.json({sucess:false,message:error.message});
}
}
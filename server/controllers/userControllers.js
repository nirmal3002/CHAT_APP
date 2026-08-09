import { generateToken } from "../lib/utils.js";
import User from "../models/users.js";
import bcrypt from "bcrypt";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    try {
        if (!fullName || !email || !password || !bio) {
            return res.json({
                success: false,
                message: "Missing details"
            });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.json({
                success: false,
                message: "Account already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio
        });

        return res.json({
            success: true,
            message: "Account created successfully",
            user: newUser
        });
        const token=generateToken(newUser._id)
        res.json({sucess:true, userData:newUser ,token, message:"accounts created sucessfully"})

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
    // controller to login a user

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userData = await User.findOne({ email });

        const isPasswordCorrect = await bcrypt.compare(
            password,
            userData.password
        );

        if (!isPasswordCorrect) {
            return res.json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const token = generateToken(userData._id);

        res.json({
            success: true,
            userData,
            token,
            message: "Login successful",
        });

    } catch (error) {
        console.log(error.message);

        res.json({
            success: false,
            message: error.message,
        });
    }
}
}
//controller to check the user is authenticate
export const checkAuth=(req,res)=>{
    res.json({sucess:true,user:req.user});
}
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body;

        const userId = req.user._id;
        let updatedUser;

        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { bio, fullName },
                { new: true }
            );
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    profilePic: upload.secure_url,
                    bio,
                    fullName
                },
                { new: true }
            );
        }
        res.json({sucess:true ,user : updatedUser})
    } catch (error) {
        // Handle error
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
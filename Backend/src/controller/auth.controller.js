import User from "../model/User.model.js";
import bcrypt from 'bcryptjs'
import { sendWelcomeEmail } from "../emails/emailHandler.js";
import { ENV } from "../lib/env.js";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body
    try {
        if(!fullName || !email || !password) {
            return res.status(400).json({message: "All the fields are required"})
        }
        if(password.length < 6) return res.status(400).json({message: "Password atlest 6 char long"});
        const existinguser = await User.findOne({email})
        if(existinguser) return res.status(400).json({message: "User with email already exists"});
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })
        const savedUser = await newUser.save()
    //     try {
    //         await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
    //   } catch (error) {
    //         console.error("Failed to send welcome email:", error);
    //         return res.status(400).json({message: "Unable to send email"})
    //   }

        generateToken(savedUser._id, res)

        res.status(200).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal server error"})
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        console.log(email, password)
        if(!email || !password) return res.status(400).json({message: "All fields are required"});
        const user = await User.findOne({email})
        if(!user) return res.status(400).json({message: "Invalid credentials"});
        const passwordcheck = await bcrypt.compare(password, user.password);
        if(!passwordcheck) return res.status(400).json({message: "Invalid credentials"});

        generateToken(user._id, res)
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.error("Error in login controller:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = (req, res) => {
    res.cookie("jwt", "", {maxAge: 0})
    return res.status(200).json({message: "Logged out successfully"})
}

export const check = (req, res) => {
    
}
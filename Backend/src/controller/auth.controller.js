import User from "../model/User.model.js";
import bcrypt from 'bcryptjs'
import { sendWelcomeEmail } from "../emails/emailHandler.js";
import { ENV } from "../lib/env.js";
import { generateToken } from "../lib/utils.js";
import { Block } from "../model/Block.model.js";

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

export const block = async(req, res) => {
    try {
        const block = await Block.create({
            blocker: req.user._id,
            blocked: req.params.id
        })
        return res.status(200).json(block)
    } catch (error) {
        console.log("Error in block controller", block)
        return res.status(400).json({message: "Internal server error"})
    }
}

export const unblock = async(req, res) => {
    try {
        const exists = await Block.findOneAndDelete({
            blocker: req.user._id,
            blocked: req.params.id
        })
        return res.status(200).json(exists)
    } catch (error) {
        console.log("Error in Unblock", error)
        return res.status(400).json({message: "Internal server error"})
    }
}

export const checkBlock = async(req, res) => {
    console.log("1 checkBlock called")
    try {
        console.log("2 Inside try block")
        const blockedBySelectedUser = await Block.findOne({
            blocker: req.params.id,
            blocked: req.user._id
        })
        const blockedByUser = await Block.findOne({
            blocked: req.params.id,
            blocker: req.user._id
        })
        console.log("3 After res")
        return res.status(200).json({isBlocked: blockedBySelectedUser ? true : false, 
            blocked: blockedByUser ? true : false})
    } catch (error) {
        console.log("Error in checkBlock", error)
        return res.status(400).json({message: "Internal server error"});
    }
}
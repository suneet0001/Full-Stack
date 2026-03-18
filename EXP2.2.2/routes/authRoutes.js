const express = require("express")
const router = express.Router()

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const verifyToken = require("../middleware/authMiddleware")

// REGISTER
router.post("/register", async(req,res)=>{
    try{
        const {name,email,password} = req.body

        if(!name || !email || !password){
            return res.status(400).json({message:"All fields required"})
        }

        const existing = await User.findOne({email})
        if(existing){
            return res.status(400).json({message:"User already exists"})
        }

        const hashed = await bcrypt.hash(password,10)

        const user = new User({
            name,
            email,
            password:hashed
        })

        await user.save()

        res.json({message:"Registered successfully"})
    } catch(err){
        console.log(err)
        res.status(500).json({message:err.message})
    }
})

module.exports = router

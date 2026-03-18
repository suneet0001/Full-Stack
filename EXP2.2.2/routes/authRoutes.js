const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const verifyToken = require("../middleware/authMiddleware")

const router = express.Router()

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
        res.status(500).json({message:"Error"})
    }
})

// LOGIN
router.post("/login", async(req,res)=>{
    try{
        const {email,password} = req.body

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"User not found"})
        }

        const valid = await bcrypt.compare(password,user.password)
        if(!valid){
            return res.status(401).json({message:"Invalid password"})
        }

        const token = jwt.sign(
            {id:user._id,email:user.email},
            process.env.JWT_SECRET,
            {expiresIn:"1h"}
        )

        res.json({token})
    } catch(err){
        res.status(500).json({message:"Error"})
    }
})

// ACCOUNT
router.get("/account", verifyToken, async(req,res)=>{
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
})

// DEPOSIT
router.post("/deposit", verifyToken, async(req,res)=>{
    const user = await User.findById(req.user.id)
    user.balance += Number(req.body.amount)
    await user.save()
    res.json({message:"Deposited"})
})

// WITHDRAW
router.post("/withdraw", verifyToken, async(req,res)=>{
    const user = await User.findById(req.user.id)

    if(user.balance < req.body.amount){
        return res.status(400).json({message:"Insufficient balance"})
    }

    user.balance -= Number(req.body.amount)
    await user.save()

    res.json({message:"Withdrawn"})
})

module.exports = router
const express = require("express")
const router = express.Router()

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const verifyToken = require("../middleware/authMiddleware")

// ================= REGISTER =================
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
            password:hashed,
            balance:0
        })

        await user.save()

        res.json({message:"Registered successfully"})
    } catch(err){
        console.log(err)
        res.status(500).json({message:err.message})
    }
})

// ================= LOGIN =================
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
        console.log(err)
        res.status(500).json({message:err.message})
    }
})

// ================= ACCOUNT =================
router.get("/account", verifyToken, async(req,res)=>{
    try{
        const user = await User.findById(req.user.id).select("-password")
        res.json(user)
    } catch(err){
        res.status(500).json({message:err.message})
    }
})

// ================= DEPOSIT =================
router.post("/deposit", verifyToken, async(req,res)=>{
    try{
        const user = await User.findById(req.user.id)

        if(req.body.amount <= 0){
            return res.status(400).json({message:"Invalid amount"})
        }

        user.balance += Number(req.body.amount)
        await user.save()

        res.json({message:"Deposited"})
    } catch(err){
        res.status(500).json({message:err.message})
    }
})

// ================= WITHDRAW =================
router.post("/withdraw", verifyToken, async(req,res)=>{
    try{
        const user = await User.findById(req.user.id)

        if(req.body.amount <= 0){
            return res.status(400).json({message:"Invalid amount"})
        }

        if(user.balance < req.body.amount){
            return res.status(400).json({message:"Insufficient balance"})
        }

        user.balance -= Number(req.body.amount)
        await user.save()

        res.json({message:"Withdrawn"})
    } catch(err){
        res.status(500).json({message:err.message})
    }
})

module.exports = router

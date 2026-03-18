router.post("/register", async(req,res)=>{
    try{
        const {name,email,password} = req.body

        if(!name || !email || !password){
            return res.status(400).json({message:"All fields required"})
        }

        console.log("Incoming:", name, email)

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

        const savedUser = await user.save()

        console.log("Saved:", savedUser)

        res.json({message:"Registered successfully"})
    }
    catch(err){
        console.log("ERROR:", err)   // 🔥 IMPORTANT
        res.status(500).json({message: err.message})
    }
})

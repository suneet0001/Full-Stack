const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")
const path = require("path")   

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

app.use(express.static(path.join(__dirname, "public")))

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Atlas Connected"))
.catch(err=>console.log(err))

const authRoutes = require("./routes/authRoutes")

// API routes
app.use("/api", authRoutes)

app.listen(process.env.PORT, ()=>{
    console.log("Server running on port", process.env.PORT)
})

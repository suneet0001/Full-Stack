const express = require("express")
const { createClient } = require("redis")
const { v4: uuidv4 } = require("uuid")

const app = express()
app.use(express.json())

const redis = createClient()

redis.connect().then(() => {
    console.log("Redis Connected")
})

const TOTAL_SEATS = 100

async function initSeats() {
    const exists = await redis.exists("available_seats")
    if (!exists) {
        await redis.set("available_seats", TOTAL_SEATS)
    }
}
initSeats()

app.post("/api/book", async (req, res) => {
    const lockKey = "seat_lock"
    const lockId = uuidv4()

    try {
        const lock = await redis.set(lockKey, lockId, {
            NX: true,
            PX: 3000
        })

        if (!lock) {
            return res.status(429).json({ success:false, msg:"System Busy" })
        }

        let seats = await redis.get("available_seats")
        seats = parseInt(seats)

        if (seats <= 0) {
            await redis.del(lockKey)
            return res.json({ success:false, msg:"House Full" })
        }

        seats = seats - 1
        await redis.set("available_seats", seats)

        await redis.del(lockKey)

        res.json({
            success:true,
            bookingId:Date.now(),
            remaining:seats
        })

    } catch(err) {
        console.log(err)
        res.status(500).json({error:"Server Error"})
    }
})

app.listen(3000, () => {
    console.log("Booking system running on port 3000")
})

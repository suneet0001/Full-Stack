const express = require("express")
const { createClient } = require("redis")
const { v4: uuidv4 } = require("uuid")

const app = express()
app.use(express.json())

// ✅ Redis connection using environment variable
const redis = createClient({
  url: process.env.REDIS_URL
})

redis.on("error", (err) => console.log("Redis Error:", err))

async function connectRedis() {
  await redis.connect()
  console.log("Redis Connected")
}
connectRedis()

const TOTAL_SEATS = 100

// ✅ Initialize seats only once
async function initSeats() {
  const exists = await redis.exists("available_seats")
  if (!exists) {
    await redis.set("available_seats", TOTAL_SEATS)
    console.log("Seats initialized")
  }
}
initSeats()

// ✅ Booking API
app.post("/api/book", async (req, res) => {
  const lockKey = "seat_lock"
  const lockId = uuidv4()

  try {
    // Acquire distributed lock
    const lock = await redis.set(lockKey, lockId, {
      NX: true,
      PX: 3000
    })

    if (!lock) {
      return res.status(429).json({
        success: false,
        msg: "System Busy"
      })
    }

    let seats = await redis.get("available_seats")
    seats = parseInt(seats)

    if (seats <= 0) {
      // Release lock safely
      const currentLock = await redis.get(lockKey)
      if (currentLock === lockId) {
        await redis.del(lockKey)
      }

      return res.json({
        success: false,
        msg: "House Full"
      })
    }

    seats -= 1
    await redis.set("available_seats", seats)

    // Release lock safely
    const currentLock = await redis.get(lockKey)
    if (currentLock === lockId) {
      await redis.del(lockKey)
    }

    res.json({
      success: true,
      bookingId: Date.now(),
      remaining: seats
    })

  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Server Error" })
  }
})

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("Seat Booking System Running")
})

// ✅ Use dynamic port for Render
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

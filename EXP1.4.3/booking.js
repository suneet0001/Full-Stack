const express = require("express")
const { createClient } = require("redis")
const { v4: uuidv4 } = require("uuid")

const app = express()
app.use(express.json())

// Redis connection
const redis = createClient({
  url: process.env.REDIS_URL
})

redis.on("error", (err) => console.log("Redis Error:", err))

async function startServer() {
  await redis.connect()
  console.log("Redis Connected")

  const TOTAL_SEATS = 100

  const exists = await redis.exists("available_seats")
  if (!exists) {
    await redis.set("available_seats", TOTAL_SEATS)
    console.log("Seats initialized")
  }

  // Booking API
  app.post("/api/book", async (req, res) => {
    const lockKey = "seat_lock"
    const lockId = uuidv4()

    try {
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

  // Remaining seats API
  app.get("/remaining", async (req, res) => {
    const seats = await redis.get("available_seats")
    res.json({ remaining: parseInt(seats) })
  })

  // Reset seats API
  app.post("/reset", async (req, res) => {
    await redis.set("available_seats", 100)
    res.json({ message: "Seats reset to 100" })
  })

  // Professional UI
  app.get("/", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Seat Booking System</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: linear-gradient(to right, #1e3c72, #2a5298);
          color: white;
          text-align: center;
          padding-top: 80px;
        }
        .card {
          background: white;
          color: black;
          width: 350px;
          margin: auto;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0px 10px 25px rgba(0,0,0,0.3);
        }
        .seats {
          font-size: 40px;
          margin: 20px 0;
        }
        button {
          padding: 10px 20px;
          margin: 10px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
        }
        .book {
          background: #28a745;
          color: white;
        }
        .reset {
          background: #dc3545;
          color: white;
        }
        .status {
          margin-top: 15px;
          font-weight: bold;
        }
        .loading { color: orange; }
        .success { color: green; }
        .error { color: red; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>🎟 Seat Booking</h1>
        <div>Remaining Seats</div>
        <div class="seats" id="seats">Loading...</div>
        <button class="book" onclick="bookSeat()">Book Seat</button>
        <button class="reset" onclick="resetSeats()">Reset</button>
        <div class="status" id="status"></div>
      </div>

      <script>
        async function fetchSeats() {
          const res = await fetch('/remaining');
          const data = await res.json();
          document.getElementById('seats').innerText = data.remaining;
        }

        async function bookSeat() {
          const status = document.getElementById('status');
          status.innerText = "Processing...";
          status.className = "status loading";

          const res = await fetch('/api/book', { method: 'POST' });
          const data = await res.json();

          if (data.success) {
            status.innerText = "Booking Successful!";
            status.className = "status success";
          } else {
            status.innerText = data.msg;
            status.className = "status error";
          }

          fetchSeats();
        }

        async function resetSeats() {
          await fetch('/reset', { method: 'POST' });
          document.getElementById('status').innerText = "Seats Reset!";
          document.getElementById('status').className = "status success";
          fetchSeats();
        }

        fetchSeats();
      </script>
    </body>
    </html>
    `)
  })

  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log("Server running on port " + PORT)
  })
}

startServer()

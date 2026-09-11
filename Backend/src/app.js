const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

// Trust proxy for Render / cloud deployments so secure cookies work properly
app.set("trust proxy", 1)

const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/+$/, "") : null

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://hireprepfrontend.vercel.app",
    frontendUrl
].filter(Boolean)

function isAllowedOrigin(origin) {
    if (!origin) return true // Postman, curl, or server-to-server
    const cleanOrigin = origin.replace(/\/+$/, "")
    if (allowedOrigins.includes(cleanOrigin)) return true
    // Allow all Vercel domains (production, preview branches, etc.)
    if (/^https:\/\/.*\.vercel\.app$/.test(cleanOrigin)) return true
    // Allow localhost on any port
    if (/^http:\/\/localhost:\d+$/.test(cleanOrigin)) return true
    return false
}

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin(origin, callback) {
        if (isAllowedOrigin(origin)) {
            return callback(null, true)
        }
        console.warn(`Blocked by CORS: ${origin}`)
        return callback(null, false)
    },
    credentials: true
}))

app.get("/", (req, res) => {
    res.status(200).json({ message: "HirePrep backend is running" })
})

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" })
})

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)



module.exports = app

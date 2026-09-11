const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

const allowedOrigins = [
    "http://localhost:5173",
    "https://hireprepfrontend.vercel.app",
    process.env.FRONTEND_URL
].filter(Boolean)

const vercelPreviewOriginPattern = /^https:\/\/hireprepfrontend-[a-z0-9-]+\.vercel\.app$/

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin(origin, callback) {
        // Requests from tools such as Postman do not send an Origin header.
        if (!origin || allowedOrigins.includes(origin) || vercelPreviewOriginPattern.test(origin)) {
            return callback(null, true)
        }

        return callback(new Error("Origin is not allowed by CORS"))
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

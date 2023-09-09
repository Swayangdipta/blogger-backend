require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')
const { startServer } = require('./utils/server_start')
const { dbConnection } = require('./utils/database_connnection')

// Route Imports
const authRoutes = require('./routes/auth')
const blogRoutes = require('./routes/blog')
const categoryRoutes = require('./routes/Category')
const userRoutes = require('./routes/user')
const reportRoutes = require('./routes/report')

// Express server
const app = express()

// Database Connection
dbConnection()

// Rate limiting

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false
})

// MiddleWares
app.use(limiter)
app.use(express.json())
app.use(cookieParser())
app.use(cors())

// Setting up routes
app.use("/api",authRoutes)
app.use("/api",blogRoutes)
app.use("/api",categoryRoutes)
app.use("/api",userRoutes)
app.use("/api",reportRoutes)

// Finally Starting the Server
startServer(app)
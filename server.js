require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { startServer } = require('./utils/server_start')
const { dbConnection } = require('./utils/database_connnection')
const app = express()

// Route Imports
const authRoutes = require('./routes/auth')

// Database Connection
dbConnection()

// MiddleWares
app.use(express.json())
app.use(cookieParser())
app.use(cors())

// Setting up routes
app.use('/api',authRoutes)

// Finally Starting the Server
startServer()
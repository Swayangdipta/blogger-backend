require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { startServer } = require('./utils/server_start')
const { dbConnection } = require('./utils/database_connnection')
const app = express()

// MiddleWares
app.use(express.json())
app.use(cookieParser())
app.use(cors())

// Database Connection
dbConnection()

// Finally Starting the Server
startServer()
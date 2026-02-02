import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import trimData from './middlewares/trimmer.js'
import lowerCase from './middlewares/lowerCase.js'
import upperCase from './middlewares/upperCase.js'
import auth from './middlewares/auth.js'
import gamesRouter from './routes/games.js'
import usersRouter from './routes/users.js'

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(trimData)
app.use(lowerCase)
app.use(upperCase)
app.use('/games', gamesRouter)
app.use('/users', usersRouter)

const db_url = process.env.DB_URL

// It calls the auth middleware
app.use('/admin', auth, (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')

  next()
})

// It sets the website content to the public folder
app.use(express.static('public'))

const PORT = process.env.PORT || 8000

mongoose.connect(db_url)
  .then(() => {
    app.listen(PORT)
  })
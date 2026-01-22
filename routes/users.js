import express from 'express'
import mongoose from 'mongoose'
import User from '../models/User.js'
import hashPassword from '../middlewares/hashPassword.js'
import comparePassword from '../middlewares/comparePassword.js'
import jwt from 'jsonwebtoken'

const router = express.Router()
const secret_key = process.env.SECRET_KEY
const db_url = process.env.DB_URL

// That is the section where the account creation is verified and, then, done.
router.post('/signup', async (req, res) => {
    let { username, password, confirmPassword } = req.body

    // Validation
    if (!username || !password || !confirmPassword) return res.status(400).send("All fields are required")
    if (username.length < 4) return res.status(400).send("Username must be at least 4 characters long")
    if (password.length < 8) return res.status(400).send("Password must be at least 8 characters long")
    if (password !== confirmPassword) return res.status(400).send("Passwords do not match")
    if (password.includes(" ")) return res.status(400).send("Password must not contain spaces")

        
        try {
        const hash = await hashPassword(password)
        const newUser = { "username": username, "password": hash }

        await User.create(newUser)

        res.redirect('/')
    } catch (error) {
        res.status(500).send("Error creating user")
    }

})

// Here, there is basically the same test method, but it is to login into an account
router.post('/login', async (req, res) => {
    let { username, password } = req.body

    // Validation
    if (!username || !password) return res.status(400).send("Username and password are required")
    if (password.includes(" ")) return res.status(400).send("Password must not contain spaces")

    try {
        const foundUser = await User.findOne({ "username": username })

        if (!foundUser) {
            return res.status(401).send("Invalid credentials")
        }

        const comparation = await comparePassword(password, foundUser.password)

        if (!comparation) return res.status(401).send("Invalid credentials")

        const token = jwt.sign(
            {
                id: foundUser._id,
                role: foundUser.role,
                username: foundUser.username
            },
            secret_key
        )

        res.cookie('userCookie', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 14 })
        res.cookie('userInfo', JSON.stringify({ username: foundUser.username }), { httpOnly: false, maxAge: 60 * 60 * 24 * 14 })

        if (foundUser.role === "admin") {
            res.redirect('/admin')
        } else {
            res.redirect('/')
        }
    } catch (error) {
        res.status(500).send("Error logging in")
    }
})

router.get('/logout', async (req, res) => {
    res.clearCookie('userCookie')
    res.clearCookie('userInfo')
    res.redirect('/')
})

export default router
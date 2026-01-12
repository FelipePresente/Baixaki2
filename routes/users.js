import express from 'express'
import jwt from 'jsonwebtoken'

const router = express.Router()
const secret_key = process.env.SECRET_KEY
const db_url = process.env.DB_URL

// That is the section where the account creation is verified and, then, done.
router.post('/signup', async (req, res) => {
    let { username, password, confirmPassword } = req.body
    let role = "user"

    if (!username || !password || !confirmPassword) {
        res.status(400).send("Username, password and password confirmation are required")
    } else if (username.includes(" ") || password.includes(" ") || confirmPassword.includes(" ")) {
        res.status(400).send("Username and password areas must not include blank spaces")
    } else if (password.length < 8 || password.length > 24 || username.length < 4 || username.length > 12) {
        res.status(400).send("The information minimum or maximum quota is not being respected")
    } else if (password !== confirmPassword) {
        res.status(400).send("The passwords must match.")
    } else {

        try {
            const response = await fetch(`${db_url}/users`)
            const users = await response.json()
            const userExists = users.find(user => user.username === username)

            if (userExists) {
                res.status(409).send("There is already an user with this username")
            } else {
                await fetch(`${db_url}/users`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        role,
                        username,
                        password
                    })
                })
                res.status(302).redirect('/')
            }

        } catch (err) {
            res.status(500).send("App crashed")
        }
    }

})

// Here, there is basically the same test method, but it is to login into an account
router.post('/login', async (req, res) => {
    let { username, password } = req.body

    if (!username || !password) {
        res.status(400).send("Username and password are required")
    } else if (password.includes(" ")) {
        res.status(400).send("Password must not include blank spaces")
    } else {
        try {
            const response = await fetch(`${db_url}/users`)
            const users = await response.json()
            const foundUser = users.find(user => user.username === username && user.password === password)

            function postToken() {
                const token = jwt.sign(
                    {
                        id: foundUser.id,
                        role: foundUser.role,
                        username: foundUser.username
                    },
                    secret_key
                )

                res.cookie('userCookie', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 14 })
                res.cookie('userInfo', JSON.stringify({ username: foundUser.username }), { httpOnly: false, maxAge: 60 * 60 * 24 * 14 })
            }

            if (!foundUser) {
                return res.status(401).send('User not found')
            } else if (foundUser.role === "admin") {
                postToken()
                res.redirect('/admin')
            } else if (foundUser.role === "user") {
                postToken()
                res.redirect('/')
            }

        } catch (err) {
            res.status(500).send('App crashed')
        }
    }
})

router.get('/logout', async (req, res) => {
    res.clearCookie('userCookie')
    res.clearCookie('userInfo')
    res.redirect('/')
})

export default router
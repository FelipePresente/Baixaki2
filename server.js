import express from 'express'
import cookieParser from 'cookie-parser'
const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// It reades the userCookie to verify if it is an admin
async function roleVerification(req, res, actionCallback) {
  const cookie = req.cookies.userCookie

  if (cookie) {
    try {
      const user = JSON.parse(cookie)

      if (user.role === "admin") {
        await actionCallback()
      } else {
        res.status(403).send("Access denied")
      }
    } catch (error) {
      console.log("Error while reading user cookie")
      res.status(400).send("Invalid cookie")
    }
  } else {
    res.redirect('/')
  }
}

// This is a basic system when the page is loaded to verify, based on the user cookie, if it is an admin or not
app.use('/admin', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')

  roleVerification(req, res, () => {
    next()
  })
})

// It sets the site content to the public folder
app.use(express.static('public'))

// That is the section where the account creation is verified and, then, done.
app.post('/signin', async (req, res) => {
  let { username, password, confirmPassword } = req.body
  let role = "user"

  if (username) username = username.trim()

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
      const response = await fetch("http://localhost:2000/users")
      const users = await response.json()
      const userExists = users.find(user => user.username === username)

      if (userExists) {
        res.status(409).send("There is already an user with this username")
      } else {
        await fetch('http://localhost:2000/users', {
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
app.post('/login', async (req, res) => {
  let { username, password } = req.body

  if (username) username = username.trim()

  if (!username || !password) {
    res.status(400).send("Username and password are required")
  } else if (password.includes(" ")) {
    res.status(400).send("Password must not include blank spaces")
  } else {
    try {
      const response = await fetch('http://localhost:2000/users')
      const users = await response.json()
      const foundUser = users.find(user => user.username === username && user.password === password)

      // Added check to prevent crash if user not found
      if (!foundUser) {
        return res.status(401).send('User not found')
      }

      if (foundUser.role === "user") {
        foundUser.password = ""
        res.cookie('userCookie', JSON.stringify(foundUser))
        res.status(302).redirect('/')
      } else if (foundUser.role === "admin") {
        foundUser.password = ""
        res.cookie('userCookie', JSON.stringify(foundUser))
        res.status(302).redirect('/admin')
      } else {
        res.status(403).send('Unauthorized role')
      }
    } catch (err) {
      res.status(500).send('App crashed')
    }
  }
})

// Here, there is a basic system to require the info from the form and add in the data base
app.post('/addGame', async (req, res) => {
  await roleVerification(req, res, addGame)

  async function addGame() {

    let { name, genre, size, cover } = req.body

    if (name) name = name.trim()
    if (genre) genre = genre.trim()
    if (size) size = size.trim()
    if (cover) cover = cover.trim()

    try {

      const response = await fetch('http://localhost:2000/games')
      const games = await response.json()
      const busyName = games.find(game => game.name === name)

      if (!busyName) {
        await fetch('http://localhost:2000/games', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            genre,
            size,
            cover
          })
        })
        res.status(302).redirect('/admin')
      } else {
        res.status(409).send('There is already a game with this name')
      }

    } catch (error) {
      res.status(500).send("Error trying to add game")
    }
  }
})

// It basically requires the info from the form, check it and edit the data base
app.post('/editGame', async (req, res) => {
  await roleVerification(req, res, editGame)

  async function editGame() {

    let { whisper, name, genre, size, cover } = req.body

    if (whisper) whisper = whisper.trim()
    if (name) name = name.trim()
    if (genre) genre = genre.trim()
    if (size) size = size.trim()
    if (cover) cover = cover.trim()

    // It verifies all the info that was sent
    if (whisper && name && genre && size && cover) {
      try {
        await fetch(`http://localhost:2000/games/${whisper}`, {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            genre,
            size,
            cover
          })
        })
        res.status(302).redirect('/admin')
      } catch (error) {
        res.status(500).send("Error trying to edit game")
      }
    } else {
      res.status(400).send("There is empty info")
    }
  }
})

app.post('/deleteGame', async (req, res) => {
  await roleVerification(req, res, deleteGame)

  async function deleteGame() {
    const { whisper2 } = req.body

    if (whisper2) {
      try {
        await fetch(`http://localhost:2000/games/${whisper2}`, {
          method: 'DELETE',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            whisper2
          })
        })
        res.status(302).redirect('/admin')
      } catch (error) {
        res.status(500).send("Error trying to delete game")
      }
    } else {
      res.status(400).send("There is empty info")
    }
  }
})

app.listen(8000)
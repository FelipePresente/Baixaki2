import express from 'express'
const app = express()

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// That is the section where the account creation is verified and, then, done.
app.post('/signin', async (req, res) => {
  let { username, password, confirmPassword } = req.body

  if (username) username = username.trim()

  if (!username || !password || !confirmPassword) {
    res.status(400).send("Username, password and password confirmation are required")
  } else if (username.includes(" ") || password.includes(" ") || confirmPassword.includes(" ")) {
    res.status(400).send("Username and password areas must not include blank spaces")
  } else if (password.length < 8 || password.length > 24 || username.length < 4 || username.length > 12){
    res.status(400).send("The information minimum or maximum quota is not being respected")
  } else if (password !== confirmPassword) {
    res.status(400).send("The passwords must match.")
  } else {

    try {
      const response = await fetch("http://localhost:2000/users")
      const users = await response.json()
      const userExists = users.find(user => user.username === username)

      if (userExists) {
        res.send("There is already an user with this username")
      } else {
        await fetch('http://localhost:2000/users', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username,
            password
          })
        })
        res.status(200).redirect('/')
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
    res.send("Username and password are required")
  } else if (password.includes(" ")) {
    res.send("Password must not include blank spaces")
  } else {
    try {
      const response = await fetch('http://localhost:2000/users')
      const users = await response.json()
      const foundUser = users.find(user => user.username === username && user.password === password)

      if (foundUser) {
        foundUser.password = ""
        res.cookie('userCookie', JSON.stringify(foundUser))
        res.status(200).redirect('/')
      } else {
        res.status(404).send('User not found')
      }
    } catch (err) {
      res.send('App crashed')
    }
  }
})

// The port where the server is running
app.listen(8000)
import express from 'express'
const app = express()

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// That is the section where the account creation is verified and, then, done.
app.post('/signin', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).send("Username and password are required")
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
  const { username, password } = req.body

  if (!username || !password) {
    res.send("Username and password are required")
  } else {
    try {
      const response = await fetch('http://localhost:2000/users')
      const users = await response.json()
      const foundUser = users.find(user => user.username === username && user.password === password)

      if (foundUser) {
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
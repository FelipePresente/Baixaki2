import express from 'express'
import roleVerification from '../middlewares/auth.js'
const router = express.Router()

const db_url = process.env.DB_URL

router.get('/', async (req, res) => {
  const response = await fetch(`${db_url}/games`)
  const games = await response.json()
  res.json(games)
})

// Here, there is a basic system to require the info from the form and add in the data base
router.post('/add', async (req, res) => {
  await roleVerification(req, res, addGame)

  async function addGame() {

    let { name, genre, size, cover } = req.body

    try {

      const response = await fetch(`${db_url}/games`)
      const games = await response.json()
      const busyName = games.find(game => game.name === name)

      if (!busyName) {
        await fetch(`${db_url}/games`, {
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
router.post('/edit', async (req, res) => {
  await roleVerification(req, res, editGame)

  async function editGame() {

    let { id, name, genre, size, cover } = req.body

    // It verifies all the info that was sent
    if (id && name && genre && size && cover) {
      try {
        await fetch(`${db_url}/games/${id}`, {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            genre,
            size,
            cover,
            id
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

// It deletes a game from the data base
router.post('/delete', async (req, res) => {
  await roleVerification(req, res, deleteGame)

  async function deleteGame() {
    const { id } = req.body

    if (id) {
      try {
        await fetch(`${db_url}/games/${id}`, {
          method: 'DELETE',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id
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

export default router
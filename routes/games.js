import express from 'express'
import mongoose from 'mongoose'
import Game from '../models/Game.js'
import roleVerification from '../middlewares/auth.js'
const router = express.Router()

const db_url = process.env.DB_URL

router.get('/', async (req, res) => {
  const games = await Game.find()
  res.json(games)
})

// Here, there is a basic system to require the info from the form and add in the database
router.post('/add', async (req, res) => {
  await roleVerification(req, res, addGame)

  async function addGame() {
    const { name, genre, size, cover } = req.body

    if (!name || !genre || !size || !cover) {
      return res.status(400).send("All fields must be filled")
    }

    try {
      const busyName = await Game.findOne({ "name": name })
      
      if (busyName) {
        return res.status(409).send("There is already a game with that name")
      }

      await Game.create({ "name": name, "genre": genre, "size": size, "cover": cover })
      res.redirect('/admin')

    } catch (error) {
      res.status(500).send("Error trying to add game")
    }
  }
})

// It basically requires the info from the form, check it and edit the database
router.post('/edit', async (req, res) => {
  await roleVerification(req, res, editGame)

  async function editGame() {
    const { id, name, genre, size, cover } = req.body

    if (!id || !name || !genre || !size || !cover) {
      return res.status(400).send("All fields must be filled")
    }

    try {
      const updatedGame = { "_id": id, "name": name, "genre": genre, "size": size, "cover": cover }
      await Game.findByIdAndUpdate(id, updatedGame)
      res.redirect('/admin')
    } catch (error) {
      res.status(500).send("Error trying to edit game")
    }
  }
})

// It deletes a game from the database
router.post('/delete', async (req, res) => {
  await roleVerification(req, res, deleteGame)

  async function deleteGame() {
    const { id } = req.body

    if (!id) {
      return res.status(400).send("Invalid ID")
    }

    try {
      const target = await Game.findOne({ "_id": id })

      if (!target) {
        return res.status(404).send("No game was found")
      }

      await Game.deleteOne(target)
      res.redirect('/admin')

    } catch (error) {
      res.status(500).send("Error trying to delete game")
    }
  }
})

export default router
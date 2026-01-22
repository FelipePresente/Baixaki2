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

router.patch('/:id', async (req, res) => {
  await roleVerification(req, res, editGame)

  async function editGame() {
    const { id } = req.params
    const { name, genre, size, cover } = req.body

    if (!id || !name || !genre || !size || !cover) {
      return res.status(400).send("All fields must be filled")
    }

    try {
      const gameData = { name, genre, size, cover }
      const target = await Game.findOne({ "_id": id })

      if (!target) {
        return res.status(404).send("Game not found")
      }

      await Game.updateOne(target, gameData, { new: true })

      res.status(200).json({ message: "Game updated successfully!" })
    } catch (error) {
      res.status(500).send("Error trying to edit game")
    }
  }
})

router.delete('/:id', async (req, res) => {
  await roleVerification(req, res, deleteGame)

  async function deleteGame() {
    const { id } = req.params

    if (!id) {
      return res.status(400).send("Invalid ID")
    }

    try {
      const target = await Game.findOne({ "_id": id })

      if (!target) {
        return res.status(404).send("No game was found")
      }

      await Game.deleteOne(target)
      res.status(200).json({ message: "Game was succesfully deleted" })
    } catch (error) {
      res.status(500).send("Error trying to delete game")
    }
  }
})

export default router
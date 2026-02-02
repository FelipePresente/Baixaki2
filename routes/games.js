import express from 'express'
import Game from '../models/Game.js'
import auth from '../middlewares/auth.js'
const router = express.Router()

router.get('/', async (req, res) => {
  const games = await Game.find()
  res.json(games)
})

router.post('/', auth, async (req, res) => {
  const { name, genre, size, cover } = req.body

  if (!name || !genre || !size || !cover) return res.status(400).send("All fields must be filled")
  if (name.length > 20 || genre.length > 20 || size.length > 7 || cover.length > 200) return res.status(400).send("Max number of characters exceeded")

  try {
    const busyName = await Game.findOne({ "name": name })

    if (busyName) return res.status(409).send("There is already a game with that name")

    const newGame = { "name": name, "genre": genre, "size": size, "cover": cover }

    await Game.create(newGame)

    res.status(200).json({ message: "Game created succesfully" })
  } catch (error) {
    res.status(500).send("Error trying to add game")
  }
})

router.patch('/:id', auth, async (req, res) => {
  const { id } = req.params
  const { name, genre, size, cover } = req.body

  if (!id || !name || !genre || !size || !cover) return res.status(400).send("All fields must be filled")
  if (name.length > 20 || genre.length > 20 || size.length > 7 || cover.length > 200) return res.status(400).send("Max number of characters exceeded")

  try {
    const gameData = { name, genre, size, cover }
    const target = await Game.findOne({ "_id": id })

    if (!target) return res.status(404).send("Game not found")

    await Game.updateOne(target, gameData, { new: true })

    res.status(200).json({ message: "Game updated successfully!" })
  } catch (error) {
    res.status(500).send("Error trying to edit game")
  }
})

router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params

  if (!id) return res.status(400).send("Invalid ID")

  try {
    const target = await Game.findOne({ "_id": id })

    if (!target) return res.status(404).send("No game was found")

    await Game.deleteOne(target)

    res.status(200).json({ message: "Game was succesfully deleted" })
  } catch (error) {
    res.status(500).send("Error trying to delete game")
  }
})

export default router
import mongoose from 'mongoose'

const gameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    genre: { type: String, required: true },
    size: { type: String, required: true },
    cover: { type: String, required: true }
})

const Game = mongoose.model('Game', gameSchema)

export default Game
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const secret_key = process.env.SECRET_KEY

export default async function auth(req, res, next) {
  const token = req.cookies.userCookie

  if (!token) return res.status(401).send("Unauthorized")

  try {
    const decodedUser = jwt.verify(token, secret_key)
    const userFromDB = await User.findById(decodedUser.id)

    if (!userFromDB) return res.redirect('/users/logout')
    if (userFromDB.role !== 'admin') return res.status(401).send("Unauthorized")

    next()
  } catch (error) {
    res.clearCookie('userInfo')
    res.clearCookie('userCookie')
    res.status(400).send('Invalid Token!')
  }
}
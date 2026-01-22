import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const secret_key = process.env.SECRET_KEY

// It reades the userCookie to verify its role
export default async function roleVerification(req, res, actionCallback) {
  const token = req.cookies.userCookie

  if (!token) return res.status(401).send("Unauthorized")

  try {
    const decodedUser = jwt.verify(token, secret_key)
    const userFromDB = await User.findById(decodedUser.id)

    if (!userFromDB) {
      res.clearCookie('userInfo')
      res.clearCookie('userCookie')

      return res.redirect('/')
    }
    if (userFromDB.role !== 'admin') return res.status(401).send("Unauthorized")

    await actionCallback()
  } catch (error) {
    res.clearCookie('userInfo')
    res.clearCookie('userCookie')
    res.status(400).send('Invalid Token!')
  }
}